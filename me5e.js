/**
 * The ME5e game system for Foundry Virtual Tabletop
 * A system for playing the fifth edition of the worlds most popular roleplaying game.
 * Author: Atropos
 * Software License: GNU GPLv3
 * Content License: https://media.wizards.com/2016/downloads/DND/SRD-OGL_V5.1.pdf
 * Repository: https://gitlab.com/foundrynet/me5e
 * Issue Tracker: https://gitlab.com/foundrynet/me5e/issues
 */

// Import Modules
import {ME5E} from "./module/config.js";
import {registerSystemSettings} from "./module/settings.js";
import {preloadHandlebarsTemplates} from "./module/templates.js";
import {_getInitiativeFormula} from "./module/combat.js";
import {measureDistances} from "./module/canvas.js";

// Import Documents
import Actor5e from "./module/actor/entity.js";
import Item5e from "./module/item/entity.js";
import {TokenDocument5e, Token5e} from "./module/token.js";

// Import Applications
import AbilityTemplate from "./module/pixi/ability-template.js";
import AbilityUseDialog from "./module/apps/ability-use-dialog.js";
import ActorSheetFlags from "./module/apps/actor-flags.js";
import ActorSheet5eCharacter from "./module/actor/sheets/character.js";
import ActorSheet5eNPC from "./module/actor/sheets/npc.js";
import ActorSheet5eVehicle from "./module/actor/sheets/vehicle.js";
import ItemSheet5e from "./module/item/sheet.js";
import ShortRestDialog from "./module/apps/short-rest.js";
import TraitSelector from "./module/apps/trait-selector.js";
import ActorMovementConfig from "./module/apps/movement-config.js";
import ActorSensesConfig from "./module/apps/senses-config.js";

// Import Helpers
import * as chat from "./module/chat.js";
import * as dice from "./module/dice.js";
import * as macros from "./module/macros.js";
import * as migrations from "./module/migration.js";
import ActiveEffect5e from "./module/active-effect.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", function() {
    console.log(`ME5e | Initializing the ME5e Game System\n${ME5E.ASCII}`);

    // Create a namespace within the game global
    game.me5e = {
        applications: {
            AbilityUseDialog,
            ActorSheetFlags,
            ActorSheet5eCharacter,
            ActorSheet5eNPC,
            ActorSheet5eVehicle,
            ItemSheet5e,
            ShortRestDialog,
            TraitSelector,
            ActorMovementConfig,
            ActorSensesConfig
        },
        canvas: {
            AbilityTemplate
        },
        config: ME5E,
        dice: dice,
        entities: {
            Actor5e,
            Item5e,
            TokenDocument5e,
            Token5e
        },
        macros: macros,
        migrations: migrations,
        rollItemMacro: macros.rollItemMacro
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
    CONFIG.Combat.initiative.formula = "1d20 + @attributes.init.mod + @attributes.init.prof + @attributes.init.bonus";
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
    Actors.registerSheet('me5e', ActorSheet5eVehicle, {
        types: ['vehicle'],
        makeDefault: true,
        label: "ME5E.SheetClassVehicle"
    });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("me5e", ItemSheet5e, {
        makeDefault: true,
        label: "ME5E.SheetClassItem"
    });

    // Preload Handlebars Templates
    return preloadHandlebarsTemplates();
});


/* -------------------------------------------- */
/*  Foundry VTT Setup                           */
/* -------------------------------------------- */

/**
 * This function runs after game data has been requested and loaded from the servers, so entities exist
 */
Hooks.once("setup", function() {

    // Localize CONFIG objects once up-front
    const toLocalize = [
        "abilities", "abilityAbbreviations", "abilityActivationTypes", "abilityConsumptionTypes", "actorSizes", "alignments",
        "armorClasses", "armorProficiencies", "conditionTypes", "consumableTypes", "cover", "currencies", "damageResistanceTypes",
        "damageTypes", "distanceUnits", "equipmentTypes", "healingTypes", "itemActionTypes", "itemRarity", "languages",
        "limitedUsePeriods", "movementTypes", "movementUnits", "polymorphSettings", "proficiencyLevels", "senses", "skills", "shipTypes",
        "spellPreparationModes", "spellScalingModes", "spellSchools", "targetTypes", "timePeriods", "toolProficiencies", "toolTypes",
        "vehicleTypes", "weaponProficiencies", "weaponProperties", "weaponTypes"
    ];

    // Exclude some from sorting where the default order matters
    const noSort = [
        "abilities", "alignments", "armorClasses", "armorProficiencies", "currencies", "distanceUnits", "movementUnits",
        "itemActionTypes", "itemRarity", "proficiencyLevels", "limitedUsePeriods",
        "spellPreparationModes", "weaponProficiencies", "weaponTypes"
    ];

    // Localize and sort CONFIG objects
    for(let o of toLocalize) {
        const localized = Object.entries(CONFIG.ME5E[o]).map(([k, v]) => {
            if(v.label) v.label = game.i18n.localize(v.label);
            if(typeof v === "string") return [k, game.i18n.localize(v)];
            return [k, v];
        });
        if(!noSort.includes(o)) localized.sort((a, b) =>
            (a[1].label ?? a[1]).localeCompare(b[1].label ?? b[1])
        );
        CONFIG.ME5E[o] = localized.reduce((obj, e) => {
            obj[e[0]] = e[1];
            return obj;
        }, {});
    }
});

/* -------------------------------------------- */

/**
 * Once the entire VTT framework is initialized, check to see if we should perform a data migration
 */
Hooks.once("ready", function() {

    // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
    Hooks.on("hotbarDrop", (bar, data, slot) => macros.create5eMacro(data, slot));

    // Determine whether a system migration is required and feasible
    if(!game.user.isGM) return;
    const currentVersion = game.settings.get("me5e", "systemMigrationVersion");
    const NEEDS_MIGRATION_VERSION = "1.4.1";
    const COMPATIBLE_MIGRATION_VERSION = 0.80;
    const totalDocuments = game.actors.size + game.scenes.size + game.items.size;
    if(!currentVersion && totalDocuments === 0) return game.settings.set("me5e", "systemMigrationVersion", game.system.data.version);
    const needsMigration = !currentVersion || isNewerVersion(NEEDS_MIGRATION_VERSION, currentVersion);
    if(!needsMigration) return;

    // Perform the migration
    if(currentVersion && isNewerVersion(COMPATIBLE_MIGRATION_VERSION, currentVersion)) {
        const warning = `Your ME5e system data is from too old a Foundry version and cannot be reliably migrated to the latest version. The process will be attempted, but errors may occur.`;
        ui.notifications.error(warning, {permanent: true});
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
    if(game.settings.get("me5e", "autoCollapseItemCards")) html.find(".card-content").hide();
});
Hooks.on("getChatLogEntryContext", chat.addChatMessageContextOptions);
Hooks.on("renderChatLog", (app, html, data) => Item5e.chatListeners(html));
Hooks.on("renderChatPopout", (app, html, data) => Item5e.chatListeners(html));
Hooks.on('getActorDirectoryEntryContext', Actor5e.addDirectoryContextOptions);

// FIXME: This helper is needed for the vehicle sheet. It should probably be refactored.
Handlebars.registerHelper('getProperty', function(data, property) {
    return getProperty(data, property);
});
