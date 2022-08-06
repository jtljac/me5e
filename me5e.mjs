/**
 * The ME5e game system for Foundry Virtual Tabletop
 * A system for playing the fifth edition of the worlds most popular roleplaying game.
 * Author: jtljac
 * Software License: GNU GPLv3
 * Repository: https://gitlab.com/foundrynet/me5e
 * Issue Tracker: https://gitlab.com/foundrynet/me5e/issues
 */

// Import Configuration
import ME5E from "./module/config.mjs";
import registerSystemSettings from "./module/settings.mjs";

// Import Submodules
import * as advancement from "./module/advancement/_module.mjs";
import * as applications from "./module/applications/_module.mjs";
import * as canvas from "./module/canvas/_module.mjs";
import * as dice from "./module/dice/_module.mjs";
import * as documents from "./module/documents/_module.mjs";
import * as migrations from "./module/migration.mjs";
import * as utils from "./module/utils.mjs";

/* -------------------------------------------- */
/*  Define Module Structure                     */
/* -------------------------------------------- */

globalThis.me5e = {
  advancement,
  applications,
  canvas,
  config: ME5E,
  dice,
  documents,
  migrations,
  utils
};

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", function() {
  globalThis.me5e = game.me5e = Object.assign(game.system, globalThis.me5e);
  console.log(`ME5e | Initializing the ME5e Game System - Version ${me5e.version}\n${ME5E.ASCII}`);

  /** @deprecated */
  Object.defineProperty(me5e, "entities", {
    get() {
      foundry.utils.logCompatibilityWarning(
        "You are referencing the 'me5e.entities' property which has been deprecated and renamed to "
        + "'me5e.documents'. Support for this old path will be removed in a future version.",
        { since: "ME5e 2.0", until: "ME5e 2.2" }
      );
      return me5e.documents;
    }
  });

  /** @deprecated */
  Object.defineProperty(me5e, "rollItemMacro", {
    get() {
      foundry.utils.logCompatibilityWarning(
        "You are referencing the 'me5e.rollItemMacro' method which has been deprecated and renamed to "
        + "'me5e.documents.macro.rollItem'. Support for this old path will be removed in a future version.",
        { since: "ME5e 2.0", until: "ME5e 2.2" }
      );
      return me5e.documents.macro.rollItem;
    }
  });

  /** @deprecated */
  Object.defineProperty(me5e, "macros", {
    get() {
      foundry.utils.logCompatibilityWarning(
        "You are referencing the 'me5e.macros' property which has been deprecated and renamed to "
        + "'me5e.documents.macro'. Support for this old path will be removed in a future version.",
        { since: "ME5e 2.0", until: "ME5e 2.2" }
      );
      return me5e.documents.macro;
    }
  });

  // Record Configuration Values
  CONFIG.ME5E = ME5E;
  CONFIG.ActiveEffect.documentClass = documents.ActiveEffect5e;
  CONFIG.Actor.documentClass = documents.Actor5e;
  CONFIG.Item.documentClass = documents.Item5e;
  CONFIG.Token.documentClass = documents.TokenDocument5e;
  CONFIG.Token.objectClass = canvas.Token5e;
  CONFIG.time.roundTime = 6;
  CONFIG.Dice.DamageRoll = dice.DamageRoll;
  CONFIG.Dice.D20Roll = dice.D20Roll;
  CONFIG.MeasuredTemplate.defaults.angle = 53.13; // 5e cone RAW should be 53.13 degrees

  // Register System Settings
  registerSystemSettings();


  // Patch Core Functions
  CONFIG.Combat.initiative.formula = "1d20 + @attributes.init.mod + @attributes.init.prof + @attributes.init.bonus + @abilities.dex.bonuses.check + @bonuses.abilities.check";
  Combatant.prototype._getInitiativeFormula = documents.combat._getInitiativeFormula;

  // Register Roll Extensions
  CONFIG.Dice.rolls.push(dice.D20Roll);
  CONFIG.Dice.rolls.push(dice.DamageRoll);

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("me5e", applications.actor.ActorSheet5eCharacter, {
    types: ["character"],
    makeDefault: true,
    label: "ME5E.SheetClassCharacter"
  });
  Actors.registerSheet("me5e", applications.actor.ActorSheet5eNPC, {
    types: ["npc"],
    makeDefault: true,
    label: "ME5E.SheetClassNPC"
  });
  Actors.registerSheet("me5e", applications.actor.ActorSheet5eVehicle, {
    types: ["vehicle"],
    makeDefault: true,
    label: "ME5E.SheetClassVehicle"
  });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("me5e", applications.item.ItemSheet5e, {
    makeDefault: true,
    label: "ME5E.SheetClassItem"
  });

  // Preload Handlebars helpers & partials
  utils.registerHandlebarsHelpers();
  utils.preloadHandlebarsTemplates();
});


/* -------------------------------------------- */
/*  Foundry VTT Setup                           */
/* -------------------------------------------- */

/**
 * Prepare attribute lists.
 */
Hooks.once("setup", function() {
  CONFIG.ME5E.trackableAttributes = expandAttributeList(CONFIG.ME5E.trackableAttributes);
  CONFIG.ME5E.consumableResources = expandAttributeList(CONFIG.ME5E.consumableResources);
});

/* --------------------------------------------- */

/**
 * Expand a list of attribute paths into an object that can be traversed.
 * @param {string[]} attributes  The initial attributes configuration.
 * @returns {object}  The expanded object structure.
 */
function expandAttributeList(attributes) {
  return attributes.reduce((obj, attr) => {
    foundry.utils.setProperty(obj, attr, true);
    return obj;
  }, {});
}

/* --------------------------------------------- */

/**
 * Perform one-time pre-localization and sorting of some configuration objects
 */
Hooks.once("i18nInit", () => utils.performPreLocalization(CONFIG.ME5E));

/* -------------------------------------------- */
/*  Foundry VTT Ready                           */
/* -------------------------------------------- */

/**
 * Once the entire VTT framework is initialized, check to see if we should perform a data migration
 */
Hooks.once("ready", function() {

  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => documents.macro.create5eMacro(data, slot));

  // Determine whether a system migration is required and feasible
  if ( !game.user.isGM ) return;
  const cv = game.settings.get("me5e", "systemMigrationVersion");
  const totalDocuments = game.actors.size + game.scenes.size + game.items.size;
  if ( !cv && totalDocuments === 0 ) return game.settings.set("me5e", "systemMigrationVersion", game.system.version);
  if ( cv && !isNewerVersion(game.system.flags.needsMigrationVersion, cv) ) return;

  // Perform the migration
  if ( cv && isNewerVersion(game.system.flags.compatibleMigrationVersion, cv) ) {
    ui.notifications.error(game.i18n.localize("MIGRATION.5eVersionTooOldWarning"), {permanent: true});
  }
  migrations.migrateWorld();
});

/* -------------------------------------------- */
/*  Canvas Initialization                       */
/* -------------------------------------------- */

Hooks.on("canvasInit", gameCanvas => {
  gameCanvas.grid.diagonalRule = game.settings.get("me5e", "diagonalMovement");
  SquareGrid.prototype.measureDistances = canvas.measureDistances;
});

/* -------------------------------------------- */
/*  Other Hooks                                 */
/* -------------------------------------------- */

Hooks.on("renderChatMessage", documents.chat.onRenderChatMessage);
Hooks.on("getChatLogEntryContext", documents.chat.addChatMessageContextOptions);

Hooks.on("renderChatLog", (app, html, data) => documents.Item5e.chatListeners(html));
Hooks.on("renderChatPopout", (app, html, data) => documents.Item5e.chatListeners(html));

/* -------------------------------------------- */
/*  Bundled Module Exports                      */
/* -------------------------------------------- */

export {
  advancement,
  applications,
  canvas,
  dice,
  documents,
  migrations,
  utils,
  ME5E
};
