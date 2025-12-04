import CompendiumBrowser from "./applications/compendium-browser.mjs";
import BastionSettingsConfig from "./applications/settings/bastion-settings.mjs";
import CalendarSettingsConfig from "./applications/settings/calendar-settings.mjs";
import CombatSettingsConfig from "./applications/settings/combat-settings.mjs";
import CompendiumBrowserSettingsConfig from "./applications/settings/compendium-browser-settings.mjs";
import ModuleArtSettingsConfig from "./applications/settings/module-art-settings.mjs";
import VariantRulesSettingsConfig from "./applications/settings/variant-rules-settings.mjs";
import VisibilitySettingsConfig from "./applications/settings/visibility-settings.mjs";
import BastionSetting from "./data/settings/bastion-setting.mjs";
import { CalendarConfigSetting, CalendarPreferencesSetting } from "./data/settings/calendar-setting.mjs";
import PrimaryPartySetting from "./data/settings/primary-party-setting.mjs";
import TransformationSetting from "./data/settings/transformation-setting.mjs";
import * as LEGACY from "./config-legacy.mjs";

const { StringField } = foundry.data.fields;

/**
 * Register all of the system's keybindings.
 */
export function registerSystemKeybindings() {
  game.keybindings.register("me5e", "skipDialogNormal", {
    name: "KEYBINDINGS.ME5E.SkipDialogNormal",
    editable: [{ key: "ShiftLeft" }, { key: "ShiftRight" }]
  });

  game.keybindings.register("me5e", "skipDialogAdvantage", {
    name: "KEYBINDINGS.ME5E.SkipDialogAdvantage",
    editable: [{ key: "AltLeft" }, { key: "AltRight" }]
  });

  game.keybindings.register("me5e", "skipDialogDisadvantage", {
    name: "KEYBINDINGS.ME5E.SkipDialogDisadvantage",
    editable: [{ key: "ControlLeft" }, { key: "ControlRight" }, { key: "OsLeft" }, { key: "OsRight" }]
  });

  game.keybindings.register("me5e", "dragCopy", {
    name: "KEYBINDINGS.ME5E.DragCopy",
    editable: [{ key: "ControlLeft" }, { key: "ControlRight" }, { key: "AltLeft" }, { key: "AltRight" }]
  });

  game.keybindings.register("me5e", "dragMove", {
    name: "KEYBINDINGS.ME5E.DragMove",
    editable: [{ key: "ShiftLeft" }, { key: "ShiftRight" }, { key: "OsLeft" }, { key: "OsRight" }]
  });
}

/* -------------------------------------------- */

/**
 * Register all of the system's settings.
 */
export function registerSystemSettings() {
  // Internal System Migration Version
  game.settings.register("me5e", "systemMigrationVersion", {
    name: "System Migration Version",
    scope: "world",
    config: false,
    type: String,
    default: ""
  });

  // Polymorph Settings
  game.settings.register("me5e", "transformationSettings", {
    scope: "client",
    config: false,
    type: TransformationSetting
  });

  // Rules version
  game.settings.register("me5e", "rulesVersion", {
    name: "SETTINGS.ME5E.RULESVERSION.Name",
    hint: "SETTINGS.ME5E.RULESVERSION.Hint",
    scope: "world",
    config: true,
    default: "modern",
    type: String,
    choices: {
      modern: "SETTINGS.ME5E.RULESVERSION.Modern",
      legacy: "SETTINGS.ME5E.RULESVERSION.Legacy"
    },
    requiresReload: true
  });

  // Movement automation
  game.settings.register("me5e", "movementAutomation", {
    name: "SETTINGS.ME5E.AUTOMATION.Movement.Name",
    hint: "SETTINGS.ME5E.AUTOMATION.Movement.Hint",
    scope: "world",
    config: true,
    default: "full",
    type: String,
    choices: {
      full: "SETTINGS.ME5E.AUTOMATION.Movement.Full",
      noBlocking: "SETTINGS.ME5E.AUTOMATION.Movement.NoBlocking",
      none: "SETTINGS.ME5E.AUTOMATION.Movement.None"
    }
  });

  // Allow rotating square templates
  game.settings.register("me5e", "gridAlignedSquareTemplates", {
    name: "SETTINGS.5eGridAlignedSquareTemplatesN",
    hint: "SETTINGS.5eGridAlignedSquareTemplatesL",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });

  // Loyalty
  game.settings.register("me5e", "loyaltyScore", {
    name: "SETTINGS.ME5E.LOYALTY.Name",
    hint: "SETTINGS.ME5E.LOYALTY.Hint",
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  // Disable Advancements
  game.settings.register("me5e", "disableAdvancements", {
    name: "SETTINGS.5eNoAdvancementsN",
    hint: "SETTINGS.5eNoAdvancementsL",
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  // Disable Concentration Tracking
  game.settings.register("me5e", "disableConcentration", {
    name: "SETTINGS.5eNoConcentrationN",
    hint: "SETTINGS.5eNoConcentrationL",
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  // Collapse Item Cards (by default)
  game.settings.register("me5e", "autoCollapseItemCards", {
    name: "SETTINGS.5eAutoCollapseCardN",
    hint: "SETTINGS.5eAutoCollapseCardL",
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
    onChange: s => {
      ui.chat.render();
    }
  });

  // Collapse Chat Card Trays
  game.settings.register("me5e", "autoCollapseChatTrays", {
    name: "SETTINGS.ME5E.COLLAPSETRAYS.Name",
    hint: "SETTINGS.ME5E.COLLAPSETRAYS.Hint",
    scope: "client",
    config: true,
    default: "older",
    type: String,
    choices: {
      manual: "SETTINGS.ME5E.COLLAPSETRAYS.Manual",
      never: "SETTINGS.ME5E.COLLAPSETRAYS.Never",
      older: "SETTINGS.ME5E.COLLAPSETRAYS.Older",
      always: "SETTINGS.ME5E.COLLAPSETRAYS.Always"
    }
  });

  // Allow Rests from Sheet
  game.settings.register("me5e", "allowRests", {
    name: "SETTINGS.ME5E.PERMISSIONS.AllowRests.Name",
    hint: "SETTINGS.ME5E.PERMISSIONS.AllowRests.Hint",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });

  // Allow Polymorphing
  game.settings.register("me5e", "allowPolymorphing", {
    name: "SETTINGS.ME5E.PERMISSIONS.AllowTransformation.Name",
    hint: "SETTINGS.ME5E.PERMISSIONS.AllowTransformation.Hint",
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  // Allow Summoning
  game.settings.register("me5e", "allowSummoning", {
    name: "SETTINGS.ME5E.PERMISSIONS.AllowSummoning.Name",
    hint: "SETTINGS.ME5E.PERMISSIONS.AllowSummoning.Hint",
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  // Metric Length Weights
  game.settings.register("me5e", "metricLengthUnits", {
    name: "SETTINGS.ME5E.METRIC.LengthUnits.Name",
    hint: "SETTINGS.ME5E.METRIC.LengthUnits.Hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  // Metric Volume Weights
  game.settings.register("me5e", "metricVolumeUnits", {
    name: "SETTINGS.ME5E.METRIC.VolumeUnits.Name",
    hint: "SETTINGS.ME5E.METRIC.VolumeUnits.Hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  // Metric Unit Weights
  game.settings.register("me5e", "metricWeightUnits", {
    name: "SETTINGS.ME5E.METRIC.WeightUnits.Name",
    hint: "SETTINGS.ME5E.METRIC.WeightUnits.Hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  // Strict validation
  game.settings.register("me5e", "strictValidation", {
    scope: "world",
    config: false,
    type: Boolean,
    default: true
  });

  // Dynamic art.
  game.settings.registerMenu("me5e", "moduleArtConfiguration", {
    name: "ME5E.ModuleArtConfigN",
    label: "ME5E.ModuleArtConfigL",
    hint: "ME5E.ModuleArtConfigH",
    icon: "fa-solid fa-palette",
    type: ModuleArtSettingsConfig,
    restricted: true
  });

  game.settings.register("me5e", "moduleArtConfiguration", {
    name: "Module Art Configuration",
    scope: "world",
    config: false,
    type: Object,
    default: {
      me5e: {
        portraits: true,
        tokens: true
      }
    }
  });

  // Compendium Browser source exclusion
  game.settings.registerMenu("me5e", "packSourceConfiguration", {
    name: "ME5E.CompendiumBrowser.Sources.Name",
    label: "ME5E.CompendiumBrowser.Sources.Label",
    hint: "ME5E.CompendiumBrowser.Sources.Hint",
    icon: "fas fa-book-open-reader",
    type: CompendiumBrowserSettingsConfig,
    restricted: true
  });

  game.settings.register("me5e", "packSourceConfiguration", {
    name: "Pack Source Configuration",
    scope: "world",
    config: false,
    type: Object,
    default: {},
    onChange: () => {
      // Refresh all open Compendium Browser instances when source configuration changes
      foundry.applications.instances.forEach(app => {
        if ( app instanceof CompendiumBrowser ) {
          app.render({ parts: ["results", "filters"], changedTab: true });
        }
      });
    }
  });

  // Bastions
  game.settings.registerMenu("me5e", "bastionConfiguration", {
    name: "ME5E.Bastion.Configuration.Name",
    label: "ME5E.Bastion.Configuration.Label",
    hint: "ME5E.Bastion.Configuration.Hint",
    icon: "fas fa-chess-rook",
    type: BastionSettingsConfig,
    restricted: true
  });

  game.settings.register("me5e", "bastionConfiguration", {
    name: "Bastion Configuration",
    scope: "world",
    config: false,
    type: BastionSetting,
    default: {
      button: false,
      enabled: false,
      duration: 7
    },
    onChange: () => game.me5e.bastion.initializeUI()
  });

  // Calendar Settings
  game.settings.registerMenu("me5e", "calendarConfiguration", {
    name: "ME5E.CALENDAR.Configuration.Name",
    label: "ME5E.CALENDAR.Configuration.Label",
    hint: "ME5E.CALENDAR.Configuration.Hint",
    icon: "fas fa-calendar-days",
    type: CalendarSettingsConfig
  });

  game.settings.register("me5e", "calendar", {
    name: "ME5E.CALENDAR.FIELDS.calendar.label",
    hint: "ME5E.CALENDAR.FIELDS.calendar.hint",
    scope: "world",
    config: false,
    type: new StringField({
      required: true, blank: false, initial: "gregorian", choices: () => Object.fromEntries(
        CONFIG.ME5E.calendar.calendars.map(({ value, label }) => [value, label])
      )
    }),
    requiresReload: true
  });

  game.settings.register("me5e", "calendarConfig", {
    name: "Calendar Configuration",
    scope: "world",
    config: false,
    type: CalendarConfigSetting,
    onChange: () => me5e.ui.calendar?.onUpdateSettings?.()
  });

  game.settings.register("me5e", "calendarPreferences", {
    name: "Calendar Preferences",
    scope: "user",
    config: false,
    type: CalendarPreferencesSetting,
    onChange: () => me5e.ui.calendar?.onUpdateSettings?.()
  });

  // Combat Settings
  game.settings.registerMenu("me5e", "combatConfiguration", {
    name: "SETTINGS.ME5E.COMBAT.Name",
    label: "SETTINGS.ME5E.COMBAT.Label",
    hint: "SETTINGS.ME5E.COMBAT.Hint",
    icon: "fas fa-explosion",
    type: CombatSettingsConfig,
    restricted: true
  });

  game.settings.register("me5e", "autoRecharge", {
    name: "SETTINGS.ME5E.NPCS.AutoRecharge.Name",
    hint: "SETTINGS.ME5E.NPCS.AutoRecharge.Hint",
    scope: "world",
    config: false,
    default: "no",
    type: String,
    choices: {
      no: "SETTINGS.ME5E.NPCS.AutoRecharge.No",
      silent: "SETTINGS.ME5E.NPCS.AutoRecharge.Silent",
      yes: "SETTINGS.ME5E.NPCS.AutoRecharge.Yes"
    }
  });

  game.settings.register("me5e", "autoRollNPCHP", {
    name: "SETTINGS.ME5E.NPCS.AutoRollNPCHP.Name",
    hint: "SETTINGS.ME5E.NPCS.AutoRollNPCHP.Hint",
    scope: "world",
    config: false,
    default: "no",
    type: String,
    choices: {
      no: "SETTINGS.ME5E.NPCS.AutoRollNPCHP.No",
      silent: "SETTINGS.ME5E.NPCS.AutoRollNPCHP.Silent",
      yes: "SETTINGS.ME5E.NPCS.AutoRollNPCHP.Yes"
    }
  });

  game.settings.register("me5e", "criticalDamageModifiers", {
    name: "SETTINGS.ME5E.CRITICAL.MultiplyModifiers.Name",
    hint: "SETTINGS.ME5E.CRITICAL.MultiplyModifiers.Hint",
    scope: "world",
    config: false,
    type: Boolean,
    default: false
  });

  game.settings.register("me5e", "criticalDamageMaxDice", {
    name: "SETTINGS.ME5E.CRITICAL.MaxDice.Name",
    hint: "SETTINGS.ME5E.CRITICAL.MaxDice.Hint",
    scope: "world",
    config: false,
    type: Boolean,
    default: false
  });

  game.settings.register("me5e", "initiativeDexTiebreaker", {
    name: "SETTINGS.ME5E.COMBAT.DexTiebreaker.Name",
    hint: "SETTINGS.ME5E.COMBAT.DexTiebreaker.Hint",
    scope: "world",
    config: false,
    default: false,
    type: Boolean
  });

  game.settings.register("me5e", "initiativeScore", {
    name: "SETTINGS.ME5E.COMBAT.InitiativeScore.Name",
    hint: "SETTINGS.ME5E.COMBAT.InitiativeScore.Hint",
    scope: "world",
    config: false,
    default: "none",
    type: String,
    choices: {
      none: "SETTINGS.ME5E.COMBAT.InitiativeScore.None",
      npcs: "SETTINGS.ME5E.COMBAT.InitiativeScore.NPCs",
      all: "SETTINGS.ME5E.COMBAT.InitiativeScore.All"
    }
  });

  // Variant Rules
  game.settings.registerMenu("me5e", "variantRulesConfiguration", {
    name: "SETTINGS.ME5E.VARIANT.Name",
    label: "SETTINGS.ME5E.VARIANT.Label",
    hint: "SETTINGS.ME5E.VARIANT.Hint",
    icon: "fas fa-list-check",
    type: VariantRulesSettingsConfig,
    restricted: true
  });

  game.settings.register("me5e", "allowFeats", {
    name: "SETTINGS.ME5E.VARIANT.AllowFeats.Name",
    hint: "SETTINGS.ME5E.VARIANT.AllowFeats.Hint",
    scope: "world",
    config: false,
    default: true,
    type: Boolean
  });

  game.settings.register("me5e", "currencyWeight", {
    name: "SETTINGS.ME5E.VARIANT.CurrencyWeight.Name",
    hint: "SETTINGS.ME5E.VARIANT.CurrencyWeight.Hint",
    scope: "world",
    config: false,
    default: true,
    type: Boolean
  });

  game.settings.register("me5e", "encumbrance", {
    name: "SETTINGS.ME5E.VARIANT.Encumbrance.Name",
    hint: "SETTINGS.ME5E.VARIANT.Encumbrance.Hint",
    scope: "world",
    config: false,
    default: "none",
    type: String,
    choices: {
      none: "SETTINGS.ME5E.VARIANT.Encumbrance.None",
      normal: "SETTINGS.ME5E.VARIANT.Encumbrance.Normal",
      variant: "SETTINGS.ME5E.VARIANT.Encumbrance.Variant"
    }
  });

  game.settings.register("me5e", "honorScore", {
    name: "SETTINGS.ME5E.VARIANT.HonorScore.Name",
    hint: "SETTINGS.ME5E.VARIANT.HonorScore.Hint",
    scope: "world",
    config: false,
    default: false,
    type: Boolean,
    requiresReload: true
  });

  game.settings.register("me5e", "levelingMode", {
    name: "SETTINGS.ME5E.VARIANT.LevelingMode.Name",
    hint: "SETTINGS.ME5E.VARIANT.LevelingMode.Hint",
    scope: "world",
    config: false,
    default: "xpBoons",
    type: String,
    choices: {
      noxp: "SETTINGS.ME5E.VARIANT.LevelingMode.NoXP",
      xp: "SETTINGS.ME5E.VARIANT.LevelingMode.XP",
      xpBoons: "SETTINGS.ME5E.VARIANT.LevelingMode.XPBoons"
    }
  });

  game.settings.register("me5e", "proficiencyModifier", {
    name: "SETTINGS.ME5E.VARIANT.ProficiencyModifier.Name",
    hint: "SETTINGS.ME5E.VARIANT.ProficiencyModifier.Hint",
    scope: "world",
    config: false,
    default: "bonus",
    type: String,
    choices: {
      bonus: "SETTINGS.ME5E.VARIANT.ProficiencyModifier.Bonus",
      dice: "SETTINGS.ME5E.VARIANT.ProficiencyModifier.Dice"
    }
  });

  game.settings.register("me5e", "restVariant", {
    name: "SETTINGS.ME5E.VARIANT.Rest.Name",
    hint: "SETTINGS.ME5E.VARIANT.Rest.Hint",
    scope: "world",
    config: false,
    default: "normal",
    type: String,
    choices: {
      normal: "SETTINGS.ME5E.VARIANT.Rest.Normal",
      gritty: "SETTINGS.ME5E.VARIANT.Rest.Gritty",
      epic: "SETTINGS.ME5E.VARIANT.Rest.Epic"
    }
  });

  game.settings.register("me5e", "sanityScore", {
    name: "SETTINGS.ME5E.VARIANT.SanityScore.Name",
    hint: "SETTINGS.ME5E.VARIANT.SanityScore.Hint",
    scope: "world",
    config: false,
    default: false,
    type: Boolean,
    requiresReload: true
  });

  // Visibility Settings
  game.settings.registerMenu("me5e", "visibilityConfiguration", {
    name: "SETTINGS.ME5E.VISIBILITY.Name",
    label: "SETTINGS.ME5E.VISIBILITY.Label",
    hint: "SETTINGS.ME5E.VISIBILITY.Hint",
    icon: "fas fa-eye",
    type: VisibilitySettingsConfig,
    restricted: true
  });

  game.settings.register("me5e", "attackRollVisibility", {
    name: "SETTINGS.ME5E.VISIBILITY.Attack.Name",
    hint: "SETTINGS.ME5E.VISIBILITY.Attack.Hint",
    scope: "world",
    config: false,
    default: "none",
    type: String,
    choices: {
      all: "SETTINGS.ME5E.VISIBILITY.Attack.All",
      hideAC: "SETTINGS.ME5E.VISIBILITY.Attack.HideAC",
      none: "SETTINGS.ME5E.VISIBILITY.Attack.None"
    }
  });

  game.settings.register("me5e", "bloodied", {
    name: "SETTINGS.ME5E.BLOODIED.Name",
    hint: "SETTINGS.ME5E.BLOODIED.Hint",
    scope: "world",
    config: false,
    default: "player",
    type: String,
    choices: {
      all: "SETTINGS.ME5E.BLOODIED.All",
      player: "SETTINGS.ME5E.BLOODIED.Player",
      none: "SETTINGS.ME5E.BLOODIED.None"
    }
  });

  game.settings.register("me5e", "challengeVisibility", {
    name: "SETTINGS.ME5E.VISIBILITY.Challenge.Name",
    hint: "SETTINGS.ME5E.VISIBILITY.Challenge.Hint",
    scope: "world",
    config: false,
    default: "player",
    type: String,
    choices: {
      all: "SETTINGS.ME5E.VISIBILITY.Challenge.All",
      player: "SETTINGS.ME5E.VISIBILITY.Challenge.Player",
      none: "SETTINGS.ME5E.VISIBILITY.Challenge.None"
    }
  });

  game.settings.register("me5e", "concealItemDescriptions", {
    name: "SETTINGS.ME5E.VISIBILITY.ItemDescriptions.Name",
    hint: "SETTINGS.ME5E.VISIBILITY.ItemDescriptions.Hint",
    scope: "world",
    config: false,
    default: false,
    type: Boolean
  });

  // Primary Group
  game.settings.register("me5e", "primaryParty", {
    name: "Primary Party",
    scope: "world",
    config: false,
    default: null,
    type: PrimaryPartySetting,
    onChange: s => ui.actors.render()
  });

  // Control hints
  game.settings.register("me5e", "controlHints", {
    name: "ME5E.Controls.Name",
    hint: "ME5E.Controls.Hint",
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });

  // NPC sheet default skills
  game.settings.register("me5e", "defaultSkills", {
    name: "SETTINGS.ME5E.DEFAULTSKILLS.Name",
    hint: "SETTINGS.ME5E.DEFAULTSKILLS.Hint",
    type: new foundry.data.fields.SetField(
      new foundry.data.fields.StringField({
        choices: () => CONFIG.ME5E.skills
      })
    ),
    default: [],
    config: true
  });
}

/* -------------------------------------------- */

/**
 * Register additional settings after modules have had a chance to initialize to give them a chance to modify choices.
 */
export function registerDeferredSettings() {
  game.settings.register("me5e", "theme", {
    name: "SETTINGS.ME5E.THEME.Name",
    hint: "SETTINGS.ME5E.THEME.Hint",
    scope: "client",
    config: false,
    default: "",
    type: String,
    choices: {
      "": "SHEETS.ME5E.THEME.Automatic",
      ...CONFIG.ME5E.themes
    },
    onChange: s => setTheme(document.body, s)
  });

  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    setTheme(document.body, game.settings.get("me5e", "theme"));
  });
  matchMedia("(prefers-contrast: more)").addEventListener("change", () => {
    setTheme(document.body, game.settings.get("me5e", "theme"));
  });

  // Hook into core color scheme setting.
  const setting = game.settings.get("core", "uiConfig");
  const settingConfig = game.settings.settings.get("core.uiConfig");
  const { onChange } = settingConfig ?? {};
  if ( onChange ) settingConfig.onChange = (s, ...args) => {
    onChange(s, ...args);
    setTheme(document.body, s.colorScheme);
  };
  setTheme(document.body, setting.colorScheme);
}

/* -------------------------------------------- */

/**
 * Update configuration data when legacy rules are set.
 */
export function applyLegacyRules() {
  const ME5E = CONFIG.ME5E;

  // Set half-casters to round down.
  ME5E.spellcasting.spell.progression.half.roundUp = false;

  // Adjust Wild Shape and Polymorph presets.
  for ( const preset of ["polymorph", "wildshape"] ) {
    ME5E.transformation.presets[preset].settings.keep.delete("hp");
    ME5E.transformation.presets[preset].settings.keep.delete("languages");
    ME5E.transformation.presets[preset].settings.keep.delete("type");
    delete ME5E.transformation.presets[preset].settings.tempFormula;
  }

  // Adjust language categories.
  delete ME5E.languages.standard.children.sign;
  ME5E.languages.exotic.children.draconic = ME5E.languages.standard.children.draconic;
  delete ME5E.languages.standard.children.draconic;
  ME5E.languages.cant = ME5E.languages.exotic.children.cant;
  delete ME5E.languages.exotic.children.cant;
  ME5E.languages.druidic = ME5E.languages.exotic.children.druidic;
  delete ME5E.languages.exotic.children.druidic;

  // Stunned stops movement in legacy & surprised doesn't provide initiative disadvantage.
  ME5E.conditionEffects.noMovement.add("stunned");
  ME5E.conditionEffects.initiativeAdvantage.delete("invisible");
  ME5E.conditionEffects.initiativeDisadvantage.delete("incapacitated");
  ME5E.conditionEffects.initiativeDisadvantage.delete("surprised");

  // Incapacitated creatures within 2 size categories still cannot be moved through in legacy
  delete ME5E.conditionTypes.incapacitated.neverBlockMovement;

  // Adjust references.
  Object.assign(ME5E.rules, LEGACY.RULES);
  for ( const [cat, value] of Object.entries(LEGACY.REFERENCES) ) {
    Object.entries(value).forEach(([k, v]) => ME5E[cat][k].reference = v);
  }

  // Adjust base item IDs.
  for ( const [cat, value] of Object.entries(LEGACY.IDS) ) {
    if ( cat === "focusTypes" ) Object.entries(value).forEach(([k, v]) => ME5E[cat][k].itemIds = v);
    else if ( cat === "tools" ) Object.entries(value).forEach(([k, v]) => ME5E[cat][k].id = v);
    else ME5E[cat] = value;
  }

  // Swap spell lists.
  ME5E.SPELL_LISTS = LEGACY.SPELL_LISTS;
}

/* -------------------------------------------- */

/**
 * Set the theme on an element, removing the previous theme class in the process.
 * @param {HTMLElement} element     Body or sheet element on which to set the theme data.
 * @param {string} [theme=""]       Theme key to set.
 * @param {Set<string>} [flags=[]]  Additional theming flags to set.
 */
export function setTheme(element, theme="", flags=new Set()) {
  if ( foundry.utils.getType(theme) === "Object" ) theme = theme.applications;
  element.className = element.className.replace(/\bme5e-(theme|flag)-[\w-]+\b/g, "");

  // Primary Theme
  if ( !theme && (element === document.body) ) {
    if ( matchMedia("(prefers-color-scheme: dark)").matches ) theme = "dark";
    if ( matchMedia("(prefers-color-scheme: light)").matches ) theme = "light";
  }
  if ( theme ) {
    element.classList.add(`me5e-theme-${theme.slugify()}`);
    element.dataset.theme = theme;
  }
  else delete element.dataset.theme;

  // Additional Flags
  if ( (element === document.body) && matchMedia("(prefers-contrast: more)").matches ) flags.add("high-contrast");
  for ( const flag of flags ) element.classList.add(`me5e-flag-${flag.slugify()}`);
  element.dataset.themeFlags = Array.from(flags).join(" ");
}
