import BaseRestDialog from "./base-rest-dialog.mjs";

const { BooleanField } = foundry.data.fields;

/**
 * Dialog for configuring a long rest.
 */
export default class LongRestDialog extends BaseRestDialog {
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["long-rest"],
    window: {
      title: "ME5E.REST.Long.Label"
    }
  };

  /* -------------------------------------------- */

  /** @inheritDoc */
  static PARTS = {
    ...super.PARTS,
    content: {
      template: "systems/me5e/templates/actors/rest/long-rest.hbs"
    }
  };

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  /** @inheritDoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    const { enabled } = game.settings.get("me5e", "bastionConfiguration");
    if ( game.user.isGM && context.isGroup && enabled ) context.fields.unshift({
      field: new BooleanField({ label: game.i18n.localize("ME5E.Bastion.Action.BastionTurn") }),
      input: context.inputs.createCheckboxInput,
      name: "advanceBastionTurn",
      value: context.config.advanceBastionTurn
    });

    return context;
  }
}
