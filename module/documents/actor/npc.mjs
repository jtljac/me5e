import Creature5e from "./creature.mjs";

export default class Npc5e extends Creature5e {
  /* -------------------------------------------- */
  /*  Event Handlers                              */
  /* -------------------------------------------- */
  /** @inheritDoc */
  prepareBaseData() {
    super.prepareBaseData();

    const cr = this.system.details.cr;

    // Attuned items
    this.system.attributes.attunement.value = this.items.filter(i => {
      return i.system.attunement === CONFIG.ME5E.attunementTypes.ATTUNED;
    }).length;

    // Kill Experience
    this.system.details.xp.value = this.getCRExp(cr);

    // Proficiency
    this.system.attributes.prof = Math.floor((Math.max(cr, 1) + 7) / 4);

    // Spellcaster Level
    if ( this.system.attributes.spellcasting && !Number.isNumeric(this.system.details.spellLevel) ) {
      this.system.details.spellLevel = Math.max(cr, 1);
    }
  }

  /* -------------------------------------------- */
  /*  Data prep                                   */
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
