/**
 * A modifier allows you to modify specific actor data whilst providing extra information about the modification,
 * like its source
 */
export default class Modifier5e {
  /**
   * The values that the modifier can affect
   * @typedef {String} ModType
   * @enum {ModType}
   */
  static ModTypes = {
    "Class": "class",
    Feat: "feat",
    Item: "item",
    Effect: "effect",
    Ability: "ability",
    Custom: "custom"
  }

  /**
   * The name of the Modifier
   * @type {String}
   */
  name;

  /**
   * The formula used to calculate the value
   * @type {String}
   */
  formula;

  /**
   * The value that the modifier will apply to
   * @type {ModType}
   */
  type;

  /**
   * Whether this modifier is set by the user and thus configurable
   * @type {Boolean}
   */
  user;

  constructor(data, user=true) {
    this.name = data.name;
    this.formula = data.formula;

    if (Modifier5e.ModTypes.values.includes(data.type)) {
      this.type = data.type;
    } else {
      this.type = Modifier5e.ModTypes.Custom;
    }

    this.user = user;
  }

  // Getters
  /**
   * Resolve the modifier's formula to a value using the provided data
   * @param data The data used to resolve the value
   * @return {number}
   */
  getValue(data) {
    return this._resolveValue(this.formula, data);
  }

  // Utilities
  /**
   * Resolves the formula into a value
   * @param formula The formula used to calculate the value
   * @param data The data used by the formula
   * @return {number}
   * @protected
   */
  _resolveValue(formula, data) {
    const result = Roll.replaceFormulaData(formula, data, {missing: "0", warn: true});

    return Roll.safeEval(result) ?? 0;
  }
}
