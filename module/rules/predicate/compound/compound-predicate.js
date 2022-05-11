import Predicate5e from "../predicate.js";

/**
 * An abstract predicate which has multiple sub-predicates
 * @abstract
 */
export default class CompoundPredicate extends Predicate5e {
  subPredicates = [];

  constructor(data) {
    super(data);
    for (const rawPredicate of data.predicates) {
      this.subPredicates.push(Predicate5e.fromRawData(rawPredicate));
    }
  }
}
