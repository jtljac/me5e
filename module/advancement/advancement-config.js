/**
 * Base configuration application for advancements that can be extended by other types to implement custom
 * editing interfaces.
 *
 * @property {Advancement} advancement  The advancement item being edited.
 * @property {object} [options={}]      Additional options passed to FormApplication.
 * @extends {FormApplication}
 */
export class AdvancementConfig extends FormApplication {

  constructor(advancement, options={}) {
    super(advancement, options);

    /**
     * The advancement being created or edited.
     * @type {Advancement}
     */
    this.advancement = advancement;

    /**
     * Parent item to which this advancement belongs.
     * @type {Item5e}
     */
    this.item = advancement.item;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["me5e", "advancement", "dialog"],
      template: "systems/me5e/templates/advancement/advancement-config.html",
      width: 400,
      height: "auto",
      submitOnChange: true,
      closeOnSubmit: false
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  get title() {
    const type = this.advancement.constructor.metadata.title;
    return `${game.i18n.format("ME5E.AdvancementConfigureTitle", { item: this.item.name })}: ${type}`;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const levels = Object.fromEntries(Array.fromRange(CONFIG.ME5E.maxLevel + 1).map(l => [l, l]));
    if ( ["class", "subclass"].includes(this.item.type) ) delete levels[0];
    else levels[0] = game.i18n.localize("ME5E.AdvancementLevelAnyHeader");

    return {
      data: this.advancement.data,
      default: {
        title: this.advancement.constructor.metadata.title,
        icon: this.advancement.constructor.metadata.icon
      },
      levels,
      showClassRestrictions: this.item.type === "class",
      showLevelSelector: !this.advancement.constructor.metadata.multiLevel
    };
  }

  /* -------------------------------------------- */

  /**
   * Perform any changes to configuration data before it is saved to the advancement.
   * @param {object} configuration  Configuration object.
   * @returns {object}              Modified configuration.
   */
  prepareConfigurationUpdate(configuration) {
    return configuration;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async _updateObject(event, formData) {
    let updates = foundry.utils.expandObject(formData).data;
    if ( updates.configuration ) updates.configuration = this.prepareConfigurationUpdate(updates.configuration);

    await this.advancement.update(updates);
    this.render();
  }

  /* -------------------------------------------- */

  /**
   * Helper method to take an object and apply updates that remove any empty keys.
   * @param {object} object  Object to be cleaned.
   * @returns {object}       Copy of object with only non false-ish values included and others marked
   *                         using `-=` syntax to be removed by update process.
   * @protected
   */
  static _cleanedObject(object) {
    return Object.entries(object).reduce((obj, [key, value]) => {
      if ( value ) obj[key] = value;
      else obj[`-=${key}`] = null;
      return obj;
    }, {});
  }

}
