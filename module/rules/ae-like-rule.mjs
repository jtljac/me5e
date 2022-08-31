import Rule5e from "./rule.mjs";
import {resolveFormulaValue} from "../utils.mjs";

/**
 * A Rule that behaves similarly to the original active effects from foundry, extended to be able to occur at different
 * phases
 */
export default class AELikeRule extends Rule5e {
  /**
   * The way in which the effect will modify the value
   * @typedef {Object<String, function(*, *): *>} AELikeMode
   * @readonly
   * @enum {AELikeMode}
   */
  static modes = {
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
  };

  /**
   * The phase that the effect will apply on
   * @typedef {String} AELikePhase
   * @readonly
   * @enum {AELikePhase}
   */
  static phases = {
    ActiveEffects: "active-effects",
    AfterDerived: "post-derived"
  };

  /**
   * The phase the AELike rule executes
   * @type {AELikeRule.phases}
   */
  phase;

  /**
   * The mode which the AELike rule uses to modify the base actor's data
   * @type {AELikeMode}
   */
  mode;

  /**
   * The key of the value in the actor being manipulated
   * E.G. system.abilities.con.value
   * @type {String}
   */
  key;

  /**
   * @inheritDoc
   */
  constructor(data, item) {
    super(data, item);

    if (data.phase && Object.values(AELikeRule.phases).includes(data.phase)) {
      throw new Error(`Unknown AELikeRule Phase: ${data.phase}`)
    }
    this.phase = data.phase || AELikeRule.phases.ActiveEffects;

    if (data.mode && Object.values(AELikeRule.modes).includes(data.mode)) {
      throw new Error(`Unknown AELikeRule Mode: ${data.mode}`);
    }
    this.mode = data.mode || AELikeRule.modes.add;

    this.key = data.key;

    this.value = data.value;
  }

  /**
   * @inheritDoc
   */
  onActiveEffects(actor, data) {
    if (this.phase === AELikeRule.phases.ActiveEffects) this.#applyEffect(actor, data);
  }

  /**
   * @inheritDoc
   */
  afterDerived(actor, data) {
    if (this.phase === AELikeRule.phases.AfterDerived) this.#applyEffect(actor, data);
  }

  /**
   * Apply the effect to the given actor, using the given data to evaluate formulas
   * @param actor {Actor5e} The actor the effect is being applied to
   * @param data {Object} The data used to evaluate formulas
   * @private
   */
  #applyEffect(actor, data = actor.toObject(false).system) {
    if (!this.test(actor, data)) return;

    if (this.mode === AELikeRule.modes.custom) {
      const preHook = foundry.utils.getProperty(actor.toObject(false).system, this.key);

      /**
       * A hook event that fires when a custom active effect is applied
       * @function me5e.applyAELike
       * @param actor {Actor5e} The actor the active affect is being applied to
       * @param data {Object} The data used when evaluating formulas in the value
       * @param rule {AELikeRule} The Rule
       * @return {boolean} Explicitly return false to prevent the AELike effect
       */
      if (Hooks.call("me5e.applyAELike", actor, data, this) === false) return;
      const postHook = foundry.utils.getProperty(actor.toObject(false).system, this.key);

      if (postHook !== preHook) {
        foundry.utils.setProperty(actor.overrides, this.key, postHook);
      }
      return;
    }

    const original = foundry.utils.getProperty(data, this.key);
    const newValue = isNaN(this.value) ? resolveFormulaValue(this.value, data) : this.value;

    const change = this.mode(original, newValue);

    if (change !== undefined) {
      foundry.utils.setProperty(actor, this.key, change);
      foundry.utils.setProperty(actor.overrides, this.key, change);
    }
  }
}
