/**
 * A Predicate used in the place of an invalid predicate, always fails.
 */
export default class InvalidPredicate extends Predicate5e {
  constructor() {
    super(null);
  }

  test() {
    return false;
  }
}
