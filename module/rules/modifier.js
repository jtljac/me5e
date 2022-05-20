import Rule5e from "./rule.js";
import Modifier5e from "../modifier/modifier.js";
import AnyPredicate from "./predicate/compound/any-predicate.js";
import ActorTypePredicate from "./predicate/simple/actor-type-predicate.js";

/**
 * A Rule that adds a modifier onto the actor
 */
export default class ModifierRule extends Rule5e {

  static mods = {
    hp: "data.attributes.hp",
    ac: "data.attributes.ac",
    init: "data.attributes.init"
}

  /**
   * @inheritDoc
   */
  constructor(data, item) {
    super(data, item);

    if (!this.data.name) {
      throw new Error("A Modifier name must be provided")
    }

    if (!this.data.formula) {
      throw new Error("A Modifier formula must be provided")
    }

    if (!Object.values(Modifier5e.ModTypes).includes(this.data.type)) {
      throw new Error(`Unknown Modifier Type: ${this.data.type}`);
    }

    if (!ModifierRule.mods[this.data.mod]) {
      throw new Error(`Unknown Modifier Mod: ${this.data.mod}`);
    }

    // If there isn't already a predicate, add one that ensures it's a character
    this.data.predicate = this.data.predicate ?? new ActorTypePredicate({
      allowedTypes: [
        ActorTypePredicate.actorTypes.Character
      ]
    });
  }

  /**
   * @inheritDoc
   * @override
   */
  onActiveEffects(actor, data) {
    const mods = foundry.utils.getProperty(actor.data, ModifierRule.mods[this.data.mod]).mods;
    mods.mods.push(new Modifier5e({
      name: this.data.name,
      type: this.data.type,
      formula: this.data.formula
    }, false));
  }
}
