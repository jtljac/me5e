import Predicate5e from "../predicate.js";


export default class ActorTypePredicate extends Predicate5e {
  /**
   * The available types of actor
   * @typedef {String} actorTypes
   * @enum {actorTypes}
   */
  static actorTypes = {
    Character: "character",
    Npc: "npc",
    Vehicle: "vehicle"
  };

  /**
   * The actor types that this rule is allowed to run for
   * @type {actorTypes[]}
   */
  allowedTypes;

  /**
   * @inheritDoc
   */
  constructor(data) {
    super(data);

    for (const type of data.allowedTypes) {
      if (!Object.values(ActorTypePredicate.actorTypes).includes(type)) {
        throw new Error(`Unknown actor type: ${type}`);
      }
    }

    this.allowedTypes = data.allowedTypes;
  }

  /**
   * @inheritDoc
   */
  test(actor, data) {
    return this.allowedTypes.includes(actor.data.data.type);
  }
}
