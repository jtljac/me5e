import Rule5e from "./rule.mjs";
// import Modifier5e from "../modifier/modifier.js";
import ActorTypePredicate from "./predicate/simple/actor-type-predicate.mjs";
import AllPredicate from "./predicate/compound/all-predicate.mjs";

/**
 * A Rule that adds a modifier onto the actor
 */
export default class ModifierRule extends Rule5e {

  /**
   * The available modifier types
   * @typedef ModifierModType {Object<String, String>}
   * @readonly
   * @enum {ModifierModType}
   */
  static mods = {
    /** The actor's hp */
    hp: "system.attributes.hp",
    /** The actor's ac */
    ac: "system.attributes.ac",
    /** The actors initiative */
    init: "system.attributes.init"
  };

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
   * @type {ModifierModType}
   */
  type;

  /**
   * The value the modifier is modifying
   * @type {ModifierRule.mods}
   */
  mod;

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

    if (!Object.values(Modifier5e.mods).includes(data.type)) {
      throw new Error(`Unknown Modifier Type: ${data.type}`);
    }
    this.type = data.type || Modifier5e.modTypes.Effect;

    if (!Object.values(ModifierRule.mods).includes(data.mod)) {
      throw new Error(`Unknown Modifier Mod: ${data.mod}`);
    }
    this.mod = data.mod;

    // Add a predicate that ensures the actor type is a character, if there is already a predicate, then use an
    // AllPredicate
    const characterCheck = new ActorTypePredicate({
      allowedTypes: [
        ActorTypePredicate.actorTypes.Character
      ]
    });

    this.predicate = new AllPredicate({predicates: [this.predicate, characterCheck]}) ?? characterCheck;
  }

  /** @inheritDoc */
  onActiveEffects(actor, data) {
    const mods = foundry.utils.getProperty(actor.system, this.mod).mods;
    mods.mods.push(new Modifier5e({
      name: this.name,
      type: this.type,
      formula: this.formula
    }, false));
  }
}
