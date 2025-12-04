import SimpleTraitField from "./simple-trait-field.mjs";
const { SetField, StringField } = foundry.data.fields;

/**
 * Field for storing damage resistances, immunities, and vulnerabilities data.
 */
export default class DamageTraitField extends SimpleTraitField {
  constructor(fields={}, { initialBypasses=[], ...options }={}) {
    super({
      bypasses: new SetField(new StringField(), {
        label: "ME5E.DamagePhysicalBypass", hint: "ME5E.DamagePhysicalBypassHint", initial: initialBypasses
      })
    }, options);
  }
}
