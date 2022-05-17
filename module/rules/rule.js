import Predicate5e from "./predicate/predicate.js"

/**
 * A Rule allows you to apply a modification to an actor's data dynamically
 * @abstract
 */
export default class Rule5e {
  data;

  /**
   * @param data {Object} The rule's data
   * @param item {Item5e} The item the rule comes from
   */
  constructor(data, item) {
    data = deepClone(data);

    this.data = {
      priority: 100,
      ...data,
      predicate: data.predicate ? Predicate5e.fromRawData(data.predicate) : undefined,
      ignored: Boolean(data.ignored)
    }
  }

  // Rule Methods
  /**
   * Called when the rule is first created
   * @param actor {Actor5e} The actor to apply to
   * @param data {Object} The data used for formulas
   */
  onCreate(actor, data){}

  /**
   * Called just after active effects would usually happen
   * @param actor {Actor5e} The actor to apply to
   * @param data {Object} The data used for formulas
   */
  onActiveEffects(actor, data){}

  /**
   * Called after the actor has finished preparing data
   * @param actor {Actor5e} The actor to apply to
   * @param data {Object} The data used for formulas
   */
  afterDerived(actor, data){}

  // Getters & Setters
  /**
   * Get a boolean representing if this rule is ignored
   * @return {boolean}
   */
  get isIgnored() {
    return this.data.ignored;
  }

  // Utilities
  /**
   * Test to see if this rule can be applied
   * Always false if ignored
   * Otherwise Always true if there isn't any predicates
   * @param actor {Actor5e} The actor this rule is being applied to
   * @param data {Object} The data that will be tested against
   * @returns {boolean}
   */
  test(actor, data) {
    if (this.isIgnored) return false;
    if (!this.data.predicate) return true;

    return this.data.predicate.test(actor, data);
  }

  /**
   * Resolves the formula into a value
   * @param formula The formula used to calculate the value
   * @param data The data used by the formula
   * @return {number}
   * @protected
   */
  _resolveValue(formula, data) {
    const result = Roll.replaceFormulaData(formula, data, {missing: "0", warn: true});

    return Roll.safeEval(result) ?? 0;
  }

  // Factory Methods
  /**
   * Creates an array of rules from an item, automatically inferring the correct class using its type
   * @param item {Item5e} The item containing the rules
   * @return {Rule5e[]}
   */
  static fromItem(item) {
    const rules = [];
    for (const rawRule of item.getRules()) {
      const RuleConstructor = CONFIG.ME5E.Rule.types[rawRule.type];

      if (!RuleConstructor) {
        console.warn(`Failed to find rule constructor for type ${rawRule.type}`);
        continue;
      }

      try {
        rules.push(new RuleConstructor(rawRule, item));
      } catch(e) {
        console.warn(`Failed to construct rule with key ${rawRule.key}`)
        console.warn(e)
      }
    }

    return rules;
  }
}
