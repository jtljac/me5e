/**
 * The ME5e game system for Foundry Virtual Tabletop
 * A system for playing the fifth edition of the worlds most popular roleplaying game.
 * Author: jtljac
 * Software License: GNU GPLv3
 * Repository: https://gitlab.com/foundrynet/me5e
 * Issue Tracker: https://gitlab.com/foundrynet/me5e/issues
 */

// Import Modules
import { ME5E } from "./module/config.js";
import { registerSystemSettings } from "./module/settings.js";
import { preloadHandlebarsTemplates, registerHandlebarsHelpers } from "./module/templates.js";
import { _getInitiativeFormula } from "./module/combat.js";
import { measureDistances } from "./module/canvas.js";

// Import Documents
// Actors
import Actor5e from "./module/actor/entity.js";

// Items
import Item5e from "./module/item/base.js";

import { TokenDocument5e, Token5e } from "./module/token.js";
import ActiveEffect5e from "./module/active-effect.js";

// Import Applications
import AbilityTemplate from "./module/pixi/ability-template.js";
import AbilityUseDialog from "./module/apps/ability-use-dialog.js";
import ActorAbilityConfig from "./module/apps/ability-config.js";
import ActorArmorConfig from "./module/apps/actor-armor.js";
import ActorHitDiceConfig from "./module/apps/hit-dice-config.js";
import ActorInitConfig from "./module/apps/init-config.js";
import ActorMovementConfig from "./module/apps/movement-config.js";
import ActorSensesConfig from "./module/apps/senses-config.js";
import ActorSheetFlags from "./module/apps/actor-flags.js";
import ActorSheet5eCharacter from "./module/actor/sheets/character.js";
import ActorSheet5eNPC from "./module/actor/sheets/npc.js";
import ActorSheet5eVehicle from "./module/actor/sheets/vehicle.js";
import ActorSkillConfig from "./module/apps/skill-config.js";
import ActorTypeConfig from "./module/apps/actor-type.js";
import ItemSheet5e from "./module/item/sheet.js";
import LongRestDialog from "./module/apps/long-rest.js";
import ProficiencySelector from "./module/apps/proficiency-selector.js";
import ShortRestDialog from "./module/apps/short-rest.js";
import TraitSelector from "./module/apps/trait-selector.js";

// Import Helpers
import advancement from "./module/advancement.js";
import * as chat from "./module/chat.js";
import * as dice from "./module/dice.js";
import * as macros from "./module/macros.js";
import * as migrations from "./module/migration.js";
import * as utils from "./module/utils.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", function() {
  console.log(`ME5e | Initializing the ME5e Game System\n${ME5E.ASCII}`);

  // Create a namespace within the game global
  game.me5e = {
    advancement,
    applications: {
      AbilityUseDialog,
      ActorAbilityConfig,
      ActorArmorConfig,
      ActorHitDiceConfig,
      ActorInitConfig,
      ActorMovementConfig,
      ActorSensesConfig,
      ActorSheetFlags,
      ActorSheet5eCharacter,
      ActorSheet5eNPC,
      ActorSheet5eVehicle,
      ActorSkillConfig,
      ActorTypeConfig,
      ItemSheet5e,
      LongRestDialog,
      ProficiencySelector,
      ShortRestDialog,
      TraitSelector
    },
    canvas: {
      AbilityTemplate
    },
    config: ME5E,
    dice,
    entities: {
      Actor5e,
      Item5e,
      TokenDocument5e,
      Token5e
    },
    macros,
    migrations,
    rollItemMacro: macros.rollItem,
    utils,
    isV9: !foundry.utils.isNewerVersion("9.224", game.version)
  };

  // Record Configuration Values
  CONFIG.ME5E = ME5E;
  CONFIG.ActiveEffect.documentClass = ActiveEffect5e;
  CONFIG.Actor.documentClass = Actor5e;
  CONFIG.Item.documentClass = Item5e;

  CONFIG.Token.documentClass = TokenDocument5e;
  CONFIG.Token.objectClass = Token5e;
  CONFIG.time.roundTime = 6;

  CONFIG.Dice.DamageRoll = dice.DamageRoll;
  CONFIG.Dice.D20Roll = dice.D20Roll;

  // 5e cone RAW should be 53.13 degrees
  CONFIG.MeasuredTemplate.defaults.angle = 53.13;

  // Register System Settings
  registerSystemSettings();

  // Patch Core Functions
  CONFIG.Combat.initiative.formula = "1d20 + @attributes.init.mod + @attributes.init.prof + @attributes.init.bonus + @abilities.dex.bonuses.check + @bonuses.abilities.check";
  Combatant.prototype._getInitiativeFormula = _getInitiativeFormula;

  // Register Roll Extensions
  CONFIG.Dice.rolls.push(dice.D20Roll);
  CONFIG.Dice.rolls.push(dice.DamageRoll);

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("me5e", ActorSheet5eCharacter, {
    types: ["character"],
    makeDefault: true,
    label: "ME5E.SheetClassCharacter"
  });
  Actors.registerSheet("me5e", ActorSheet5eNPC, {
    types: ["npc"],
    makeDefault: true,
    label: "ME5E.SheetClassNPC"
  });
  Actors.registerSheet("me5e", ActorSheet5eVehicle, {
    types: ["vehicle"],
    makeDefault: true,
    label: "ME5E.SheetClassVehicle"
  });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("me5e", ItemSheet5e, {
    makeDefault: true,
    label: "ME5E.SheetClassItem"
  });

  // Preload Handlebars helpers & partials
  registerHandlebarsHelpers();
  preloadHandlebarsTemplates();
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
  Hooks.on("hotbarDrop", (bar, data, slot) => macros.create5eMacro(data, slot));

  // Determine whether a system migration is required and feasible
  if ( !game.user.isGM ) return;
  const currentVersion = game.settings.get("me5e", "systemMigrationVersion");
  const NEEDS_MIGRATION_VERSION = "1.6.0";
  const COMPATIBLE_MIGRATION_VERSION = 0.80;
  const totalDocuments = game.actors.size + game.scenes.size + game.items.size;
  if ( !currentVersion && totalDocuments === 0 ) return game.settings.set("me5e", "systemMigrationVersion", game.system.data.version);
  const needsMigration = !currentVersion || isNewerVersion(NEEDS_MIGRATION_VERSION, currentVersion);
  if ( !needsMigration ) return;

  // Perform the migration
  if ( currentVersion && isNewerVersion(COMPATIBLE_MIGRATION_VERSION, currentVersion) ) {
    ui.notifications.error(game.i18n.localize("MIGRATION.5eVersionTooOldWarning"), {permanent: true});
  }
  migrations.migrateWorld();
});

/* -------------------------------------------- */
/*  Canvas Initialization                       */
/* -------------------------------------------- */

Hooks.on("canvasInit", function() {
  // Extend Diagonal Measurement
  canvas.grid.diagonalRule = game.settings.get("me5e", "diagonalMovement");
  SquareGrid.prototype.measureDistances = measureDistances;
});


/* -------------------------------------------- */
/*  Other Hooks                                 */
/* -------------------------------------------- */

Hooks.on("renderChatMessage", (app, html, data) => {

  // Display action buttons
  chat.displayChatActionButtons(app, html, data);

  // Highlight critical success or failure die
  chat.highlightCriticalSuccessFailure(app, html, data);

  // Optionally collapse the content
  if (game.settings.get("me5e", "autoCollapseItemCards")) html.find(".card-content").hide();
});
Hooks.on("getChatLogEntryContext", chat.addChatMessageContextOptions);
Hooks.on("renderChatLog", (app, html, data) => Item5e.chatListeners(html));
Hooks.on("renderChatPopout", (app, html, data) => Item5e.chatListeners(html));
Hooks.on("getActorDirectoryEntryContext", Actor5e.addDirectoryContextOptions);
