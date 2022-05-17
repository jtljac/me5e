import ComparisonPredicate from "./comparison-predicate.js";

/**
 * A simple predicate that checks if the lh parameter is equal to the rh parameter with type coercion
 */
export default class EquPredicate extends ComparisonPredicate {
  /**
   * @inheritDoc
   * @override
   */
  test(actor, data) {
    // noinspection EqualityComparisonWithCoercionJS
    return this._resolveValue(this.lh, data) == this._resolveValue(this.rh, data);
  }
}
