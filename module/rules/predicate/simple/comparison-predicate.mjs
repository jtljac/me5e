import SimplePredicate from "./simple-predicate.mjs";

/**
 * An abstract predicate that compares two operands
 * @abstract
 */
export default class ComparisonPredicate extends SimplePredicate {
  /**
   * The left-hand operand
   * @type {string | number}
   */
  lh;

  /**
   * The right-hand operand
   * @type {string | number}
   */
  rh;

  constructor(data) {
    super(data);
    this.lh = data.lh;
    this.rh = data.rh;
  }
}
