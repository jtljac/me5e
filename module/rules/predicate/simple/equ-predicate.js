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
    return this.resolveValue(this.lh, data) == this.resolveValue(this.rh, data);
  }
}
