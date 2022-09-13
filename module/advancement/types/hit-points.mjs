import Advancement from "../advancement.mjs";
import AdvancementFlow from "../advancement-flow.mjs";
import AdvancementConfig from "../advancement-config.mjs";
import Modifier5e from "../../modifiers/modifier.mjs";

/**
 * Advancement that presents the player with the option to roll hit points at each level or select the average value.
 * Keeps track of player hit point rolls or selection for each class level. **Can only be added to classes and each
 * class can only have one.**
 */
export class HitPointsAdvancement extends Advancement {

  /** @inheritdoc */
  static get metadata() {
    return foundry.utils.mergeObject(super.metadata, {
      order: 10,
      icon: "systems/me5e/icons/svg/hit-points.svg",
      title: game.i18n.localize("ME5E.AdvancementHitPointsTitle"),
      hint: game.i18n.localize("ME5E.AdvancementHitPointsHint"),
      multiLevel: true,
      validItemTypes: new Set(["class"]),
      apps: {
        config: HitPointsConfig,
        flow: HitPointsFlow
      }
    });
  }

  /* -------------------------------------------- */
  /*  Instance Properties                         */
  /* -------------------------------------------- */

  /** @inheritdoc */
  get levels() {
    return Array.fromRange(CONFIG.ME5E.maxLevel + 1).slice(1);
  }

  /* -------------------------------------------- */

  /**
   * Shortcut to the hit die used by the class.
   * @returns {string}
   */
  get hitDie() {
    return this.item.system.hitDice;
  }

  /* -------------------------------------------- */

  /**
   * The face value of the hit die used.
   * @returns {number}
   */
  get hitDieValue() {
    return Number(this.hitDie.substring(1));
  }

  /* -------------------------------------------- */
  /*  Display Methods                             */
  /* -------------------------------------------- */

  /** @inheritdoc */
  configuredForLevel(level) {
    return this.valueForLevel(level) !== null;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  titleForLevel(level, { configMode=false }={}) {
    const hp = this.valueForLevel(level);
    if ( !hp || configMode ) return this.title;
    return `${this.title}: <strong>${hp}</strong>`;
  }

  /* -------------------------------------------- */

  /**
   * Hit points given at the provided level.
   * @param {number} level   Level for which to get hit points.
   * @returns {number|null}  Hit points for level or null if none have been taken.
   */
  valueForLevel(level) {
    return this.constructor.valueForLevel(this.data.value, this.hitDieValue, level);
  }

  /* -------------------------------------------- */

  /**
   * Hit points given at the provided level.
   * @param {object} data         Contents of `data.value` used to determine this value.
   * @param {number} hitDieValue  Face value of the hit die used by this advancement.
   * @param {number} level        Level for which to get hit points.
   * @returns {number|null}       Hit points for level or null if none have been taken.
   */
  static valueForLevel(data, hitDieValue, level) {
    const value = data[level];
    if ( !value ) return null;

    if ( value === "max" ) return hitDieValue;
    if ( value === "avg" ) return (hitDieValue / 2) + 1;
    return value;
  }

  /* -------------------------------------------- */

  /**
   * Total hit points provided by this advancement.
   * @returns {number}  Hit points currently selected.
   */
  total() {
    return Object.keys(this.data.value).reduce((total, level) => total + this.valueForLevel(parseInt(level)), 0);
  }

  /* -------------------------------------------- */
  /*  Editing Methods                             */
  /* -------------------------------------------- */

  /** @inheritdoc */
  static availableForItem(item) {
    return !item.advancement.getByType("HitPoints")?.length;
  }

  /* -------------------------------------------- */
  /*  Data Methods                                */
  /* -------------------------------------------- */

  /** @inheritDoc */
  getRules() {
    return [{
      type: "ModifierRule",
      name: this.item.name,
      formula: Object.keys(this.data.value).reduce((total, level) => total + " + " + this.valueForLevel(parseInt(level)), ""),
      category: CONFIG.ME5E.ModifierCategories.class,
      target: Modifier5e.targets.hp
    }];
  }

  /* -------------------------------------------- */
  /*  Application Methods                         */
  /* -------------------------------------------- */

  /** @inheritdoc */
  reverse(level) {
    let value = this.valueForLevel(level);
    if ( value === undefined ) return;
    const con = this.actor.system.abilities.con;
    const hp = this.actor.system.attributes.hp;
    value += con?.mod ?? 0;
    this.actor.updateSource({
      "system.attributes.hp.max": hp.max - value,
      "system.attributes.hp.value": hp.value - value
    });
    const source = { [level]: this.data.value[level] };
    this.updateSource({ [`value.-=${level}`]: null });
    return source;
  }
}


/**
 * Configuration application for hit points.
 */
export class HitPointsConfig extends AdvancementConfig {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: "systems/me5e/templates/advancement/hit-points-config.hbs"
    });
  }


  /** @inheritdoc */
  getData() {
    return foundry.utils.mergeObject(super.getData(), {
      hitDie: this.advancement.hitDie
    });
  }
}


/**
 * Inline application that presents hit points selection upon level up.
 */
export class HitPointsFlow extends AdvancementFlow {

  get advancementType() {
    return "HitPoints";
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: "systems/me5e/templates/advancement/hit-points-flow.hbs"
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    // The below would usually need to be +1 for both parts of the slice, however levels start from 1
    const source = Object.values(this.advancements[0].data.value).slice(this.startingLevel, this.startingLevel + this.levelDelta);
    let lastValue = source[this.startingLevel] || "avg";

    let values = [];
    for (let i = 0; i < this.levelDelta; i++) {
      if (source[i]) lastValue = source[i];
      values.push({useAverage: lastValue === "avg", value: Number.isInteger(lastValue) ? lastValue : "", level: this.startingLevel + i + 1})
    }

    return foundry.utils.mergeObject(super.getData(), {
      isFirstClassLevel: (this.startingLevel === 1) && this.item.isOriginalClass,
      hitDie: this.advancements[0].hitDie,
      dieValue: this.advancements[0].hitDieValue,
      values
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    html.find(".averageCheckbox").change(event => {
      const rollElement = event.target.parentElement.parentElement;
      rollElement.querySelector(".rollResult").disabled = event.target.checked;
      rollElement.querySelector(".rollButton").disabled = event.target.checked;
      this._updateRollResults();
    });
    html.find(".rollButton").click(async (event) => {
      const roll = await this.advancements[0].actor.rollClassHitPoints(this.advancements[0].item);
      event.target.parentElement.querySelector(".rollResult").value = roll.total;
    });
    this._updateRollResults();
  }

  /* -------------------------------------------- */

  /**
   * Update the roll result display when the average result is taken.
   * @protected
   */
  _updateRollResults() {
    this.form.querySelectorAll(".roll").forEach(element => {
      if ( !element.querySelector(".averageCheckbox")?.checked ) return;
      element.querySelector(".rollResult").value = (this.advancements[0].hitDieValue / 2) + 1;
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async getChanges() {
    const formData = this._getSubmitData();
    const useAverage = Array.isArray(formData.useAverage) ? formData.useAverage : [formData.useAverage];
    const values = Array.isArray(formData.value) ? formData.value : [formData.value];

    const results = values.reduce((acc, value, index) => {
      let newValue;
      if (value === "max") newValue = "max";
      else if (useAverage[index]) value = "avg";
      else if (Number.isInteger(value)) value = parseInt(value);

      if (newValue === undefined) {
        this.form.querySelector(".rollResult")?.classList.add("error");
        const errorType = newValue ? "Invalid" : "Empty";
        throw new Advancement.ERROR(game.i18n.localize(`ME5E.AdvancementHitPoints${errorType}Error`));
      }

      acc[(this.startingLevel + index + 1).toString()] = newValue;
      return acc;
    }, {});

    return {advancementUpdates: {[this.advancements[0].id]: {value: results}}}
  }
}
