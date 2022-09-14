/**
 * A simple form to set save throw configuration for a given ability score.
 *
 * @param {Actor5e} actor               The Actor instance being displayed within the sheet.
 * @param {ApplicationOptions} options  Additional application configuration options.
 * @param {string} abilityId            The ability key as defined in CONFIG.ME5E.abilities.
 */
import ActorModifierConfig from "./modifier-config.mjs";
import Modifier5e from "../../modifiers/modifier.mjs";

export default class ActorAbilityConfig extends DocumentSheet {
  constructor(actor, options, abilityId) {
    super(actor, options);
    this._abilityId = abilityId;

    this.modifiers = new ActorModifierConfig(actor, options, Modifier5e.targets[abilityId], this);
  }

  /* -------------------------------------------- */

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["me5e"],
      template: "systems/me5e/templates/apps/ability-config.hbs",
      width: 500,
      height: "auto"
    });
  }

  /* -------------------------------------------- */

  /** @override */
  get title() {
    return `${game.i18n.format("ME5E.AbilityConfigureTitle", {ability: CONFIG.ME5E.abilities[this._abilityId]})}: ${this.document.name}`;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async _render(force, options) {
    await super._render(force, options);

    await this.modifiers._render(force, options);
    this.setPosition();
  }

  /* -------------------------------------------- */

  /** @override */
  getData(options) {
    const src = this.object.toObject();
    return {
      ability: src.system.abilities[this._abilityId] || {},
      labelSaves: game.i18n.format("ME5E.AbilitySaveConfigure", {ability: CONFIG.ME5E.abilities[this._abilityId]}),
      labelChecks: game.i18n.format("ME5E.AbilityCheckConfigure", {ability: CONFIG.ME5E.abilities[this._abilityId]}),
      abilityId: this._abilityId,
      proficiencyLevels: {
        0: CONFIG.ME5E.proficiencyLevels[0],
        1: CONFIG.ME5E.proficiencyLevels[1]
      },
      bonusGlobalSave: src.system.bonuses?.abilities?.save,
      bonusGlobalCheck: src.system.bonuses?.abilities?.check
    };
  }

  /* -------------------------------------------- */

  /** @override */
  async _updateObject(event, formData) {
    await this.modifiers._updateObject(event, this.modifiers._getSubmitData());
    return await super._updateObject(event, formData);
  }
}
