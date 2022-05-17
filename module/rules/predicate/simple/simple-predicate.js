import Predicate5e from "../predicate.js";

/**
 * An abstract predicate for handling values
 * @abstract
 */
export class SimplePredicate extends Predicate5e {
  /**
   * Whether the operands should be evaluated before being compared
   * @type {boolean}
   */
  eval;

  /**
   * @inheritDoc
   */
  constructor(data) {
    super(data);
    this.eval = Boolean(data.eval ?? true);
  }

  /**
   * Resolves the formula into a value
   * @param formula The formula used to calculate the value
   * @param data The data used by the formula
   * @return {number}
   * @protected
   */
  _resolveValue(formula, data) {
    if (this.eval && isNaN(value)) {
      const result = Roll.replaceFormulaData(value, data, {missing: "0", warn: true});

      return Roll.safeEval(result) ?? 0;
    }

    return value;
  }
}
