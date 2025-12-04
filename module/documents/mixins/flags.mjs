/**
 * Mixin used to add system flags enforcement to types.
 * @template {foundry.abstract.Document} T
 * @param {typeof T} Base  The base document class to wrap.
 * @returns {typeof SystemFlags}
 * @mixin
 */
export default function SystemFlagsMixin(Base) {
  class SystemFlags extends Base {
    /**
     * Get the data model that represents system flags.
     * @type {typeof DataModel|null}
     * @abstract
     */
    get _systemFlagsDataModel() {
      return null;
    }

    /* -------------------------------------------- */

    /** @inheritDoc */
    prepareData() {
      super.prepareData();
      if ( ("me5e" in this.flags) && this._systemFlagsDataModel ) {
        this.flags.me5e = new this._systemFlagsDataModel(this._source.flags.me5e, { parent: this });
      }
    }

    /* -------------------------------------------- */

    /** @inheritDoc */
    async setFlag(scope, key, value) {
      if ( (scope === "me5e") && this._systemFlagsDataModel ) {
        let diff;
        const changes = foundry.utils.expandObject({ [key]: value });
        if ( this.flags.me5e ) diff = this.flags.me5e.updateSource(changes, { dryRun: true });
        else diff = new this._systemFlagsDataModel(changes, { parent: this }).toObject();
        return this.update({ flags: { me5e: diff } });
      }
      return super.setFlag(scope, key, value);
    }
  }
  return SystemFlags;
}
