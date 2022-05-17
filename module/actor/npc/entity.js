import Creature5e from "../creature/entity.js";

/**
 * @ex
 */
export default class Npc5e extends Creature5e {

  /**
   * @override
   */
  prepareBaseData() {
    super.prepareBaseData();

    const actorData = this.data;
    const data = actorData.data;

    // Kill Experience
    data.details.xp.value = this.getCRExp(data.details.cr);

    // Proficiency
    data.attributes.prof = Math.floor((Math.max(data.details.cr, 1) + 7) / 4);

    // Spellcaster Level
    if ( data.attributes.spellcasting && !Number.isNumeric(data.details.spellLevel) ) {
      data.details.spellLevel = Math.max(data.details.cr, 1);
    }
  }

  /**
   * @override
   */
  prepareDerivedData() {
    super.prepareBaseData();

    const actorData = this.data;
    const data = actorData.data;

    // Cache labels
    this.labels = {};
    this.labels.creatureType = this.constructor.formatCreatureType(data.details.type);
  }

  /* -------------------------------------------- */

  /**
   * Return the amount of experience granted by killing a creature of a certain CR.
   * @param {number} cr     The creature's challenge rating.
   * @returns {number}      The amount of experience granted per kill.
   */
  getCRExp(cr) {
    if (cr < 1.0) return Math.max(200 * cr, 10);
    return CONFIG.ME5E.CR_EXP_LEVELS[cr];
  }

  /* -------------------------------------------- */

  /**
   * Format a type object into a string.
   * @param {object} typeData          The type data to convert to a string.
   * @returns {string}
   */
  static formatCreatureType(typeData) {
    if ( typeof typeData === "string" ) return typeData; // Backwards compatibility
    let localizedType;
    if ( typeData.value === "custom" ) {
      localizedType = typeData.custom;
    } else {
      let code = CONFIG.ME5E.creatureTypes[typeData.value];
      localizedType = game.i18n.localize(typeData.swarm ? `${code}Pl` : code);
    }
    let type = localizedType;
    if ( typeData.swarm ) {
      type = game.i18n.format("ME5E.CreatureSwarmPhrase", {
        size: game.i18n.localize(CONFIG.ME5E.actorSizes[typeData.swarm]),
        type: localizedType
      });
    }
    if (typeData.subtype) type = `${type} (${typeData.subtype})`;
    return type;
  }
}
