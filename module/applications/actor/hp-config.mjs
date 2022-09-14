import ActorModifierConfig from "./modifier-config.mjs";
import Modifier5e from "../../modifiers/modifier.mjs";

/**
 * A simple form to set hp configuration.
 * @extends {DocumentSheet}
 * @param {Actor} actor                   The Actor instance being displayed within the sheet.
 * @param {ApplicationOptions} options    Additional application configuration options.
 */
export default class ActorHitPointsConfig extends DocumentSheet {

  constructor(actor, opts) {
    super(actor, opts);

    this.modifiers = new ActorModifierConfig(actor, opts, Modifier5e.targets.hp, this);
  }

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["me5e"],
      template: "systems/me5e/templates/apps/hp-config.hbs",
      width: 500,
      height: "auto"
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  get title() {
    return `${game.i18n.format("ME5E.SkillConfigureTitle", {skill: game.i18n.format("ME5E.HitPoints")})}: ${this.document.name}`;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async _render(force, options) {
    await super._render(force, options);

    await this.modifiers._render(force, options);
    this.setPosition();
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData(options) {
    const src = this.document.toObject();

    return {
      hp: src.system.attributes.hp || {},
      abilities: CONFIG.ME5E.abilities,
    };
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async _updateObject(event, formData) {
    formData[`system.attributes.init.value`] = formData[`system.attributes.init.value`] || 0;

    await this.modifiers._updateObject(event, this.modifiers._getSubmitData());
    return await super._updateObject(event, formData);
  }
}
