/**
 * A simple form to set actor hit dice amounts
 * @implements {DocumentSheet}
 */
import {ME5E} from "../config.js";
import {Modifier} from "../actor/modifier.js";

export default class ActorModifierConfig extends DocumentSheet {

  constructor(actor, modType) {
    super(actor);
    this._type = modType;
    this._maxIndex = 0;

    switch (modType) {
      case "hp":
        this._typeName = "ME5E.HP";
        break;
      case "init":
        this._typeName = "ME5E.Initiative";
        break;
    }
  }

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["me5e", "mod-config", "dialog"],
      template: "systems/me5e/templates/apps/modifier-config.html",
      width: 360,
      height: "auto"
    });
  }

  /* -------------------------------------------- */

  /** @override */
  get title() {
    return `${game.i18n.format("ME5E.ModifierConfigure", {"mod": game.i18n.localize(this._typeName)})}: ${this.object.name}`;
  }

  /* -------------------------------------------- */

  sortMods(a, b) {
    const aType = Object.keys(ME5E.modifierType)[a.type];
    const bType = Object.keys(ME5E.modifierType)[b.type];
    if (aType !== bType) return a - b;

    const aName = a.name.toUpperCase();
    const bName = b.name.toUpperCase();
    if (aName < bName) return -1;
    else if (aName > bName) return 1;
    else return 0;
  }

  /** @override */
  getData(options) {
    const mods = this.object.data.data.modifiers.mods[this._type];
    const value = Object.keys(mods).reduce((acc, key) => {
      const mod = mods[key];
      (mod.user ? acc.user : acc.system).push(mod);

      return acc;
    }, {system: [], user: []});

    value.system.sort(this.sortMods);
    value.user.sort(this.sortMods);

    this._maxIndex = value.user.length;

    return {
      type: this._type,
      typeName: this._typeName,
      value: value,
      types: ME5E.modifierType
    };
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /** @inheritdoc */
  async _onChangeInput(event) {
    await super._onChangeInput(event)

    if (event.target.dataset["type"] === "formula") {
      const formula = event.target.value;
      const mod = new Modifier("temp", "custom", formula);
      mod.evaluate(this.object.data);

      const display = event.target.parentElement.parentElement.querySelector("label");
      display.innerText = mod.value;
    }
    console.log(event);
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    const context = this;

    // Setup delete buttons
    html.find("a.item-control.item-delete").click(event => {
      const button = event.currentTarget;
      const container = button.parentElement.parentElement.parentElement;

      container.parentElement.removeChild(container);

    });

    html.find("a.item-control.item-create").click(async event => {
      const name = this.form["newName"];
      const formula = this.form["newFormula"];
      const type = this.form["newType"];

      if (name.value.trim().length === 0) {
        ui.notifications.warn(game.i18n.localize("ME5E.ModifierNoNameWarn"));
        return;
      }

      if ([...context.form.querySelectorAll("[data-type=\"name\"]")].find((element => element.value === name.value))) {
        ui.notifications.warn(game.i18n.localize("ME5E.ModifierDuplicateNameWarn"));
        return;
      }

      if (formula.value.trim().length === 0) {
        ui.notifications.warn(game.i18n.localize("ME5E.ModifierNoFormulaWarn"));
        return
      }

      const value = new Modifier(name.value, type.value, formula.value);
      value.evaluate(this.object.data);

      const html = await renderTemplate("systems/me5e/templates/apps/parts/modifier.html", {name: name.value, modType: context._type, index: context._maxIndex++, _formula: formula.value, type: type.value, _value: value.value, user: true, types: ME5E.modifierType});
      const ref = context.form.querySelector(".insert-before")
      ref.parentElement.insertBefore(document.createRange().createContextualFragment(html), ref);

      name.value = "";
      formula.value = "";
      type.selectedIndex = 0;
    });
  }

  /* -------------------------------------------- */

  /** @override */
  async _updateObject(event, formData) {
    const userMods = Object.entries(formData).filter(([key, arr]) => !key.startsWith("new")).reduce((acc, [index, arr]) => {
      acc.push({
        name: arr[0],
        type: arr[1],
        formula: arr[2]
      });

      return acc;
    }, [])

    return this.object.update({"data.modifiers.user": {
      [this._type]: userMods
    }});
  }
}