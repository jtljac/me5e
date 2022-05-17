import Creature5e from "../creature/entity.js";
import {damageRoll} from "../../dice.js";
import ShortRestDialog from "../../apps/short-rest.js";
import LongRestDialog from "../../apps/long-rest.js";


export default class Character5e extends Creature5e {
  /**
   * @override
   */
  prepareBaseData() {
    super.prepareBaseData();

    this._sortActorItems();

    const actorData = this.data;
    const data = actorData.data;

    // Determine character level and available hit dice based on owned Class items
    const [level, hd] = Object.values(this.classes).reduce((arr, item) => {
      const classLevels = parseInt(item.data.data.levels) || 1;
      arr[0] += classLevels;
      arr[1] += classLevels - (parseInt(item.data.data.hitDiceUsed) || 0);
      return arr;
    }, [0, 0]);
    data.details.level = level;
    data.attributes.hd = hd;

    // Character proficiency bonus
    data.attributes.prof = Math.floor((level + 7) / 4);

    // Experience required for next level
    const xp = data.details.xp;
    xp.max = this.getLevelExp(level || 1);
    const prior = this.getLevelExp(level - 1 || 0);
    const required = xp.max - prior;
    const pct = Math.round((xp.value - prior) * 100 / required);
    xp.pct = Math.clamped(pct, 0, 100);
  }

  /**
   * @override
   */
  prepareDerivedData() {
    super.prepareDerivedData();

    const actorData = this.data;
    const data = actorData.data;

    // Determine Scale Values
    this._computeScaleValues(data);
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getRollData() {
    const data = super.getRollData();

    data.classes = {};
    for ( const [identifier, cls] of Object.entries(this.classes) ) {
      data.classes[identifier] = cls.data.data;
      if ( cls.subclass ) data.classes[identifier].subclass = cls.subclass.data.data;
    }

    data.species = this.species?.data.data;
    data.background = this.background?.data.data;
    return data;
  }

  /* -------------------------------------------- */
  /*  Data Preparation Helpers                    */
  /* -------------------------------------------- */

  /**
   * Prepare the items
   * @private
   */
  _sortActorItems() {
    // TODO: Check out replacing with this.itemTypes with caching
    this.classes = {};
    this.species = null;
    this.background = null;

    for (const item in this.items) {
      switch (item.type) {
        case "class":
          this.classes[item.identifier] = item;
          break;
        case "species":
          this.species = item;
          break;
        case "background":
          this.background = item;
          break;
        // Feats
        // Fighting Styles
      }
    }
  }

  /* -------------------------------------------- */

  /**
   * Derive any values that have been scaled by the Advancement system.
   * @param {object} data  The actor's system data being prepared.
   * @private
   */
  _computeScaleValues(data) {
    const scale = data.scale = {};
    for ( const [identifier, cls] of Object.entries(this.classes) ) {
      scale[identifier] = cls.scaleValues;
      if ( cls.subclass ) scale[cls.subclass.identifier] = cls.subclass.scaleValues;
    }
  }

  /* -------------------------------------------- */
  /*  Event Handlers                              */
  /* -------------------------------------------- */

  /**
   * @inheritdoc
   * @override
   */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);

    this.data.token.update({vision: true, actorLink: true, disposition: 1});
  }

  /* -------------------------------------------- */

  /**
   * Return the amount of experience required to gain a certain character level.
   * @param {number} level  The desired level.
   * @returns {number}      The XP required.
   */
  getLevelExp(level) {
    const levels = CONFIG.ME5E.CHARACTER_EXP_LEVELS;
    return levels[Math.min(level, levels.length - 1)];
  }

  /* -------------------------------------------- */

  /**
   * Assign a class item as the original class for the Actor based on which class has the most levels.
   * @returns {Promise<Actor5e>}  Instance of the updated actor.
   * @protected
   */
  _assignPrimaryClass() {
    const classes = this.itemTypes.class.sort((a, b) => b.data.data.levels - a.data.data.levels);
    const newPC = classes[0]?.id || "";
    return this.update({"data.details.originalClass": newPC});
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
    const rollData = { formula: `1${item.data.data.hitDice}`, data: item.getRollData() };
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

  /**
   * Roll a hit die of the appropriate type, gaining hit points equal to the die roll plus your CON modifier
   * @param {string} [denomination]   The hit denomination of hit die to roll. Example "d8".
   *                                  If no denomination is provided, the first available HD will be used
   * @param {boolean} [dialog]        Show a dialog prompt for configuring the hit die roll?
   * @returns {Promise<Roll|null>}    The created Roll instance, or null if no hit die was rolled
   */
  async rollHitDie(denomination, {dialog=true}={}) {

    // If no denomination was provided, choose the first available
    let cls = null;
    if ( !denomination ) {
      cls = this.itemTypes.class.find(c => c.data.data.hitDiceUsed < c.data.data.levels);
      if ( !cls ) return null;
      denomination = cls.data.data.hitDice;
    }

    // Otherwise locate a class (if any) which has an available hit die of the requested denomination
    else {
      cls = this.items.find(i => {
        const d = i.data.data;
        return (d.hitDice === denomination) && ((d.hitDiceUsed || 0) < (d.levels || 1));
      });
    }

    // If no class is available, display an error notification
    if ( !cls ) {
      ui.notifications.error(game.i18n.format("ME5E.HitDiceWarn", {name: this.name, formula: denomination}));
      return null;
    }

    // Prepare roll data
    const parts = [`1${denomination}`, "@abilities.con.mod"];
    const flavor = game.i18n.localize("ME5E.HitDiceRoll");
    const title = `${flavor}: ${this.name}`;
    const data = foundry.utils.deepClone(this.data.data);

    // Call the roll helper utility
    const roll = await damageRoll({
      event: new Event("hitDie"),
      parts,
      data,
      title,
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
    await cls.update({"data.hitDiceUsed": cls.data.data.hitDiceUsed + 1});
    const hp = this.data.data.attributes.hp;
    const dhp = Math.min(hp.max - hp.value, roll.total);
    await this.update({"data.attributes.hp.value": hp.value + dhp});
    return roll;
  }

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
    const hd0 = this.data.data.attributes.hd;
    const hp0 = this.data.data.attributes.hp.value;
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
    else if ( autoHD ) {
      await this.autoSpendHitDice({ threshold: autoHDThreshold });
    }
    return this._rest(
      chat, newDay, false, this.data.data.attributes.hd - hd0, this.data.data.attributes.hp.value - hp0);
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
    // Maybe present a confirmation dialog
    if ( dialog ) {
      try {
        newDay = await LongRestDialog.longRestDialog({actor: this});
      } catch(err) {
        return;
      }
    }

    return this._rest(chat, newDay, true);
  }

  /* -------------------------------------------- */

  /**
   * Perform all of the changes needed for a short or long rest.
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

    if ( Hooks._hooks.restCompleted?.length ) console.warn(
      "The restCompleted hook has been deprecated in favor of me5e.restCompleted. "
      + "The original hook will be removed in me5e 1.8."
    );
    /** @deprecated since 1.6, targeted for removal in 1.8 */
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

    let restFlavor;
    let message;

    // Summarize the rest duration
    switch (game.settings.get("me5e", "restVariant")) {
      case "normal": restFlavor = (longRest && newDay) ? "ME5E.LongRestOvernight" : `ME5E.${length}RestNormal`; break;
      case "gritty": restFlavor = (!longRest && newDay) ? "ME5E.ShortRestOvernight" : `ME5E.${length}RestGritty`; break;
      case "epic": restFlavor = `ME5E.${length}RestEpic`; break;
    }

    // Determine the chat message to display
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
   *
   * @param {object} [options]
   * @param {number} [options.threshold=3]  A number of missing hit points which would trigger an automatic HD roll.
   * @returns {Promise<number>}             Number of hit dice spent.
   */
  async autoSpendHitDice({ threshold=3 }={}) {
    const max = this.data.data.attributes.hp.max;

    let diceRolled = 0;
    while ( (this.data.data.attributes.hp.value + threshold) <= max ) {
      const r = await this.rollHitDie(undefined, {dialog: false});
      if ( r === null ) break;
      diceRolled += 1;
    }

    return diceRolled;
  }

  /* -------------------------------------------- */

  /**
   * Recovers actor hit points and eliminates any temp HP.
   *
   * @param {object} [options]
   * @param {boolean} [options.recoverTemp=true]     Reset temp HP to zero.
   * @returns {object}                               Updates to the actor and change in hit points.
   * @protected
   */
  _getRestHitPointRecovery({ recoverTemp=true }={}) {
    const data = this.data.data;
    let updates = {};
    let max = data.attributes.hp.max;

    updates["data.attributes.hp.value"] = max;
    if ( recoverTemp ) {
      updates["data.attributes.hp.temp"] = 0;
    }

    return { updates, hitPointsRecovered: max - data.attributes.hp.value };
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
    for ( let [k, r] of Object.entries(this.data.data.resources) ) {
      if ( Number.isNumeric(r.max) && ((recoverShortRestResources && r.sr) || (recoverLongRestResources && r.lr)) ) {
        updates[`data.resources.${k}.value`] = Number(r.max);
      }
    }
    return updates;
  }

  /* -------------------------------------------- */

  /**
   * Recovers spell slots and pact slots.
   *
   * @param {object} [options]
   * @param {boolean} [options.recoverPact=true]     Recover all expended pact slots.
   * @param {boolean} [options.recoverSpells=true]   Recover all expended spell slots.
   * @returns {object}                               Updates to the actor.
   * @protected
   */
  _getRestSpellRecovery({ recoverPact=true, recoverSpells=true }={}) {
    let updates = {};
    if ( recoverPact ) {
      const pact = this.data.data.spells.pact;
      updates["data.spells.pact.value"] = pact.override || pact.max;
    }

    if ( recoverSpells ) {
      for ( let [k, v] of Object.entries(this.data.data.spells) ) {
        updates[`data.spells.${k}.value`] = Number.isNumeric(v.override) ? v.override : (v.max ?? 0);
      }
    }

    return updates;
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
      const d = item.data.data;
      if ( d.uses && recovery.includes(d.uses.per) ) {
        updates.push({_id: item.id, "data.uses.value": d.uses.max});
      }
      if ( recoverLongRestUses && d.recharge && d.recharge.value ) {
        updates.push({_id: item.id, "data.recharge.charged": true});
      }
    }

    return updates;
  }

  /**
   * Recovers class hit dice during a long rest.
   *
   * @param {object} [options]
   * @param {number} [options.maxHitDice]  Maximum number of hit dice to recover.
   * @returns {object}                     Array of item updates and number of hit dice recovered.
   * @protected
   */
  _getRestHitDiceRecovery({ maxHitDice=undefined }={}) {
    // Determine the number of hit dice which may be recovered
    if ( maxHitDice === undefined ) {
      maxHitDice = Math.max(Math.floor(this.data.data.details.level / 2), 1);
    }

    // Sort classes which can recover HD, assuming players prefer recovering larger HD first.
    const sortedClasses = Object.values(this.classes).sort((a, b) => {
      return (parseInt(b.data.data.hitDice.slice(1)) || 0) - (parseInt(a.data.data.hitDice.slice(1)) || 0);
    });

    let updates = [];
    let hitDiceRecovered = 0;
    for ( let item of sortedClasses ) {
      const d = item.data.data;
      if ( (hitDiceRecovered < maxHitDice) && (d.hitDiceUsed > 0) ) {
        let delta = Math.min(d.hitDiceUsed || 0, maxHitDice - hitDiceRecovered);
        hitDiceRecovered += delta;
        updates.push({_id: item.id, "data.hitDiceUsed": d.hitDiceUsed - delta});
      }
    }

    return { updates, hitDiceRecovered };
  }
}
