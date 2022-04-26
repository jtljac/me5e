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
      template: "systems/me5e/templates/apps/init-config.html",
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
    return {
      init: foundry.utils.getProperty(this.document.data._source, `data.attributes.init`) || {},
      abilities: CONFIG.ME5E.abilities,
      bonusGlobal: getProperty(this.object.data._source, "data.bonuses.abilities.skill")
    };
  }

  /** @inheritdoc */
  _updateObject(event, formData) {
    const bonus = formData[`data.attributes.init.value`];
    if (!bonus) formData[`data.attributes.init.value`] = 0;

    super._updateObject(event, formData);
  }
}
