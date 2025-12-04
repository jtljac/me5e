import SystemDataModel from "../abstract/system-data-model.mjs";
import MappingField from "../fields/mapping-field.mjs";

/**
 * A template for currently held currencies.
 * @mixin
 */
export default class CurrencyTemplate extends SystemDataModel {
  /** @inheritDoc */
  static defineSchema() {
    return {
      currency: new MappingField(new foundry.data.fields.NumberField({
        required: true, nullable: false, integer: true, min: 0, initial: 0
      }), {initialKeys: CONFIG.ME5E.currencies, initialKeysOnly: true, label: "ME5E.Currency"})
    };
  }

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /**
   * Get the weight of all of the currency. Always returns 0 if currency weight is disabled in settings.
   * @returns {number}
   */
  get currencyWeight() {
    if ( !game.settings.get("me5e", "currencyWeight") ) return 0;
    const count = Object.values(this.currency).reduce((count, value) => count + value, 0);
    const currencyPerWeight = game.settings.get("me5e", "metricWeightUnits")
      ? CONFIG.ME5E.encumbrance.currencyPerWeight.metric
      : CONFIG.ME5E.encumbrance.currencyPerWeight.imperial;
    return count / currencyPerWeight;
  }
}
