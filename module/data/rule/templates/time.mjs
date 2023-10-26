import {SystemDataModel} from "../../_module.mjs";

export default class TimeTemplate extends SystemDataModel {
    /** @inheritdoc */
    static defineSchema() {
        return {
            duration: new SchemaField({
                startTime: new foundry.data.fields.NumberField({initial: null, label: "EFFECT.StartTime"}),
                seconds: new foundry.data.fields.NumberField({integer: true, min: 0, label: "EFFECT.DurationSecs"}),
                combat: new foundry.data.fields.ForeignDocumentField(BaseCombat$1, {label: "EFFECT.Combat"}),
                rounds: new foundry.data.fields.NumberField({integer: true, min: 0}),
                turns: new foundry.data.fields.NumberField({integer: true, min: 0, label: "EFFECT.DurationTurns"}),
                startRound: new foundry.data.fields.NumberField({integer: true, min: 0}),
                startTurn: new foundry.data.fields.NumberField({integer: true, min: 0, label: "EFFECT.StartTurns"})
            }),
        }
    }
}
