import ComparisonPredicate from "./comparison-predicate.mjs";

/**
 * A simple predicate that checks if the lh parameter is less than the rh parameter
 */
export default class LtPredicate extends ComparisonPredicate {
  /**
   * @inheritDoc
   * @override
   */
  test(actor, data) {
    return this._resolveValue(this.lh, data) < this._resolveValue(this.rh, data);
  }
}
