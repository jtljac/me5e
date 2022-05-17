import ComparisonPredicate from "./comparison-predicate.js";

/**
 * A simple predicate that checks if the lh parameter is greater than the rh parameter
 */
export default class GtPredicate extends ComparisonPredicate {
  /**
   * @inheritDoc
   * @override
   */
  test(actor, data) {
    return this._resolveValue(this.lh, data) > this._resolveValue(this.rh, data);
  }
}
