import Predicate5e from "../../predicate.mjs";

/**
 * An abstract predicate which has multiple sub-predicates
 * @abstract
 */
export default class CompoundPredicate extends Predicate5e {
  subPredicates = [];

  constructor(data) {
    super(data);
    if (data.rawPredicates) {
      for (const rawPredicate of data.rawPredicates) {
        this.subPredicates.push(Predicate5e.fromRawData(rawPredicate));
      }
    }

    if (data.predicates) {
      this.subPredicates.push(...data.predicates);
    }
  }
}
