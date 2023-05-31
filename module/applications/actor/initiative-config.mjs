import BaseConfigSheet from "./base-config.mjs";

/**
 * A simple sub-application of the ActorSheet which is used to configure properties related to initiative.
 */
export default class ActorInitiativeConfig extends BaseConfigSheet {

    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["me5e"],
            template: "systems/me5e/templates/apps/initiative-config.hbs",
            width: 360,
            height: "auto"
        });
    }

    /* -------------------------------------------- */

    /** @override */
    get title() {
        return `${game.i18n.localize("ME5E.InitiativeConfig")}: ${this.document.name}`;
    }

    /* -------------------------------------------- */

    /** @override */
    getData(options = {}) {
        const source = this.document.toObject();
        const init = source.system.attributes.init || {};
        const flags = source.flags.me5e || {};
        return {
            ability: init.ability,
            abilities: CONFIG.ME5E.abilities,
            bonus: init.bonus,
            initiativeAlert: flags.initiativeAlert,
            initiativeAdv: flags.initiativeAdv
        };
    }

    /* -------------------------------------------- */

    /** @inheritDoc */
    _getSubmitData(updateData = {}) {
        const formData = super._getSubmitData(updateData);
        formData.flags = {me5e: {}};
        for (const flag of ["initiativeAlert", "initiativeAdv"]) {
            const k = `flags.me5e.${flag}`;
            if (formData[k]) formData.flags.me5e[flag] = true;
            else formData.flags.me5e[`-=${flag}`] = null;
            delete formData[k];
        }
        return formData;
    }
}
