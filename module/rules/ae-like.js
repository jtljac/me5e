import Rule5e from "./rule.js";

/**
 * A Rule that behaves similarly to the original active effects from foundry, extended to be able to occur at different
 * phases
 */
export default class AELikeRule extends Rule5e {
  /**
   * The way in which the effect will modify the value
   * @readonly
   * @enum {number}
   */
  static mode = {
    /** Multiply the existing value by the value from the Rule */
    multiply: 0,
    /** Add the value from the Rule onto the existing value */
    add: 1,
    /** Set the value to the value from the rule only if the value from the rule is smaller */
    downgrade: 2,
    /** Set the value to the value from the rule only if the value from the rule is greater */
    upgrade: 3,
    /** Set the value to the value from the rule */
    override: 4
  }

  // TODO: Implement
}
