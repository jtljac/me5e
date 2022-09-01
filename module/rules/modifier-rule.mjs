import Rule5e from "./rule.mjs";
import Modifier5e from "../modifier/modifier.mjs";
import ActorTypePredicate from "./predicate/simple/actor-type-predicate.mjs";
import AllPredicate from "./predicate/compound/all-predicate.mjs";

/**
 * A Rule that adds a modifier onto the actor
 */
export default class ModifierRule extends Rule5e {
  /**
   * The name of the modifier
   * @type {String}
   */
  name;

  /**
   * The formula used for the value of the modifier
   * @type {String}
   */
  formula;

  /**
   * The type of the modifier
   * @type {CONFIG.ME5E.ModifierCategories}
   */
  category;

  /**
   * The value the modifier is modifying
   * @type {Modifier5e.targets}
   */
  target;

  /** @inheritDoc */
  constructor(data, item) {
    super(data, item);

    if (!data.name) {
      throw new Error("A Modifier name must be provided")
    }
    this.name = data.name;

    if (!data.formula) {
      throw new Error("A Modifier formula must be provided")
    }
    this.formula = data.formula;

    if (data.category && !Object.values(CONFIG.ME5E.ModifierCategories).includes(data.category)) {
      throw new Error(`Unknown Modifier Category: ${data.category}`);
    }
    this.category = data.category || CONFIG.ME5E.ModifierCategories.effect;

    if (!Object.values(ModifierRule.targets).includes(data.target)) {
      throw new Error(`Unknown Modifier Mod: ${data.target}`);
    }
    this.target = data.target;

    // Add a predicate that ensures the actor type is a character, if there is already a predicate, then use an
    // AllPredicate
    const characterCheck = new ActorTypePredicate({
      allowedTypes: [
        ActorTypePredicate.actorTypes.Character
      ]
    });

    this.predicate = this.predicate ? new AllPredicate({predicates: [this.predicate, characterCheck]}) : characterCheck;
  }

  /** @inheritDoc */
  onActiveEffects(actor, data) {
    const mods = foundry.utils.getProperty(actor, this.target).mods;
    mods.mods.push(new Modifier5e({
      name: this.name,
      category: this.category,
      formula: this.formula
    }, false));
  }
}
