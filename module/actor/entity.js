import Proficiency from "./proficiency.js";
import ProficiencySelector from "../apps/proficiency-selector.js";
import Rule5e from "../rules/rule.js";


/**
 * Extend the base Actor class to implement additional system-specific logic.
 * @extends {Actor}
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

  /** @inheritdoc */
  static LOG_V10_COMPATIBILITY_WARNINGS = false;

  /* -------------------------------------------- */
  /*  Methods                                     */
  /* -------------------------------------------- */

  /** @override */
  prepareData() {
    this._preparationWarnings = [];
    this.overrides = {}
    super.prepareData();

    for (const rule of this.rules) {
      rule.afterDerived(this, this.data);
    }

    // Iterate over owned items and recompute attributes that depend on prepared actor data
    this.items.forEach(item => item.prepareFinalAttributes());
  }

  /* -------------------------------------------- */

  /** @override */
  prepareBaseData() {

  }

  /* --------------------------------------------- */

  /** @override */
  prepareEmbeddedDocuments() {
    // This super call first calls prepare data on all the embedded items, then calls apply active effects
    super.prepareEmbeddedDocuments();

    this._prepareRules();

    for (const rule of this.rules) {
      rule.onActiveEffects(this, this.data);
    }
  }

  /* -------------------------------------------- */

  /** @override */
  prepareDerivedData() {
    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags.me5e || {};
    const bonuses = getProperty(data, "bonuses.abilities") || {};

    // TODO: There's gotta be some data that's common to all actor types
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getRollData() {
    const data = super.getRollData();
    data.prof = new Proficiency(this.data.data.attributes.prof, 1);

    return data;
  }

  /* -------------------------------------------- */
  /*  Data Preparation Helpers                    */
  /* -------------------------------------------- */

  /**
   * Convert a bonus value to a simple integer for displaying on the sheet.
   * @param {number|string|null} bonus  Actor's bonus value.
   * @param {object} data               Actor data to use for replacing @ strings.
   * @returns {number}                  Simplified bonus as an integer.
   * @protected
   */
  _simplifyBonus(bonus, data) {
    if ( !bonus ) return 0;
    if ( Number.isNumeric(bonus) ) return Number(bonus);
    try {
      const roll = new Roll(bonus, data);
      if ( !roll.isDeterministic ) return 0;
      roll.evaluate({ async: false });
      return roll.total;
    } catch(error) {
      console.error(error);
      return 0;
    }
  }

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
  /*  Event Handlers                              */
  /* -------------------------------------------- */

  /** @inheritdoc */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);
    const sourceId = this.getFlag("core", "sourceId");
    if ( sourceId?.startsWith("Compendium.") ) return;

    // Some sensible defaults for convenience
    // Token size category
    const s = CONFIG.ME5E.tokenSizes[this.data.data.traits.size || "med"];
    this.data.token.update({width: s, height: s});
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async _preUpdate(changed, options, user) {
    await super._preUpdate(changed, options, user);

    // Apply changes in Actor size to Token width/height
    const newSize = foundry.utils.getProperty(changed, "data.traits.size");
    if ( newSize && (newSize !== foundry.utils.getProperty(this.data, "data.traits.size")) ) {
      let size = CONFIG.ME5E.tokenSizes[newSize];
      if ( !foundry.utils.hasProperty(changed, "token.width") ) {
        changed.token = changed.token || {};
        changed.token.height = size;
        changed.token.width = size;
      }
    }

    // Reset death save counters
    const isDead = this.data.data.attributes.hp.value <= 0;
    if ( isDead && (foundry.utils.getProperty(changed, "data.attributes.hp.value") > 0) ) {
      foundry.utils.setProperty(changed, "data.attributes.death.success", 0);
      foundry.utils.setProperty(changed, "data.attributes.death.failure", 0);
    }
  }

  /* -------------------------------------------- */
  /*  Gameplay Mechanics                          */
  /* -------------------------------------------- */

  /** @override */
  async modifyTokenAttribute(attribute, value, isDelta, isBar) {
    if ( attribute === "attributes.hp" ) {
      const hp = getProperty(this.data.data, attribute);
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
  async applyDamage(amount=0, multiplier=1) {
    amount = Math.floor(parseInt(amount) * multiplier);
    const hp = this.data.data.attributes.hp;

    // Deduct damage from temp HP first
    const tmp = parseInt(hp.temp) || 0;
    const dt = amount > 0 ? Math.min(tmp, amount) : 0;

    // Remaining goes to health
    const dh = Math.clamped(hp.value - (amount - dt), 0, hp.max);

    // Update the Actor
    const updates = {
      "data.attributes.hp.temp": tmp - dt,
      "data.attributes.hp.value": dh
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
  /*  Conversion & Transformation                 */
  /* -------------------------------------------- */

  /**
   * Convert all carried currency to the highest possible denomination to reduce the number of raw coins being
   * carried by an Actor.
   * @returns {Promise<Actor5e>}
   */
  convertCurrency() {
    const curr = foundry.utils.deepClone(this.data.data.currency);
    const conversion = Object.entries(CONFIG.ME5E.currencies);
    conversion.reverse();
    for ( let [c, data] of conversion ) {
      const t = data.conversion;
      if ( !t ) continue;
      let change = Math.floor(curr[c] / t.each);
      curr[c] -= (change * t.each);
      curr[t.into] += change;
    }
    return this.update({"data.currency": curr});
  }

  /* -------------------------------------------- */

  /**
   * Add additional system-specific sidebar directory context menu options for Actor documents
   * @param {jQuery} html         The sidebar HTML
   * @param {Array} entryOptions  The default array of context menu options
   */
  static addDirectoryContextOptions(html, entryOptions) {
    entryOptions.push({
      name: "ME5E.PolymorphRestoreTransformation",
      icon: '<i class="fas fa-backward"></i>',
      callback: li => {
        const actor = game.actors.get(li.data("documentId"));
        return actor.revertOriginalForm();
      },
      condition: li => {
        const allowed = game.settings.get("me5e", "allowPolymorphing");
        if ( !allowed && !game.user.isGM ) return false;
        const actor = game.actors.get(li.data("documentId"));
        return actor && actor.isPolymorphed;
      }
    });
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
    if ( data.value ) {
      values = data.value instanceof Array ? data.value : [data.value];
    }

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
    if ( data.custom ) {
      data.custom.split(";").forEach((c, i) => data.selected[`custom${i+1}`] = c.trim());
    }
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
    for ( let t of tokens ) {
      const pct = Math.clamped(Math.abs(dhp) / this.data.data.attributes.hp.max, 0, 1);
      t.hud.createScrollingText(dhp.signedString(), {
        anchor: CONST.TEXT_ANCHOR_POINTS.TOP,
        fontSize: 16 + (32 * pct), // Range between [16, 48]
        fill: CONFIG.ME5E.tokenHPColors[dhp < 0 ? "damage" : "healing"],
        stroke: 0x000000,
        strokeThickness: 4,
        jitter: 0.25
      });
    }
  }
}
