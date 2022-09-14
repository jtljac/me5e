import {resolveFormulaValue} from "../../utils.mjs";

/**
 * A simple form to set actor modifiers
 * @implements {DocumentSheet}
 */
export default class ActorModifierConfig extends DocumentSheet {

  /**
   * @param {Character5e} actor The actor the modifiers are for
   * @param {Object} options
   * @param {Modifier5e.targets} modType The modifier Type
   * @param {Application} parent The parent application containing this one
   */
  constructor(actor, options, modType, parent) {
    super(actor, options);
    this._type = modType;
    this._parent = parent;
  }

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: "systems/me5e/templates/apps/modifiers-config.hbs",
      popOut: false,
    });
  }

  /* -------------------------------------------- */

  /** @override */
  get title() {
    return `${game.i18n.localize("ME5E.ModifierConfigure")}`;
  }

  /* -------------------------------------------- */

  get id() {
    return "modifiers";
  }

  /* -------------------------------------------- */

  /** @override */
  getData(options) {
    const values = foundry.utils.getProperty(this.object, this._type).mods.mods.reduce((acc, mod) => {
      (mod.user ? acc.user : acc.system).push({
        name: mod.name,
        category: mod.category,
        formula: mod.formula,
        value: mod.evaluate(this.object),
        user: mod.user
      });
      return acc;
    }, {system: [], user: []});

    return foundry.utils.mergeObject(
      super.getData(options),
      {
        values,
        categories: CONFIG.ME5E.ModifierCategories
      }
    );
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /** @inheritdoc */
  async _onChangeInput(event) {
    await super._onChangeInput(event);
    if (["formula", "add-formula"].includes(event.target.name)) {
      const formula = event.target.value;
      const display = event.target.parentElement.parentElement.querySelector("span.mod-value");
      try {
        display.innerText = resolveFormulaValue(formula, this.object);
      } catch (e) {
        display.innerText = "-";
      }
    }
  }

  /**
   * Called when a mod is deleted
   * @param {event<onclick>} event
   * @return {Promise<void>}
   */
  deleteMod(event) {
    const modContainer = event.currentTarget.parentElement;
    const containerParent = modContainer.parentElement
    containerParent.removeChild(modContainer);

    /*
     In order to use the :empty selector there cannot be any whitespace in the parent, so remove any if
     the parent has no child nodes
     */
    if (!containerParent.childElementCount) containerParent.innerHTML = "";

    this._parent.setPosition();
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    const context = this;

    // Setup delete buttons
    html.find(".mod > button.mod-button[data-action=\"delete\"]").click(this.deleteMod.bind(this));

    html.find(".mod > button.mod-button[data-action=\"add\"]").click(async (event) => {
      const modContainer = event.currentTarget.parentElement;

      const userModGroupEle = context.form.querySelector(".mod-group:nth-child(2)");

      const name = context.form["add-name"];
      const formula = context.form["add-formula"];
      const category = context.form["add-category"];
      const value = modContainer.querySelector(".mod-value");

      if (!context.validateModifierData(name.value, formula.value, category.value)) return;

      let node = document.createRange().createContextualFragment(await renderTemplate(
        "systems/me5e/templates/apps/parts/modifier-input.hbs",
        {
          categories: CONFIG.ME5E.ModifierCategories,
          name: name.value,
          category: category.value,
          formula: formula.value,
          user: true,
          value: resolveFormulaValue(formula.value, this.object)
        }
      ));

      node.querySelector("button.mod-button[data-action=\"delete\"]").addEventListener("click", this.deleteMod.bind(this));

      userModGroupEle.appendChild(node);

      name.value = "";
      formula.value = "";
      category.selectedIndex = 0;
      value.innerHTML = "-";
      context._parent.setPosition();
    });
  }

  /** @inheritDoc */
  async _onSubmit(event, updateData) {
    event.preventDefault();

    return null;
  }

  /** @override */
  async _updateObject(event, formData) {
    const modifiers = [];

    if (formData.name) {
      const names = Array.isArray(formData.name) ? formData.name : [formData.name];
      const formulas = Array.isArray(formData.formula) ? formData.formula : [formData.formula];
      const categories = Array.isArray(formData.category) ? formData.category : [formData.category];


      for (let i = 0; i < names.length; i++) {
        if (names[i] === null) continue;

        if (!this.validateModifierData(names[i], formulas[i], categories[i])) throw new Error("Modifier failed validation");

        modifiers.push({
          name: names[i],
          formula: formulas[i],
          category: categories[i]
        });
      }
    }

    this.object.update({[`${this._type}.mods.userMods`]: modifiers});
  }

  /**
   * Validate a modifiers data
   * @param name The name of the modifier
   * @param formula The formula of the modifier
   * @param category The category of the modifier
   * @return {boolean} True if the data passes the validation
   */
  validateModifierData(name, formula, category) {
    if (name.trim().length === 0) {
      ui.notifications.warn(game.i18n.localize("ME5E.ModifierErrorNoName"));
      return false;
    }

    if (formula.trim().length === 0) {
      ui.notifications.warn(game.i18n.localize("ME5E.ModifierErrorNoFormula"));
      return false;
    }

    if (formula.match(/\d*d\d+/gi)) {
      ui.notifications.warn(game.i18n.localize("ME5E.ModifierErrorFormulaDice"));
      return false;
    }

    try {
      resolveFormulaValue(formula, this.object)
    } catch(e) {
      ui.notifications.warn(game.i18n.localize("ME5E.ModifierErrorFormulaError"));
      return false;
    }

    return true;
  }
}
