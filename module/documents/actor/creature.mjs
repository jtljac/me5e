import Actor5e from "./actor.mjs";
import {simplifyBonus} from "../../utils.mjs";
import Proficiency from "./proficiency.mjs";
import {d20Roll} from "../../dice/dice.mjs";

export default class Creature5e extends Actor5e {
  /* -------------------------------------------- */
  /*  Event Handlers                              */
  /* -------------------------------------------- */
  /** @inheritDoc */
  prepareBaseData() {
    super.prepareBaseData();

    const updates = {};
    this._prepareBaseSkills(updates);
    if ( !foundry.utils.isEmpty(updates) ) {
      if ( !this.id ) this.updateSource(updates);
      else this.update(updates);
    }
  }

  /** @inheritDoc */
  prepareDerivedData() {
    super.prepareDerivedData();

    const globalBonuses = this.system.bonuses?.abilities ?? {};
    const bonusData = this.getRollData();
    const checkBonus = simplifyBonus(globalBonuses?.check, bonusData);
    this._prepareSkills(bonusData, globalBonuses, checkBonus);
    this._prepareInitiative(bonusData, checkBonus);
    this._prepareSpellcasting();
  }

  /* -------------------------------------------- */
  /*  Base Data Preparation Helpers               */
  /* -------------------------------------------- */

  /**
   * Update the actor's skill list to match the skills configured in `ME5E.skills`.
   * Mutates the system.skills object.
   * @param {object} updates  Updates to be applied to the actor. *Will be mutated*.
   * @private
   */
  _prepareBaseSkills(updates) {
    const skills = {};
    for ( const [key, skill] of Object.entries(CONFIG.ME5E.skills) ) {
      skills[key] = this.system.skills[key];
      if ( !skills[key] ) {
        skills[key] = foundry.utils.deepClone(game.system.template.Actor.templates.creature.skills.acr);
        skills[key].ability = skill.ability;
        updates[`data.skills.${key}`] = foundry.utils.deepClone(skills[key]);
      }
    }
    this.system.skills = skills;
  }

  /* -------------------------------------------- */
  /*  Derived Data Preparation Helpers            */
  /* -------------------------------------------- */

  /**
   * Prepare skill checks. Mutates the values of system.skills.
   * @param {object} bonusData       Data produced by `getRollData` to be applied to bonus formulas.
   * @param {object} globalBonuses   Global bonus data.
   * @param {number} checkBonus      Global ability check bonus.
   * @protected
   */
  _prepareSkills(bonusData, globalBonuses, checkBonus) {
    const flags = this.flags.me5e ?? {};

    // Skill modifiers
    const feats = CONFIG.ME5E.characterFlags;
    const skillBonus = simplifyBonus(globalBonuses.skill, bonusData);
    for ( const [id, skl] of Object.entries(this.system.skills) ) {
      skl.ability = skl.userAbility || skl.defaultAbility;

      skl.value = Math.clamped(Number(skl.value).toNearest(0.5), 0, 2) ?? 0;
      const baseBonus = simplifyBonus(skl.bonuses?.check, bonusData);
      let roundDown = true;

      // Remarkable Athlete
      if ( this._isRemarkableAthlete(skl.ability) && (skl.value < 0.5) ) {
        skl.value = 0.5;
        roundDown = false;
      }

      // Jack of All Trades
      else if ( flags.jackOfAllTrades && (skl.value < 0.5) ) {
        skl.value = 0.5;
      }

      // Compute modifier
      const ability = this.system.abilities[skl.ability];
      const checkBonusAbl = simplifyBonus(ability?.bonuses?.check, bonusData);
      skl.bonus = baseBonus + checkBonus + checkBonusAbl + skillBonus;
      skl.mod = ability?.mod ?? 0;
      skl.prof = new Proficiency(this.system.attributes.prof, skl.value, roundDown);
      skl.proficient = skl.value;
      skl.total = skl.mod + skl.bonus;
      if ( Number.isNumeric(skl.prof.term) ) skl.total += skl.prof.flat;

      // Compute passive bonus
      const passive = flags.observantFeat && (feats.observantFeat.skills.includes(id)) ? 5 : 0;
      const passiveBonus = simplifyBonus(skl.bonuses?.passive, bonusData);
      skl.passive = 10 + skl.mod + skl.bonus + skl.prof.flat + passive + passiveBonus;
    }
  }



  /* -------------------------------------------- */

  /**
   * Prepare the initiative data for an actor.
   * Mutates the value of the `system.attributes.init` object.
   * @param {object} bonusData         Data produced by `getRollData` to be applied to bonus formulas.
   * @param {number} globalCheckBonus  Global ability check bonus.
   * @protected
   */
  _prepareInitiative(bonusData, globalCheckBonus) {
    const init = this.system.attributes.init ??= {};
    const checkBonus = simplifyBonus(this.system.abilities[init.ability]?.bonuses?.check, bonusData);

    init.ability = init.userAbility || init.defaultAbility;

    init.mod = this.system.abilities[init.ability]?.mod ?? 0;
    init.value ??= 0;
    init.total = init.mod + init.value + checkBonus + globalCheckBonus;
  }

  /* -------------------------------------------- */

  /**
   * Prepare data related to the spell-casting capabilities of the Actor.
   * Mutates the value of the system.spells object.
   * @protected
   */
  _prepareSpellcasting() {
    const isNPC = this.type === "npc";
    const spells = this.system.spells;

    // Spellcasting DC
    const spellcastingAbility = this.system.abilities[this.system.attributes.spellcasting];
    this.system.attributes.spelldc = spellcastingAbility ? spellcastingAbility.dc : 8 + this.system.attributes.prof;

    // Translate the list of classes into spell-casting progression
    const progression = {total: 0, slot: 0, pact: 0};

    // Keep track of the last seen caster in case we're in a single-caster situation.
    let caster = null;

    // Tabulate the total spell-casting progression
    for ( let cls of Object.values(this.classes) ) {
      const prog = cls.spellcasting.progression;
      if ( prog === "none" ) continue;
      const levels = cls.system.levels;

      // Accumulate levels
      if ( prog !== "pact" ) {
        caster = cls;
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
    if ( !isNPC && isSingleClass && ["half", "third"].includes(caster.spellcasting.progression) ) {
      const denom = caster.spellcasting.progression === "third" ? 3 : 2;
      progression.slot = Math.ceil(caster.system.levels / denom);
    }

    // EXCEPTION: NPC with an explicit spell-caster level
    if ( isNPC && this.system.details.spellLevel ) progression.slot = this.system.details.spellLevel;

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
    if ( (pl === 0) && isNPC && Number.isNumeric(spells.pact.override) ) pl = this.system.details.spellLevel;

    // Determine the number of Warlock pact slots per level
    if ( pl > 0 ) {
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
  /*  Gameplay Mechanics                          */
  /* -------------------------------------------- */

  /** @inheritDoc */
  getInitiativeFormula() {
    /*
     * Apply advantage, proficiency, or bonuses where appropriate
     * Apply the dexterity score as a decimal tiebreaker if requested
     */
    const init = this.system.attributes.init;
    const rollData = this.getRollData();

    const parts = [
      super.getInitiativeFormula(),
      init.mod
    ];

    // Ability Check Bonuses
    const checkBonus = this.system.abilities[init.ability]?.bonuses?.check;
    const globalCheckBonus = this.system.bonuses?.abilities?.check;
    if ( checkBonus ) parts.push(Roll.replaceFormulaData(checkBonus, rollData));
    if ( globalCheckBonus ) parts.push(Roll.replaceFormulaData(globalCheckBonus, rollData));

    // Optionally apply Dexterity tiebreaker
    const tiebreaker = game.settings.get("me5e", "initiativeDexTiebreaker");
    if ( tiebreaker ) parts.push((this.system.abilities.dex?.value ?? 0) / 100);
    return parts.filter(p => p !== null).join(" + ");
  }

  /* -------------------------------------------- */
  /*  Rolls                                       */
  /* -------------------------------------------- */

  /**
   * Roll a Skill Check
   * Prompt the user for input regarding Advantage/Disadvantage and any Situational Bonus
   * @param {string} skillId      The skill id (e.g. "ins")
   * @param {object} options      Options which configure how the skill check is rolled
   * @returns {Promise<D20Roll>}  A Promise which resolves to the created Roll instance
   */
  async rollSkill(skillId, options={}) {
    const skl = this.system.skills[skillId];
    const abl = this.system.abilities[skl.ability];
    const globalBonuses = this.system.bonuses?.abilities ?? {};
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
    if ( globalBonuses.check ) {
      parts.push("@checkBonus");
      data.checkBonus = Roll.replaceFormulaData(globalBonuses.check, data);
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
    if ( globalBonuses.skill ) {
      parts.push("@skillBonus");
      data.skillBonus = Roll.replaceFormulaData(globalBonuses.skill, data);
    }

    // Add provided extra roll parts now because they will get clobbered by mergeObject below
    if ( options.parts?.length > 0 ) parts.push(...options.parts);

    // Reliable Talent applies to any skill check we have full or better proficiency in
    const reliableTalent = (skl.value >= 1 && this.getFlag("me5e", "reliableTalent"));

    // Roll and return
    const flavor = game.i18n.format("ME5E.SkillPromptTitle", {skill: CONFIG.ME5E.skills[skillId]?.label ?? ""});
    const rollData = foundry.utils.mergeObject({
      parts: parts,
      data: data,
      title: `${flavor}: ${this.name}`,
      flavor,
      chooseModifier: true,
      halflingLucky: this.getFlag("me5e", "halflingLucky"),
      reliableTalent,
      messageData: {
        speaker: options.speaker || ChatMessage.getSpeaker({actor: this}),
        "flags.me5e.roll": {type: "skill", skillId }
      }
    }, options);

    /**
     * A hook event that fires before a skill check is rolled for an Actor.
     * @function me5e.preRollSkill
     * @memberof hookEvents
     * @param {Actor5e} actor                Actor for which the skill check is being rolled.
     * @param {D20RollConfiguration} config  Configuration data for the pending roll.
     * @param {string} skillId               ID of the skill being rolled as defined in `ME5E.skills`.
     * @returns {boolean}                    Explicitly return `false` to prevent skill check from being rolled.
     */
    if ( Hooks.call("me5e.preRollSkill", this, rollData, skillId) === false ) return;

    const roll = await d20Roll(rollData);

    /**
     * A hook event that fires after a skill check has been rolled for an Actor.
     * @function me5e.rollSkill
     * @memberof hookEvents
     * @param {Actor5e} actor   Actor for which the skill check has been rolled.
     * @param {D20Roll} roll    The resulting roll.
     * @param {string} skillId  ID of the skill that was rolled as defined in `ME5E.skills`.
     */
    if ( roll ) Hooks.callAll("me5e.rollSkill", this, roll, skillId);

    return roll;
  }
}
