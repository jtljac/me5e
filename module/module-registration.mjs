import ItemCompendium5e from "./applications/item/item-compendium.mjs";
import TableOfContentsCompendium from "./applications/journal/table-of-contents.mjs";
import { log } from "./utils.mjs";

/* -------------------------------------------- */
/*  Module Data                                 */
/* -------------------------------------------- */

/**
 * Scan module manifests for any data that should be integrated into the system configuration.
 */
export function registerModuleData() {
  log("Registering Module Data", { level: "groupCollapsed" });
  for ( const manifest of [game.system, ...game.modules.filter(m => m.active), game.world] ) {
    try {
      const complete = registerMethods.map(m => m(manifest)).filter(r => r);
      if ( complete.length ) log(`Registered ${manifest.title} data: ${complete.join(", ")}`);
    } catch(err) {
      log(`Error registering ${manifest.title}\n`, { extras: [err.message], level: "error" });
    }
  }
  console.groupEnd();
}

const registerMethods = [registerSourceBooks, registerSpellLists];

/* -------------------------------------------- */

/**
 * Register package source books from `flags.me5e.sourceBooks`.
 * @param {Module|System|World} manifest  Manifest from which to register data.
 * @returns {string|void}                 Description of the data registered.
 */
function registerSourceBooks(manifest) {
  if ( !manifest.flags.me5e?.sourceBooks ) return;
  Object.assign(CONFIG.ME5E.sourceBooks, manifest.flags.me5e.sourceBooks);
  return "source books";
}

/* -------------------------------------------- */

/**
 * Register package spell lists from `flags.me5e.spellLists`.
 * @param {Module|System|World} manifest  Manifest from which to register data.
 * @returns {string|void}                 Description of the data registered.
 */
function registerSpellLists(manifest) {
  if ( foundry.utils.getType(manifest.flags.me5e?.spellLists) !== "Array" ) return;
  manifest.flags.me5e.spellLists.forEach(uuid => me5e.registry.spellLists.register(uuid));
  return "spell lists";
}

/* -------------------------------------------- */
/*  Compendium Packs                            */
/* -------------------------------------------- */

/**
 * Apply any changes to compendium packs during the setup hook.
 */
export function setupModulePacks() {
  log("Setting Up Compendium Packs", { level: "groupCollapsed" });
  for ( const pack of game.packs ) {
    if ( pack.metadata.type === "Item" ) pack.applicationClass = ItemCompendium5e;
    try {
      const complete = setupMethods.map(m => m(pack)).filter(r => r);
      if ( complete.length ) log(`Finished setting up ${pack.metadata.label}: ${complete.join(", ")}`);
    } catch(err) {
      log(`Error setting up ${pack.title}\n`, { extras: [err.message], level: "error" });
    }
  }
  if ( sortingChanged ) game.settings.set("core", "collectionSortingModes", collectionSortingModes);
  console.groupEnd();
}

const setupMethods = [setupPackDisplay, setupPackSorting];

/* -------------------------------------------- */

/**
 * Set application based on `flags.me5e.display`.
 * @param {Compendium} pack  Pack to set up.
 * @returns {string|void}    Description of the step.
 */
function setupPackDisplay(pack) {
  const display = pack.metadata.flags.display ?? pack.metadata.flags.me5e?.display;
  if ( display !== "table-of-contents" ) return;
  pack.applicationClass = TableOfContentsCompendium;
  return "table of contents";
}

/* -------------------------------------------- */

let collectionSortingModes;
let sortingChanged = false;

/**
 * Set default sorting order based on `flags.me5e.sorting`.
 * @param {Compendium} pack  Pack to set up.
 * @returns {string|void}    Description of the step.
 */
function setupPackSorting(pack) {
  collectionSortingModes ??= game.settings.get("core", "collectionSortingModes") ?? {};
  if ( !pack.metadata.flags.me5e?.sorting || collectionSortingModes[pack.metadata.id] ) return;
  collectionSortingModes[pack.metadata.id] = pack.metadata.flags.me5e.sorting;
  sortingChanged = true;
  return "default sorting";
}

/* -------------------------------------------- */
/*  Redirects                                   */
/* -------------------------------------------- */

/**
 * Add compendium UUID redirects from core premium modules to SRD if module's aren't enabled.
 */
export function registerModuleRedirects() {
  log("Registering Module Redirects", { level: "groupCollapsed" });
  for ( const [moduleId, redirects] of Object.entries(moduleRedirects) ) {
    if ( game.modules.get(moduleId)?.active ) {
      log(`Skipped redirects for ${moduleId}`);
    } else {
      log(`Registered redirects to SRD for ${moduleId}`);
      Object.assign(CONFIG.compendium.uuidRedirects, redirects);
    }
  }
  console.groupEnd();
}

const moduleRedirects = {
  "dnd-players-handbook": {
    "Compendium.dnd-players-handbook.actors": "Compendium.me5e.actors24",
    "Compendium.dnd-players-handbook.classes": "Compendium.me5e.classes24",
    "Compendium.dnd-players-handbook.content": "Compendium.me5e.content24",
    "Compendium.dnd-players-handbook.equipment": "Compendium.me5e.equipment24",
    "Compendium.dnd-players-handbook.feats": "Compendium.me5e.feats24",
    "Compendium.dnd-players-handbook.origins": "Compendium.me5e.origins24",
    "Compendium.dnd-players-handbook.spells": "Compendium.me5e.spells24",
    "Compendium.dnd-players-handbook.tables": "Compendium.me5e.tables24"
  },
  "dnd-dungeon-masters-guide": {
    "Compendium.dnd-dungeon-masters-guide.actors": "Compendium.me5e.actors24",
    "Compendium.dnd-dungeon-masters-guide.content": "Compendium.me5e.content24",
    "Compendium.dnd-dungeon-masters-guide.equipment": "Compendium.me5e.equipment24",
    "Compendium.dnd-dungeon-masters-guide.tables": "Compendium.me5e.tables24"
  },
  "dnd-monster-manual": {
    "Compendium.dnd-monster-manual.actors": "Compendium.me5e.actors24",
    "Compendium.dnd-monster-manual.content": "Compendium.me5e.content24",
    "Compendium.dnd-monster-manual.features": "Compendium.me5e.monsterfeatures24",
    "Compendium.dnd-monster-manual.tables": "Compendium.me5e.tables24"
  }
};
