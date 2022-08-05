/**
 * Override the default Initiative formula to customize special behaviors of the system.
 * Apply advantage, proficiency, or bonuses where appropriate
 * Apply the dexterity score as a decimal tiebreaker if requested
 * See Combat._getInitiativeFormula for more detail.
 * @returns {string}  Final initiative formula for the actor.
 */
export function _getInitiativeFormula() {
  const actor = this.actor;
  if ( !actor ) return "1d20";
  const init = actor.system.attributes.init;
  const rollData = actor.getRollData();

  // Construct initiative formula parts
  let nd = 1;
  let mods = "";
  if ( actor.getFlag("me5e", "halflingLucky") ) mods += "r1=1";
  if ( actor.getFlag("me5e", "initiativeAdv") ) {
    nd = 2;
    mods += "kh";
  }
  const parts = [
    `${nd}d20${mods}`,
    init.mod,
    (init.prof.term !== "0") ? init.prof.term : null,
    (init.value !== 0) ? init.value : null
  ];

  // Ability Check Bonuses
  const checkBonus = actor.system.abilities[init.ability]?.bonuses?.check;
  const globalCheckBonus = actor.system.bonuses?.abilities?.check;
  if ( checkBonus ) parts.push(Roll.replaceFormulaData(checkBonus, rollData));
  if ( globalCheckBonus ) parts.push(Roll.replaceFormulaData(globalCheckBonus, rollData));

  // Optionally apply Dexterity tiebreaker
  const tiebreaker = game.settings.get("me5e", "initiativeDexTiebreaker");
  if ( tiebreaker ) parts.push((actor.system.abilities.dex?.value ?? 0) / 100);
  return parts.filter(p => p !== null).join(" + ");
}
