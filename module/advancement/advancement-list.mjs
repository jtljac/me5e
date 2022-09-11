import Advancement from "./advancement.mjs";

export default class AdvancementList {

  /**
   * The list of advancements
   * @type {Object<String,Advancement>}
   * @private
   */
  #advancements = {};

  /**
   * The minimum level the advancements can be (1 for classes and subclasses, 0 for everything else)
   * @type {Number}
   * @private
   */
  #minAdvancementLevel;

  /**
   * @param {Object[]} rawAdvancements An array of raw advancement data
   * @param {Number} minAdvancementLevel The minimum level the advancements can be (1 for classes and subclasses, 0 for everything else)
   */
  constructor(rawAdvancements, minAdvancementLevel) {
    for (const rawAdvancement of rawAdvancements) {
      const advancement = Advancement.fromRawData(rawAdvancement);
      if (advancement) {
        this.#advancements[advancement.id] = advancement;
      }
    }

    this.#minAdvancementLevel = minAdvancementLevel;
  }

  /**
   * Get an advancement by its id
   * @param id The id of the advancement
   * @return {Advancement}
   */
  getById(id) {
    return this.#advancements[id];
  }

  /**
   * Get an object with the advancement Ids mapped to their advancements
   * @see Advancement#getById
   * @return {Object<String, Advancement>}
   */
  get byId() {
    return this.#advancements;
  }

  /**
   * Get an array of advancements by the specified level
   * @param level the level of the advancements
   * @return {Advancement[]}
   */
  getByLevel(level) {
    return Object.values(this.#advancements).filter(advancement => advancement.levels.find(aLevel => aLevel <= level));
  }


  /**
   * Get the advancements sorted into the levels they make changes in
   * @see Advancement#getByLevel
   * @return {Object<Number, Advancement>}
   */
  get byLevel() {
    // noinspection JSValidateTypes
    return Object.values(this.#advancements).reduce((acc, advancement) => {
      advancement.levels.forEach(l => acc[l].push(advancement));
      return acc;
    }, Array.fromRange(CONFIG.ME5E.maxLevel + 1).slice(this.#minAdvancementLevel).reduce((acc, l) => acc[l] = []));
  }

  /**
   * Get an array of advancements that have a specific type
   * @param type the type of the advancements
   * @return {Advancement[]}
   */
  getByType(type) {
    return Object.values(this.#advancements).filter(advancement => advancement.data.type === type);
  }

  /**
   * Get the advancements grouped by their types
   * @see Advancement#getByType
   * @return {Object<String, Advancement>}
   */
  get byType() {
    return Object.values(this.#advancements).reduce((acc, advancement) => {
      if (!acc[advancement.data.type]) acc[advancement.data.type] = [];
      acc[advancement.data.type].push(advancement);
      return acc;
    }, {});
  }
}
