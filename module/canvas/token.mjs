/**
 * Extend the base Token class to implement additional system-specific logic.
 */
export default class Token5e extends Token {

  /** @inheritdoc */
  _drawBar(number, bar, data) {
    if ( data.attribute === "attributes.hp" ) return this._drawHPBar(number, bar, data);
    return super._drawBar(number, bar, data);
  }

  /* -------------------------------------------- */

  /**
   * Specialized drawing function for HP bars.
   * @param {number} number      The Bar number
   * @param {PIXI.Graphics} bar  The Bar container
   * @param {object} data        Resource data for this bar
   * @private
   */
  _drawHPBar(number, bar, data) {

    // Extract health data
    let {value, max, temp} = this.document.actor.system.attributes.hp;
    temp = Number(temp || 0);

    // Differentiate between effective maximum and displayed maximum
    const effectiveMax = Math.max(0, max);

    // Allocate percentages of the total
    const tempPct = Math.clamped(temp, 0, max) / max;
    const valuePct = Math.clamped(value, 0, effectiveMax) / max;
    const colorPct = Math.clamped(value, 0, effectiveMax) / max;

    // Determine colors to use
    const blk = 0x000000;
    const hpColor = PIXI.utils.rgb2hex([(1-(colorPct/2)), colorPct, 0]);
    const c = CONFIG.ME5E.tokenHPColors;

    // Determine the container size (logic borrowed from core)
    const w = this.w;
    let h = Math.max((canvas.dimensions.size / 12), 8);
    if ( this.height >= 2 ) h *= 1.6;
    const bs = Math.clamped(h / 8, 1, 2);
    const bs1 = bs+1;

    // Overall bar container
    bar.clear();
    bar.beginFill(blk, 0.5).lineStyle(bs, blk, 1.0).drawRoundedRect(0, 0, w, h, 3);

    // Health bar
    bar.beginFill(hpColor, 1.0).lineStyle(bs, blk, 1.0).drawRoundedRect(0, 0, valuePct*w, h, 2);

    // Temporary hit points
    if ( temp > 0 ) {
      bar.beginFill(c.temp, 1.0).lineStyle(0).drawRoundedRect(bs1, bs1, (tempPct*w)-(2*bs1), h-(2*bs1), 1);
    }

    // Set position
    let posY = (number === 0) ? (this.h - h) : 0;
    bar.position.set(0, posY);
  }
}
