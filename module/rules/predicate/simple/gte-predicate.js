import ComparisonPredicate from "./comparison-predicate.js";

/**
 * A simple predicate that checks if the lh parameter is greater than or equal to the rh parameter
 */
export default class GtePredicate extends ComparisonPredicate {
  /**
   * @inheritDoc
   * @override
   */
  test(actor, data) {
    return this._resolveValue(this.lh, data) >= this._resolveValue(this.rh, data);
  }
}
