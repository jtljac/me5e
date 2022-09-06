import Proficiency from "./proficiency.mjs";
import { d20Roll} from "../../dice/dice.mjs";
import { simplifyBonus } from "../../utils.mjs";
import ProficiencySelector from "../../applications/proficiency-selector.mjs";
import Item5e from "../item.mjs";
import {Rule5e} from "../../rules/_module.mjs";
import SelectItemsPrompt from "../../applications/select-items-prompt.mjs";

/**
 * Extend the base Actor class to implement additional system-specific logic.
 */
export default class Actor5e extends Actor {
  constructor(data, context={}) {
    if (!context?.me5e?.isInit) {
      foundry.utils.mergeObject(context, {
        me5e: {
          isInit: true
        }
      });

      const ClassConstructor = CONFIG.ME5E.Actor.documentClasses[data.type];

      // noinspection JSValidateTypes
      return ClassConstructor ? new ClassConstructor(data, context) : new Actor5e(data, context);
    }

    super(data, context);
  }

  /**
   * The data source for Actor5e.classes allowing it to be lazily computed.
   * @type {Object<Item5e>}
   * @private
   */
  _classes;

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /**
   * A mapping of classes belonging to this Actor.
   * @type {Object<Item5e>}
   */
  get classes() {
    if ( this._classes !== undefined ) return this._classes;
    if ( !["character", "npc"].includes(this.type) ) return this._classes = {};
    return this._classes = this.items.filter(item => item.type === "class").reduce((obj, cls) => {
      obj[cls.identifier] = cls;
      return obj;
    }, {});
  }

  /* -------------------------------------------- */

  /**
   * The Actor's currently equipped armor, if any.
   * @type {Item5e|null}
   */
  get armor() {
    return this.system.attributes.ac.equippedArmor ?? null;
  }

  /* -------------------------------------------- */

  /**
   * The Actor's currently equipped shield, if any.
   * @type {Item5e|null}
   */
  get shield() {
    return this.system.attributes.ac.equippedShield ?? null;
  }

  /* -------------------------------------------- */
  /*  Methods                                     */
  /* -------------------------------------------- */

  /** @inheritDoc */
  prepareData() {
    this._classes = undefined;
    this._preparationWarnings = [];
    super.prepareData();

    for (const rule of this.rules) {
      rule.afterDerived(this, this.toObject(false));
    }

    this.items.forEach(item => item.prepareFinalAttributes());
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  prepareBaseData() {
    this._prepareBaseArmorClass();

    switch ( this.type ) {
      case "vehicle":
        return this._prepareVehicleData();
    }
  }

  /* --------------------------------------------- */

  /** @override */
  prepareEmbeddedDocuments() {
    // This super call first calls prepare data on all the embedded items, then calls apply active effects
    super.prepareEmbeddedDocuments();

    this._prepareRules();

    for (const rule of this.rules) {
      rule.onActiveEffects(this, this.toObject(false));
    }
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  prepareDerivedData() {
    const flags = this.flags.me5e || {};
    this.labels = {};

    this._prepareArmorClass();
    this._prepareEncumbrance();
    this._prepareScaleValues();
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
   * Return the amount of experience granted by killing a creature of a certain CR.
   * @param {number} cr     The creature's challenge rating.
   * @returns {number}      The amount of experience granted per kill.
   */
  getCRExp(cr) {
    if ( cr < 1.0 ) return Math.max(200 * cr, 10);
    return CONFIG.ME5E.CR_EXP_LEVELS[cr];
  }

  /* -------------------------------------------- */

  /**
   * @inheritdoc
   * @param {object} [options]
   * @param {boolean} [options.deterministic] Whether to force deterministic values for data properties that could be
   *                                            either a die term or a flat term.
   */
  getRollData({ deterministic=false }={}) {
    const data = foundry.utils.deepClone(super.getRollData());
    data.prof = new Proficiency(this.system.attributes.prof, 1);
    if ( deterministic ) data.prof = data.prof.flat;

    data.classes = {};
    for ( const [identifier, cls] of Object.entries(this.classes) ) {
      data.classes[identifier] = cls.system;
      if ( cls.subclass ) data.classes[identifier].subclass = cls.subclass.system;
    }
    return data;
  }

  /* -------------------------------------------- */
  /*  Base Data Preparation Helpers               */
  /* -------------------------------------------- */

  /**
   * Initialize derived AC fields for Active Effects to target.
   * Mutates the system.attributes.ac object.
   * @protected
   */
  _prepareBaseArmorClass() {
    const ac = this.system.attributes.ac;
    ac.armor = 10;
    ac.shield = ac.bonus = ac.cover = 0;
  }

  /* -------------------------------------------- */

  /**
   * Perform any Vehicle specific preparation.
   * Mutates several aspects of the system data object.
   * @protected
   */
  _prepareVehicleData() {
    this.system.attributes.prof = 0;
  }

  /* -------------------------------------------- */
  /*  Embedded Data Preparation Helpers           */
  /* -------------------------------------------- */

  /**
   * Collects the rules from all the items in the actor
   * @private
   */
  _prepareRules() {
    this.rules = this.items.contents
      .flatMap((item) => Rule5e.fromItem(item))
      .filter((rule) => !rule.isIgnored)
      .sort((ruleA, ruleB) => ruleA.data.priority - ruleB.data.priority)
  }

  /* -------------------------------------------- */
  /*  Derived Data Preparation Helpers            */
  /* -------------------------------------------- */

  /**
   * Prepare a character's AC value from their equipped armor and shield.
   * Mutates the value of the `system.attributes.ac` object.
   */
  _prepareArmorClass() {
    const ac = this.system.attributes.ac;

    // Apply automatic migrations for older data structures
    let cfg = CONFIG.ME5E.armorClasses[ac.calc];
    if ( !cfg ) {
      ac.calc = "flat";
      if ( Number.isNumeric(ac.value) ) ac.flat = Number(ac.value);
      cfg = CONFIG.ME5E.armorClasses.flat;
    }

    // Identify Equipped Items
    const armorTypes = new Set(Object.keys(CONFIG.ME5E.armorTypes));
    const {armors, shields} = this.itemTypes.equipment.reduce((obj, equip) => {
      const armor = equip.system.armor;
      if ( !equip.system.equipped || !armorTypes.has(armor?.type) ) return obj;
      if ( armor.type === "shield" ) obj.shields.push(equip);
      else obj.armors.push(equip);
      return obj;
    }, {armors: [], shields: []});

    // Determine base AC
    switch ( ac.calc ) {

      // Flat AC (no additional bonuses)
      case "flat":
        ac.value = Number(ac.flat);
        return;

      // Natural AC (includes bonuses)
      case "natural":
        ac.base = Number(ac.flat);
        break;

      default:
        let formula = ac.calc === "custom" ? ac.formula : cfg.formula;
        if ( armors.length ) {
          if ( armors.length > 1 ) this._preparationWarnings.push("ME5E.WarnMultipleArmor");
          const armorData = armors[0].system.armor;
          const isHeavy = armorData.type === "heavy";
          ac.armor = armorData.value ?? ac.armor;
          ac.dex = isHeavy ? 0 : Math.min(armorData.dex ?? Infinity, this.system.abilities.dex?.mod ?? 0);
          ac.equippedArmor = armors[0];
        }
        else ac.dex = this.system.abilities.dex?.mod ?? 0;

        const rollData = this.getRollData({ deterministic: true });
        rollData.attributes.ac = ac;
        try {
          const replaced = Roll.replaceFormulaData(formula, rollData);
          ac.base = Roll.safeEval(replaced);
        } catch(err) {
          this._preparationWarnings.push("ME5E.WarnBadACFormula");
          const replaced = Roll.replaceFormulaData(CONFIG.ME5E.armorClasses.default.formula, rollData);
          ac.base = Roll.safeEval(replaced);
        }
        break;
    }

    // Equipped Shield
    if ( shields.length ) {
      if ( shields.length > 1 ) this._preparationWarnings.push("ME5E.WarnMultipleShields");
      ac.shield = shields[0].system.armor.value ?? 0;
      ac.equippedShield = shields[0];
    }

    // Compute total AC and return
    ac.value = ac.base + ac.shield + ac.bonus + ac.cover;
  }

  /* -------------------------------------------- */

  /**
   * Prepare the level and percentage of encumbrance for an Actor.
   * Optionally include the weight of carried currency by applying the standard rule from the PHB pg. 143.
   * Mutates the value of the `system.attributes.encumbrance` object.
   * @protected
   */
  _prepareEncumbrance() {
    const encumbrance = this.system.attributes.encumbrance ??= {};

    // Get the total weight from items
    // TODO: Don't Forget
    const physicalItems = ["weapon", "equipment", "consumable", "tool", "backpack", "loot"];
    let weight = this.items.reduce((weight, i) => {
      if ( !physicalItems.includes(i.type) ) return weight;
      const q = i.system.quantity || 0;
      const w = i.system.weight || 0;
      return weight + (q * w);
    }, 0);

    // [Optional] add Currency Weight (for non-transformed actors)
    const currency = this.system.currency;
    if ( game.settings.get("me5e", "currencyWeight") && currency ) {
      const numCoins = Object.values(currency).reduce((val, denom) => val + Math.max(denom, 0), 0);
      const currencyPerWeight = game.settings.get("me5e", "metricWeightUnits")
        ? CONFIG.ME5E.encumbrance.currencyPerWeight.metric
        : CONFIG.ME5E.encumbrance.currencyPerWeight.imperial;
      weight += numCoins / currencyPerWeight;
    }

    // Determine the Encumbrance size class
    let mod = {tiny: 0.5, sm: 1, med: 1, lg: 2, huge: 4, grg: 8}[this.system.traits.size] || 1;
    if ( this.flags.me5e?.powerfulBuild ) mod = Math.min(mod * 2, 8);

    const strengthMultiplier = game.settings.get("me5e", "metricWeightUnits")
      ? CONFIG.ME5E.encumbrance.strMultiplier.metric
      : CONFIG.ME5E.encumbrance.strMultiplier.imperial;

    // Populate final Encumbrance values
    encumbrance.value = weight.toNearest(0.1);
    encumbrance.max = ((this.system.abilities.str?.value ?? 10) * strengthMultiplier * mod).toNearest(0.1);
    encumbrance.pct = Math.clamped((encumbrance.value * 100) / encumbrance.max, 0, 100);
    encumbrance.encumbered = encumbrance.pct > (200 / 3);
  }

  /* -------------------------------------------- */

  /**
   * Derive any values that have been scaled by the Advancement system.
   * Mutates the value of the `system.scale` object.
   * @protected
   */
  _prepareScaleValues() {
    this.system.scale = Object.entries(this.classes).reduce((scale, [identifier, cls]) => {
      scale[identifier] = cls.scaleValues;
      if ( cls.subclass ) scale[cls.subclass.identifier] = cls.subclass.scaleValues;
      return scale;
    }, {});
  }

  /* -------------------------------------------- */
  /*  Event Handlers                              */
  /* -------------------------------------------- */

  /** @inheritdoc */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);
    const sourceId = this.getFlag("core", "sourceId");
    if ( sourceId?.startsWith("Compendium.") ) return;

    // Configure prototype token settings
    const s = CONFIG.ME5E.tokenSizes[this.system.traits.size || "med"];
    const prototypeToken = {width: s, height: s};
    this.updateSource({prototypeToken});
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async _preUpdate(changed, options, user) {
    await super._preUpdate(changed, options, user);

    // Apply changes in Actor size to Token width/height
    const newSize = foundry.utils.getProperty(changed, "system.traits.size");
    if ( newSize && (newSize !== this.system.traits?.size) ) {
      let size = CONFIG.ME5E.tokenSizes[newSize];
      if ( !foundry.utils.hasProperty(changed, "prototypeToken.width") ) {
        changed.prototypeToken ||= {};
        changed.prototypeToken.height = size;
        changed.prototypeToken.width = size;
      }
    }

    // Reset death save counters
    const isDead = this.system.attributes.hp.value <= 0;
    if ( isDead && (foundry.utils.getProperty(changed, "system.attributes.hp.value") > 0) ) {
      foundry.utils.setProperty(changed, "system.attributes.death.success", 0);
      foundry.utils.setProperty(changed, "system.attributes.death.failure", 0);
    }
  }

  /* -------------------------------------------- */

  /**
   * Assign a class item as the original class for the Actor based on which class has the most levels.
   * @returns {Promise<Actor5e>}  Instance of the updated actor.
   * @protected
   */
  _assignPrimaryClass() {
    const classes = this.itemTypes.class.sort((a, b) => b.system.levels - a.system.levels);
    const newPC = classes[0]?.id || "";
    return this.update({"system.details.originalClass": newPC});
  }

  /* -------------------------------------------- */
  /*  Gameplay Mechanics                          */
  /* -------------------------------------------- */

  /**
   * Get a formula for the initiative of the actor
   * See Combat._getInitiativeFormula for more detail.
   * @returns {string}  Final initiative formula for the actor.
   */
  getInitiativeFormula() {
    // Construct initiative formula parts
    let nd = 1;
    let mods = "";

    if ( this.getFlag("me5e", "halflingLucky") ) mods += "r1=1";
    if ( this.getFlag("me5e", "initiativeAdv") ) {
      nd = 2;
      mods += "kh";
    }

    return `${nd}d20${mods}` + (this.system.attributes.init.value ? " + " + this.system.attributes.init.value : "");
  }

  /** @override */
  async modifyTokenAttribute(attribute, value, isDelta, isBar) {
    if ( attribute === "attributes.hp" ) {
      const hp = this.system.attributes.hp;
      const delta = isDelta ? (-1 * value) : (hp.value + hp.temp) - value;
      return this.applyDamage(delta);
    }
    return super.modifyTokenAttribute(attribute, value, isDelta, isBar);
  }

  /* -------------------------------------------- */

  /**
   * Apply a certain amount of damage or healing to the health pool for Actor
   * @param {number} amount       An amount of damage (positive) or healing (negative) to sustain
   * @param {number} multiplier   A multiplier which allows for resistance, vulnerability, or healing
   * @returns {Promise<Actor5e>}  A Promise which resolves once the damage has been applied
   */
  // TODO: Account for shields, barrier, and tech armour
  async applyDamage(amount=0, multiplier=1) {
    amount = Math.floor(parseInt(amount) * multiplier);
    const hp = this.system.attributes.hp;

    // Deduct damage from temp HP first
    const tmp = parseInt(hp.temp) || 0;
    const dt = amount > 0 ? Math.min(tmp, amount) : 0;

    // Remaining goes to health
    const dh = Math.clamped(hp.value - (amount - dt), 0, hp.max);

    // Update the Actor
    const updates = {
      "system.attributes.hp.temp": tmp - dt,
      "system.attributes.hp.value": dh
    };

    // Delegate damage application to a hook
    // TODO replace this in the future with a better modifyTokenAttribute function in the core
    const allowed = Hooks.call("modifyTokenAttribute", {
      attribute: "attributes.hp",
      value: amount,
      isDelta: false,
      isBar: true
    }, updates);
    return allowed !== false ? this.update(updates, {dhp: -amount}) : this;
  }

  /* -------------------------------------------- */

  /**
   * Apply a certain amount of temporary hit point, but only if it's more than the actor currently has.
   * @param {number} amount       An amount of temporary hit points to set
   * @returns {Promise<Actor5e>}  A Promise which resolves once the temp HP has been applied
   */
  async applyTempHP(amount=0) {
    amount = parseInt(amount);
    const hp = this.system.attributes.hp;

    // Update the actor if the new amount is greater than the current
    const tmp = parseInt(hp.temp) || 0;
    return amount > tmp ? this.update({"system.attributes.hp.temp": amount}) : this;
  }

  /* -------------------------------------------- */

  /**
   * Determine whether the provided ability is usable for remarkable athlete.
   * @param {string} ability  Ability type to check.
   * @returns {boolean}       Whether the actor has the remarkable athlete flag and the ability is physical.
   * @protected
   */
  _isRemarkableAthlete(ability) {
    return this.getFlag("me5e", "remarkableAthlete")
      && CONFIG.ME5E.characterFlags.remarkableAthlete.abilities.includes(ability);
  }

  /* -------------------------------------------- */
  /*  Rolls                                       */
  /* -------------------------------------------- */

  /**
   * Roll a generic ability test or saving throw.
   * Prompt the user for input on which variety of roll they want to do.
   * @param {string} abilityId    The ability id (e.g. "str")
   * @param {object} options      Options which configure how ability tests or saving throws are rolled
   */
  rollAbility(abilityId, options={}) {
    const label = CONFIG.ME5E.abilities[abilityId] ?? "";
    new Dialog({
      title: `${game.i18n.format("ME5E.AbilityPromptTitle", {ability: label})}: ${this.name}`,
      content: `<p>${game.i18n.format("ME5E.AbilityPromptText", {ability: label})}</p>`,
      buttons: {
        test: {
          label: game.i18n.localize("ME5E.ActionAbil"),
          callback: () => this.rollAbilityTest(abilityId, options)
        },
        save: {
          label: game.i18n.localize("ME5E.ActionSave"),
          callback: () => this.rollAbilitySave(abilityId, options)
        }
      }
    }).render(true);
  }

  /* -------------------------------------------- */

  /**
   * Roll an Ability Test
   * Prompt the user for input regarding Advantage/Disadvantage and any Situational Bonus
   * @param {string} abilityId    The ability ID (e.g. "str")
   * @param {object} options      Options which configure how ability tests are rolled
   * @returns {Promise<D20Roll>}  A Promise which resolves to the created Roll instance
   */
  async rollAbilityTest(abilityId, options={}) {
    const label = CONFIG.ME5E.abilities[abilityId] ?? "";
    const abl = this.system.abilities[abilityId];
    const globalBonuses = this.system.bonuses?.abilities ?? {};
    const parts = [];
    const data = this.getRollData();

    // Add ability modifier
    parts.push("@mod");
    data.mod = abl?.mod ?? 0;

    // Include proficiency bonus
    if ( abl?.checkProf.hasProficiency ) {
      parts.push("@prof");
      data.prof = abl.checkProf.term;
    }

    // Add ability-specific check bonus
    if ( abl?.bonuses?.check ) {
      const checkBonusKey = `${abilityId}CheckBonus`;
      parts.push(`@${checkBonusKey}`);
      data[checkBonusKey] = Roll.replaceFormulaData(abl.bonuses.check, data);
    }

    // Add global actor bonus
    if ( globalBonuses.check ) {
      parts.push("@checkBonus");
      data.checkBonus = Roll.replaceFormulaData(globalBonuses.check, data);
    }

    // Add provided extra roll parts now because they will get clobbered by mergeObject below
    if ( options.parts?.length > 0 ) parts.push(...options.parts);

    // Roll and return
    const flavor = game.i18n.format("ME5E.AbilityPromptTitle", {ability: label});
    const rollData = foundry.utils.mergeObject({
      parts,
      data,
      title: `${flavor}: ${this.name}`,
      flavor,
      halflingLucky: this.getFlag("me5e", "halflingLucky"),
      messageData: {
        speaker: options.speaker || ChatMessage.getSpeaker({actor: this}),
        "flags.me5e.roll": {type: "ability", abilityId }
      }
    }, options);

    /**
     * A hook event that fires before an ability test is rolled for an Actor.
     * @function me5e.preRollAbilityTest
     * @memberof hookEvents
     * @param {Actor5e} actor                Actor for which the ability test is being rolled.
     * @param {D20RollConfiguration} config  Configuration data for the pending roll.
     * @param {string} abilityId             ID of the ability being rolled as defined in `ME5E.abilities`.
     * @returns {boolean}                    Explicitly return `false` to prevent ability test from being rolled.
     */
    if ( Hooks.call("me5e.preRollAbilityTest", this, rollData, abilityId) === false ) return;

    const roll = await d20Roll(rollData);

    /**
     * A hook event that fires after an ability test has been rolled for an Actor.
     * @function me5e.rollAbilityTest
     * @memberof hookEvents
     * @param {Actor5e} actor     Actor for which the ability test has been rolled.
     * @param {D20Roll} roll      The resulting roll.
     * @param {string} abilityId  ID of the ability that was rolled as defined in `ME5E.abilities`.
     */
    if ( roll ) Hooks.callAll("me5e.rollAbilityTest", this, roll, abilityId);

    return roll;
  }

  /* -------------------------------------------- */

  /**
   * Roll an Ability Saving Throw
   * Prompt the user for input regarding Advantage/Disadvantage and any Situational Bonus
   * @param {string} abilityId    The ability ID (e.g. "str")
   * @param {object} options      Options which configure how ability tests are rolled
   * @returns {Promise<D20Roll>}  A Promise which resolves to the created Roll instance
   */
  async rollAbilitySave(abilityId, options={}) {
    const label = CONFIG.ME5E.abilities[abilityId] ?? "";
    const abl = this.system.abilities[abilityId];
    const globalBonuses = this.system.bonuses?.abilities ?? {};
    const parts = [];
    const data = this.getRollData();

    // Add ability modifier
    parts.push("@mod");
    data.mod = abl?.mod ?? 0;

    // Include proficiency bonus
    if ( abl?.saveProf.hasProficiency ) {
      parts.push("@prof");
      data.prof = abl.saveProf.term;
    }

    // Include ability-specific saving throw bonus
    if ( abl?.bonuses?.save ) {
      const saveBonusKey = `${abilityId}SaveBonus`;
      parts.push(`@${saveBonusKey}`);
      data[saveBonusKey] = Roll.replaceFormulaData(abl.bonuses.save, data);
    }

    // Include a global actor ability save bonus
    if ( globalBonuses.save ) {
      parts.push("@saveBonus");
      data.saveBonus = Roll.replaceFormulaData(globalBonuses.save, data);
    }

    // Add provided extra roll parts now because they will get clobbered by mergeObject below
    if ( options.parts?.length > 0 ) parts.push(...options.parts);

    // Roll and return
    const flavor = game.i18n.format("ME5E.SavePromptTitle", {ability: label});
    const rollData = foundry.utils.mergeObject({
      parts,
      data,
      title: `${flavor}: ${this.name}`,
      flavor,
      halflingLucky: this.getFlag("me5e", "halflingLucky"),
      messageData: {
        speaker: options.speaker || ChatMessage.getSpeaker({actor: this}),
        "flags.me5e.roll": {type: "save", abilityId }
      }
    }, options);

    /**
     * A hook event that fires before an ability save is rolled for an Actor.
     * @function me5e.preRollAbilitySave
     * @memberof hookEvents
     * @param {Actor5e} actor                Actor for which the ability save is being rolled.
     * @param {D20RollConfiguration} config  Configuration data for the pending roll.
     * @param {string} abilityId             ID of the ability being rolled as defined in `ME5E.abilities`.
     * @returns {boolean}                    Explicitly return `false` to prevent ability save from being rolled.
     */
    if ( Hooks.call("me5e.preRollAbilitySave", this, rollData, abilityId) === false ) return;

    const roll = await d20Roll(rollData);

    /**
     * A hook event that fires after an ability save has been rolled for an Actor.
     * @function me5e.rollAbilitySave
     * @memberof hookEvents
     * @param {Actor5e} actor     Actor for which the ability save has been rolled.
     * @param {D20Roll} roll      The resulting roll.
     * @param {string} abilityId  ID of the ability that was rolled as defined in `ME5E.abilities`.
     */
    if ( roll ) Hooks.callAll("me5e.rollAbilitySave", this, roll, abilityId);

    return roll;
  }

  /* -------------------------------------------- */

  /**
   * Populate a proficiency object with a `selected` field containing a combination of
   * localizable group & individual proficiencies from `value` and the contents of `custom`.
   *
   * @param {object} data          Object containing proficiency data.
   * @param {string[]} data.value  Array of standard proficiency keys.
   * @param {string} data.custom   Semicolon-separated string of custom proficiencies.
   * @param {string} type          "armor", "weapon", or "tool"
   */
  static prepareProficiencies(data, type) {
    const profs = CONFIG.ME5E[`${type}Proficiencies`];
    const itemTypes = CONFIG.ME5E[`${type}Ids`];

    let values = [];
    if ( data.value ) values = data.value instanceof Array ? data.value : [data.value];

    data.selected = {};
    for ( const key of values ) {
      if ( profs[key] ) {
        data.selected[key] = profs[key];
      } else if ( itemTypes && itemTypes[key] ) {
        const item = ProficiencySelector.getBaseItem(itemTypes[key], { indexOnly: true });
        if ( item ) data.selected[key] = item.name;
      } else if ( type === "tool" && CONFIG.ME5E.vehicleTypes[key] ) {
        data.selected[key] = CONFIG.ME5E.vehicleTypes[key];
      }
    }

    // Add custom entries
    if ( data.custom ) data.custom.split(";").forEach((c, i) => data.selected[`custom${i+1}`] = c.trim());
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /** @inheritdoc */
  _onUpdate(data, options, userId) {
    super._onUpdate(data, options, userId);
    this._displayScrollingDamage(options.dhp);
  }

  /* -------------------------------------------- */

  /**
   * Display changes to health as scrolling combat text.
   * Adapt the font size relative to the Actor's HP total to emphasize more significant blows.
   * @param {number} dhp      The change in hit points that was applied
   * @private
   */
  _displayScrollingDamage(dhp) {
    if ( !dhp ) return;
    dhp = Number(dhp);
    const tokens = this.isToken ? [this.token?.object] : this.getActiveTokens(true);
    for ( const t of tokens ) {
      const pct = Math.clamped(Math.abs(dhp) / this.system.attributes.hp.max, 0, 1);
      canvas.interface.createScrollingText(t.center, dhp.signedString(), {
        anchor: CONST.TEXT_ANCHOR_POINTS.TOP,
        fontSize: 16 + (32 * pct), // Range between [16, 48]
        fill: CONFIG.ME5E.tokenHPColors[dhp < 0 ? "damage" : "healing"],
        stroke: 0x000000,
        strokeThickness: 4,
        jitter: 0.25
      });
    }
  }

  /* -------------------------------------------- */
  /*  DEPRECATED METHODS                          */
  /* -------------------------------------------- */

  /**
   * Given a list of items to add to the Actor, optionally prompt the user for which they would like to add.
   * @param {Item5e[]} items         The items being added to the Actor.
   * @param {boolean} [prompt=true]  Whether or not to prompt the user.
   * @returns {Promise<Item5e[]>}
   * @deprecated since me5e 1.6, targeted for removal in 2.1
   */
  async addEmbeddedItems(items, prompt=true) {
    foundry.utils.logCompatibilityWarning(
      "Actor5e#addEmbeddedItems has been deprecated.", { since: "ME5e 1.6", until: "ME5e 2.1" }
    );
    let itemsToAdd = items;
    if ( !items.length ) return [];

    // Obtain the array of item creation data
    let toCreate = [];
    if (prompt) {
      const itemIdsToAdd = await SelectItemsPrompt.create(items, {
        hint: game.i18n.localize("ME5E.AddEmbeddedItemPromptHint")
      });
      for (let item of items) {
        if (itemIdsToAdd.includes(item.id)) toCreate.push(item.toObject());
      }
    }
    else toCreate = items.map(item => item.toObject());

    // Create the requested items
    if (itemsToAdd.length === 0) return [];
    return Item5e.createDocuments(toCreate, {parent: this});
  }

  /* -------------------------------------------- */

  /**
   * Get a list of features to add to the Actor when a class item is updated.
   * Optionally prompt the user for which they would like to add.
   * @param {object} [options]
   * @param {string} [options.classIdentifier] Identifier slug of the class if it has been changed.
   * @param {string} [options.subclassName]    Name of the selected subclass if it has been changed.
   * @param {number} [options.level]           New class level if it has been changed.
   * @returns {Promise<Item5e[]>}              Any new items that should be added to the actor.
   * @deprecated since me5e 1.6, targeted for removal in 2.1
   */
  async getClassFeatures({classIdentifier, subclassName, level}={}) {
    foundry.utils.logCompatibilityWarning(
      "Actor5e#getClassFeatures has been deprecated. Please refer to the Advancement API for its replacement.",
      { since: "ME5e 1.6", until: "ME5e 2.1" }
    );
    const existing = new Set(this.items.map(i => i.name));
    const features = await Actor5e.loadClassFeatures({classIdentifier, subclassName, level});
    return features.filter(f => !existing.has(f.name)) || [];
  }

  /* -------------------------------------------- */

  /**
   * Return the features which a character is awarded for each class level.
   * @param {object} [options]
   * @param {string} [options.classIdentifier] Identifier slug of the class being added or updated.
   * @param {string} [options.subclassName]    Name of the subclass of the class being added, if any.
   * @param {number} [options.level]           The number of levels in the added class.
   * @param {number} [options.priorLevel]      The previous level of the added class.
   * @returns {Promise<Item5e[]>}              Items that should be added based on the changes made.
   * @deprecated since me5e 1.6, targeted for removal in 2.1
   */
  static async loadClassFeatures({classIdentifier="", subclassName="", level=1, priorLevel=0}={}) {
    foundry.utils.logCompatibilityWarning(
      "Actor5e#loadClassFeatures has been deprecated. Please refer to the Advancement API for its replacement.",
      { since: "ME5e 1.6", until: "ME5e 2.1" }
    );
    subclassName = subclassName.slugify();

    // Get the configuration of features which may be added
    const clsConfig = CONFIG.ME5E.classFeatures[classIdentifier];
    if (!clsConfig) return [];

    // Acquire class features
    let ids = [];
    for ( let [l, f] of Object.entries(clsConfig.features || {}) ) {
      l = parseInt(l);
      if ( (l <= level) && (l > priorLevel) ) ids = ids.concat(f);
    }

    // Acquire subclass features
    const subConfig = clsConfig.subclasses[subclassName] || {};
    for ( let [l, f] of Object.entries(subConfig.features || {}) ) {
      l = parseInt(l);
      if ( (l <= level) && (l > priorLevel) ) ids = ids.concat(f);
    }

    // Load item data for all identified features
    const features = [];
    for ( let id of ids ) {
      features.push(await fromUuid(id));
    }

    // Class spells should always be prepared
    for ( const feature of features ) {
      if ( feature.type === "spell" ) {
        const preparation = feature.system.preparation;
        preparation.mode = "always";
        preparation.prepared = true;
      }
    }
    return features;
  }

  /* -------------------------------------------- */

  /**
   * Determine a character's AC value from their equipped armor and shield.
   * @returns {object}
   * @private
   * @deprecated since me5e 2.0, targeted for removal in 2.2
   */
  _computeArmorClass() {
    foundry.utils.logCompatibilityWarning(
      "Actor5e#_computeArmorClass has been renamed Actor5e#_prepareArmorClass.",
      { since: "ME5e 2.0", until: "ME5e 2.2" }
    );
    this._prepareArmorClass();
    return this.system.attributes.ac;
  }

  /* -------------------------------------------- */

  /**
   * Compute the level and percentage of encumbrance for an Actor.
   * @returns {object}  An object describing the character's encumbrance level
   * @private
   * @deprecated since me5e 2.0, targeted for removal in 2.2
   */
  _computeEncumbrance() {
    foundry.utils.logCompatibilityWarning(
      "Actor5e#_computeEncumbrance has been renamed Actor5e#_prepareEncumbrance.",
      { since: "ME5e 2.0", until: "ME5e 2.2" }
    );
    this._prepareEncumbrance();
    return this.system.attributes.encumbrance;
  }

  /* -------------------------------------------- */

  /**
   * Calculate the initiative bonus to display on a character sheet.
   * @private
   * @deprecated since me5e 2.0, targeted for removal in 2.2
   */
  _computeInitiativeModifier() {
    foundry.utils.logCompatibilityWarning(
      "Actor5e#_computeInitiativeModifier has been renamed Actor5e#_prepareInitiative.",
      { since: "ME5e 2.0", until: "ME5e 2.2" }
    );
    this._prepareInitiative();
  }

  /* -------------------------------------------- */

  /**
   * Prepare data related to the spell-casting capabilities of the Actor.
   * Mutates the value of the system.spells object.
   * @private
   * @deprecated since me5e 2.0, targeted for removal in 2.2
   */
  _computeSpellcastingProgression() {
    foundry.utils.logCompatibilityWarning(
      "Actor5e#_computeSpellcastingProgression has been renamed Actor5e#_prepareSpellcasting.",
      { since: "ME5e 2.0", until: "ME5e 2.2" }
    );
    this._prepareSpellcasting();
  }

  /* -------------------------------------------- */

  /**
   * Convert a bonus value to a simple integer for displaying on the sheet.
   * @param {number|string|null} bonus  Actor's bonus value.
   * @param {object} data               Actor data to use for replacing @ strings.
   * @returns {number}                  Simplified bonus as an integer.
   * @protected
   * @deprecated since me5e 2.0, targeted for removal in 2.2
   */
  _simplifyBonus(bonus, data) {
    foundry.utils.logCompatibilityWarning(
      "Actor#_simplifyBonus has been made a utility function and can be accessed at me5e.utils.simplifyBonus.",
      { since: "ME5e 2.0", until: "ME5e 2.2" }
    );
    return simplifyBonus(bonus, data);
  }
}
