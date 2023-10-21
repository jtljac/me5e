import SystemDataModel from "../../abstract.mjs";

/**
 * Data model template with information on items that can be attuned and equipped.
 *
 * @property {number} attunement  Attunement information as defined in `ME5E.attunementTypes`.
 * @property {boolean} equipped   Is this item equipped on its owning actor.
 * @mixin
 */
export default class EquippableItemTemplate extends SystemDataModel {
    /** @inheritdoc */
    static defineSchema() {
        return {
            attunement: new foundry.data.fields.NumberField({
                required: true, integer: true, initial: CONFIG.ME5E.attunementTypes.NONE, label: "ME5E.Attunement"
            }),
            equipped: new foundry.data.fields.BooleanField({required: true, label: "ME5E.Equipped"})
        };
    }

    /* -------------------------------------------- */
    /*  Migrations                                  */

    /* -------------------------------------------- */

    /** @inheritdoc */
    static _migrateData(source) {
        super._migrateData(source);
        EquippableItemTemplate.#migrateAttunement(source);
        EquippableItemTemplate.#migrateEquipped(source);
    }

    /* -------------------------------------------- */

    /**
     * Migrate the item's attuned boolean to attunement string.
     * @param {object} source  The candidate source data from which the model will be constructed.
     */
    static #migrateAttunement(source) {
        if ((source.attuned === undefined) || (source.attunement !== undefined)) return;
        source.attunement = source.attuned ? CONFIG.ME5E.attunementTypes.ATTUNED : CONFIG.ME5E.attunementTypes.NONE;
    }

    /* -------------------------------------------- */

    /**
     * Migrate the equipped field.
     * @param {object} source  The candidate source data from which the model will be constructed.
     */
    static #migrateEquipped(source) {
        if (!("equipped" in source)) return;
        if ((source.equipped === null) || (source.equipped === undefined)) source.equipped = false;
    }

    /* -------------------------------------------- */
    /*  Getters                                     */

    /* -------------------------------------------- */

    /**
     * Chat properties for equippable items.
     * @type {string[]}
     */
    get equippableItemChatProperties() {
        const req = CONFIG.ME5E.attunementTypes.REQUIRED;
        return [
            this.attunement === req ? CONFIG.ME5E.attunements[req] : null,
            game.i18n.localize(this.equipped ? "ME5E.Equipped" : "ME5E.Unequipped"),
            ("proficient" in this) ? CONFIG.ME5E.proficiencyLevels[this.prof?.multiplier || 0] : null
        ];
    }
}
