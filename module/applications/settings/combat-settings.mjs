import BaseSettingsConfig from "./base-settings.mjs";

/**
 * An application for configuring combat settings.
 */
export default class CombatSettingsConfig extends BaseSettingsConfig {
  /** @override */
  static DEFAULT_OPTIONS = {
    window: {
      title: "SETTINGS.ME5E.COMBAT.Label"
    }
  };

  /* -------------------------------------------- */

  /** @override */
  static PARTS = {
    initiative: {
      template: "systems/me5e/templates/settings/base-config.hbs"
    },
    criticals: {
      template: "systems/me5e/templates/settings/base-config.hbs"
    },
    npcs: {
      template: "systems/me5e/templates/settings/base-config.hbs"
    },
    footer: {
      template: "templates/generic/form-footer.hbs"
    }
  };

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  /** @inheritDoc */
  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options);
    switch ( partId ) {
      case "initiative":
        context.fields = [
          this.createSettingField("initiativeDexTiebreaker"),
          this.createSettingField("initiativeScore")
        ];
        context.legend = game.i18n.localize("ME5E.Initiative");
        break;
      case "criticals":
        context.fields = [
          this.createSettingField("criticalDamageModifiers"),
          this.createSettingField("criticalDamageMaxDice")
        ];
        context.legend = game.i18n.localize("SETTINGS.ME5E.CRITICAL.Name");
        break;
      case "npcs":
        context.fields = [
          this.createSettingField("autoRecharge"),
          this.createSettingField("autoRollNPCHP")
        ];
        context.legend = game.i18n.localize("SETTINGS.ME5E.NPCS.Name");
        break;
    }
    return context;
  }
}
