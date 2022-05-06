import Item5e from "../base.js";

/**
 * An item implementation for classes
 * @extends {Item5e}
 */
export default class Class5e extends Item5e {
  /**
   * Caches an item linked to this one, such as a subclass associated with a class.
   * @type {Item5e}
   * @private
   */
  _subClass;

  /**
   * Subclass associated with this class. Always returns null on non-class or non-embedded items.
   * @type {Item5e|null}
   */
  // TODO: Optimise
  get subclass() {
    if ( !this.isEmbedded || (this.type !== "class") ) return null;
    this._subClass ??= this.parent.items.find(i => (i.type === "subclass")
      && (i.data.data.classIdentifier === this.data.data.identifier));
    return this._subClass;
  }

  /* -------------------------------------------- */

  /**
   * Is this class item the original class for the containing actor? If the item is not a class or it is not
   * embedded in an actor then this will return `null`.
   * @type {boolean|null}
   */
  get isOriginalClass() {
    if ( !this.isEmbedded ) return null;
    return this.id === this.parent.data.data.details.originalClass;
  }

  /**
   * @inheritDoc
   */
  prepareDerivedData() {
    super.prepareDerivedData();

    // Clear out linked item cache
    this._subClass = undefined;
  }

  /**
   * @inheritDoc
   */
  prepareFinalAttributes() {
    super.prepareFinalAttributes();

    this.data.data.isOriginalClass = this.isOriginalClass;
  }

  /* -------------------------------------------- */
  /*  Event Handlers                              */
  /* -------------------------------------------- */

  /** @inheritDoc */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);

    // Create class identifier based on name
    if ( !this.data.data.identifier ) {
      await this.data.update({ "data.identifier": data.name.slugify({strict: true}) });
    }
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  async _onCreate(data, options, userId) {
    super._onCreate(data, options, userId);
    if ( (userId !== game.user.id) || !this.parent ) return;

    // Assign a new original class
    if ( this.parent.type === "character" ) {
      const pc = this.parent.items.get(this.parent.data.data.details.originalClass);
      if ( !pc ) await this.parent._assignPrimaryClass();
    }
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  async _preUpdate(changed, options, user) {
    await super._preUpdate(changed, options, user);
    if (!changed.data || !("levels" in changed.data) ) return;

    // Check to make sure the updated class level isn't below zero
    if ( changed.data.levels <= 0 ) {
      ui.notifications.warn(game.i18n.localize("ME5E.MaxClassLevelMinimumWarn"));
      changed.data.levels = 1;
    }

    // Check to make sure the updated class level doesn't exceed level cap
    if ( changed.data.levels > CONFIG.ME5E.maxLevel ) {
      ui.notifications.warn(game.i18n.format("ME5E.MaxClassLevelExceededWarn", {max: CONFIG.ME5E.maxLevel}));
      changed.data.levels = CONFIG.ME5E.maxLevel;
    }
    if ( !this.isEmbedded || (this.parent.type !== "character") ) return;

    // Check to ensure the updated character doesn't exceed level cap
    const newCharacterLevel = this.actor.data.data.details.level + (changed.data.levels - this.data.data.levels);
    if ( newCharacterLevel > CONFIG.ME5E.maxLevel ) {
      ui.notifications.warn(game.i18n.format("ME5E.MaxCharacterLevelExceededWarn",
        {max: CONFIG.ME5E.maxLevel}));
      changed.data.levels -= newCharacterLevel - CONFIG.ME5E.maxLevel;
    }
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  _onDelete(options, userId) {
    super._onDelete(options, userId);
    if ( (userId !== game.user.id) || !this.parent ) return;

    // Assign a new original class
    // Check if this can be done in the character
    if ( (this.id === this.parent.data.data.details.originalClass) ) {
      this.parent._assignPrimaryClass();
    }
  }
}
