import Predicate5e from "./predicate.mjs";

/**
 * A Predicate used in the place of an invalid predicate, always fails.
 */
export default class InvalidPredicate extends Predicate5e {
  constructor() {
    super(null);
  }

  /**
   * @inheritDoc
   */
  test(actor, data) {
    // As this predicate is invalid, to avoid making any changes we don't mean to, always return false
    return false;
  }
}
