import Rule5e from "./rule.js";

/**
 * A Rule that behaves similarly to the original active effects from foundry, extended to be able to occur at different
 * phases
 */
export default class AELikeRule extends Rule5e {
  /**
   * The way in which the effect will modify the value
   * @readonly
   * @enum {Object<String, function(*, *): *>}
   */
  static mode = {
    /** Multiply the existing value by the value from the Rule */
    multiply: (value, effect) => {
      const type = foundry.utils.getType(value);
      return type === "number" ? value * effect : undefined;
    },
    /** Add the value from the Rule onto the existing value */
    add: (value, effect) => {
      const type = foundry.utils.getType(value);

      switch(type) {
        case "array":
          return value.concat(effect instanceof Array ? effect : [effect]);
        case "number":
        case "string":
          return value + effect;
        default:
          return undefined;
      }
    },
    /** Set the value to the value from the rule only if the value from the rule is smaller */
    downgrade: (value, effect) => {
      return foundry.utils.getType(value) === "number" ? (effect < value ? effect : undefined) : undefined;
    },
    /** Set the value to the value from the rule only if the value from the rule is greater */
    upgrade: (value, effect) => {
      return foundry.utils.getType(value) === "number" ? (effect > value ? effect : undefined) : undefined;
    },
    /** Set the value to the value from the rule */
    override: (value, effect) => {
      const type = foundry.utils.getType(value);

      switch (type) {
        case "array":
          return effect instanceof Array ? effect : undefined;
        case "default":
          return effect;
      }
    },
    /** Use a custom hook to handle the change (not actually handled by this lambda) */
    custom: (value, effect) => value
  }

  /**
   * The phase that the effect will apply on
   * @readonly
   * @enum {String}
   */
  static phase = {
    ActiveEffects: "active-effects",
    AfterDerived: "post-derived"
  }

  /**
   * @inheritDoc
   */
  constructor(data, item) {
    super(data, item);

    if (!this.data.phase) this.data.phase = AELikeRule.phase.ActiveEffects;

    if (!this.data.mode) this.data.mode = "add";
    else if (!AELikeRule.mode.hasOwnProperty(this.data.mode)) {
      throw new Error(`Unknown AELikeRule Mode: ${this.data.mode}`)
    }
  }

  /**
   * @inheritDoc
   * @override
   */
  onActiveEffects(actor, data) {
    if (this.data.phase === AELikeRule.phase.ActiveEffects) this._applyEffect(actor, data);
  }

  /**
   * @inheritDoc
   * @override
   */
  afterDerived(actor, data) {
    if (this.data.phase === AELikeRule.phase.AfterDerived) this._applyEffect(actor, data);
  }

  /**
   * Apply the effect to the given actor, using the given data to evaluate formulas
   * @param actor {Actor5e} The actor the effect is being applied to
   * @param data {Object} The data used to evaluate formulas
   * @private
   */
  _applyEffect(actor, data = actor.data) {
    if (!this.test(actor, data)) return;

    if (this.data.mode === "custom") {
      /**
       * A hook event that fires when a custom active effect is applied
       * @function me5e.applyAELike
       * @param actor {Actor5e} The actor the active affect is being applied to
       * @param data {Object} The data used when evaluating formulas in the value
       * @param effectData {Object} The effect data
       */
      Hooks.call("me5e.applyAELike", actor, data, this.data)
      return;
    }

    const key = this.data.key;
    const original = foundry.utils.getProperty(data, key);
    const newValue = isNaN(this.data.value) ? this.resolveValue(this.data.value, data) : this.data.value;

    const change = AELikeRule.mode[this.data.mode](original, newValue);

    if (change !== undefined) {
      foundry.utils.setProperty(actor.data, key, change);
      foundry.utils.setProperty(actor.overrides, key, change);
    }
  }
}
