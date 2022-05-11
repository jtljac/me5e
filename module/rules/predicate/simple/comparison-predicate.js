import {SimplePredicate} from "./simple-predicate.js";

/**
 * An abstract predicate that compares two operands
 * @abstract
 */
export default class ComparisonPredicate extends SimplePredicate {
  // noinspection EqualityComparisonWithCoercionJS
  /**
   * The available operators for comparing
   * @typedef {function(*, *)} Operands
   * @enum {Operands}
   */
  static ops = {
    /** Safe equal */
    eq: (lh, rh) => lh === rh,
    /** Unsafe equal with type coercion */
    equ: (lh, rh) => lh == rh,
    /** Greater Than */
    gt: (lh, rh) => lh > rh,
    /** Greater than or equal */
    gte: (lh, rh) => lh >= rh,
    /** Less than */
    lt: (lh, rh) => lh < rh,
    /** Less than or equal */
    lte: (lh, rh) => lh <= rh,
  }

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

  /**
   * The comparison operator
   * @type {Operands}
   */
  op;

  constructor(data) {
    super(data);
    this.lh = data.lh;
    this.rh = data.rh;
    this.op = ComparisonPredicate.ops[data.operation]

    if (!this.op) {
      throw new Error(`Failed to find Operation of type ${data.op}`)
    }
  }

  test(actor, data) {
    const lh = isNaN(this.lh) ? this.resolveValue(this.lh, data) : this.lh;
    const rh = isNaN(this.rh) ? this.resolveValue(this.rh, data) : this.rh;

    return this.op(lh, rh);
  }
}
