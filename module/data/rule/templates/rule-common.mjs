import SystemDataModel from "../../abstract.mjs";
import {TypeDataModelField} from "../../fields.mjs";

/**
 * The Data Model for rules
 *
 * @property {Object<string, AbilityData>} abilities  Actor's abilities.
 * @mixin
 */
export default class RuleCommon extends foundry.abstract.DataModel {
    /** @override */
    static defineSchema() {
        return {
            _id: new foundry.data.fields.DocumentIdField({initial: () => foundry.utils.randomID(), label: "ME5E.id"}),
            type: new foundry.data.fields.StringField({required: true, choices: () => this.TYPES,
                validationError: "must be one of the Rules types defined by the system in `me5e.ruleTypes`"}),
            priority: new foundry.data.fields.NumberField({initial: 20, label: "ME5E.priority"}),
            predicate: new TypeDataModelField("CONFIG.ME5E.predicateTypes", {initial: null, nullable: true, label: "ME5E.predicate"}),
            disabled: new foundry.data.fields.BooleanField({initial: false, label: "ME5E.disabled"}),
        };
    }

    /**
     * The allowed set of Rule types which may exist.
     * @type {string[]}
     */
    static get TYPES() {
        return globalThis.CONFIG.ME5E.ruleTypes;
    }
}
