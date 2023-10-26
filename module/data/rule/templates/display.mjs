import {SystemDataModel} from "../../_module.mjs";

export default class DisplayTemplate extends SystemDataModel {
    /** @inheritdoc */
    static defineSchema() {
        return {
            name: new foundry.data.fields.StringField({required: true, blank: false, label: "EFFECT.Name", textSearch: true}),
            description: new foundry.data.fields.HTMLField({label: "EFFECT.Description", textSearch: true}),
            icon: new foundry.data.fields.FilePathField({categories: ["IMAGE"], label: "EFFECT.Icon"}),
            origin: new foundry.data.fields.StringField({nullable: true, blank: false, initial: null, label: "EFFECT.Origin"})
        }
    }
}
