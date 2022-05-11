import CompoundPredicate from "./compound-predicate.js";

/**
 * A compound predicate where at least one of the sub-predicates must be true
 */
export default class OrPredicate extends CompoundPredicate {
  /**
   * @inheritDoc
   */
  test(actor, data) {
    for (const predicate of this.subPredicates) {
      if (!predicate.test(actor, data)) return true;
    }

    return false;
  }
}
