import HealSheet from "../../applications/activity/heal-sheet.mjs";
import BaseHealActivityData from "../../data/activity/heal-data.mjs";
import ActivityMixin from "./mixin.mjs";

/**
 * Activity for rolling healing.
 */
export default class HealActivity extends ActivityMixin(BaseHealActivityData) {
  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** @inheritDoc */
  static LOCALIZATION_PREFIXES = [...super.LOCALIZATION_PREFIXES, "ME5E.HEAL"];

  /* -------------------------------------------- */

  /** @inheritDoc */
  static metadata = Object.freeze(
    foundry.utils.mergeObject(super.metadata, {
      type: "heal",
      img: "systems/me5e/icons/svg/activity/heal.svg",
      title: "ME5E.HEAL.Title",
      hint: "ME5E.HEAL.Hint",
      sheetClass: HealSheet,
      usage: {
        actions: {
          rollHealing: HealActivity.#rollHealing
        }
      }
    }, { inplace: false })
  );

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /** @override */
  get damageFlavor() {
    return game.i18n.localize("ME5E.HealingRoll");
  }

  /* -------------------------------------------- */
  /*  Activation                                  */
  /* -------------------------------------------- */

  /** @override */
  _usageChatButtons(message) {
    if ( !this.healing.formula ) return super._usageChatButtons(message);
    return [{
      label: game.i18n.localize("ME5E.Healing"),
      icon: '<i class="me5e-icon" data-src="systems/me5e/icons/svg/damage/healing.svg"></i>',
      dataset: {
        action: "rollHealing"
      }
    }].concat(super._usageChatButtons(message));
  }

  /* -------------------------------------------- */

  /** @override */
  async _triggerSubsequentActions(config, results) {
    this.rollDamage({ event: config.event }, {}, { data: { "flags.me5e.originatingMessage": results.message?.id } });
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /**
   * Handle performing a healing roll.
   * @this {HealActivity}
   * @param {PointerEvent} event     Triggering click event.
   * @param {HTMLElement} target     The capturing HTML element which defined a [data-action].
   * @param {ChatMessage5e} message  Message associated with the activation.
   */
  static #rollHealing(event, target, message) {
    this.rollDamage({ event });
  }
}
