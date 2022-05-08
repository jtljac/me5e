import InvalidPredicate from "./invalid-predicate.js";

/**
 * A class containing logic that must be met in order for a
 */
export default class Predicate5e {
  /**
   * @param data {Object} The data to construct the predicate with
   */
  constructor(data) {
  }

  /**
   * Test the conditions set by the predicate are true based off of the data passed
   * @param actor {Actor5e} The actor being Tested
   * @param data {Object} The data used by the test
   * @returns {boolean}
   */
  test(actor, data) {
    return true;
  }

  // Factory methods
  /**
   * Constructs a predicate from its data, automatically inferring the correct class using its type
   * @param rawPredicate {Object} The predicate's data
   * @return {Predicate5e}
   */
  static fromRawData(rawPredicate) {
    const PredicateConstructor = CONFIG.ME5E.rules.predicates[rawPredicate.type];

    if (!PredicateConstructor) {
      console.warn(`Failed to find predicate constructor for type ${rawPredicate.type}`);
      return new InvalidPredicate();
    }

    try {
      return new PredicateConstructor(rawPredicate);
    } catch(e) {
      console.warn(`Failed to construct predicate`)
      console.warn(e)
      return new InvalidPredicate();
    }
  }
}
