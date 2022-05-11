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

  resolveValue(operator, data) {
    if (this.eval) {
      const result = Roll.replaceFormulaData(operator, data, {missing: "0", warn: true});

      return Roll.safeEval(result) ?? 0;
    }

    return operator;
  }
}
