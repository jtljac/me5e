import Rule5e from "../rule.mjs";

/**
 * A Rule that behaves similarly to the original active effects from foundry, extended to be able to occur at different
 * phases
 */
export default class ScaleValueRule extends Rule5e {
  /**
   * The class identifier the scale value will be stored under
   */
  classIdentifier;

  /**
   * The name used to access the scale value
   * @type {String}
   */
  identifier;

  /**
   * The scaled value
   * @type {String}
   */
  scaleValue;


  /** @inheritDoc */
  constructor(data, item) {
    super(data, item);

    if (!data.classIdentifier) {
      throw new Error(`ScaleValueRule missing classIdentifier`);
    }
    this.classIdentifier = data.classIdentifier;

    if (!data.identifier) {
      throw new Error(`ScaleValueRule missing identifier`);
    }
    this.identifier = data.identifier;

    if (data.scaleValue === undefined) {
      throw new Error(`ScaleValueRule missing scaleValue`);
    }
    this.scaleValue = data.scaleValue;
  }

  /**
   * @inheritDoc
   */
  onActiveEffects(actor, data) {
    const scale = actor.system.scale;

    if (!scale[this.classIdentifier]) scale[this.classIdentifier] = {};
    scale[this.classIdentifier][this.identifier] = this.scaleValue;
  }
}
