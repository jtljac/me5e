import SystemDataModel from "../abstract.mjs";
import {TypedDataModelField} from "../fields.mjs";

export default class BaseRule extends SystemDataModel {
    /** @inheritdoc */
    static defineSchema() {
        return this.mergeSchema(super.defineSchema(), {
            _id: new foundry.data.fields.DocumentIdField({initial: () => foundry.utils.randomID()}),
            type: new foundry.data.fields.StringField({required: true, choices: () => BaseRule.TYPES, initial: () => BaseRule.TYPES[0],
                validationError: "Must be in the array of Rule Types in config (CONFIG.ME5E.rules.types)"}),
            system: new TypedDataModelField(this, "CONFIG.ME5E.rules.types"),
            priority: new foundry.data.fields.NumberField({initial: () => 100}),
            flags: new foundry.data.fields.ObjectField(),
        });
    }

    static get TYPES() {
        return Object.keys(CONFIG.ME5E.rules.types);
    }
}
