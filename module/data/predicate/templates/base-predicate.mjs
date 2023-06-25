import {TypeDataModelField} from "../../fields.mjs";

/**
 * The template for all predicates
 *
 * @property {Object<string, AbilityData>} abilities  Actor's abilities.
 * @mixin
 */
export default class BaseRule extends foundry.abstract.DataModel {
    /** @overview */
    static defineSchema() {
        return {
            type: new foundry.data.fields.StringField(),

        };
    }
}
