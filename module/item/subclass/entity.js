import Item5e from "../base.js";


export default class Subclass5e extends Item5e {
  /**
   * Caches an item linked to this one, such as a subclass associated with a class.
   * @type {Item5e}
   * @private
   */
  _class;

  /**
   * Class associated with this subclass. Always returns null on non-subclass or non-embedded items.
   * @type {Item5e|null}
   */
  // TODO: Optimise
  get class() {
    if ( !this.isEmbedded ) return null;
    this._class ??= this.parent.items.find(i => (i.type === "class")
      && (i.data.data.identifier === this.data.data.classIdentifier));
    return this._class;
  }

  /**
   * @inheritDoc
   */
  prepareDerivedData() {
    super.prepareDerivedData();

    // Clear out linked item cache
    this._class = undefined;
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
}
