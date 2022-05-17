import Actor5e from "../entity.js";
import Proficiency from "../proficiency.js";
import {d20Roll, damageRoll} from "../../dice.js";


export default class Creature5e extends Actor5e {

  /**
   * @inheritDoc
   * @override
   */
  prepareBaseData() {
    super.prepareBaseData();

    this._prepareBaseArmorClass(this.data);
  }

  /**
   * @inheritDoc
   * @override
   */
  prepareDerivedData() {
    super.prepareDerivedData();

    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags.me5e || {};
    const bonuses = getProperty(data, "bonuses.abilities") || {};

    // Ability modifiers and saves
    const bonusData = this.getRollData();
    const joat = flags.jackOfAllTrades;
    const dcBonus = this._simplifyBonus(data.bonuses?.spell?.dc, bonusData);
    const saveBonus = this._simplifyBonus(bonuses.save, bonusData);
    const checkBonus = this._simplifyBonus(bonuses.check, bonusData);
    for (let [id, abl] of Object.entries(data.abilities)) {
      if ( flags.diamondSoul ) abl.proficient = 1;  // Diamond Soul is proficient in all saves
      abl.mod = Math.floor((abl.value - 10) / 2);

      const isRA = this._isRemarkableAthlete(id);
      abl.checkProf = new Proficiency(data.attributes.prof, (isRA || joat) ? 0.5 : 0, !isRA);
      const saveBonusAbl = this._simplifyBonus(abl.bonuses?.save, bonusData);
      abl.saveBonus = saveBonusAbl + saveBonus;

      abl.saveProf = new Proficiency(data.attributes.prof, abl.proficient);
      const checkBonusAbl = this._simplifyBonus(abl.bonuses?.check, bonusData);
      abl.checkBonus = checkBonusAbl + checkBonus;

      abl.save = abl.mod + abl.saveBonus;
      if ( Number.isNumeric(abl.saveProf.term) ) abl.save += abl.saveProf.flat;
      abl.dc = 8 + abl.mod + data.attributes.prof + dcBonus;
    }

    data.attributes.attunement.value = this.items.filter(i => {
      return i.data.data.attunement === CONFIG.ME5E.attunementTypes.ATTUNED;
    }).length;

    // Inventory encumbrance
    data.attributes.encumbrance = this._computeEncumbrance(actorData);

    // Prepare skills
    this._prepareSkills(actorData, bonusData, bonuses, checkBonus)

    // Determine Initiative Modifier
    this._computeInitiativeModifier(actorData, checkBonus, bonusData);

    // Prepare spell-casting data
    this._computeSpellcastingProgression(this.data);

    // Prepare armor class data
    const ac = this._computeArmorClass(data);
    this.armor = ac.equippedArmor || null;
    this.shield = ac.equippedShield || null;
    if ( ac.warnings ) this._preparationWarnings.push(...ac.warnings);
  }

  /* -------------------------------------------- */

  /**
   * Compute the level and percentage of encumbrance for an Actor.
   *
   * Optionally include the weight of carried currency across all denominations by applying the standard rule
   * from the PHB pg. 143
   * @param {object} actorData      The data object for the Actor being rendered
   * @returns {{max: number, value: number, pct: number}}  An object describing the character's encumbrance level
   * @protected
   */
  _computeEncumbrance(actorData) {
    // Get the total weight from items
    const physicalItems = ["weapon", "equipment", "consumable", "tool", "backpack", "loot"];
    let weight = actorData.items.reduce((weight, i) => {
      if ( !physicalItems.includes(i.type) ) return weight;
      const q = i.data.data.quantity || 0;
      const w = i.data.data.weight || 0;
      return weight + (q * w);
    }, 0);

    // [Optional] add Currency Weight (for non-transformed actors)
    if ( game.settings.get("me5e", "currencyWeight") && actorData.data.currency ) {
      const currency = actorData.data.currency;
      const numCoins = Object.values(currency).reduce((val, denom) => val += Math.max(denom, 0), 0);

      const currencyPerWeight = game.settings.get("me5e", "metricWeightUnits")
        ? CONFIG.ME5E.encumbrance.currencyPerWeight.metric
        : CONFIG.ME5E.encumbrance.currencyPerWeight.imperial;

      weight += numCoins / currencyPerWeight;
    }

    // Determine the encumbrance size class
    let mod = {
      tiny: 0.5,
      sm: 1,
      med: 1,
      lg: 2,
      huge: 4,
      grg: 8
    }[actorData.data.traits.size] || 1;
    if ( this.getFlag("me5e", "powerfulBuild") ) mod = Math.min(mod * 2, 8);

    // Compute Encumbrance percentage
    weight = weight.toNearest(0.1);

    const strengthMultiplier = game.settings.get("me5e", "metricWeightUnits")
      ? CONFIG.ME5E.encumbrance.strMultiplier.metric
      : CONFIG.ME5E.encumbrance.strMultiplier.imperial;

    const max = (actorData.data.abilities.str.value * strengthMultiplier * mod).toNearest(0.1);
    const pct = Math.clamped((weight * 100) / max, 0, 100);
    return { value: weight.toNearest(0.1), max, pct, encumbered: pct > (200/3) };
  }

  /* -------------------------------------------- */
  /*  Data Preparation Helpers                    */
  /* -------------------------------------------- */

  /**
   * Initialize derived AC fields for Active Effects to target.
   * @param {object} actorData  Copy of the data for the actor being prepared. *Will be mutated.*
   * @protected
   */
  _prepareBaseArmorClass(actorData) {
    const ac = actorData.data.attributes.ac;
    ac.armor = 10;
    ac.shield = ac.bonus = ac.cover = 0;
    this.armor = null;
    this.shield = null;
  }

  /* -------------------------------------------- */

  /**
   * Prepare skill checks.
   * @param {object} actorData       Copy of the data for the actor being prepared. *Will be mutated.*
   * @param {object} bonusData       Data produced by `getRollData` to be applied to bonus formulas.
   * @param {object} bonuses         Global bonus data.
   * @param {number} checkBonus      Global ability check bonus.
   * @param {object} originalSkills  A transformed actor's original actor's skills.
   * @protected
   */
  _prepareSkills(actorData, bonusData, bonuses, checkBonus) {
    const data = actorData.data;
    const flags = actorData.flags.me5e || {};

    // Skill modifiers
    const feats = CONFIG.ME5E.characterFlags;
    const joat = flags.jackOfAllTrades;
    const observant = flags.observantFeat;
    const skillBonus = this._simplifyBonus(bonuses.skill, bonusData);
    for (let [id, skl] of Object.entries(data.skills)) {
      skl.ability = skl.userAbility || skl.defaultAbility;

      skl.value = Math.clamped(Number(skl.value).toNearest(0.5), 0, 2) ?? 0;
      const baseBonus = this._simplifyBonus(skl.bonuses?.check, bonusData);
      let roundDown = true;

      // Remarkable Athlete
      if ( this._isRemarkableAthlete(skl.ability) && (skl.value < 0.5) ) {
        skl.value = 0.5;
        roundDown = false;
      }

      // Jack of All Trades
      else if ( joat && (skl.value < 0.5) ) {
        skl.value = 0.5;
      }

      // Compute modifier
      const checkBonusAbl = this._simplifyBonus(data.abilities[skl.ability]?.bonuses?.check, bonusData);
      skl.bonus = baseBonus + checkBonus + checkBonusAbl + skillBonus;
      skl.mod = data.abilities[skl.ability]?.mod ?? 0;
      skl.prof = new Proficiency(data.attributes.prof, skl.value, roundDown);
      skl.proficient = skl.value;
      skl.total = skl.mod + skl.bonus;
      if ( Number.isNumeric(skl.prof.term) ) skl.total += skl.prof.flat;

      // Compute passive bonus
      const passive = observant && (feats.observantFeat.skills.includes(id)) ? 5 : 0;
      const passiveBonus = this._simplifyBonus(skl.bonuses?.passive, bonusData);
      skl.passive = 10 + skl.mod + skl.bonus + skl.prof.flat + passive + passiveBonus;
    }
  }

  /* -------------------------------------------- */

  /**
   * Calculate the initiative bonus to display on a character sheet
   *
   * @param {object} actorData         The actor data being prepared.
   * @param {number} globalCheckBonus  The simplified global ability check bonus for this actor
   * @param {object} bonusData         Actor data to use for replacing formula variables in bonuses
   */
  _computeInitiativeModifier(actorData, globalCheckBonus, bonusData) {
    const data = actorData.data;
    const flags = actorData.flags.me5e || {};
    const init = data.attributes.init;

    // Set Ability
    init.ability = init.userAbility || init.defaultAbility;

    // Initiative modifiers
    const joat = flags.jackOfAllTrades;
    const athlete = flags.remarkableAthlete;
    const checkBonus = this._simplifyBonus(data.abilities[init.ability]?.bonuses?.check, bonusData);

    // Compute initiative modifier
    init.mod = data.abilities[init.ability]?.mod ?? 0;
    init.prof = new Proficiency(data.attributes.prof, (joat || athlete) ? 0.5 : 0, !athlete);
    init.value = init.value ?? 0;
    init.bonus = init.value + (flags.initiativeAlert ? 5 : 0);
    init.total = init.mod + init.bonus + checkBonus + globalCheckBonus;
    if ( Number.isNumeric(init.prof.term) ) init.total += init.prof.flat;
  }

  /* -------------------------------------------- */

  /**
   * Prepare data related to the spell-casting capabilities of the Actor.
   * @param {object} actorData  Copy of the data for the actor being prepared. *Will be mutated.*
   * @protected
   */
  _computeSpellcastingProgression(actorData) {
    // TODO: Split for NPCs and actors
    const ad = actorData.data;
    const spells = ad.spells;
    const isNPC = actorData.type === "npc";

    // Spellcasting DC
    const spellcastingAbility = ad.abilities[ad.attributes.spellcasting];
    ad.attributes.spelldc = spellcastingAbility ? spellcastingAbility.dc : 8 + ad.attributes.prof;

    // Translate the list of classes into spell-casting progression
    const progression = {
      total: 0,
      slot: 0,
      pact: 0
    };

    // Keep track of the last seen caster in case we're in a single-caster situation.
    let caster = null;

    // Tabulate the total spell-casting progression
    for ( let cls of Object.values(this.classes) ) {
      const classData = cls.data.data;
      const subclassProg = cls.subclass?.data.data.spellcasting.progression;
      const prog = ( subclassProg && (subclassProg !== "none") ) ? subclassProg : classData.spellcasting.progression;
      if ( prog === "none" ) continue;
      const levels = classData.levels;

      // Accumulate levels
      if ( prog !== "pact" ) {
        caster = classData;
        progression.total++;
      }
      switch (prog) {
        case "third": progression.slot += Math.floor(levels / 3); break;
        case "half": progression.slot += Math.floor(levels / 2); break;
        case "full": progression.slot += levels; break;
        case "artificer": progression.slot += Math.ceil(levels / 2); break;
        case "pact": progression.pact += levels; break;
      }
    }

    // EXCEPTION: single-classed non-full progression rounds up, rather than down
    const isSingleClass = (progression.total === 1) && (progression.slot > 0);
    if (!isNPC && isSingleClass && ["half", "third"].includes(caster.spellcasting.progression) ) {
      const denom = caster.spellcasting.progression === "third" ? 3 : 2;
      progression.slot = Math.ceil(caster.levels / denom);
    }

    // EXCEPTION: NPC with an explicit spell-caster level
    if (isNPC && actorData.data.details.spellLevel) {
      progression.slot = actorData.data.details.spellLevel;
    }

    // Look up the number of slots per level from the progression table
    const levels = Math.clamped(progression.slot, 0, CONFIG.ME5E.maxLevel);
    const slots = CONFIG.ME5E.SPELL_SLOT_TABLE[Math.min(levels, CONFIG.ME5E.SPELL_SLOT_TABLE.length) - 1] || [];
    for ( let [n, lvl] of Object.entries(spells) ) {
      let i = parseInt(n.slice(-1));
      if ( Number.isNaN(i) ) continue;
      if ( Number.isNumeric(lvl.override) ) lvl.max = Math.max(parseInt(lvl.override), 0);
      else lvl.max = slots[i-1] || 0;
      lvl.value = parseInt(lvl.value);
    }

    // Determine the Actor's pact magic level (if any)
    let pl = Math.clamped(progression.pact, 0, CONFIG.ME5E.maxLevel);
    spells.pact = spells.pact || {};
    if ( (pl === 0) && isNPC && Number.isNumeric(spells.pact.override) ) pl = actorData.data.details.spellLevel;

    // Determine the number of Warlock pact slots per level
    if ( pl > 0) {
      spells.pact.level = Math.ceil(Math.min(10, pl) / 2);
      if ( Number.isNumeric(spells.pact.override) ) spells.pact.max = Math.max(parseInt(spells.pact.override), 1);
      else spells.pact.max = Math.max(1, Math.min(pl, 2), Math.min(pl - 8, 3), Math.min(pl - 13, 4));
      spells.pact.value = Math.min(spells.pact.value, spells.pact.max);
    } else {
      spells.pact.max = parseInt(spells.pact.override) || 0;
      spells.pact.level = spells.pact.max > 0 ? 1 : 0;
    }
  }

  /* -------------------------------------------- */

  /**
   * Determine a character's AC value from their equipped armor and shield.
   * @param {object} data  Copy of the data for the actor being prepared. *Will be mutated.*
   * @returns {{
   *   calc: string,
   *   value: number,
   *   base: number,
   *   shield: number,
   *   bonus: number,
   *   cover: number,
   *   flat: number,
   *   equippedArmor: Item5e,
   *   equippedShield: Item5e,
   *   warnings: string[]
   * }}
   * @private
   */
  _computeArmorClass(data) {

    // Get AC configuration and apply automatic migrations for older data structures
    const ac = data.attributes.ac;
    ac.warnings = [];
    let cfg = CONFIG.ME5E.armorClasses[ac.calc];
    if ( !cfg ) {
      ac.calc = "flat";
      if ( Number.isNumeric(ac.value) ) ac.flat = Number(ac.value);
      cfg = CONFIG.ME5E.armorClasses.flat;
    }

    // Identify Equipped Items
    const armorTypes = new Set(Object.keys(CONFIG.ME5E.armorTypes));
    const {armors, shields} = this.itemTypes.equipment.reduce((obj, equip) => {
      const armor = equip.data.data.armor;
      if ( !equip.data.data.equipped || !armorTypes.has(armor?.type) ) return obj;
      if ( armor.type === "shield" ) obj.shields.push(equip);
      else obj.armors.push(equip);
      return obj;
    }, {armors: [], shields: []});

    // Determine base AC
    switch ( ac.calc ) {

      // Flat AC (no additional bonuses)
      case "flat":
        ac.value = Number(ac.flat);
        return ac;

      // Natural AC (includes bonuses)
      case "natural":
        ac.base = Number(ac.flat);
        break;

      default:
        let formula = ac.calc === "custom" ? ac.formula : cfg.formula;
        const rollData = foundry.utils.deepClone(this.getRollData());
        if ( armors.length ) {
          if ( armors.length > 1 ) ac.warnings.push("ME5E.WarnMultipleArmor");
          const armorData = armors[0].data.data.armor;
          const isHeavy = armorData.type === "heavy";
          ac.armor = armorData.value ?? ac.armor;
          ac.dex = isHeavy ? 0 : Math.min(armorData.dex ?? Infinity, data.abilities.dex?.mod ?? 0);
          ac.equippedArmor = armors[0];
        } else {
          ac.dex = data.abilities.dex?.mod ?? 0;
        }
        rollData.attributes.ac = ac;
        try {
          const replaced = Roll.replaceFormulaData(formula, rollData);
          ac.base = Roll.safeEval(replaced);
        } catch(err) {
          ac.warnings.push("ME5E.WarnBadACFormula");
          const replaced = Roll.replaceFormulaData(CONFIG.ME5E.armorClasses.default.formula, rollData);
          ac.base = Roll.safeEval(replaced);
        }
        break;
    }

    // Equipped Shield
    if ( shields.length ) {
      if ( shields.length > 1 ) ac.warnings.push("ME5E.WarnMultipleShields");
      ac.shield = shields[0].data.data.armor.value ?? 0;
      ac.equippedShield = shields[0];
    }

    // Compute total AC and return
    ac.value = ac.base + ac.shield + ac.bonus + ac.cover;
    return ac;
  }

  /* -------------------------------------------- */
  /*  Event Handlers                              */
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
  /*  Gameplay Mechanics                          */
  /* -------------------------------------------- */

  /**
   * Roll a Skill Check
   * Prompt the user for input regarding Advantage/Disadvantage and any Situational Bonus
   * @param {string} skillId      The skill id (e.g. "ins")
   * @param {object} options      Options which configure how the skill check is rolled
   * @returns {Promise<Roll>}     A Promise which resolves to the created Roll instance
   */
  rollSkill(skillId, options={}) {
    const skl = this.data.data.skills[skillId];
    const abl = this.data.data.abilities[skl.ability];
    const bonuses = getProperty(this.data.data, "bonuses.abilities") || {};

    const parts = ["@mod", "@abilityCheckBonus"];
    const data = this.getRollData();

    // Add ability modifier
    data.mod = skl.mod;
    data.defaultAbility = skl.ability;

    // Include proficiency bonus
    if ( skl.prof.hasProficiency ) {
      parts.push("@prof");
      data.prof = skl.prof.term;
    }

    // Global ability check bonus
    if ( bonuses.check ) {
      parts.push("@checkBonus");
      data.checkBonus = Roll.replaceFormulaData(bonuses.check, data);
    }

    // Ability-specific check bonus
    if ( abl?.bonuses?.check ) data.abilityCheckBonus = Roll.replaceFormulaData(abl.bonuses.check, data);
    else data.abilityCheckBonus = 0;

    // Skill-specific skill bonus
    if ( skl.bonuses?.check ) {
      const checkBonusKey = `${skillId}CheckBonus`;
      parts.push(`@${checkBonusKey}`);
      data[checkBonusKey] = Roll.replaceFormulaData(skl.bonuses.check, data);
    }

    // Global skill check bonus
    if ( bonuses.skill ) {
      parts.push("@skillBonus");
      data.skillBonus = Roll.replaceFormulaData(bonuses.skill, data);
    }

    // Add provided extra roll parts now because they will get clobbered by mergeObject below
    if (options.parts?.length > 0) {
      parts.push(...options.parts);
    }

    // Reliable Talent applies to any skill check we have full or better proficiency in
    const reliableTalent = (skl.value >= 1 && this.getFlag("me5e", "reliableTalent"));

    // Roll and return
    const flavor = game.i18n.format("ME5E.SkillPromptTitle", {skill: CONFIG.ME5E.skills[skillId]});
    const rollData = foundry.utils.mergeObject(options, {
      parts: parts,
      data: data,
      title: `${flavor}: ${this.name}`,
      flavor,
      chooseModifier: true,
      halflingLucky: this.getFlag("me5e", "halflingLucky"),
      reliableTalent: reliableTalent,
      messageData: {
        speaker: options.speaker || ChatMessage.getSpeaker({actor: this}),
        "flags.me5e.roll": {type: "skill", skillId }
      }
    });
    return d20Roll(rollData);
  }

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
   * @returns {Promise<Roll>}     A Promise which resolves to the created Roll instance
   */
  rollAbilityTest(abilityId, options={}) {
    const label = CONFIG.ME5E.abilities[abilityId] ?? "";
    const abl = this.data.data.abilities[abilityId];

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
    const bonuses = getProperty(this.data.data, "bonuses.abilities") || {};
    if ( bonuses.check ) {
      parts.push("@checkBonus");
      data.checkBonus = Roll.replaceFormulaData(bonuses.check, data);
    }

    // Add provided extra roll parts now because they will get clobbered by mergeObject below
    if (options.parts?.length > 0) {
      parts.push(...options.parts);
    }

    // Roll and return
    const flavor = game.i18n.format("ME5E.AbilityPromptTitle", {ability: label});
    const rollData = foundry.utils.mergeObject(options, {
      parts,
      data,
      title: `${flavor}: ${this.name}`,
      flavor,
      halflingLucky: this.getFlag("me5e", "halflingLucky"),
      messageData: {
        speaker: options.speaker || ChatMessage.getSpeaker({actor: this}),
        "flags.me5e.roll": {type: "ability", abilityId }
      }
    });
    return d20Roll(rollData);
  }

  /* -------------------------------------------- */

  /**
   * Roll an Ability Saving Throw
   * Prompt the user for input regarding Advantage/Disadvantage and any Situational Bonus
   * @param {string} abilityId    The ability ID (e.g. "str")
   * @param {object} options      Options which configure how ability tests are rolled
   * @returns {Promise<Roll>}     A Promise which resolves to the created Roll instance
   */
  rollAbilitySave(abilityId, options={}) {
    const label = CONFIG.ME5E.abilities[abilityId] ?? "";
    const abl = this.data.data.abilities[abilityId];

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
    const bonuses = getProperty(this.data.data, "bonuses.abilities") || {};
    if ( bonuses.save ) {
      parts.push("@saveBonus");
      data.saveBonus = Roll.replaceFormulaData(bonuses.save, data);
    }

    // Add provided extra roll parts now because they will get clobbered by mergeObject below
    if (options.parts?.length > 0) {
      parts.push(...options.parts);
    }

    // Roll and return
    const flavor = game.i18n.format("ME5E.SavePromptTitle", {ability: label});
    const rollData = foundry.utils.mergeObject(options, {
      parts,
      data,
      title: `${flavor}: ${this.name}`,
      flavor,
      halflingLucky: this.getFlag("me5e", "halflingLucky"),
      messageData: {
        speaker: options.speaker || ChatMessage.getSpeaker({actor: this}),
        "flags.me5e.roll": {type: "save", abilityId }
      }
    });
    return d20Roll(rollData);
  }

  /* -------------------------------------------- */

  /**
   * Perform a death saving throw, rolling a d20 plus any global save bonuses
   * @param {object} options        Additional options which modify the roll
   * @returns {Promise<Roll|null>}  A Promise which resolves to the Roll instance
   */
  async rollDeathSave(options={}) {

    // Display a warning if we are not at zero HP or if we already have reached 3
    const death = this.data.data.attributes.death;
    if ( (this.data.data.attributes.hp.value > 0) || (death.failure >= 3) || (death.success >= 3)) {
      ui.notifications.warn(game.i18n.localize("ME5E.DeathSaveUnnecessary"));
      return null;
    }

    // Evaluate a global saving throw bonus
    const parts = [];
    const data = this.getRollData();
    const speaker = options.speaker || ChatMessage.getSpeaker({actor: this});

    // Diamond Soul adds proficiency
    if ( this.getFlag("me5e", "diamondSoul") ) {
      parts.push("@prof");
      data.prof = new Proficiency(this.data.data.attributes.prof, 1).term;
    }

    // Include a global actor ability save bonus
    const bonuses = foundry.utils.getProperty(this.data.data, "bonuses.abilities") || {};
    if ( bonuses.save ) {
      parts.push("@saveBonus");
      data.saveBonus = Roll.replaceFormulaData(bonuses.save, data);
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
          "data.attributes.death.success": 0,
          "data.attributes.death.failure": 0,
          "data.attributes.hp.value": 1
        });
        chatString = "ME5E.DeathSaveCriticalSuccess";
      }

      // 3 Successes = survive and reset checks
      else if ( successes === 3 ) {
        await this.update({
          "data.attributes.death.success": 0,
          "data.attributes.death.failure": 0
        });
        chatString = "ME5E.DeathSaveSuccess";
      }

      // Increment successes
      else await this.update({"data.attributes.death.success": Math.clamped(successes, 0, 3)});
    }

    // Save failure
    else {
      let failures = (death.failure || 0) + (d20 === 1 ? 2 : 1);
      await this.update({"data.attributes.death.failure": Math.clamped(failures, 0, 3)});
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
}
