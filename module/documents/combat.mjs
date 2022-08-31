/**
 * Override the default Initiative formula to customize special behaviors of the system.
 * Passes the responsibility onto the actor
 * See Combat._getInitiativeFormula for more detail.
 * @returns {string}  Final initiative formula for the actor.
 */
export function _getInitiativeFormula() {
  const actor = this.actor;
  if ( !actor ) return "1d20";

  return actor.getInitiativeFormula()
}
