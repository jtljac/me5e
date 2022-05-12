import ComparisonPredicate from "./comparison-predicate.js";

/**
 * A simple predicate that checks if the lh parameter is less than the rh parameter
 */
export default class LtPredicate extends ComparisonPredicate {
  /**
   * @inheritDoc
   * @override
   */
  test(actor, data) {
    return this.resolveValue(this.lh, data) < this.resolveValue(this.rh, data);
  }
}
