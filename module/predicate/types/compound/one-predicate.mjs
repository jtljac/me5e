import CompoundPredicate from "./compound-predicate.mjs";

/**
 * A compound predicate where only one sub-predicates can be true
 */
export default class OnePredicate extends CompoundPredicate {
  /**
   * @inheritDoc
   */
  test(actor, data) {
    let result = false;

    for (const predicate of this.subPredicates) {
      if (predicate.test(actor, data)) {
        if (result) {
          return false;
        } else {
          result = true;
        }
      }
    }

    return result;
  }
}
