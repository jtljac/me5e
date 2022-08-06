import CompoundPredicate from "./compound-predicate.mjs";

/**
 * A compound predicate where all the sub-predicates must be true
 */
export default class AllPredicate extends CompoundPredicate {
  /**
   * @inheritDoc
   */
  test(actor, data) {
    for (const predicate of this.subPredicates) {
      if (!predicate.test(actor, data)) return false;
    }

    return true;
  }
}
