import Advancement from "../advancement.mjs";
import AdvancementFlow from "../advancement-flow.mjs";
import AdvancementConfig from "../advancement-config.mjs";

/**
 * Advancement that automatically grants one or more items to the player. Presents the player with the option of
 * skipping any or all of the items.
 */
export class ItemGrantAdvancement extends Advancement {

  /** @inheritdoc */
  static get metadata() {
    return foundry.utils.mergeObject(super.metadata, {
      defaults: {
        configuration: {
          items: [],
          optional: false,
          spell: null
        }
      },
      order: 40,
      icon: "systems/me5e/icons/svg/item-grant.svg",
      title: game.i18n.localize("ME5E.AdvancementItemGrantTitle"),
      hint: game.i18n.localize("ME5E.AdvancementItemGrantHint"),
      apps: {
        config: ItemGrantConfig,
        flow: ItemGrantFlow
      }
    });
  }

  /* -------------------------------------------- */

  /**
   * The item types that are supported in Item Grant.
   * @type {Set<string>}
   */
  static VALID_TYPES = new Set(["feat", "spell", "consumable", "backpack", "equipment", "loot", "tool", "weapon"]);

  /* -------------------------------------------- */
  /*  Display Methods                             */
  /* -------------------------------------------- */

  /** @inheritdoc */
  configuredForLevel(level) {
    return !foundry.utils.isEmpty(this.data.value);
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  summaryForLevel(level, { configMode=false }={}) {
    // Link to compendium items
    if ( !this.data.value.added || configMode ) {
      return this.data.configuration.items.reduce((html, uuid) => html + me5e.utils.linkForUuid(uuid), "");
    }

    // Link to items on the actor
    else {
      return Object.keys(this.data.value.added).map(id => {
        const item = this.actor.items.get(id);
        return item?.toAnchor({classes: ["content-link"]}).outerHTML ?? "";
      }).join("");
    }
  }

  /* -------------------------------------------- */
  /*  Application Methods                         */
  /* -------------------------------------------- */

  /** @inheritDoc */
  getDeletionSideEffects() {
    return Object.keys(this.data.value?.added || {});
  }
}


/**
 * Configuration application for item grants.
 */
export class ItemGrantConfig extends AdvancementConfig {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      dragDrop: [{ dropSelector: ".drop-target" }],
      dropKeyPath: "items",
      template: "systems/me5e/templates/advancement/item-grant-config.hbs"
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();
    context.showSpellConfig = context.data.configuration.items.map(fromUuidSync).some(i => i.type === "spell");
    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  _validateDroppedItem(event, item) {
    if ( this.advancement.constructor.VALID_TYPES.has(item.type) ) return true;
    const type = game.i18n.localize(`ITEM.Type${item.type.capitalize()}`);
    throw new Error(game.i18n.format("ME5E.AdvancementItemTypeInvalidWarning", { type }));
  }
}


/**
 * Inline application that presents the player with a list of items to be added.
 */
export class ItemGrantFlow extends AdvancementFlow {

  get advancementType() {
    return "ItemGrant";
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: "systems/me5e/templates/advancement/item-grant-flow.hbs"
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async getData() {
    const groups = await this.advancements.sort((a, b) => {
        if (a.data.level === b.data.level) return a.title.localeCompare(b.title);
        return a - b;
      }).reduce(async (acc, advancement) => {
        acc = await acc;
        if (!acc[advancement.data.level]) acc[advancement.data.level] = [];
        acc[advancement.data.level].push({
          id: advancement.id,
          title: advancement.title,
          icon: advancement.icon,
          optional: advancement.data.configuration.optional,
          items: (await Promise.all(advancement.data.configuration.items.map(fromUuid))).filter(item => item)
        });
        return acc;
      }, Promise.resolve({}));

    return foundry.utils.mergeObject(super.getData(), {
      groups
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);
    html.find("a[data-uuid]").click(this._onClickFeature.bind(this));
  }

  /* -------------------------------------------- */

  /**
   * Handle clicking on a feature during item grant to preview the feature.
   * @param {MouseEvent} event  The triggering event.
   * @protected
   */
  async _onClickFeature(event) {
    event.preventDefault();
    const uuid = event.currentTarget.dataset.uuid;
    const item = await fromUuid(uuid);
    item?.sheet.render(true);
  }

  /** @inheritDoc */
  async getForwardChanges() {
    const formData = this._getSubmitData();
    const toCreate = [];
    const advancementUpdates = {};
    for (const [uuid, checked] of Object.entries(formData)) {
      if (!checked) continue;

      let splitIndex = uuid.indexOf(".", 0);
      const advancementId = uuid.slice(0, splitIndex);
      const itemId = uuid.slice(splitIndex + 1, uuid.length);

      const source = await fromUuid(itemId);
      if (!source) continue;
      const itemData = source.clone({
        _id: foundry.utils.randomID(),
        "flags.me5e.sourceId": uuid,
        "flags.me5e.advancementOrigin": `${this.item.id}.${advancementId}`
      }, {keepId: true}).toObject();

      if ( itemData.type === "spell" ) foundry.utils.mergeObject(itemData, this.advancements.find((advancement => advancement.id === advancementId))?.spellChanges);

      toCreate.push(itemData);
      if (!advancementUpdates[advancementId]) advancementUpdates[advancementId] = {"value.added": {}};
      advancementUpdates[advancementId]["value.added"][itemData._id] = itemId;
    }

    return {toCreate, advancementUpdates};
  }

  /** @inheritDoc */
  async getReverseChanges() {
    return this.advancements.reduce((acc, advancement) => {
      if (!advancement.data.value?.added) return acc;

      const items = Object.keys(advancement.data.value.added);

      acc.toDelete.push(...items);
      acc.advancementUpdates[advancement.id] = {
        "value.added": items.reduce((acc, item) => {
          acc[`-=${item}`] = "";
          return acc;
        }, {})
      };
      return acc;
    }, {toDelete: [], advancementUpdates: {}})
  }
}
