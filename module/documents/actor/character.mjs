import Creature5e from "./creature.mjs";
import Proficiency from "./proficiency.mjs";
import {d20Roll, damageRoll} from "../../dice/dice.mjs";
import ShortRestDialog from "../../applications/actor/short-rest.mjs";
import LongRestDialog from "../../applications/actor/long-rest.mjs";

export default class Character5e extends Creature5e {
  /* -------------------------------------------- */
  /*  Event Handlers                              */
  /* -------------------------------------------- */
  /** @inheritDoc */
  prepareBaseData() {
    super.prepareBaseData();

    this.system.details.level = 0;
    this.system.attributes.hd = 0;
    this.system.attributes.attunement.value = 0;

    for ( const item of this.items ) {
      // Class levels & hit dice
      if ( item.type === "class" ) {
        const classLevels = parseInt(item.system.levels) || 1;
        this.system.details.level += classLevels;
        this.system.attributes.hd += classLevels - (parseInt(item.system.hitDiceUsed) || 0);
      }

      // Attuned items
      else if ( item.system.attunement === CONFIG.ME5E.attunementTypes.ATTUNED ) {
        this.system.attributes.attunement.value += 1;
      }
    }

    // Character proficiency bonus
    this.system.attributes.prof = Math.floor((this.system.details.level + 7) / 4);

    // Experience required for next level
    const xp = this.system.details.xp;
    xp.max = this.getLevelExp(this.system.details.level || 1);
    const prior = this.getLevelExp(this.system.details.level - 1 || 0);
    const required = xp.max - prior;
    const pct = Math.round((xp.value - prior) * 100 / required);
    xp.pct = Math.clamped(pct, 0, 100);
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);

    this.updateSource({prototypeToken: {vision: true, actorLink: true, disposition: 1}});
  }

  /* -------------------------------------------- */
  /*  Rolls                                       */
  /* -------------------------------------------- */

  /**
   * Perform a death saving throw, rolling a d20 plus any global save bonuses
   * @param {object} options          Additional options which modify the roll
   * @returns {Promise<D20Roll|null>} A Promise which resolves to the Roll instance
   */
  async rollDeathSave(options={}) {
    const death = this.system.attributes.death;

    // Display a warning if we are not at zero HP or if we already have reached 3
    if ( (this.system.attributes.hp.value > 0) || (death.failure >= 3) || (death.success >= 3)) {
      ui.notifications.warn(game.i18n.localize("ME5E.DeathSaveUnnecessary"));
      return null;
    }

    // Evaluate a global saving throw bonus
    const speaker = options.speaker || ChatMessage.getSpeaker({actor: this});
    const globalBonuses = this.system.bonuses?.abilities ?? {};
    const parts = [];
    const data = this.getRollData();

    // Diamond Soul adds proficiency
    if ( this.getFlag("me5e", "diamondSoul") ) {
      parts.push("@prof");
      data.prof = new Proficiency(this.system.attributes.prof, 1).term;
    }

    // Include a global actor ability save bonus
    if ( globalBonuses.save ) {
      parts.push("@saveBonus");
      data.saveBonus = Roll.replaceFormulaData(globalBonuses.save, data);
    }

    // Evaluate the roll
    const flavor = game.i18n.localize("ME5E.DeathSavingThrow");
    const rollData = foundry.utils.mergeObject(options, {
      parts,
      data,
      title: `${flavor}: ${this.name}`,
      flavor,
      halflingLucky: this.getFlag("me5e", "halflingLucky"),
      targetValue: 10,
      messageData: {
        speaker: speaker,
        "flags.me5e.roll": {type: "death"}
      }
    });
    const roll = await d20Roll(rollData);
    if ( !roll ) return null;

    // Take action depending on the result
    const success = roll.total >= 10;
    const d20 = roll.dice[0].total;

    let chatString;

    // Save success
    if ( success ) {
      let successes = (death.success || 0) + 1;

      // Critical Success = revive with 1hp
      if ( d20 === 20 ) {
        await this.update({
          "system.attributes.death.success": 0,
          "system.attributes.death.failure": 0,
          "system.attributes.hp.value": 1
        });
        chatString = "ME5E.DeathSaveCriticalSuccess";
      }

      // 3 Successes = survive and reset checks
      else if ( successes === 3 ) {
        await this.update({
          "system.attributes.death.success": 0,
          "system.attributes.death.failure": 0
        });
        chatString = "ME5E.DeathSaveSuccess";
      }

      // Increment successes
      else await this.update({"system.attributes.death.success": Math.clamped(successes, 0, 3)});
    }

    // Save failure
    else {
      let failures = (death.failure || 0) + (d20 === 1 ? 2 : 1);
      await this.update({"system.attributes.death.failure": Math.clamped(failures, 0, 3)});
      if ( failures >= 3 ) {  // 3 Failures = death
        chatString = "ME5E.DeathSaveFailure";
      }
    }

    // Display success/failure chat message
    if ( chatString ) {
      let chatData = { content: game.i18n.format(chatString, {name: this.name}), speaker };
      ChatMessage.applyRollMode(chatData, roll.options.rollMode);
      await ChatMessage.create(chatData);
    }

    // Return the rolled result
    return roll;
  }

  /* -------------------------------------------- */

  /**
   * Roll a hit die of the appropriate type, gaining hit points equal to the die roll plus your CON modifier
   * @param {string} [denomination]       The hit denomination of hit die to roll. Example "d8".
   *                                      If no denomination is provided, the first available HD will be used
   * @param {boolean} [dialog]            Show a dialog prompt for configuring the hit die roll?
   * @returns {Promise<DamageRoll|null>}  The created Roll instance, or null if no hit die was rolled
   */
  async rollHitDie(denomination, {dialog=true}={}) {

    // If no denomination was provided, choose the first available
    let cls = null;
    if ( !denomination ) {
      cls = this.itemTypes.class.find(c => c.system.hitDiceUsed < c.system.levels);
      if ( !cls ) return null;
      denomination = cls.system.hitDice;
    }

    // Otherwise, locate a class (if any) which has an available hit die of the requested denomination
    else cls = this.items.find(i => {
      return (i.system.hitDice === denomination) && ((i.system.hitDiceUsed || 0) < (i.system.levels || 1));
    });

    // If no class is available, display an error notification
    if ( !cls ) {
      ui.notifications.error(game.i18n.format("ME5E.HitDiceWarn", {name: this.name, formula: denomination}));
      return null;
    }

    // Prepare roll data
    const flavor = game.i18n.localize("ME5E.HitDiceRoll");

    // Call the roll helper utility
    const roll = await damageRoll({
      event: new Event("hitDie"),
      parts: [`1${denomination}`, "@abilities.con.mod"],
      data: this.toObject(false).system,
      title: `${flavor}: ${this.name}`,
      flavor,
      allowCritical: false,
      fastForward: !dialog,
      dialogOptions: {width: 350},
      messageData: {
        speaker: ChatMessage.getSpeaker({actor: this}),
        "flags.me5e.roll": {type: "hitDie"}
      }
    });
    if ( !roll ) return null;

    // Adjust actor data
    await cls.update({"system.hitDiceUsed": cls.system.hitDiceUsed + 1});
    const hp = this.system.attributes.hp;
    const dhp = Math.min(hp.max + (hp.tempmax ?? 0) - hp.value, roll.total);
    await this.update({"system.attributes.hp.value": hp.value + dhp});
    return roll;
  }

  /* -------------------------------------------- */

  /**
   * Roll hit points for a specific class as part of a level-up workflow.
   * @param {Item5e} item      The class item whose hit dice to roll.
   * @returns {Promise<Roll>}  The completed roll.
   * @see {@link me5e.preRollClassHitPoints}
   */
  async rollClassHitPoints(item) {
    if ( item.type !== "class" ) throw new Error("Hit points can only be rolled for a class item.");
    const rollData = { formula: `1${item.system.hitDice}`, data: item.getRollData() };
    const flavor = game.i18n.format("ME5E.AdvancementHitPointsRollMessage", { class: item.name });
    const messageData = {
      title: `${flavor}: ${this.name}`,
      flavor,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      "flags.me5e.roll": { type: "hitPoints" }
    };

    /**
     * A hook event that fires before hit points are rolled for a character's class.
     * @function me5e.preRollClassHitPoints
     * @memberof hookEvents
     * @param {Actor5e} actor            Actor for which the hit points are being rolled.
     * @param {Item5e} item              The class item whose hit dice will be rolled.
     * @param {object} rollData
     * @param {string} rollData.formula  The string formula to parse.
     * @param {object} rollData.data     The data object against which to parse attributes within the formula.
     * @param {object} messageData       The data object to use when creating the message.
     */
    Hooks.callAll("me5e.preRollClassHitPoints", this, item, rollData, messageData);

    const roll = new Roll(rollData.formula, rollData.data);
    await roll.toMessage(messageData);
    return roll;
  }

  /* -------------------------------------------- */
  /*  Rest                                        */
  /* -------------------------------------------- */

  /**
   * Results from a rest operation.
   *
   * @typedef {object} RestResult
   * @property {number} dhp            Hit points recovered during the rest.
   * @property {number} dhd            Hit dice recovered or spent during the rest.
   * @property {object} updateData     Updates applied to the actor.
   * @property {object[]} updateItems  Updates applied to actor's items.
   * @property {boolean} longRest      Whether the rest type was a long rest.
   * @property {boolean} newDay        Whether a new day occurred during the rest.
   */

  /* -------------------------------------------- */

  /**
   * Take a short rest, possibly spending hit dice and recovering resources, item uses, and pact slots.
   *
   * @param {object} [options]
   * @param {boolean} [options.dialog=true]         Present a dialog window which allows for rolling hit dice as part
   *                                                of the Short Rest and selecting whether a new day has occurred.
   * @param {boolean} [options.chat=true]           Summarize the results of the rest workflow as a chat message.
   * @param {boolean} [options.autoHD=false]        Automatically spend Hit Dice if you are missing 3 or more hit
   *                                                points.
   * @param {boolean} [options.autoHDThreshold=3]   A number of missing hit points which would trigger an automatic HD
   *                                                roll.
   * @returns {Promise<RestResult>}                 A Promise which resolves once the short rest workflow has completed.
   */
  async shortRest({dialog=true, chat=true, autoHD=false, autoHDThreshold=3}={}) {

    // Take note of the initial hit points and number of hit dice the Actor has
    const hd0 = this.system.attributes.hd;
    const hp0 = this.system.attributes.hp.value;
    let newDay = false;

    // Display a Dialog for rolling hit dice
    if ( dialog ) {
      try {
        newDay = await ShortRestDialog.shortRestDialog({actor: this, canRoll: hd0 > 0});
      } catch(err) {
        return;
      }
    }

    // Automatically spend hit dice
    else if ( autoHD ) await this.autoSpendHitDice({ threshold: autoHDThreshold });

    // Return the rest result
    return this._rest(chat, newDay, false, this.system.attributes.hd - hd0, this.system.attributes.hp.value - hp0);
  }

  /* -------------------------------------------- */

  /**
   * Take a long rest, recovering hit points, hit dice, resources, item uses, and spell slots.
   *
   * @param {object} [options]
   * @param {boolean} [options.dialog=true]  Present a confirmation dialog window whether or not to take a long rest.
   * @param {boolean} [options.chat=true]    Summarize the results of the rest workflow as a chat message.
   * @param {boolean} [options.newDay=true]  Whether the long rest carries over to a new day.
   * @returns {Promise<RestResult>}          A Promise which resolves once the long rest workflow has completed.
   */
  async longRest({dialog=true, chat=true, newDay=true}={}) {
    if ( dialog ) {
      try {
        newDay = await LongRestDialog.longRestDialog({actor: this});
      }
      catch(err) {
        return;
      }
    }
    return this._rest(chat, newDay, true);
  }

  /* -------------------------------------------- */

  /**
   * Perform all the changes needed for a short or long rest.
   *
   * @param {boolean} chat           Summarize the results of the rest workflow as a chat message.
   * @param {boolean} newDay         Has a new day occurred during this rest?
   * @param {boolean} longRest       Is this a long rest?
   * @param {number} [dhd=0]         Number of hit dice spent during so far during the rest.
   * @param {number} [dhp=0]         Number of hit points recovered so far during the rest.
   * @returns {Promise<RestResult>}  Consolidated results of the rest workflow.
   * @private
   */
  async _rest(chat, newDay, longRest, dhd=0, dhp=0) {
    let hitPointsRecovered = 0;
    let hitPointUpdates = {};
    let hitDiceRecovered = 0;
    let hitDiceUpdates = [];

    // Recover hit points & hit dice on long rest
    if ( longRest ) {
      ({ updates: hitPointUpdates, hitPointsRecovered } = this._getRestHitPointRecovery());
      ({ updates: hitDiceUpdates, hitDiceRecovered } = this._getRestHitDiceRecovery());
    }

    // Figure out the rest of the changes
    const result = {
      dhd: dhd + hitDiceRecovered,
      dhp: dhp + hitPointsRecovered,
      updateData: {
        ...hitPointUpdates,
        ...this._getRestResourceRecovery({ recoverShortRestResources: !longRest, recoverLongRestResources: longRest }),
        ...this._getRestSpellRecovery({ recoverSpells: longRest })
      },
      updateItems: [
        ...hitDiceUpdates,
        ...this._getRestItemUsesRecovery({ recoverLongRestUses: longRest, recoverDailyUses: newDay })
      ],
      longRest,
      newDay
    };

    // Perform updates
    await this.update(result.updateData);
    await this.updateEmbeddedDocuments("Item", result.updateItems);

    // Display a Chat Message summarizing the rest effects
    if ( chat ) await this._displayRestResultMessage(result, longRest);

    if ( Hooks.events.restCompleted?.length ) foundry.utils.logCompatibilityWarning(
      "The restCompleted hook has been deprecated in favor of me5e.restCompleted.",
      { since: "ME5e 1.6", until: "ME5e 2.1" }
    );
    /** @deprecated since 1.6, targeted for removal in 2.1 */
    Hooks.callAll("restCompleted", this, result);

    /**
     * A hook event that fires when the rest process is completed for an actor.
     * @function me5e.restCompleted
     * @memberof hookEvents
     * @param {Actor5e} actor      The actor that just completed resting.
     * @param {RestResult} result  Details on the rest completed.
     */
    Hooks.callAll("me5e.restCompleted", this, result);

    // Return data summarizing the rest effects
    return result;
  }

  /* -------------------------------------------- */

  /**
   * Display a chat message with the result of a rest.
   *
   * @param {RestResult} result         Result of the rest operation.
   * @param {boolean} [longRest=false]  Is this a long rest?
   * @returns {Promise<ChatMessage>}    Chat message that was created.
   * @protected
   */
  async _displayRestResultMessage(result, longRest=false) {
    const { dhd, dhp, newDay } = result;
    const diceRestored = dhd !== 0;
    const healthRestored = dhp !== 0;
    const length = longRest ? "Long" : "Short";

    // Summarize the rest duration
    let restFlavor;
    switch (game.settings.get("me5e", "restVariant")) {
      case "normal": restFlavor = (longRest && newDay) ? "ME5E.LongRestOvernight" : `ME5E.${length}RestNormal`; break;
      case "gritty": restFlavor = (!longRest && newDay) ? "ME5E.ShortRestOvernight" : `ME5E.${length}RestGritty`; break;
      case "epic": restFlavor = `ME5E.${length}RestEpic`; break;
    }

    // Determine the chat message to display
    let message;
    if ( diceRestored && healthRestored ) message = `ME5E.${length}RestResult`;
    else if ( longRest && !diceRestored && healthRestored ) message = "ME5E.LongRestResultHitPoints";
    else if ( longRest && diceRestored && !healthRestored ) message = "ME5E.LongRestResultHitDice";
    else message = `ME5E.${length}RestResultShort`;

    // Create a chat message
    let chatData = {
      user: game.user.id,
      speaker: {actor: this, alias: this.name},
      flavor: game.i18n.localize(restFlavor),
      content: game.i18n.format(message, {
        name: this.name,
        dice: longRest ? dhd : -dhd,
        health: dhp
      })
    };
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));
    return ChatMessage.create(chatData);
  }

  /* -------------------------------------------- */

  /**
   * Automatically spend hit dice to recover hit points up to a certain threshold.
   * @param {object} [options]
   * @param {number} [options.threshold=3]  A number of missing hit points which would trigger an automatic HD roll.
   * @returns {Promise<number>}             Number of hit dice spent.
   */
  async autoSpendHitDice({ threshold=3 }={}) {
    const hp = this.system.attributes.hp;
    const max = hp.max + hp.tempmax;
    let diceRolled = 0;
    while ( (this.system.attributes.hp.value + threshold) <= max ) {
      const r = await this.rollHitDie(undefined, {dialog: false});
      if ( r === null ) break;
      diceRolled += 1;
    }
    return diceRolled;
  }

  /* -------------------------------------------- */

  /**
   * Recovers actor hit points and eliminates any temp HP.
   * @param {object} [options]
   * @param {boolean} [options.recoverTemp=true]     Reset temp HP to zero.
   * @param {boolean} [options.recoverTempMax=true]  Reset temp max HP to zero.
   * @returns {object}                               Updates to the actor and change in hit points.
   * @protected
   */
  _getRestHitPointRecovery({recoverTemp=true, recoverTempMax=true}={}) {
    const hp = this.system.attributes.hp;
    let max = hp.max;
    let updates = {};
    if ( recoverTempMax ) updates["system.attributes.hp.tempmax"] = 0;
    else max += hp.tempmax;
    updates["system.attributes.hp.value"] = max;
    if ( recoverTemp ) updates["system.attributes.hp.temp"] = 0;
    return { updates, hitPointsRecovered: max - hp.value };
  }

  /* -------------------------------------------- */

  /**
   * Recovers actor resources.
   * @param {object} [options]
   * @param {boolean} [options.recoverShortRestResources=true]  Recover resources that recharge on a short rest.
   * @param {boolean} [options.recoverLongRestResources=true]   Recover resources that recharge on a long rest.
   * @returns {object}                                          Updates to the actor.
   * @protected
   */
  _getRestResourceRecovery({recoverShortRestResources=true, recoverLongRestResources=true}={}) {
    let updates = {};
    for ( let [k, r] of Object.entries(this.system.resources) ) {
      if ( Number.isNumeric(r.max) && ((recoverShortRestResources && r.sr) || (recoverLongRestResources && r.lr)) ) {
        updates[`system.resources.${k}.value`] = Number(r.max);
      }
    }
    return updates;
  }

  /* -------------------------------------------- */

  /**
   * Recovers spell slots and pact slots.
   * @param {object} [options]
   * @param {boolean} [options.recoverPact=true]     Recover all expended pact slots.
   * @param {boolean} [options.recoverSpells=true]   Recover all expended spell slots.
   * @returns {object}                               Updates to the actor.
   * @protected
   */
  _getRestSpellRecovery({ recoverPact=true, recoverSpells=true }={}) {
    const spells = this.system.spells;
    let updates = {};
    if ( recoverPact ) {
      const pact = spells.pact;
      updates["system.spells.pact.value"] = pact.override || pact.max;
    }
    if ( recoverSpells ) {
      for ( let [k, v] of Object.entries(spells) ) {
        updates[`system.spells.${k}.value`] = Number.isNumeric(v.override) ? v.override : (v.max ?? 0);
      }
    }
    return updates;
  }

  /* -------------------------------------------- */

  /**
   * Recovers class hit dice during a long rest.
   *
   * @param {object} [options]
   * @param {number} [options.maxHitDice]  Maximum number of hit dice to recover.
   * @returns {object}                     Array of item updates and number of hit dice recovered.
   * @protected
   */
  _getRestHitDiceRecovery({maxHitDice=undefined}={}) {

    // Determine the number of hit dice which may be recovered
    if ( maxHitDice === undefined ) maxHitDice = Math.max(Math.floor(this.system.details.level / 2), 1);

    // Sort classes which can recover HD, assuming players prefer recovering larger HD first.
    const sortedClasses = Object.values(this.classes).sort((a, b) => {
      return (parseInt(b.system.hitDice.slice(1)) || 0) - (parseInt(a.system.hitDice.slice(1)) || 0);
    });

    // Update hit dice usage
    let updates = [];
    let hitDiceRecovered = 0;
    for ( let item of sortedClasses ) {
      const hitDiceUsed = item.system.hitDiceUsed;
      if ( (hitDiceRecovered < maxHitDice) && (hitDiceUsed > 0) ) {
        let delta = Math.min(hitDiceUsed || 0, maxHitDice - hitDiceRecovered);
        hitDiceRecovered += delta;
        updates.push({_id: item.id, "system.hitDiceUsed": hitDiceUsed - delta});
      }
    }
    return { updates, hitDiceRecovered };
  }

  /* -------------------------------------------- */

  /**
   * Recovers item uses during short or long rests.
   *
   * @param {object} [options]
   * @param {boolean} [options.recoverShortRestUses=true]  Recover uses for items that recharge after a short rest.
   * @param {boolean} [options.recoverLongRestUses=true]   Recover uses for items that recharge after a long rest.
   * @param {boolean} [options.recoverDailyUses=true]      Recover uses for items that recharge on a new day.
   * @returns {Array<object>}                              Array of item updates.
   * @protected
   */
  _getRestItemUsesRecovery({ recoverShortRestUses=true, recoverLongRestUses=true, recoverDailyUses=true }={}) {
    let recovery = [];
    if ( recoverShortRestUses ) recovery.push("sr");
    if ( recoverLongRestUses ) recovery.push("lr");
    if ( recoverDailyUses ) recovery.push("day");
    let updates = [];
    for ( let item of this.items ) {
      if ( recovery.includes(item.system.uses?.per) ) {
        updates.push({_id: item.id, "system.uses.value": item.system.uses.max});
      }
      if ( recoverLongRestUses && item.system.recharge?.value ) {
        updates.push({_id: item.id, "system.recharge.charged": true});
      }
    }
    return updates;
  }
}
