import Predicate5e from "./predicate/predicate.js"

/**
 * A Rule allows you to apply a modification to an actor's data dynamically
 *
 * @see {CONFIG.ME5E.Rule.classes} for
 */
export default class Rule5e {
  key;
  data;

  /**
   * @param data {Object} The rule's data
   * @param item {Item5e} The item the rule comes from
   * @param context {Object} Extra config for the rule
   */
  constructor(data, item) {
    this.key = data.key;

    data = deepClone(data);

    this.data = {
      priority: 100,
      ...data,
      predicate: data.predicate ? new Predicate5e(data.predicate) : undefined,
      ignored: Boolean(data.ignored)
    }
  }

  // Factory Methods
  /**
   * Creates an array of rules from an item, automatically inferring the correct class using its type
   * @param item {Item5e} The item containing the rules
   * @return {Rule5e[]}
   */
  static fromItem(item) {
    const rules = [];
    for (const rawRule of item.data.data.rules) {
      const RuleConstructor = CONFIG.ME5E.rules.classes[rawRule.type];

      if (!RuleConstructor) {
        console.warn(`Failed to find rule constructor for type ${rawRule.type}`);
        continue;
      }

      try {
        rules.push(new RuleConstructor(rawRule, item));
      } catch(e) {
        console.warn(`Failed to construct rule with key ${data.key}`)
        console.warn(e)
      }
    }

    return rules;
  }
}
