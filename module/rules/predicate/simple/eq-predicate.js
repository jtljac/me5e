import ComparisonPredicate from "./comparison-predicate.js";

/**
 * A simple predicate that safely checks if the lh parameter is equal to the rh parameter
 */
export default class EqPredicate extends ComparisonPredicate {
  /**
   * @inheritDoc
   * @override
   */
  test(actor, data) {
    return this.resolveValue(this.lh, data) === this.resolveValue(this.rh, data);
  }
}
