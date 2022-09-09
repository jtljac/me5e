import Predicate5e from "../../predicate.mjs";

/**
 * A compound predicate which inverts the result of its sub-predicate
 * @abstract
 */
export default class InversePredicate extends Predicate5e {
  /**
   * @type {Predicate5e}
   */
  subPredicate;

  constructor(data) {
    super(data);
    this.subPredicate = Predicate5e.fromRawData(data.predicate);
  }

  /**
   * @inheritDoc
   */
  test(actor, data) {
    return !this.subPredicate.test(actor, data);
  }
}
