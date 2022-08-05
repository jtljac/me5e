/**
 * A simple form to set skill configuration for a given skill.
 * @extends {DocumentSheet}
 * @param {Actor} actor                   The Actor instance being displayed within the sheet.
 * @param {ApplicationOptions} options    Additional application configuration options.
 */
export default class ActorInitConfig extends DocumentSheet {

  constructor(actor, opts) {
    super(actor, opts);
  }

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["me5e"],
      template: "systems/me5e/templates/apps/init-config.hbs",
      width: 500,
      height: "auto"
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  get title() {
    return `${game.i18n.format("ME5E.SkillConfigureTitle", {skill: game.i18n.format("ME5E.Initiative")})}: ${this.document.name}`;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData(options) {
    const src = this.document.toObject();

    return {
      init: src.system.attributes.init || {},
      abilities: CONFIG.ME5E.abilities,
      bonusGlobal: src.system.bonuses?.skill
    };
  }

  /** @inheritdoc */
  _updateObject(event, formData) {
    formData[`system.attributes.init.value`] = formData[`system.attributes.init.value`] || 0;

    super._updateObject(event, formData);
  }
}
