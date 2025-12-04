const { NumberField, StringField } = foundry.data.fields;

/**
 * Field for storing senses data.
 */
export default class SensesField extends foundry.data.fields.SchemaField {
  constructor(fields={}, { initialUnits=null, ...options }={}) {
    const numberConfig = { required: true, nullable: true, integer: true, min: 0, initial: null };
    fields = {
      darkvision: new NumberField({ ...numberConfig, label: "ME5E.SenseDarkvision" }),
      blindsight: new NumberField({ ...numberConfig, label: "ME5E.SenseBlindsight" }),
      tremorsense: new NumberField({ ...numberConfig, label: "ME5E.SenseTremorsense" }),
      truesight: new NumberField({ ...numberConfig, label: "ME5E.SenseTruesight" }),
      units: new StringField({
        required: true, nullable: true, blank: false, initial: initialUnits, label: "ME5E.SenseUnits"
      }),
      special: new StringField({ required: true, label: "ME5E.SenseSpecial" }),
      ...fields
    };
    Object.entries(fields).forEach(([k, v]) => !v ? delete fields[k] : null);
    super(fields, { label: "ME5E.Senses", ...options });
  }
}
