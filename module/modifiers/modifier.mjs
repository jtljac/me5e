import {resolveFormulaValue} from "../utils.mjs";

export default class Modifier5e {
  /**
   * The attributes the modifier can target
   * @typedef {String} Modifier5eTarget
   * @enum Modifier5eTarget
   */
  static targets = {
    /** The character's max hp */
    hp: "system.attributes.hp",
    /** The character's ac **/
    ac: "system.attributes.ac",
    /** The character's Initiative */
    init: "system.attributes.init",
    /** The character's Strength Ability Score */
    str: "system.abilities.str",
    /** The character's Dexterity Ability Score */
    dex: "system.abilities.dex",
    /** The character's Constitution Ability Score */
    con: "system.abilities.con",
    /** The character's Intelligence Ability Score */
    int: "system.abilities.int",
    /** The character's Wisdom Ability Score */
    wis: "system.abilities.wis",
    /** The character's Charisma Ability Score */
    cha: "system.abilities.cha",
  };

  /**
   * The name used to identify the modifier to the user
   * @type {String}
   */
  name;

  /**
   * The category of the modifier
   * @type CONFIG.ME5E.ModifierCategories
   */
  category;

  /**
   * The formula used to calculate the value of the modifier
   * @type {String | Number}
   */
  formula;

  /**
   * Whether the modifier is editable by the user
   * @type {boolean}
   */
  user;

  /**
   * The data provided to construct a Modifier5e
   * @typedef {Object} Modifier5eData
   * @property {String} name The name used to identify the property
   * @property {CONFIG.ME5E.ModifierCategories} category The category of the modifier
   * @property {String | Number} formula The formula used to calculate the value of the modifier
   */

  /**
   * @param data {Modifier5eData}
   * @param user {boolean} Whether the modifier is editable by the user
   */
  constructor(data={}, user) {
    if (!data.name) throw new Error("A modifier must be constructed with a name");
    this.name = data.name;

    if (data.category && !Object.values(CONFIG.ME5E.ModifierCategories).includes(data.category)) {
      throw new Error(`Unknown Modifier Category: ${data.category}`);
    }
    this.category = data.category || CONFIG.ME5E.ModifierCategories.custom;

    if (!data.formula) throw new Error("A modifier must be constructed with a formula");
    this.formula = data.formula;

    this.user = user || true;
  }

  /**
   * Evaluate the formula of the modifier
   * @param data The data used by the formula
   * @returns the result of the formula
   */
  evaluate(data) {
    return resolveFormulaValue(this.formula, data);
  }
}
