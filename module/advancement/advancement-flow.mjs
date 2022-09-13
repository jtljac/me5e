/**
 * Base class for the advancement interface displayed by the advancement prompt that should be subclassed by
 * individual advancement types.
 *
 * @param {Actor5e} item                                The item to which the advancements belong.
 * @param {Advancement[]} advancements                  The Advancements being processed by this flow
 * @param {number} startingLevel                        The level before the advancement change is applied
 * @param {number} levelDelta                           The change in level
 * @param {object} [options={}]                         Application rendering options.
 */
export default class AdvancementFlow extends FormApplication {
  constructor(item, advancements, startingLevel, levelDelta, options={}) {
    super({}, options);

    /**
     * The item that houses the Advancements.
     * @type {Item5e}
     */
    this.item = item;

    /**
     * The Advancements being processed by this flow
     * @type {Advancement[]}
     */
    this.advancements = advancements;

    /**
     * The level before the advancement change is applied
     * @type {number}
     */
    this.startingLevel = startingLevel;

    /**
     * The change in level
     * @type {number}
     */
    this.levelDelta = levelDelta;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: "systems/me5e/templates/advancement/advancement-flow.hbs",
      popOut: false
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  get id() {
    return `actor-${this.item.parent._id}-item-${this.item._id}-advancement-${this.advancementType}-${this.startingLevel + this.levelDelta}`;
  }

  /* -------------------------------------------- */

  /**
   * The type of the advancement this flow is responsible for
   * @abstract
   */
  get advancementType() {
    return "";
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  get title() {
    return this.advancements[0].title;
  }

  /**
   * The summary of the represented advancement
   */
  get summary() {
    return "";
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    return {
      appId: this.id,
      advancements: this.advancements,
      type: this.advancementType,
      title: this.title,
      summary: this.summary,
      startingLevel: this.startingLevel,
      levelDelta: this.levelDelta
    };
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async _updateObject(event, formData) {}

  /* -------------------------------------------- */

  /**
   * @typedef flowChanges
   * @type {Object}
   * @property {Object[]} [toCreate] An array of item data to be created in the actor
   * @property {String[]} [toDelete] An array of item Ids to be deleted from the actor
   * @property {Object[]} [toUpdate] An array of item data used to update items in the actor
   * @property {Object<String, Object<String, Object>>} [advancementUpdates] itemIds mapped to an object containing advancement Ids mapped to their changes
   */
  /**
   * Get the changes this flow makes to the actor's items and advancements
   * @returns {flowChanges}
   */
  async getChanges() {
    if (this.levelDelta >= 0) return this.getForwardChanges();
    return this.getReverseChanges();
  }

  /**
   * Get the changes this flow makes to the actor's items and advancements when adding levels
   * @returns {flowChanges}
   * @abstract
   */
  async getForwardChanges() {
    return {};
  }

  /**
   * Get the changes this flow makes to the actor's items and advancements when subtracting levels
   * @returns {flowChanges}
   * @abstract
   */
  async getReverseChanges() {
    return {};
  }
}
