import Predicate5e from "../predicate.mjs";
import {resolveFormulaValue} from "../../../utils.mjs";

/**
 * An abstract predicate for handling values
 * @abstract
 */
export default class SimplePredicate extends Predicate5e {
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
    if (this.eval && isNaN(formula)) {
      return resolveFormulaValue(formula, data)
    }

    return formula;
  }
}
