import Creature5e from "./creature.mjs";
import Proficiency from "./proficiency.mjs";
import {d20Roll, damageRoll} from "../../dice/dice.mjs";
import ShortRestDialog from "../../applications/actor/short-rest.mjs";
import LongRestDialog from "../../applications/actor/long-rest.mjs";
import Modifier5e from "../../modifiers/modifier.mjs";

export default class Character5e extends Creature5e {
  /* -------------------------------------------- */
  /*  Event Handlers                              */
  /* -------------------------------------------- */
  /** @inheritDoc */
  prepareBaseData() {
    super.prepareBaseData();

    this._prepareBaseModifiers();

    this.system.scale = {};
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

  /** @inheritDoc */
  prepareDerivedData() {
    super.prepareDerivedData();

    this._prepareHp();
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);

    this.updateSource({prototypeToken: {vision: true, actorLink: true, disposition: 1}});
  }

  /* -------------------------------------------- */
  /*  Base Data Preparation Helpers               */
  /* -------------------------------------------- */

  /**
   * Set up the modifiers for each
   * @private
   */
  _prepareBaseModifiers() {
    for (const target of Object.values(Modifier5e.targets)) {
      const mod = foundry.utils.getProperty(this, target).mods;
      mod.mods = [];
    }
  }

  /* -------------------------------------------- */
  /*  Derived Data Preparation Helpers            */
  /* -------------------------------------------- */

  /**
   * Prepare the modifiers in the provided target and return the sum
   * Sets up the user mods and sorts the modifiers
   * @param target {Modifier5e.targets}
   * @returns {Number} The sum of the evaluated modifiers
   * @protected
   */
  _prepareModifiers(target) {
    const mods = foundry.utils.getProperty(this, target).mods;

    mods.mods.sort((a, b) => {
      if (a.category === b.category) {
       return  a.category.localeCompare(b.category);
      }

      const aCat = Object.values(CONFIG.ME5E.ModifierCategories).indexOf(CONFIG.ME5E.ModifierCategories[a.category]);
      const bCat = Object.values(CONFIG.ME5E.ModifierCategories).indexOf(CONFIG.ME5E.ModifierCategories[b.category]);
      return aCat-bCat;
    });

    // Instantiate all the raw user mods and add them to the main mods array
    for (const userMod of mods.userMods) {
      mods.mods.push(new Modifier5e(userMod, true));
    }

    return mods.mods.reduce((acc, mod) => acc + mod.evaluate(this), 0);
  }

  /** @inheritDoc */
  _prepareAbilities(bonusData, globalBonuses, checkBonus) {
    for (const [id, abl] of Object.entries(this.system.abilities)) {
      abl.mods.mods.push(new Modifier5e({
          name: game.i18n.localize("ME5E.ModifierNameAbilityBase"),
          category: "base",
          formula: `${abl.value}`
        }, false));

      const newScore = this._prepareModifiers(Modifier5e.targets[id]);

      if (abl.value !== newScore) {
        abl.value = newScore;
        this.overrides[`system.abilities.${id}.value`] = abl.value;
      }
    }

    super._prepareAbilities(bonusData, globalBonuses, checkBonus);
  }

  /**
   * Prepare the character's max hp. Mutates the values of system.attributes.hp.mods
   * @private
   */
  _prepareHp() {
    const hp = this.system.attributes.hp;
    hp.ability = hp.userAbility || hp.defaultAbility;

    hp.mods.mods.push(new Modifier5e(
      {
        name: CONFIG.ME5E.abilities[hp.ability],
        category: "attribute",
        formula: `@system.abilities.${hp.ability}.mod * @system.details.level`
      }, false
    ));

    hp.max = this._prepareModifiers(Modifier5e.targets.hp);
  }

  /** @inheritDoc */
  _prepareInitiative(bonusData, globalCheckBonus) {
    /*
     * Set up the value using the modifiers and append on the proficiency
     */
    const init = this.system.attributes.init;
    const { jackOfAllTrades, remarkableAthlete } = this.flags.me5e ?? {};

    // Set the value to the result of the modifiers
    init.value = this._prepareModifiers(Modifier5e.targets.init);

    super._prepareInitiative(bonusData, globalCheckBonus);

    // Add proficiency to the total if it's not the dice variant
    init.prof = new Proficiency(
      this.system.attributes.prof,
      (jackOfAllTrades || remarkableAthlete) ? 0.5 : 0,
      !remarkableAthlete
    );

    if ( Number.isNumeric(init.prof.term) ) init.total += init.prof.flat;
  }

  /* -------------------------------------------- */

  /**
   * Assign a given class itemId as the original class for the Actor.
   * @param {String} itemId The id of the item being set to the primary class
   * @returns {Promise<Actor5e>}  Instance of the updated actor.
   * @protected
   */
  _assignPrimaryClass(itemId) {
    return this.update({"system.details.originalClass": itemId});
  }

  /* -------------------------------------------- */
  /*  Gameplay Mechanics                          */
  /* -------------------------------------------- */

  /** @inheritDoc */
  getInitiativeFormula() {
    const init = this.system.attributes.init;

    return super.getInitiativeFormula() + (init.prof.term !== "0" ? ` + ${init.prof.term}` : "");
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
    const rollData = foundry.utils.mergeObject({
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
    }, options);

    /**
     * A hook event that fires before a death saving throw is rolled for an Actor.
     * @function me5e.preRollDeathSave
     * @memberof hookEvents
     * @param {Actor5e} actor                Actor for which the death saving throw is being rolled.
     * @param {D20RollConfiguration} config  Configuration data for the pending roll.
     * @returns {boolean}                    Explicitly return `false` to prevent death saving throw from being rolled.
     */
    if ( Hooks.call("me5e.preRollDeathSave", this, rollData) === false ) return;

    const roll = await d20Roll(rollData);
    if ( !roll ) return null;

    // Take action depending on the result
    const details = {};

    // Save success
    if ( roll.total >= (roll.options.targetValue ?? 10) ) {
      let successes = (death.success || 0) + 1;

      // Critical Success = revive with 1hp
      if ( roll.isCritical ) {
        details.updates = {
          "system.attributes.death.success": 0,
          "system.attributes.death.failure": 0,
          "system.attributes.hp.value": 1
        };
        details.chatString = "ME5E.DeathSaveCriticalSuccess";
      }

      // 3 Successes = survive and reset checks
      else if ( successes === 3 ) {
        details.updates = {
          "system.attributes.death.success": 0,
          "system.attributes.death.failure": 0
        };
        details.chatString = "ME5E.DeathSaveSuccess";
      }

      // Increment successes
      else details.updates = {"system.attributes.death.success": Math.clamped(successes, 0, 3)};
    }

    // Save failure
    else {
      let failures = (death.failure || 0) + (roll.isFumble ? 2 : 1);
      details.updates = {"system.attributes.death.failure": Math.clamped(failures, 0, 3)};
      if ( failures >= 3 ) {  // 3 Failures = death
        details.chatString = "ME5E.DeathSaveFailure";
      }
    }

    /**
     * A hook event that fires after a death saving throw has been rolled for an Actor, but before
     * updates have been performed.
     * @function me5e.rollDeathSave
     * @memberof hookEvents
     * @param {Actor5e} actor              Actor for which the death saving throw has been rolled.
     * @param {D20Roll} roll               The resulting roll.
     * @param {object} details
     * @param {object} details.updates     Updates that will be applied to the actor as a result of this save.
     * @param {string} details.chatString  Localizable string displayed in the create chat message. If not set, then
     *                                     no chat message will be displayed.
     * @returns {boolean}                  Explicitly return `false` to prevent updates from being performed.
     */
    if ( Hooks.call("me5e.rollDeathSave", this, roll, details) === false ) return roll;

    if ( !foundry.utils.isEmpty(details.updates) ) await this.update(details.updates);

    // Display success/failure chat message
    if ( details.chatString ) {
      let chatData = { content: game.i18n.format(details.chatString, {name: this.name}), speaker };
      ChatMessage.applyRollMode(chatData, roll.options.rollMode);
      await ChatMessage.create(chatData);
    }

    // Return the rolled result
    return roll;
  }

  /* -------------------------------------------- */

  /**
   * Roll a hit die of the appropriate type, gaining hit points equal to the die roll plus your CON modifier.
   * @param {string} [denomination]  The hit denomination of hit die to roll. Example "d8".
   *                                 If no denomination is provided, the first available HD will be used
   * @param {object} options         Additional options which modify the roll.
   * @returns {Promise<Roll|null>}   The created Roll instance, or null if no hit die was rolled
   */
  async rollHitDie(denomination, options={}) {
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
    const rollConfig = foundry.utils.mergeObject({
      formula: `max(0, 1${denomination} + @abilities.con.mod)`,
      data: this.getRollData(),
      chatMessage: true,
      messageData: {
        speaker: ChatMessage.getSpeaker({actor: this}),
        flavor,
        title: `${flavor}: ${this.name}`,
        rollMode: game.settings.get("core", "rollMode"),
        "flags.me5e.roll": {type: "hitDie"}
      }
    }, options);

    /**
     * A hook event that fires before a hit die is rolled for an Actor.
     * @function me5e.preRollHitDie
     * @memberof hookEvents
     * @param {Actor5e} actor               Actor for which the hit die is to be rolled.
     * @param {object} config               Configuration data for the pending roll.
     * @param {string} config.formula       Formula that will be rolled.
     * @param {object} config.data          Data used when evaluating the roll.
     * @param {boolean} config.chatMessage  Should a chat message be created for this roll?
     * @param {object} config.messageData   Data used to create the chat message.
     * @param {string} denomination         Size of hit die to be rolled.
     * @returns {boolean}                   Explicitly return `false` to prevent hit die from being rolled.
     */
    if ( Hooks.call("me5e.preRollHitDie", this, rollConfig, denomination) === false ) return;

    const roll = await new Roll(rollConfig.formula, rollConfig.data).roll({async: true});
    if ( rollConfig.chatMessage ) roll.toMessage(rollConfig.messageData);

    const hp = this.system.attributes.hp;
    const dhp = Math.min(hp.max + (hp.tempmax ?? 0) - hp.value, roll.total);
    const updates = {
      actor: {"system.attributes.hp.value": hp.value + dhp},
      class: {"system.hitDiceUsed": cls.system.hitDiceUsed + 1}
    };

    /**
     * A hook event that fires after a hit die has been rolled for an Actor, but before updates have been performed.
     * @function me5e.rollHitDie
     * @memberof hookEvents
     * @param {Actor5e} actor         Actor for which the hit die has been rolled.
     * @param {Roll} roll             The resulting roll.
     * @param {object} updates
     * @param {object} updates.actor  Updates that will be applied to the actor.
     * @param {object} updates.class  Updates that will be applied to the class.
     * @returns {boolean}             Explicitly return `false` to prevent updates from being performed.
     */
    if ( Hooks.call("me5e.rollHitDie", this, roll, updates) === false ) return roll;

    // Perform updates
    if ( !foundry.utils.isEmpty(updates.actor) ) await this.update(updates.actor);
    if ( !foundry.utils.isEmpty(updates.class) ) await cls.update(updates.class);

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
  /*  Resting                                     */
  /* -------------------------------------------- */

  /**
   * Configuration options for a rest.
   *
   * @typedef {object} RestConfiguration
   * @property {boolean} dialog            Present a dialog window which allows for rolling hit dice as part of the
   *                                       Short Rest and selecting whether a new day has occurred.
   * @property {boolean} chat              Should a chat message be created to summarize the results of the rest?
   * @property {boolean} newDay            Does this rest carry over to a new day?
   * @property {boolean} [autoHD]          Should hit dice be spent automatically during a short rest?
   * @property {number} [autoHDThreshold]  How many hit points should be missing before hit dice are
   *                                       automatically spent during a short rest.
   */

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
   * @param {RestConfiguration} [config]  Configuration options for a short rest.
   * @returns {Promise<RestResult>}       A Promise which resolves once the short rest workflow has completed.
   */
  async shortRest(config={}) {
    config = foundry.utils.mergeObject({
      dialog: true, chat: true, newDay: false, autoHD: false, autoHDThreshold: 3
    }, config);

    /**
     * A hook event that fires before a short rest is started.
     * @function me5e.preShortRest
     * @memberof hookEvents
     * @param {Actor5e} actor             The actor that is being rested.
     * @param {RestConfiguration} config  Configuration options for the rest.
     * @returns {boolean}                 Explicitly return `false` to prevent the rest from being started.
     */
    if ( Hooks.call("me5e.preShortRest", this, config) === false ) return;

    // Take note of the initial hit points and number of hit dice the Actor has
    const hd0 = this.system.attributes.hd;
    const hp0 = this.system.attributes.hp.value;

    // Display a Dialog for rolling hit dice
    if ( config.dialog ) {
      try { config.newDay = await ShortRestDialog.shortRestDialog({actor: this, canRoll: hd0 > 0});
      } catch(err) { return; }
    }

    // Automatically spend hit dice
    else if ( config.autoHD ) await this.autoSpendHitDice({ threshold: config.autoHDThreshold });

    // Return the rest result
    const dhd = this.system.attributes.hd - hd0;
    const dhp = this.system.attributes.hp.value - hp0;
    return this._rest(config.chat, config.newDay, false, dhd, dhp);
  }

  /* -------------------------------------------- */

  /**
   * Take a long rest, recovering hit points, hit dice, resources, item uses, and spell slots.
   * @param {RestConfiguration} [config]  Configuration options for a long rest.
   * @returns {Promise<RestResult>}       A Promise which resolves once the long rest workflow has completed.
   */
  async longRest(config={}) {
    config = foundry.utils.mergeObject({
      dialog: true, chat: true, newDay: true
    }, config);

    /**
     * A hook event that fires before a long rest is started.
     * @function me5e.preLongRest
     * @memberof hookEvents
     * @param {Actor5e} actor             The actor that is being rested.
     * @param {RestConfiguration} config  Configuration options for the rest.
     * @returns {boolean}                 Explicitly return `false` to prevent the rest from being started.
     */
    if ( Hooks.call("me5e.preLongRest", this, config) === false ) return;

    if ( config.dialog ) {
      try { config.newDay = await LongRestDialog.longRestDialog({actor: this}); }
      catch(err) { return; }
    }

    return this._rest(config.chat, config.newDay, true);
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

    /**
     * A hook event that fires after rest result is calculated, but before any updates are performed.
     * @function me5e.preRestCompleted
     * @memberof hookEvents
     * @param {Actor5e} actor      The actor that is being rested.
     * @param {RestResult} result  Details on the rest to be completed.
     * @returns {boolean}          Explicitly return `false` to prevent the rest updates from being performed.
     */
    if ( Hooks.call("me5e.preRestCompleted", this, result) === false ) return result;

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
      const r = await this.rollHitDie();
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
