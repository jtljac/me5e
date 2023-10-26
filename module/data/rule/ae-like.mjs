import {SystemDataModel} from "../_module.mjs";
import CommonTemplate from "./templates/common.mjs";
import DisplayTemplate from "./templates/display.mjs";
import TimeTemplate from "./templates/time.mjs";

export default class AeLikeRule extends SystemDataModel.mixin(CommonTemplate, DisplayTemplate, TimeTemplate) {
    /** @inheritdoc */
    static _systemType = "aeLike";

    /**
     * Allowed AELike effect modes
     * @enum {Number}
     */
    static EFFECT_MODES = {
        CUSTOM: 0,
        MULTIPLY: 1,
        ADD: 2,
        DOWNGRADE: 3,
        UPGRADE: 4,
        OVERRIDE: 4
    }

    /** @inheritdoc */
    static defineSchema() {
        return this.mergeSchema(super.defineSchema(),{
            changes: new foundry.data.fields.ArrayField(new foundry.data.fields.SchemaField({
                key: new foundry.data.fields.StringField({required: true, label: "EFFECT.ChangeKey"}),
                value: new foundry.data.fields.StringField({required: true, label: "EFFECT.ChangeValue"}),
                mode: new foundry.data.fields.NumberField({integer: true, initial: AeLikeRule.EFFECT_MODES.ADD,
                    label: "EFFECT.ChangeMode"}),
                priority: new foundry.data.fields.NumberField()
            })),
        });
    }
}
