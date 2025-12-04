/**
 * The Mass Effect 5e game system for Foundry Virtual Tabletop
 * A system for playing the Mass Effect Total conversion of DnD5e.
 * Author: jtljac
 * Software License: MIT
 * Content License: https://www.dndbeyond.com/attachments/39j2li89/SRD5.1-CCBY4.0License.pdf
 *                  https://data.n7.world/OGL
 * Repository: https://github.com/jtljac/me5e
 * Issue Tracker: https://github.com/jtljac/me5e/issues
 */

// Import Configuration
import ME5E from "./module/config.mjs";
import {
  applyLegacyRules, registerDeferredSettings, registerSystemKeybindings, registerSystemSettings
} from "./module/settings.mjs";

// Import Submodules
import * as applications from "./module/applications/_module.mjs";
import * as canvas from "./module/canvas/_module.mjs";
import * as dataModels from "./module/data/_module.mjs";
import * as dice from "./module/dice/_module.mjs";
import * as documents from "./module/documents/_module.mjs";
import * as enrichers from "./module/enrichers.mjs";
import * as Filter from "./module/filter.mjs";
import * as migrations from "./module/migration.mjs";
import ModuleArt from "./module/module-art.mjs";
import { registerModuleData, registerModuleRedirects, setupModulePacks } from "./module/module-registration.mjs";
import { default as registry } from "./module/registry.mjs";
import Tooltips5e from "./module/tooltips.mjs";
import * as utils from "./module/utils.mjs";
import DragDrop5e from "./module/drag-drop.mjs";

/* -------------------------------------------- */
/*  Define Module Structure                     */
/* -------------------------------------------- */

globalThis.me5e = {
  applications,
  canvas,
  config: ME5E,
  dataModels,
  dice,
  documents,
  enrichers,
  Filter,
  migrations,
  registry,
  ui: {},
  utils
};

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", function() {
  globalThis.me5e = game.me5e = Object.assign(game.system, globalThis.me5e);
  utils.log(`Initializing the ME5E Game System - Version ${me5e.version}\n${ME5E.ASCII}`);

  // Record Configuration Values
  CONFIG.ME5E = ME5E;
  CONFIG.ActiveEffect.documentClass = documents.ActiveEffect5e;
  CONFIG.ActiveEffect.legacyTransferral = false;
  CONFIG.Actor.collection = dataModels.collection.Actors5e;
  CONFIG.Actor.documentClass = documents.Actor5e;
  CONFIG.Adventure.documentClass = documents.Adventure5e;
  CONFIG.Canvas.layers.tokens.layerClass = CONFIG.Token.layerClass = canvas.layers.TokenLayer5e;
  CONFIG.ChatMessage.documentClass = documents.ChatMessage5e;
  CONFIG.Combat.documentClass = documents.Combat5e;
  CONFIG.Combatant.documentClass = documents.Combatant5e;
  CONFIG.CombatantGroup.documentClass = documents.CombatantGroup5e;
  CONFIG.Item.collection = dataModels.collection.Items5e;
  CONFIG.Item.compendiumIndexFields.push("system.container", "system.identifier");
  CONFIG.Item.documentClass = documents.Item5e;
  CONFIG.JournalEntryPage.documentClass = documents.JournalEntryPage5e;
  CONFIG.Token.documentClass = documents.TokenDocument5e;
  CONFIG.Token.objectClass = canvas.Token5e;
  CONFIG.Token.rulerClass = canvas.TokenRuler5e;
  CONFIG.Token.movement.TerrainData = dataModels.TerrainData5e;
  CONFIG.User.documentClass = documents.User5e;
  CONFIG.time.roundTime = 6;
  Roll.TOOLTIP_TEMPLATE = "systems/me5e/templates/chat/roll-breakdown.hbs";
  CONFIG.Dice.BasicRoll = dice.BasicRoll;
  CONFIG.Dice.DamageRoll = dice.DamageRoll;
  CONFIG.Dice.D20Die = dice.D20Die;
  CONFIG.Dice.D20Roll = dice.D20Roll;
  CONFIG.MeasuredTemplate.defaults.angle = 53.13; // 5e cone RAW should be 53.13 degrees
  CONFIG.Note.objectClass = canvas.Note5e;
  CONFIG.ui.chat = applications.ChatLog5e;
  CONFIG.ui.combat = applications.combat.CombatTracker5e;
  CONFIG.ui.items = applications.item.ItemDirectory5e;
  CONFIG.ux.DragDrop = DragDrop5e;

  // Register System Settings
  registerSystemSettings();
  registerSystemKeybindings();

  // Configure module art
  game.me5e.moduleArt = new ModuleArt();

  // Configure bastions
  game.me5e.bastion = new documents.Bastion();

  // Configure tooltips
  game.me5e.tooltips = new Tooltips5e();

  // Remove honor & sanity from configuration if they aren't enabled
  if ( !game.settings.get("me5e", "honorScore") ) delete ME5E.abilities.hon;
  if ( !game.settings.get("me5e", "sanityScore") ) delete ME5E.abilities.san;

  // Legacy rules.
  if ( game.settings.get("me5e", "rulesVersion") === "legacy" ) applyLegacyRules();

  // Register system
  ME5E.SPELL_LISTS.forEach(uuid => me5e.registry.spellLists.register(uuid));

  // Register module data from manifests
  registerModuleData();
  registerModuleRedirects();

  // Register Roll Extensions
  CONFIG.Dice.rolls = [dice.BasicRoll, dice.D20Roll, dice.DamageRoll];

  // Hook up system data types
  CONFIG.ActiveEffect.dataModels = dataModels.activeEffect.config;
  CONFIG.Actor.dataModels = dataModels.actor.config;
  CONFIG.ChatMessage.dataModels = dataModels.chatMessage.config;
  CONFIG.Item.dataModels = dataModels.item.config;
  CONFIG.JournalEntryPage.dataModels = dataModels.journal.config;
  Object.assign(CONFIG.RegionBehavior.dataModels, dataModels.regionBehavior.config);
  Object.assign(CONFIG.RegionBehavior.typeIcons, dataModels.regionBehavior.icons);

  // Add fonts
  _configureFonts();

  // Register sheet application classes
  const DocumentSheetConfig = foundry.applications.apps.DocumentSheetConfig;
  DocumentSheetConfig.unregisterSheet(Actor, "core", foundry.appv1.sheets.ActorSheet);
  DocumentSheetConfig.registerSheet(Actor, "me5e", applications.actor.CharacterActorSheet, {
    types: ["character"],
    makeDefault: true,
    label: "ME5E.SheetClass.Character"
  });
  DocumentSheetConfig.registerSheet(Actor, "me5e", applications.actor.NPCActorSheet, {
    types: ["npc"],
    makeDefault: true,
    label: "ME5E.SheetClass.NPC"
  });
  DocumentSheetConfig.registerSheet(Actor, "me5e", applications.actor.VehicleActorSheet, {
    types: ["vehicle"],
    makeDefault: true,
    label: "ME5E.SheetClass.Vehicle"
  });
  DocumentSheetConfig.registerSheet(Actor, "me5e", applications.actor.GroupActorSheet, {
    types: ["group"],
    makeDefault: true,
    label: "ME5E.SheetClass.Group"
  });
  DocumentSheetConfig.registerSheet(Actor, "me5e", applications.actor.EncounterActorSheet, {
    types: ["encounter"],
    makeDefault: true,
    label: "ME5E.SheetClass.Encounter"
  });

  DocumentSheetConfig.unregisterSheet(Item, "core", foundry.appv1.sheets.ItemSheet);
  DocumentSheetConfig.registerSheet(Item, "me5e", applications.item.ItemSheet5e, {
    makeDefault: true,
    label: "ME5E.SheetClass.Item"
  });
  DocumentSheetConfig.unregisterSheet(Item, "me5e", applications.item.ItemSheet5e, { types: ["container"] });
  DocumentSheetConfig.registerSheet(Item, "me5e", applications.item.ContainerSheet, {
    makeDefault: true,
    types: ["container"],
    label: "ME5E.SheetClass.Container"
  });

  DocumentSheetConfig.registerSheet(JournalEntry, "me5e", applications.journal.JournalEntrySheet5e, {
    makeDefault: true,
    label: "ME5E.SheetClass.JournalEntry"
  });
  DocumentSheetConfig.registerSheet(JournalEntry, "me5e", applications.journal.JournalSheet5e, {
    makeDefault: false,
    canConfigure: false,
    canBeDefault: false,
    label: "ME5E.SheetClass.JournalEntrySheetLegacy"
  });
  DocumentSheetConfig.registerSheet(JournalEntryPage, "me5e", applications.journal.JournalClassPageSheet, {
    label: "ME5E.SheetClass.ClassSummary",
    types: ["class", "subclass"]
  });
  DocumentSheetConfig.registerSheet(JournalEntryPage, "me5e", applications.journal.JournalMapLocationPageSheet, {
    label: "ME5E.SheetClass.MapLocation",
    types: ["map"]
  });
  DocumentSheetConfig.registerSheet(JournalEntryPage, "me5e", applications.journal.JournalRulePageSheet, {
    label: "ME5E.SheetClass.Rule",
    types: ["rule"]
  });
  DocumentSheetConfig.registerSheet(JournalEntryPage, "me5e", applications.journal.JournalSpellListPageSheet, {
    label: "ME5E.SheetClass.SpellList",
    types: ["spells"]
  });

  DocumentSheetConfig.unregisterSheet(RegionBehavior, "core", foundry.applications.sheets.RegionBehaviorConfig, {
    types: ["me5e.difficultTerrain", "me5e.rotateArea"]
  });
  DocumentSheetConfig.registerSheet(RegionBehavior, "me5e", applications.regionBehavior.DifficultTerrainConfig, {
    label: "ME5E.SheetClass.DifficultTerrain",
    types: ["me5e.difficultTerrain"]
  });
  DocumentSheetConfig.registerSheet(RegionBehavior, "me5e", applications.regionBehavior.RotateAreaConfig, {
    label: "ME5E.SheetClass.RotateArea",
    types: ["me5e.rotateArea"]
  });

  CONFIG.Token.prototypeSheetClass = applications.PrototypeTokenConfig5e;
  DocumentSheetConfig.unregisterSheet(TokenDocument, "core", foundry.applications.sheets.TokenConfig);
  DocumentSheetConfig.registerSheet(TokenDocument, "me5e", applications.TokenConfig5e, {
    label: "ME5E.SheetClass.Token"
  });

  // Preload Handlebars helpers & partials
  utils.registerHandlebarsHelpers();
  utils.preloadHandlebarsTemplates();

  // Enrichers
  enrichers.registerCustomEnrichers();

  // Exhaustion handling
  documents.ActiveEffect5e.registerHUDListeners();

  // Set up token movement actions
  documents.TokenDocument5e.registerMovementActions();

  // Custom movement cost aggregator
  CONFIG.Token.movement.costAggregator = (results, distance, segment) => {
    return Math.max(...results.map(i => i.cost));
  };

  // Setup Calendar
  _configureCalendar();
});

/* -------------------------------------------- */

/**
 * Configure world calendar based on setting.
 */
function _configureCalendar() {
  CONFIG.time.earthCalendarClass = dataModels.calendar.CalendarData5e;
  CONFIG.time.worldCalendarClass = dataModels.calendar.CalendarData5e;

  /**
   * A hook event that fires during the `init` step to give modules a chance to customize the calendar
   * configuration before loading the world calendar.
   * @function me5e.preSetupCalendar
   * @memberof hookEvents
   * @returns               Explicitly return `false` to prevent system from setting up the calendar.
   */
  if ( Hooks.call("me5e.setupCalendar") === false ) return;

  const calendar = game.settings.get("me5e", "calendar");
  const calendarConfig = CONFIG.ME5E.calendar.calendars.find(c => c.value === calendar);
  if ( calendarConfig ) {
    CONFIG.time.worldCalendarConfig = calendarConfig.config;
    if ( calendarConfig.class ) CONFIG.time.worldCalendarClass = calendarConfig.class;
  }
}

/* -------------------------------------------- */

/**
 * Configure explicit lists of attributes that are trackable on the token HUD and in the combat tracker.
 * @internal
 */
function _configureTrackableAttributes() {
  const common = {
    bar: [],
    value: [
      ...Object.keys(ME5E.abilities).map(ability => `abilities.${ability}.value`),
      ...Object.keys(ME5E.movementTypes).map(movement => `attributes.movement.${movement}`),
      "attributes.ac.value", "attributes.init.total"
    ]
  };

  const creature = {
    bar: [
      ...common.bar,
      "attributes.hp",
      ..._trackedSpellAttributes()
    ],
    value: [
      ...common.value,
      ...Object.keys(ME5E.skills).map(skill => `skills.${skill}.passive`),
      ...Object.keys(ME5E.senses).map(sense => `attributes.senses.${sense}`),
      "attributes.hp.temp", "attributes.spell.attack", "attributes.spell.dc"
    ]
  };

  CONFIG.Actor.trackableAttributes = {
    character: {
      bar: [...creature.bar, "resources.primary", "resources.secondary", "resources.tertiary", "details.xp"],
      value: [...creature.value]
    },
    npc: {
      bar: [...creature.bar, "resources.legact", "resources.legres"],
      value: [...creature.value, "attributes.spell.level", "details.cr", "details.xp.value"]
    },
    vehicle: {
      bar: [...common.bar, "attributes.hp"],
      value: [...common.value]
    },
    group: {
      bar: [],
      value: []
    }
  };
}

/* -------------------------------------------- */

/**
 * Get all trackable spell slot attributes.
 * @param {string} [suffix=""]  Suffix appended to the path.
 * @returns {Set<string>}
 * @internal
 */
function _trackedSpellAttributes(suffix="") {
  return Object.entries(ME5E.spellcasting).reduce((acc, [k, v]) => {
    if ( v.slots ) Array.fromRange(Object.keys(ME5E.spellLevels).length - 1, 1).forEach(l => {
      acc.add(`spells.${v.getSpellSlotKey(l)}${suffix}`);
    });
    return acc;
  }, new Set());
}

/* -------------------------------------------- */

/**
 * Configure which attributes are available for item consumption.
 * @internal
 */
function _configureConsumableAttributes() {
  CONFIG.ME5E.consumableResources = [
    ...Object.keys(ME5E.abilities).map(ability => `abilities.${ability}.value`),
    "attributes.ac.flat",
    "attributes.hp.value",
    "attributes.exhaustion",
    ...Object.keys(ME5E.senses).map(sense => `attributes.senses.${sense}`),
    ...Object.keys(ME5E.movementTypes).map(type => `attributes.movement.${type}`),
    ...Object.keys(ME5E.currencies).map(denom => `currency.${denom}`),
    "details.xp.value",
    "resources.primary.value", "resources.secondary.value", "resources.tertiary.value",
    "resources.legact.value", "resources.legres.value", "attributes.actions.value",
    ..._trackedSpellAttributes(".value")
  ];
}

/* -------------------------------------------- */

/**
 * Configure additional system fonts.
 */
function _configureFonts() {
  Object.assign(CONFIG.fontDefinitions, {
    Roboto: {
      editor: true,
      fonts: [
        { urls: ["systems/me5e/fonts/roboto/Roboto-Regular.woff2"] },
        { urls: ["systems/me5e/fonts/roboto/Roboto-Bold.woff2"], weight: "bold" },
        { urls: ["systems/me5e/fonts/roboto/Roboto-Italic.woff2"], style: "italic" },
        { urls: ["systems/me5e/fonts/roboto/Roboto-BoldItalic.woff2"], weight: "bold", style: "italic" }
      ]
    },
    "Roboto Condensed": {
      editor: true,
      fonts: [
        { urls: ["systems/me5e/fonts/roboto-condensed/RobotoCondensed-Regular.woff2"] },
        { urls: ["systems/me5e/fonts/roboto-condensed/RobotoCondensed-Bold.woff2"], weight: "bold" },
        { urls: ["systems/me5e/fonts/roboto-condensed/RobotoCondensed-Italic.woff2"], style: "italic" },
        {
          urls: ["systems/me5e/fonts/roboto-condensed/RobotoCondensed-BoldItalic.woff2"], weight: "bold",
          style: "italic"
        }
      ]
    },
    "Roboto Slab": {
      editor: true,
      fonts: [
        { urls: ["systems/me5e/fonts/roboto-slab/RobotoSlab-Regular.ttf"] },
        { urls: ["systems/me5e/fonts/roboto-slab/RobotoSlab-Bold.ttf"], weight: "bold" }
      ]
    }
  });
}

/* -------------------------------------------- */

/**
 * Configure system status effects.
 */
function _configureStatusEffects() {
  const addEffect = (effects, {special, ...data}) => {
    data = foundry.utils.deepClone(data);
    data._id = utils.staticID(`me5e${data.id}`);
    data.order ??= Infinity;
    effects.push(data);
    if ( special ) CONFIG.specialStatusEffects[special] = data.id;
    if ( data.neverBlockMovement ) ME5E.neverBlockStatuses.add(data.id);
  };
  CONFIG.statusEffects = Object.entries(CONFIG.ME5E.statusEffects).reduce((arr, [id, data]) => {
    const original = CONFIG.statusEffects.find(s => s.id === id);
    addEffect(arr, foundry.utils.mergeObject(original ?? {}, { id, ...data }, { inplace: false }));
    return arr;
  }, []);
  for ( const [id, data] of Object.entries(CONFIG.ME5E.conditionTypes) ) {
    addEffect(CONFIG.statusEffects, { id, ...data });
  }
  for ( const [id, data] of Object.entries(CONFIG.ME5E.encumbrance.effects) ) {
    addEffect(CONFIG.statusEffects, { id, ...data, hud: false });
  }
}

/* -------------------------------------------- */
/*  Foundry VTT Setup                           */
/* -------------------------------------------- */

/**
 * Prepare attribute lists.
 */
Hooks.once("setup", function() {
  // Configure trackable & consumable attributes.
  _configureTrackableAttributes();
  _configureConsumableAttributes();

  CONFIG.ME5E.trackableAttributes = expandAttributeList(CONFIG.ME5E.trackableAttributes);
  game.me5e.moduleArt.registerModuleArt();
  Tooltips5e.activateListeners();
  game.me5e.tooltips.observe();

  // Register settings after modules have had a chance to initialize
  registerDeferredSettings();

  // Set up compendiums with custom applications & sorting
  setupModulePacks();

  // Create CSS for currencies
  const style = document.createElement("style");
  const currencies = append => Object.entries(CONFIG.ME5E.currencies)
    .map(([key, { icon }]) => `&.${key}${append ?? ""} { background-image: url("${icon}"); }`);
  style.innerHTML = `
    :is(.me5e2, .me5e2-journal) :is(i, span).currency {
      ${currencies().join("\n")}
    }
    .me5e2 .form-group label.label-icon.currency {
      ${currencies("::after").join("\n")}
    }
  `;
  document.head.append(style);
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
Hooks.once("i18nInit", () => {
  // Set up status effects. Explicitly performed after init and before prelocalization.
  _configureStatusEffects();

  if ( game.settings.get("me5e", "rulesVersion") === "legacy" ) {
    const { translations, _fallback } = game.i18n;
    foundry.utils.mergeObject(translations, {
      "TYPES.Item": {
        race: game.i18n.localize("TYPES.Item.raceLegacy"),
        racePl: game.i18n.localize("TYPES.Item.raceLegacyPl")
      },
      ME5E: {
        "Feature.Class.ArtificerPlan": game.i18n.localize("ME5E.Feature.Class.ArtificerInfusion"),
        "Feature.Species": game.i18n.localize("ME5E.Feature.SpeciesLegacy"),
        FlagsAlertHint: game.i18n.localize("ME5E.FlagsAlertHintLegacy"),
        ItemSpeciesDetails: game.i18n.localize("ME5E.ItemSpeciesDetailsLegacy"),
        "Language.Category.Rare": game.i18n.localize("ME5E.Language.Category.Exotic"),
        "MOVEMENT.Type.Speed": game.i18n.localize("ME5E.MOVEMENT.Type.Walk"),
        RacialTraits: game.i18n.localize("ME5E.RacialTraitsLegacy"),
        "REST.Long.Hint.Normal": game.i18n.localize("ME5E.REST.Long.Hint.NormalLegacy"),
        "REST.Long.Hint.Group": game.i18n.localize("ME5E.REST.Long.Hint.GroupLegacy"),
        "Species.Add": game.i18n.localize("ME5E.Species.AddLegacy"),
        "Species.Features": game.i18n.localize("ME5E.Species.FeaturesLegacy"),
        "TARGET.Type.Emanation": foundry.utils.mergeObject(
          _fallback.ME5E?.TARGET?.Type?.Radius ?? {},
          translations.ME5E?.TARGET?.Type?.Radius ?? {},
          { inplace: false }
        ),
        TraitArmorPlural: foundry.utils.mergeObject(
          _fallback.ME5E?.TraitArmorLegacyPlural ?? {},
          translations.ME5E?.TraitArmorLegacyPlural ?? {},
          { inplace: false }
        ),
        TraitArmorProf: game.i18n.localize("ME5E.TraitArmorLegacyProf")
      }
    });
  }
  utils.performPreLocalization(CONFIG.ME5E);
  Object.values(CONFIG.ME5E.activityTypes).forEach(c => c.documentClass.localize());
  Object.values(CONFIG.ME5E.advancementTypes).forEach(c => c.documentClass.localize());
  foundry.helpers.Localization.localizeDataModel(dataModels.settings.CalendarConfigSetting);
  foundry.helpers.Localization.localizeDataModel(dataModels.settings.CalendarPreferencesSetting);
  foundry.helpers.Localization.localizeDataModel(dataModels.settings.TransformationSetting);

  // Spellcasting
  dataModels.spellcasting.SpellcastingModel.fromConfig();
});

/* -------------------------------------------- */
/*  Foundry VTT Ready                           */
/* -------------------------------------------- */

/**
 * Once the entire VTT framework is initialized, check to see if we should perform a data migration
 */
Hooks.once("ready", function() {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => {
    if ( ["ActiveEffect", "Activity", "Item"].includes(data.type) ) {
      documents.macro.create5eMacro(data, slot);
      return false;
    }
  });

  // Adjust sourced items on actors now that compendium UUID redirects have been initialized
  game.actors.forEach(a => a.sourcedItems._redirectKeys());

  // Register items by type
  me5e.registry.classes.initialize();
  me5e.registry.subclasses.initialize();

  // Chat message listeners
  documents.ChatMessage5e.activateListeners();

  // Bastion initialization
  game.me5e.bastion.initializeUI();

  // Display the calendar HUD
  if ( CONFIG.ME5E.calendar.application ) {
    me5e.ui.calendar = new CONFIG.ME5E.calendar.application();
    me5e.ui.calendar.render({ force: true });
  }

  // Determine whether a system migration is required and feasible
  if ( !game.user.isGM ) return;
  const cv = game.settings.get("me5e", "systemMigrationVersion") || game.world.flags.me5e?.version;
  const totalDocuments = game.actors.size + game.scenes.size + game.items.size;
  if ( !cv && totalDocuments === 0 ) return game.settings.set("me5e", "systemMigrationVersion", game.system.version);
  if ( cv && !foundry.utils.isNewerVersion(game.system.flags.needsMigrationVersion, cv) ) return;

  // Perform the migration
  if ( cv && foundry.utils.isNewerVersion(game.system.flags.compatibleMigrationVersion, cv) ) {
    ui.notifications.error("MIGRATION.5eVersionTooOldWarning", {localize: true, permanent: true});
  }
  migrations.migrateWorld();
});

/* -------------------------------------------- */
/*  System Styling                              */
/* -------------------------------------------- */

Hooks.on("renderGamePause", (app, html) => {
  if ( Hooks.events.renderGamePause.length > 1 ) return;
  html.classList.add("me5e2");
  const container = document.createElement("div");
  container.classList.add("flexcol");
  container.append(...html.children);
  html.append(container);
  const img = html.querySelector("img");
  img.src = "systems/me5e/ui/official/ampersand.svg";
  img.className = "";
});

Hooks.on("renderSettings", (app, html) => applications.settings.sidebar.renderSettings(html));

/* -------------------------------------------- */
/*  Other Hooks                                 */
/* -------------------------------------------- */

Hooks.on("applyCompendiumArt", (documentClass, ...args) => documentClass.applyCompendiumArt?.(...args));

Hooks.on("renderChatPopout", documents.ChatMessage5e.onRenderChatPopout);
Hooks.on("getChatMessageContextOptions", documents.ChatMessage5e.addChatMessageContextOptions);

Hooks.on("renderChatLog", (app, html, data) => {
  documents.Item5e.chatListeners(html);
  documents.ChatMessage5e.onRenderChatLog(html);
});
Hooks.on("renderChatPopout", (app, html, data) => documents.Item5e.chatListeners(html));

Hooks.on("chatMessage", (app, message, data) => applications.Award.chatMessage(message));
Hooks.on("createChatMessage", dataModels.chatMessage.RequestMessageData.onCreateMessage);
Hooks.on("updateChatMessage", dataModels.chatMessage.RequestMessageData.onUpdateResultMessage);

Hooks.on("renderActorDirectory", (app, html, data) => documents.Actor5e.onRenderActorDirectory(html));

Hooks.on("getActorContextOptions", documents.Actor5e.addDirectoryContextOptions);
Hooks.on("getItemContextOptions", documents.Item5e.addDirectoryContextOptions);

Hooks.on("renderCompendiumDirectory", (app, html) => applications.CompendiumBrowser.injectSidebarButton(html));

Hooks.on("renderJournalEntryPageSheet", applications.journal.JournalEntrySheet5e.onRenderJournalPageSheet);

Hooks.on("renderActiveEffectConfig", documents.ActiveEffect5e.onRenderActiveEffectConfig);

Hooks.on("renderDocumentSheetConfig", (app, html) => {
  const { document } = app.options;
  if ( (document instanceof Actor) && document.system.isGroup ) {
    applications.actor.MultiActorSheet.addDocumentSheetConfigOptions(app, html);
  }
});

Hooks.on("targetToken", canvas.Token5e.onTargetToken);

Hooks.on("renderCombatTracker", (app, html, data) => app.renderGroups(html));

Hooks.on("preCreateScene", (doc, createData, options, userId) => {
  // Set default grid units based on metric length setting
  const units = utils.defaultUnits("length");
  if ( (units !== me5e.grid.units) && !foundry.utils.getProperty(createData, "grid.distance")
    && !foundry.utils.getProperty(createData, "grid.units") ) {
    doc.updateSource({
      grid: { distance: utils.convertLength(me5e.grid.distance, me5e.grid.units, units, { strict: false }), units }
    });
  }
});

Hooks.on("updateWorldTime", (...args) => {
  dataModels.calendar.CalendarData5e.onUpdateWorldTime(...args);
  CONFIG.ME5E.calendar.application?.onUpdateWorldTime?.(...args);
});

/* -------------------------------------------- */
/*  Bundled Module Exports                      */
/* -------------------------------------------- */

export {
  applications,
  canvas,
  dataModels,
  dice,
  documents,
  enrichers,
  Filter,
  migrations,
  registry,
  utils,
  ME5E
};
