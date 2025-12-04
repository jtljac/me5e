import CalenderHUD from "./applications/calendar/calendar-hud.mjs";
import MapLocationControlIcon from "./canvas/map-location-control-icon.mjs";
import { ConsumptionTargetData } from "./data/activity/fields/consumption-targets-field.mjs";
import { CalendarGreyhawk, CALENDAR_OF_GREYHAWK } from "./data/calendar/calendar-of-greyhawk.mjs";
import { CalendarHarptos, CALENDAR_OF_HARPTOS } from "./data/calendar/calendar-of-harptos.mjs";
import { CalendarKhorvaire, CALENDAR_OF_KHORVAIRE } from "./data/calendar/calendar-of-khorvaire.mjs";
import * as activities from "./documents/activity/_module.mjs";
import Actor5e from "./documents/actor/actor.mjs";
import * as advancement from "./documents/advancement/_module.mjs";
import { preLocalize } from "./utils.mjs";
import MappingField from "./data/fields/mapping-field.mjs";
import VehicleData from "./data/actor/vehicle.mjs";

/**
 * @import {
 *   AbilityConfiguration, ActivityActivationTypeConfiguration, ActivityConsumptionTargetConfiguration,
 *   ActivityTypeConfiguration, ActorSizeConfiguration, AdvancementTypeConfiguration,
 *   AreaTargetDefinition, CalendarHUDConfiguration, CharacterFlagConfiguration, ConditionConfiguration,
 *   CraftingConfiguration, CreatureTypeConfiguration, CurrencyConfiguration, DamageTypeConfiguration,
 *   EncumbranceConfiguration, FacilityConfiguration, HabitatConfiguration5e,
 *   IndividualTargetDefinition, ItemPropertyConfiguration, LimitedUsePeriodConfiguration,
 *   MapLocationMarkerStyle, MovementTypeConfiguration, MovementUnitConfiguration,
 *   RestTypeConfiguration, RequestCallback5e, RuleTypeConfiguration, SkillConfiguration,
 *   SpellcastingFocusConfiguration, SpellcastingPreparationState5e, SpellSchoolConfiguration,
 *   SpellScrollValues, StatusEffectConfig5e, SubtypeTypeConfiguration, TimeUnitConfiguration,
 *   ToolConfiguration, TraitConfiguration, TransformationConfiguration, TravelPaceConfiguration,
 *   TravelUnitConfiguration, TreasureConfiguration5e, UnitConfiguration, WeaponMasterConfiguration
 * } from "./_types.mjs";
 * @import { TravelPace5e } from "./data/actor/fields/_types.mjs";
 * @import {
 *   MultiLevelSpellcasting, SingleLevelSpellcastingData, SlotSpellcastingData, SpellcastingModelData,
 *   SpellcastingTable5e, SpellcastingTableSingle5e
 * } from "./data/spellcasting/_types.mjs";
 */

// Namespace Configuration Values
const ME5E = {};

// ASCII Artwork
ME5E.ASCII = `___________________________
___  ___ _____ _____ _____
|  \\/  ||  ___|  ___|  ___|
| .  . || |__ |___ \\| |__
| |\\/| ||  __|    \\ \\  __|
| |  | || |___/\\__/ / |___
\\_|  |_/\\____/\\____/\\____/
___________________________`;

/**
 * The set of Ability Scores used within the system.
 * @enum {AbilityConfiguration}
 */
ME5E.abilities = {
  str: {
    label: "ME5E.AbilityStr",
    abbreviation: "ME5E.AbilityStrAbbr",
    type: "physical",
    fullKey: "strength",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.nUPv6C66Ur64BIUH",
    icon: "systems/me5e/icons/svg/abilities/strength.svg"
  },
  dex: {
    label: "ME5E.AbilityDex",
    abbreviation: "ME5E.AbilityDexAbbr",
    type: "physical",
    fullKey: "dexterity",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.ER8CKDUWLsFXuARJ",
    icon: "systems/me5e/icons/svg/abilities/dexterity.svg"
  },
  con: {
    label: "ME5E.AbilityCon",
    abbreviation: "ME5E.AbilityConAbbr",
    type: "physical",
    fullKey: "constitution",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.MpA4jnwD17Q0RPg7",
    icon: "systems/me5e/icons/svg/abilities/constitution.svg"
  },
  int: {
    label: "ME5E.AbilityInt",
    abbreviation: "ME5E.AbilityIntAbbr",
    type: "mental",
    fullKey: "intelligence",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.WzWWcTIppki35YvF",
    icon: "systems/me5e/icons/svg/abilities/intelligence.svg",
    defaults: { vehicle: 0 }
  },
  wis: {
    label: "ME5E.AbilityWis",
    abbreviation: "ME5E.AbilityWisAbbr",
    type: "mental",
    fullKey: "wisdom",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.v3IPyTtqvXqN934s",
    icon: "systems/me5e/icons/svg/abilities/wisdom.svg",
    defaults: { vehicle: 0 }
  },
  cha: {
    label: "ME5E.AbilityCha",
    abbreviation: "ME5E.AbilityChaAbbr",
    type: "mental",
    fullKey: "charisma",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.9FyghudYFV5QJOuG",
    icon: "systems/me5e/icons/svg/abilities/charisma.svg",
    defaults: { vehicle: 0 }
  },
  hon: {
    label: "ME5E.AbilityHon",
    abbreviation: "ME5E.AbilityHonAbbr",
    type: "mental",
    fullKey: "honor",
    defaults: { npc: "cha", vehicle: 0 },
    improvement: false
  },
  san: {
    label: "ME5E.AbilitySan",
    abbreviation: "ME5E.AbilitySanAbbr",
    type: "mental",
    fullKey: "sanity",
    defaults: { npc: "wis", vehicle: 0 },
    improvement: false
  }
};
preLocalize("abilities", { keys: ["label", "abbreviation"] });

/**
 * Configure which ability score is used as the default modifier for initiative rolls,
 * when calculating hit points per level and hit dice, and as the default modifier for
 * saving throws to maintain concentration.
 * @enum {string}
 */
ME5E.defaultAbilities = {
  meleeAttack: "str",
  rangedAttack: "dex",
  initiative: "dex",
  hitPoints: "con",
  concentration: "con"
};

/* -------------------------------------------- */

/**
 * The set of skill which can be trained with their default ability scores.
 * @enum {SkillConfiguration}
 */
ME5E.skills = {
  acr: {
    label: "ME5E.SkillAcr",
    ability: "dex",
    fullKey: "acrobatics",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.AvvBLEHNl7kuwPkN",
    icon: "icons/equipment/feet/shoes-simple-leaf-green.webp"
  },
  ani: {
    label: "ME5E.SkillAni",
    ability: "wis",
    fullKey: "animalHandling",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.xb3MCjUvopOU4viE",
    icon: "icons/environment/creatures/horse-brown.webp"
  },
  arc: {
    label: "ME5E.SkillArc",
    ability: "int",
    fullKey: "arcana",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.h3bYSPge8IOqne1N",
    icon: "icons/sundries/books/book-embossed-jewel-silver-green.webp"
  },
  ath: {
    label: "ME5E.SkillAth",
    ability: "str",
    fullKey: "athletics",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.rIR7ttYDUpH3tMzv",
    icon: "icons/magic/control/buff-strength-muscle-damage-orange.webp"
  },
  dec: {
    label: "ME5E.SkillDec",
    ability: "cha",
    fullKey: "deception",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.mqVZ2fz0L7a9VeKJ",
    icon: "icons/magic/control/mouth-smile-deception-purple.webp"
  },
  his: {
    label: "ME5E.SkillHis",
    ability: "int",
    fullKey: "history",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.kRBZbdWMGW9K3wdY",
    icon: "icons/sundries/books/book-embossed-bound-brown.webp"
  },
  ins: {
    label: "ME5E.SkillIns",
    ability: "wis",
    fullKey: "insight",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.8R5SMbAGbECNgO8z",
    icon: "icons/magic/perception/orb-crystal-ball-scrying-blue.webp"
  },
  itm: {
    label: "ME5E.SkillItm",
    ability: "cha",
    fullKey: "intimidation",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.4VHHI2gJ1jEsppfg",
    icon: "icons/skills/social/intimidation-impressing.webp"
  },
  inv: {
    label: "ME5E.SkillInv",
    ability: "int",
    fullKey: "investigation",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.Y7nmbQAruWOs7WRM",
    icon: "icons/tools/scribal/magnifying-glass.webp"
  },
  med: {
    label: "ME5E.SkillMed",
    ability: "wis",
    fullKey: "medicine",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.GeYmM7BVfSCAga4o",
    icon: "icons/tools/cooking/mortar-herbs-yellow.webp"
  },
  nat: {
    label: "ME5E.SkillNat",
    ability: "int",
    fullKey: "nature",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.ueMx3uF2PQlcye31",
    icon: "icons/magic/nature/plant-sprout-snow-green.webp"
  },
  prc: {
    label: "ME5E.SkillPrc",
    ability: "wis",
    fullKey: "perception",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.zjEeHCUqfuprfzhY",
    icon: "icons/magic/perception/eye-ringed-green.webp",
    pace: {
      advantage: new Set(["slow"]),
      disadvantage: new Set(["fast"])
    }
  },
  prf: {
    label: "ME5E.SkillPrf",
    ability: "cha",
    fullKey: "performance",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.hYT7Z06yDNBcMtGe",
    icon: "icons/tools/instruments/lute-gold-brown.webp"
  },
  per: {
    label: "ME5E.SkillPer",
    ability: "cha",
    fullKey: "persuasion",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.4R5H8iIsdFQTsj3X",
    icon: "icons/skills/social/diplomacy-handshake.webp"
  },
  rel: {
    label: "ME5E.SkillRel",
    ability: "int",
    fullKey: "religion",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.CXVzERHdP4qLhJXM",
    icon: "icons/magic/holy/saint-glass-portrait-halo.webp"
  },
  slt: {
    label: "ME5E.SkillSlt",
    ability: "dex",
    fullKey: "sleightOfHand",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.yg6SRpGNVz9nDW0A",
    icon: "icons/sundries/gaming/playing-cards.webp"
  },
  ste: {
    label: "ME5E.SkillSte",
    ability: "dex",
    fullKey: "stealth",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.4MfrpERNiQXmvgCI",
    icon: "icons/magic/perception/shadow-stealth-eyes-purple.webp",
    pace: {
      disadvantage: new Set(["normal", "fast"])
    }
  },
  sur: {
    label: "ME5E.SkillSur",
    ability: "wis",
    fullKey: "survival",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.t3EzDU5b9BVAIEVi",
    icon: "icons/magic/fire/flame-burning-campfire-yellow-blue.webp",
    pace: {
      advantage: new Set(["slow"]),
      disadvantage: new Set(["fast"])
    }
  }
};
preLocalize("skills", { key: "label", sort: true });

/* -------------------------------------------- */

/**
 * Base passive score and the amount by which the passive skill scores are modified when that skill has
 * advantage or disadvantage.
 * @type {{ base: number, modifier: number }}
 */
ME5E.skillPassive = {
  base: 10,
  modifier: 5
};

/* -------------------------------------------- */

/**
 * Character alignment options.
 * @enum {string}
 */
ME5E.alignments = {
  lg: "ME5E.AlignmentLG",
  ng: "ME5E.AlignmentNG",
  cg: "ME5E.AlignmentCG",
  ln: "ME5E.AlignmentLN",
  tn: "ME5E.AlignmentTN",
  cn: "ME5E.AlignmentCN",
  le: "ME5E.AlignmentLE",
  ne: "ME5E.AlignmentNE",
  ce: "ME5E.AlignmentCE"
};
preLocalize("alignments");

/* -------------------------------------------- */

/**
 * An enumeration of item attunement types.
 * @enum {string}
 */
ME5E.attunementTypes = {
  required: "ME5E.AttunementRequired",
  optional: "ME5E.AttunementOptional"
};
preLocalize("attunementTypes");

/* -------------------------------------------- */
/*  Weapon Details                              */
/* -------------------------------------------- */

/**
 * The set of types which a weapon item can take.
 * @enum {string}
 */
ME5E.weaponTypes = {
  simpleM: "ME5E.WeaponSimpleM",
  simpleR: "ME5E.WeaponSimpleR",
  martialM: "ME5E.WeaponMartialM",
  martialR: "ME5E.WeaponMartialR",
  natural: "ME5E.WeaponNatural",
  improv: "ME5E.WeaponImprov",
  siege: "ME5E.WeaponSiege"
};
preLocalize("weaponTypes");

/* -------------------------------------------- */

/**
 * General weapon categories.
 * @enum {string}
 */
ME5E.weaponProficiencies = {
  sim: "ME5E.WeaponSimpleProficiency",
  mar: "ME5E.WeaponMartialProficiency"
};
preLocalize("weaponProficiencies");

/* -------------------------------------------- */

/**
 * Weapon masteries.
 * @enum {WeaponMasterConfiguration}
 */
ME5E.weaponMasteries = {
  cleave: {
    label: "ME5E.WEAPON.Mastery.Cleave",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.ULDpodOdTxTTiNEx"
  },
  graze: {
    label: "ME5E.WEAPON.Mastery.Graze",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.PPnaXKPsQvAZp0J4"
  },
  nick: {
    label: "ME5E.WEAPON.Mastery.Nick",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.l0uao3UVco5ptQso"
  },
  push: {
    label: "ME5E.WEAPON.Mastery.Push",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.BPD7ScnLyuPwl145"
  },
  sap: {
    label: "ME5E.WEAPON.Mastery.Sap",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.fPkZQ7TkKCCA3nTc"
  },
  slow: {
    label: "ME5E.WEAPON.Mastery.Slow",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.OQQ7hAp6OAxX1rXY"
  },
  topple: {
    label: "ME5E.WEAPON.Mastery.Topple",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.IMnpuysdrSalmZJg"
  },
  vex: {
    label: "ME5E.WEAPON.Mastery.Vex",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.hg3adn9O1O5Z2QxL"
  }
};
preLocalize("weaponMasteries", { key: "label", sort: true });

/* -------------------------------------------- */

/**
 * A mapping between `ME5E.weaponTypes` and `ME5E.weaponProficiencies` that
 * is used to determine if character has proficiency when adding an item.
 * @enum {(boolean|string)}
 */
ME5E.weaponProficienciesMap = {
  simpleM: "sim",
  simpleR: "sim",
  martialM: "mar",
  martialR: "mar"
};

/* -------------------------------------------- */

/**
 * A mapping between `ME5E.weaponTypes` and `ME5E.attackClassifications`. Unlisted types are assumed to be
 * of the "weapon" classification.
 * @enum {string}
 */
ME5E.weaponClassificationMap = {};

/* -------------------------------------------- */

/**
 * A mapping between `ME5E.weaponTypes` and `ME5E.attackTypes`.
 * @enum {string}
 */
ME5E.weaponTypeMap = {
  simpleM: "melee",
  simpleR: "ranged",
  martialM: "melee",
  martialR: "ranged",
  siege: "ranged"
};

/* -------------------------------------------- */

/**
 * The basic weapon types in 5e. This enables specific weapon proficiencies or
 * starting equipment provided by classes and backgrounds.
 * @enum {string}
 */
ME5E.weaponIds = {
  battleaxe: "Compendium.me5e.equipment24.Item.phbwepBattleaxe0",
  blowgun: "Compendium.me5e.equipment24.Item.phbwepBlowgun000",
  club: "Compendium.me5e.equipment24.Item.phbwepClub000000",
  dagger: "Compendium.me5e.equipment24.Item.phbwepDagger0000",
  dart: "Compendium.me5e.equipment24.Item.phbwepDart000000",
  flail: "Compendium.me5e.equipment24.Item.phbwepFlail00000",
  glaive: "Compendium.me5e.equipment24.Item.phbwepGlaive0000",
  greataxe: "Compendium.me5e.equipment24.Item.phbwepGreataxe00",
  greatclub: "Compendium.me5e.equipment24.Item.phbwepGreatclub0",
  greatsword: "Compendium.me5e.equipment24.Item.phbwepGreatsword",
  halberd: "Compendium.me5e.equipment24.Item.phbwepHalberd000",
  handaxe: "Compendium.me5e.equipment24.Item.phbwepHandaxe000",
  handcrossbow: "Compendium.me5e.equipment24.Item.phbwepHandCrossb",
  heavycrossbow: "Compendium.me5e.equipment24.Item.phbwepHeavyCross",
  javelin: "Compendium.me5e.equipment24.Item.phbwepJavelin000",
  lance: "Compendium.me5e.equipment24.Item.phbwepLance00000",
  lightcrossbow: "Compendium.me5e.equipment24.Item.phbwepLightCross",
  lighthammer: "Compendium.me5e.equipment24.Item.phbwepLightHamme",
  longbow: "Compendium.me5e.equipment24.Item.phbwepLongbow000",
  longsword: "Compendium.me5e.equipment24.Item.phbwepLongsword0",
  mace: "Compendium.me5e.equipment24.Item.phbwepMace000000",
  maul: "Compendium.me5e.equipment24.Item.phbwepMaul000000",
  morningstar: "Compendium.me5e.equipment24.Item.phbwepMorningsta",
  musket: "Compendium.me5e.equipment24.Item.phbwepMusket0000",
  pike: "Compendium.me5e.equipment24.Item.phbwepPike000000",
  pistol: "Compendium.me5e.equipment24.Item.phbwepPistol0000",
  quarterstaff: "Compendium.me5e.equipment24.Item.phbwepQuartersta",
  rapier: "Compendium.me5e.equipment24.Item.phbwepRapier0000",
  scimitar: "Compendium.me5e.equipment24.Item.phbwepScimitar00",
  shortsword: "Compendium.me5e.equipment24.Item.phbwepShortsword",
  sickle: "Compendium.me5e.equipment24.Item.phbwepSickle0000",
  spear: "Compendium.me5e.equipment24.Item.phbwepSpear00000",
  shortbow: "Compendium.me5e.equipment24.Item.phbwepShortbow00",
  sling: "Compendium.me5e.equipment24.Item.phbwepSling00000",
  trident: "Compendium.me5e.equipment24.Item.phbwepTrident000",
  warpick: "Compendium.me5e.equipment24.Item.phbwepWarPick000",
  warhammer: "Compendium.me5e.equipment24.Item.phbwepWarhammer0",
  whip: "Compendium.me5e.equipment24.Item.phbwepWhip000000"
};

/* -------------------------------------------- */

/**
 * The basic ammunition types.
 * @enum {string}
 */
ME5E.ammoIds = {
  arrow: "Compendium.me5e.equipment24.Item.phbamoArrows0000",
  blowgunNeedle: "Compendium.me5e.equipment24.Item.phbamoNeedles000",
  crossbowBolt: "Compendium.me5e.equipment24.Item.phbamoBolts00000",
  firearmBullet: "Compendium.me5e.equipment24.Item.phbamoBulletsFir",
  slingBullet: "Compendium.me5e.equipment24.Item.phbamoBulletsSli"
};

/* -------------------------------------------- */
/*  Bastion Facilities                          */
/* -------------------------------------------- */

/**
 * Configuration data for bastion facilities.
 * @type {FacilityConfiguration}
 */
ME5E.facilities = {
  advancement: {
    basic: { 5: 2 },
    special: { 5: 2, 9: 4, 13: 5, 17: 6 }
  },
  orders: {
    build: {
      label: "ME5E.FACILITY.Orders.build.inf",
      icon: "systems/me5e/icons/svg/facilities/build.svg"
    },
    change: {
      label: "ME5E.FACILITY.Orders.change.inf",
      icon: "systems/me5e/icons/svg/facilities/change.svg",
      duration: 21
    },
    craft: {
      label: "ME5E.FACILITY.Orders.craft.inf",
      icon: "systems/me5e/icons/svg/facilities/craft.svg"
    },
    empower: {
      label: "ME5E.FACILITY.Orders.empower.inf",
      icon: "systems/me5e/icons/svg/facilities/empower.svg"
    },
    enlarge: {
      label: "ME5E.FACILITY.Orders.enlarge.inf",
      icon: "systems/me5e/icons/svg/facilities/enlarge.svg",
      basic: true
    },
    harvest: {
      label: "ME5E.FACILITY.Orders.harvest.inf",
      icon: "systems/me5e/icons/svg/facilities/harvest.svg"
    },
    maintain: {
      label: "ME5E.FACILITY.Orders.maintain.inf",
      icon: "systems/me5e/icons/svg/facilities/maintain.svg"
    },
    recruit: {
      label: "ME5E.FACILITY.Orders.recruit.inf",
      icon: "systems/me5e/icons/svg/facilities/recruit.svg"
    },
    repair: {
      label: "ME5E.FACILITY.Orders.repair.inf",
      icon: "systems/me5e/icons/svg/facilities/repair.svg",
      hidden: true
    },
    research: {
      label: "ME5E.FACILITY.Orders.research.inf",
      icon: "systems/me5e/icons/svg/facilities/research.svg"
    },
    trade: {
      label: "ME5E.FACILITY.Orders.trade.inf",
      icon: "systems/me5e/icons/svg/facilities/trade.svg"
    }
  },
  sizes: {
    cramped: {
      label: "ME5E.FACILITY.Sizes.cramped",
      days: 20,
      squares: 4,
      value: 500
    },
    roomy: {
      label: "ME5E.FACILITY.Sizes.roomy",
      days: 45,
      squares: 16,
      value: 1_000
    },
    vast: {
      label: "ME5E.FACILITY.Sizes.vast",
      days: 125,
      squares: 36,
      value: 3_000
    }
  },
  types: {
    basic: {
      label: "ME5E.FACILITY.Types.Basic.Label.one",
      subtypes: {
        bedroom: "ME5E.FACILITY.Types.Basic.Bedroom",
        diningRoom: "ME5E.FACILITY.Types.Basic.DiningRoom",
        parlor: "ME5E.FACILITY.Types.Basic.Parlor",
        courtyard: "ME5E.FACILITY.Types.Basic.Courtyard",
        kitchen: "ME5E.FACILITY.Types.Basic.Kitchen",
        storage: "ME5E.FACILITY.Types.Basic.Storage"
      }
    },
    special: {
      label: "ME5E.FACILITY.Types.Special.Label.one",
      subtypes: {
        arcaneStudy: "ME5E.FACILITY.Types.Special.ArcaneStudy",
        armory: "ME5E.FACILITY.Types.Special.Armory",
        barrack: "ME5E.FACILITY.Types.Special.Barrack",
        garden: "ME5E.FACILITY.Types.Special.Garden",
        library: "ME5E.FACILITY.Types.Special.Library",
        sanctuary: "ME5E.FACILITY.Types.Special.Sanctuary",
        smithy: "ME5E.FACILITY.Types.Special.Smithy",
        storehouse: "ME5E.FACILITY.Types.Special.Storehouse",
        workshop: "ME5E.FACILITY.Types.Special.Workshop",
        gamingHall: "ME5E.FACILITY.Types.Special.GamingHall",
        greenhouse: "ME5E.FACILITY.Types.Special.Greenhouse",
        laboratory: "ME5E.FACILITY.Types.Special.Laboratory",
        sacristy: "ME5E.FACILITY.Types.Special.Sacristy",
        scriptorium: "ME5E.FACILITY.Types.Special.Scriptorium",
        stable: "ME5E.FACILITY.Types.Special.Stable",
        teleportationCircle: "ME5E.FACILITY.Types.Special.TeleportationCircle",
        theater: "ME5E.FACILITY.Types.Special.Theater",
        trainingArea: "ME5E.FACILITY.Types.Special.TrainingArea",
        trophyRoom: "ME5E.FACILITY.Types.Special.TrophyRoom",
        archive: "ME5E.FACILITY.Types.Special.Archive",
        meditationChamber: "ME5E.FACILITY.Types.Special.MeditationChamber",
        menagerie: "ME5E.FACILITY.Types.Special.Menagerie",
        observatory: "ME5E.FACILITY.Types.Special.Observatory",
        pub: "ME5E.FACILITY.Types.Special.Pub",
        reliquary: "ME5E.FACILITY.Types.Special.Reliquary",
        demiplane: "ME5E.FACILITY.Types.Special.Demiplane",
        guildhall: "ME5E.FACILITY.Types.Special.Guildhall",
        sanctum: "ME5E.FACILITY.Types.Special.Sanctum",
        warRoom: "ME5E.FACILITY.Types.Special.WarRoom"
      }
    }
  }
};
preLocalize("facilities.orders", { key: "label", sort: true });
preLocalize("facilities.sizes", { key: "label", sort: true });
preLocalize("facilities.types", { key: "label", sort: true });
preLocalize("facilities.types.basic.subtypes", { sort: true });
preLocalize("facilities.types.special.subtypes", { sort: true });

/* -------------------------------------------- */
/*  Tool Details                                */
/* -------------------------------------------- */

/**
 * The categories into which Tool items can be grouped.
 *
 * @enum {string}
 */
ME5E.toolTypes = {
  art: "ME5E.ToolArtisans",
  game: "ME5E.ToolGamingSet",
  music: "ME5E.ToolMusicalInstrument"
};
preLocalize("toolTypes", { sort: true });

/**
 * The categories of tool proficiencies that a character can gain.
 *
 * @enum {string}
 */
ME5E.toolProficiencies = {
  ...ME5E.toolTypes,
  vehicle: "ME5E.ToolVehicle"
};
preLocalize("toolProficiencies", { sort: true });

/**
 * Configuration data for tools.
 * @enum {ToolConfiguration}
 */
ME5E.tools = {
  alchemist: {
    ability: "int",
    id: "Compendium.me5e.equipment24.Item.phbtulAlchemists"
  },
  bagpipes: {
    ability: "cha",
    id: "Compendium.me5e.equipment24.Item.phbmusBagpipes00"
  },
  brewer: {
    ability: "int",
    id: "Compendium.me5e.equipment24.Item.phbtulBrewersSup"
  },
  calligrapher: {
    ability: "dex",
    id: "Compendium.me5e.equipment24.Item.phbtulCalligraph"
  },
  card: {
    ability: "wis",
    id: "Compendium.me5e.equipment24.Item.phbgstPlayingcar"
  },
  carpenter: {
    ability: "str",
    id: "Compendium.me5e.equipment24.Item.phbtulCarpenters"
  },
  cartographer: {
    ability: "wis",
    id: "Compendium.me5e.equipment24.Item.phbtulCartograph"
  },
  chess: {
    ability: "wis",
    id: "Compendium.me5e.equipment24.Item.phbgstDragonches"
  },
  cobbler: {
    ability: "dex",
    id: "Compendium.me5e.equipment24.Item.phbtulCobblersTo"
  },
  cook: {
    ability: "wis",
    id: "Compendium.me5e.equipment24.Item.phbtulCooksUtens"
  },
  dice: {
    ability: "wis",
    id: "Compendium.me5e.equipment24.Item.phbgstDice000000"
  },
  disg: {
    ability: "cha",
    id: "Compendium.me5e.equipment24.Item.phbtulDisguiseKi"
  },
  drum: {
    ability: "cha",
    id: "Compendium.me5e.equipment24.Item.phbmusDrum000000"
  },
  dulcimer: {
    ability: "cha",
    id: "Compendium.me5e.equipment24.Item.phbmusDulcimer00"
  },
  flute: {
    ability: "cha",
    id: "Compendium.me5e.equipment24.Item.phbmusFlute00000"
  },
  forg: {
    ability: "dex",
    id: "Compendium.me5e.equipment24.Item.phbtulForgeryKit"
  },
  glassblower: {
    ability: "int",
    id: "Compendium.me5e.equipment24.Item.phbtulGlassblowe"
  },
  herb: {
    ability: "int",
    id: "Compendium.me5e.equipment24.Item.phbtulHerbalismK"
  },
  horn: {
    ability: "cha",
    id: "Compendium.me5e.equipment24.Item.phbmusHorn000000"
  },
  jeweler: {
    ability: "int",
    id: "Compendium.me5e.equipment24.Item.phbtulJewelersTo"
  },
  leatherworker: {
    ability: "dex",
    id: "Compendium.me5e.equipment24.Item.phbtulLeatherwor"
  },
  lute: {
    ability: "cha",
    id: "Compendium.me5e.equipment24.Item.phbmusLute000000"
  },
  lyre: {
    ability: "cha",
    id: "Compendium.me5e.equipment24.Item.phbmusLyre000000"
  },
  mason: {
    ability: "str",
    id: "Compendium.me5e.equipment24.Item.phbtulMasonsTool"
  },
  navg: {
    ability: "wis",
    id: "Compendium.me5e.equipment24.Item.phbtulNavigators"
  },
  painter: {
    ability: "wis",
    id: "Compendium.me5e.equipment24.Item.phbtulPaintersSu"
  },
  panflute: {
    ability: "cha",
    id: "Compendium.me5e.equipment24.Item.phbmusPanflute00"
  },
  pois: {
    ability: "int",
    id: "Compendium.me5e.equipment24.Item.phbtulPoisonersK"
  },
  potter: {
    ability: "int",
    id: "Compendium.me5e.equipment24.Item.phbtulPottersToo"
  },
  shawm: {
    ability: "cha",
    id: "Compendium.me5e.equipment24.Item.phbmusShawm00000"
  },
  smith: {
    ability: "str",
    id: "Compendium.me5e.equipment24.Item.phbtulSmithsTool"
  },
  thief: {
    ability: "dex",
    id: "Compendium.me5e.equipment24.Item.phbtulThievesToo"
  },
  tinker: {
    ability: "dex",
    id: "Compendium.me5e.equipment24.Item.phbtulTinkersToo"
  },
  viol: {
    ability: "cha",
    id: "Compendium.me5e.equipment24.Item.phbmusViol000000"
  },
  weaver: {
    ability: "dex",
    id: "Compendium.me5e.equipment24.Item.phbtulWeaversToo"
  },
  woodcarver: {
    ability: "dex",
    id: "Compendium.me5e.equipment24.Item.phbtulWoodcarver"
  }
};

/**
 * The basic tool types in 5e. This enables specific tool proficiencies or
 * starting equipment provided by classes and backgrounds.
 * @enum {string}
 */
ME5E.toolIds = new Proxy(ME5E.tools, {
  get(target, prop) {
    return target[prop]?.id ?? target[prop];
  }
});

/* -------------------------------------------- */
/*  Time                                        */
/* -------------------------------------------- */

/**
 * Configuration for time units available to the system.
 * @enum {TimeUnitConfiguration}
 */
ME5E.timeUnits = {
  turn: {
    label: "ME5E.UNITS.TIME.Turn.Label",
    counted: "ME5E.UNITS.TIME.Turn.Counted",
    conversion: .1,
    combat: true
  },
  round: {
    label: "ME5E.UNITS.TIME.Round.Label",
    counted: "ME5E.UNITS.TIME.Round.Counted",
    conversion: .1,
    combat: true
  },
  second: {
    label: "ME5E.UNITS.TIME.Second.Label",
    conversion: 1 / 60,
    option: false,
    timeComponent: "second"
  },
  minute: {
    label: "ME5E.UNITS.TIME.Minute.Label",
    conversion: 1,
    timeComponent: "minute"
  },
  hour: {
    label: "ME5E.UNITS.TIME.Hour.Label",
    conversion: 60,
    timeComponent: "hour"
  },
  day: {
    label: "ME5E.UNITS.TIME.Day.Label",
    conversion: 1_440,
    timeComponent: "day"
  },
  week: {
    label: "ME5E.UNITS.TIME.Week.Label",
    conversion: 10_080,
    option: false
  },
  month: {
    label: "ME5E.UNITS.TIME.Month.Label",
    conversion: 43_200
  },
  year: {
    label: "ME5E.UNITS.TIME.Year.Label",
    conversion: 525_600,
    timeComponent: "year"
  }
};
preLocalize("timeUnits", { key: "label" });

/* -------------------------------------------- */

/**
 * Time periods that accept a numeric value.
 * @enum {string}
 */
ME5E.scalarTimePeriods = new Proxy(ME5E.timeUnits, {
  get(target, prop) {
    return target[prop]?.label;
  },
  has(target, key) {
    return target[key] && target[key].option !== false;
  },
  ownKeys(target) {
    return Object.keys(target).filter(k => target[k]?.option !== false);
  }
});

/* -------------------------------------------- */

/**
 * Time periods for spells that don't have a defined ending.
 * @enum {string}
 */
ME5E.permanentTimePeriods = {
  disp: "ME5E.TimeDisp",
  dstr: "ME5E.TimeDispTrig",
  perm: "ME5E.TimePerm"
};
preLocalize("permanentTimePeriods");

/* -------------------------------------------- */

/**
 * Time periods that don't accept a numeric value.
 * @enum {string}
 */
ME5E.specialTimePeriods = {
  inst: "ME5E.TimeInst",
  spec: "ME5E.Special"
};
preLocalize("specialTimePeriods");

/* -------------------------------------------- */

/**
 * The various lengths of time over which effects can occur.
 * @enum {string}
 */
ME5E.timePeriods = {
  ...ME5E.specialTimePeriods,
  ...ME5E.permanentTimePeriods,
  ...ME5E.scalarTimePeriods
};
preLocalize("timePeriods");

/* -------------------------------------------- */

/**
 * Ways in which to activate an item that cannot be labeled with a cost.
 * @enum {string}
 */
ME5E.staticAbilityActivationTypes = {
  none: "ME5E.NoneActionLabel",
  special: ME5E.timePeriods.spec
};

/**
 * Various ways in which an item or ability can be activated.
 * @enum {string}
 */
ME5E.abilityActivationTypes = {
  ...ME5E.staticAbilityActivationTypes,
  action: "ME5E.Action",
  bonus: "ME5E.BonusAction",
  reaction: "ME5E.Reaction",
  minute: ME5E.timePeriods.minute,
  hour: ME5E.timePeriods.hour,
  day: ME5E.timePeriods.day,
  legendary: "ME5E.LegendaryAction.Label",
  mythic: "ME5E.MythicActionLabel",
  lair: "ME5E.LAIR.Action.Label",
  crew: "ME5E.VEHICLE.Activation.Crew.label"
};
preLocalize("abilityActivationTypes");

/* -------------------------------------------- */

/**
 * Configuration data for activation types on activities.
 * @enum {ActivityActivationTypeConfiguration}
 */
ME5E.activityActivationTypes = {
  action: {
    label: "ME5E.ACTIVATION.Type.Action.Label",
    header: "ME5E.ACTIVATION.Type.Action.Header",
    group: "ME5E.ACTIVATION.Category.Standard"
  },
  bonus: {
    label: "ME5E.ACTIVATION.Type.BonusAction.Label",
    header: "ME5E.ACTIVATION.Type.BonusAction.Header",
    group: "ME5E.ACTIVATION.Category.Standard"
  },
  reaction: {
    label: "ME5E.ACTIVATION.Type.Reaction.Label",
    header: "ME5E.ACTIVATION.Type.Reaction.Header",
    group: "ME5E.ACTIVATION.Category.Standard"
  },
  minute: {
    label: "ME5E.ACTIVATION.Type.Minute.Label",
    header: "ME5E.ACTIVATION.Type.Minute.Header",
    group: "ME5E.ACTIVATION.Category.Time",
    scalar: true
  },
  hour: {
    label: "ME5E.ACTIVATION.Type.Hour.Label",
    header: "ME5E.ACTIVATION.Type.Hour.Header",
    group: "ME5E.ACTIVATION.Category.Time",
    scalar: true
  },
  day: {
    label: "ME5E.ACTIVATION.Type.Day.Label",
    header: "ME5E.ACTIVATION.Type.Day.Header",
    group: "ME5E.ACTIVATION.Category.Time",
    scalar: true
  },
  longRest: {
    label: "ME5E.ACTIVATION.Type.LongRest.Label",
    group: "ME5E.ACTIVATION.Category.Rest",
    passive: true
  },
  shortRest: {
    label: "ME5E.ACTIVATION.Type.ShortRest.Label",
    group: "ME5E.ACTIVATION.Category.Rest",
    passive: true
  },
  encounter: {
    label: "ME5E.ACTIVATION.Type.Encounter.Label",
    group: "ME5E.ACTIVATION.Category.Combat",
    passive: true
  },
  turnStart: {
    label: "ME5E.ACTIVATION.Type.TurnStart.Label",
    group: "ME5E.ACTIVATION.Category.Combat",
    passive: true
  },
  turnEnd: {
    label: "ME5E.ACTIVATION.Type.TurnEnd.Label",
    group: "ME5E.ACTIVATION.Category.Combat",
    passive: true
  },
  legendary: {
    counted: "ME5E.ACTIVATION.Type.Legendary.Counted",
    consume: {
      property: "resources.legact"
    },
    label: "ME5E.ACTIVATION.Type.Legendary.Label",
    header: "ME5E.ACTIVATION.Type.Legendary.Header",
    group: "ME5E.ACTIVATION.Category.Monster",
    scalar: true
  },
  mythic: {
    counted: "ME5E.ACTIVATION.Type.Mythic.Counted",
    consume: {
      property: "resources.legact"
    },
    label: "ME5E.ACTIVATION.Type.Mythic.Label",
    header: "ME5E.ACTIVATION.Type.Mythic.Header",
    group: "ME5E.ACTIVATION.Category.Monster",
    scalar: true
  },
  lair: {
    label: "ME5E.ACTIVATION.Type.Lair.Label",
    header: "ME5E.ACTIVATION.Type.Lair.Header",
    group: "ME5E.ACTIVATION.Category.Monster"
  },
  crew: {
    counted: "ME5E.ACTIVATION.Type.Crew.Counted",
    consume: {
      canConsume: VehicleData.canConsumeCrewAction,
      property: "attributes.actions"
    },
    label: "ME5E.ACTIVATION.Type.Crew.Label",
    header: "ME5E.ACTIVATION.Type.Crew.Header",
    group: "ME5E.ACTIVATION.Category.Vehicle",
    scalar: true
  },
  special: {
    label: "ME5E.Special",
    passive: true
  }
};
preLocalize("activityActivationTypes", { key: "label" });

/* -------------------------------------------- */

/**
 * Different things that an ability can consume upon use.
 * @enum {string}
 */
ME5E.abilityConsumptionTypes = {
  ammo: "ME5E.ConsumeAmmunition",
  attribute: "ME5E.ConsumeAttribute",
  hitDice: "ME5E.ConsumeHitDice",
  material: "ME5E.ConsumeMaterial",
  charges: "ME5E.ConsumeCharges"
};
preLocalize("abilityConsumptionTypes", { sort: true });

/* -------------------------------------------- */

/**
 * Configuration information for different consumption targets.
 * @enum {ActivityConsumptionTargetConfiguration}
 */
ME5E.activityConsumptionTypes = {
  activityUses: {
    label: "ME5E.CONSUMPTION.Type.ActivityUses.Label",
    consume: ConsumptionTargetData.consumeActivityUses,
    consumptionLabels: ConsumptionTargetData.consumptionLabelsActivityUses
  },
  itemUses: {
    label: "ME5E.CONSUMPTION.Type.ItemUses.Label",
    consume: ConsumptionTargetData.consumeItemUses,
    consumptionLabels: ConsumptionTargetData.consumptionLabelsItemUses,
    nonEmbeddedHint: "ME5E.CONSUMPTION.Type.ItemUses.NonEmbeddedHint",
    targetRequiresEmbedded: true,
    validTargets: ConsumptionTargetData.validItemUsesTargets
  },
  material: {
    label: "ME5E.CONSUMPTION.Type.Material.Label",
    consume: ConsumptionTargetData.consumeMaterial,
    consumptionLabels: ConsumptionTargetData.consumptionLabelsMaterial,
    nonEmbeddedHint: "ME5E.CONSUMPTION.Type.Material.NonEmbeddedHint",
    targetRequiresEmbedded: true,
    validTargets: ConsumptionTargetData.validMaterialTargets
  },
  hitDice: {
    label: "ME5E.CONSUMPTION.Type.HitDice.Label",
    consume: ConsumptionTargetData.consumeHitDice,
    consumptionLabels: ConsumptionTargetData.consumptionLabelsHitDice,
    validTargets: ConsumptionTargetData.validHitDiceTargets
  },
  spellSlots: {
    label: "ME5E.CONSUMPTION.Type.SpellSlots.Label",
    consume: ConsumptionTargetData.consumeSpellSlots,
    consumptionLabels: ConsumptionTargetData.consumptionLabelsSpellSlots,
    scalingModes: [{ value: "level", label: "ME5E.CONSUMPTION.Scaling.SlotLevel" }],
    validTargets: ConsumptionTargetData.validSpellSlotsTargets
  },
  attribute: {
    label: "ME5E.CONSUMPTION.Type.Attribute.Label",
    consume: ConsumptionTargetData.consumeAttribute,
    consumptionLabels: ConsumptionTargetData.consumptionLabelsAttribute,
    nonEmbeddedHint: "ME5E.CONSUMPTION.Type.Attribute.NonEmbeddedHint",
    targetRequiresEmbedded: true,
    validTargets: ConsumptionTargetData.validAttributeTargets
  }
};
preLocalize("activityConsumptionTypes", { key: "label" });

/* -------------------------------------------- */

/**
 * Creature sizes ordered from smallest to largest.
 * @enum {ActorSizeConfiguration}
 */
ME5E.actorSizes = {
  tiny: {
    label: "ME5E.SizeTiny",
    abbreviation: "ME5E.SizeTinyAbbr",
    hitDie: 4,
    token: 0.5,
    capacityMultiplier: 0.5,
    numerical: 0
  },
  sm: {
    label: "ME5E.SizeSmall",
    abbreviation: "ME5E.SizeSmallAbbr",
    hitDie: 6,
    dynamicTokenScale: 0.8,
    numerical: 1
  },
  med: {
    label: "ME5E.SizeMedium",
    abbreviation: "ME5E.SizeMediumAbbr",
    hitDie: 8,
    numerical: 2
  },
  lg: {
    label: "ME5E.SizeLarge",
    abbreviation: "ME5E.SizeLargeAbbr",
    hitDie: 10,
    token: 2,
    capacityMultiplier: 2,
    numerical: 3
  },
  huge: {
    label: "ME5E.SizeHuge",
    abbreviation: "ME5E.SizeHugeAbbr",
    hitDie: 12,
    token: 3,
    capacityMultiplier: 4,
    numerical: 4
  },
  grg: {
    label: "ME5E.SizeGargantuan",
    abbreviation: "ME5E.SizeGargantuanAbbr",
    hitDie: 20,
    token: 4,
    capacityMultiplier: 8,
    numerical: 5
  }
};
preLocalize("actorSizes", { keys: ["label", "abbreviation"] });

/* -------------------------------------------- */
/*  Canvas                                      */
/* -------------------------------------------- */

/**
 * Colors used to visualize temporary and temporary maximum HP in token health bars.
 * @enum {number}
 */
ME5E.tokenHPColors = {
  damage: 0xFF0000,
  healing: 0x00FF00,
  temp: 0x66CCFF,
  tempmax: 0x440066,
  negmax: 0x550000
};

/* -------------------------------------------- */

/**
 * Colors used when a dynamic token ring effects.
 * @enum {number}
 */
ME5E.tokenRingColors = {
  damage: 0xFF0000,
  defeated: 0x000000,
  healing: 0x00FF00,
  temp: 0x33AAFF
};

/* -------------------------------------------- */

/**
 * Colors used to denote movement speed on ruler segments & grid highlighting
 * @enum {number}
 */
ME5E.tokenRulerColors = {
  normal: 0x33BC4E,
  double: 0xF1D836,
  triple: 0xE72124
};

/* -------------------------------------------- */

/**
 * Settings used to render map location markers on the canvas.
 * @enum {MapLocationMarkerStyle}
 */
ME5E.mapLocationMarker = {
  default: {
    icon: MapLocationControlIcon,
    backgroundColor: 0xFBF8F5,
    borderColor: 0x000000,
    borderHoverColor: 0xFF5500,
    fontFamily: "Roboto Slab",
    shadowColor: 0x000000,
    textColor: 0x000000
  }
};

/* -------------------------------------------- */

/**
 * Default types of creatures.
 * @enum {CreatureTypeConfiguration}
 */
ME5E.creatureTypes = {
  aberration: {
    label: "ME5E.CreatureAberration",
    plural: "ME5E.CreatureAberrationPl",
    icon: "icons/creatures/tentacles/tentacle-eyes-yellow-pink.webp",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.yy50qVC1JhPHt4LC",
    detectAlignment: true
  },
  beast: {
    label: "ME5E.CreatureBeast",
    plural: "ME5E.CreatureBeastPl",
    icon: "icons/creatures/claws/claw-bear-paw-swipe-red.webp",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.6bTHn7pZek9YX2tv"
  },
  celestial: {
    label: "ME5E.CreatureCelestial",
    plural: "ME5E.CreatureCelestialPl",
    icon: "icons/creatures/abilities/wings-birdlike-blue.webp",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.T5CJwxjhBbi6oqaM",
    detectAlignment: true
  },
  construct: {
    label: "ME5E.CreatureConstruct",
    plural: "ME5E.CreatureConstructPl",
    icon: "icons/creatures/magical/construct-stone-earth-gray.webp",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.jQGAJZBZTqDFod8d"
  },
  dragon: {
    label: "ME5E.CreatureDragon",
    plural: "ME5E.CreatureDragonPl",
    icon: "icons/creatures/abilities/dragon-fire-breath-orange.webp",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.k2IRXZwGk9W0PM2S"
  },
  elemental: {
    label: "ME5E.CreatureElemental",
    plural: "ME5E.CreatureElementalPl",
    icon: "icons/creatures/magical/spirit-fire-orange.webp",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.7z1LXGGkXpHuzkFh",
    detectAlignment: true
  },
  fey: {
    label: "ME5E.CreatureFey",
    plural: "ME5E.CreatureFeyPl",
    icon: "icons/creatures/magical/fae-fairy-winged-glowing-green.webp",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.OFsRUt3pWljgm8VC",
    detectAlignment: true
  },
  fiend: {
    label: "ME5E.CreatureFiend",
    plural: "ME5E.CreatureFiendPl",
    icon: "icons/magic/death/skull-horned-goat-pentagram-red.webp",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.ElHKBJeiJPC7gj6k",
    detectAlignment: true
  },
  giant: {
    label: "ME5E.CreatureGiant",
    plural: "ME5E.CreatureGiantPl",
    icon: "icons/creatures/magical/humanoid-giant-forest-blue.webp",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.AOXn3Mv5vPZwo0Uf"
  },
  humanoid: {
    label: "ME5E.CreatureHumanoid",
    plural: "ME5E.CreatureHumanoidPl",
    icon: "icons/environment/people/group.webp",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.iFzQs4AenN8ALRvw"
  },
  monstrosity: {
    label: "ME5E.CreatureMonstrosity",
    plural: "ME5E.CreatureMonstrosityPl",
    icon: "icons/creatures/abilities/mouth-teeth-rows-red.webp",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.TX0yPEFTn79AMZ8P"
  },
  ooze: {
    label: "ME5E.CreatureOoze",
    plural: "ME5E.CreatureOozePl",
    icon: "icons/creatures/slimes/slime-movement-pseudopods-green.webp",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.cgzIC1ecG03D97Fg"
  },
  plant: {
    label: "ME5E.CreaturePlant",
    plural: "ME5E.CreaturePlantPl",
    icon: "icons/magic/nature/tree-animated-strike.webp",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.1oT7t6tHE4kZuSN1"
  },
  undead: {
    label: "ME5E.CreatureUndead",
    plural: "ME5E.CreatureUndeadPl",
    icon: "icons/magic/death/skull-horned-worn-fire-blue.webp",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.D2BdqS1GeD5rcZ6q",
    detectAlignment: true
  }
};
preLocalize("creatureTypes", { keys: ["label", "plural"], sort: true });

/* -------------------------------------------- */

/**
 * Classification types for item action types.
 * @enum {string}
 */
ME5E.itemActionTypes = {
  mwak: "ME5E.ActionMWAK",
  rwak: "ME5E.ActionRWAK",
  msak: "ME5E.ActionMSAK",
  rsak: "ME5E.ActionRSAK",
  abil: "ME5E.ActionAbil",
  save: "ME5E.ActionSave",
  ench: "ME5E.ActionEnch",
  summ: "ME5E.ActionSumm",
  heal: "ME5E.ActionHeal",
  util: "ME5E.ActionUtil",
  other: "ME5E.ActionOther"
};
preLocalize("itemActionTypes");

/* -------------------------------------------- */

/**
 * Different ways in which item capacity can be limited.
 * @enum {string}
 */
ME5E.itemCapacityTypes = {
  items: "ME5E.ItemContainerCapacityItems",
  weight: "ME5E.ItemContainerCapacityWeight"
};
preLocalize("itemCapacityTypes", { sort: true });

/* -------------------------------------------- */

/**
 * List of various item rarities.
 * @enum {string}
 */
ME5E.itemRarity = {
  common: "ME5E.ItemRarityCommon",
  uncommon: "ME5E.ItemRarityUncommon",
  rare: "ME5E.ItemRarityRare",
  veryRare: "ME5E.ItemRarityVeryRare",
  legendary: "ME5E.ItemRarityLegendary",
  artifact: "ME5E.ItemRarityArtifact"
};
preLocalize("itemRarity");

/* -------------------------------------------- */

/**
 * Enumerate the lengths of time over which an item can have limited use ability.
 * @enum {LimitedUsePeriodConfiguration}
 */
ME5E.limitedUsePeriods = {
  lr: {
    label: "ME5E.USES.Recovery.Period.LongRest.Label",
    abbreviation: "ME5E.USES.Recovery.Period.LongRest.Abbreviation"
  },
  sr: {
    label: "ME5E.USES.Recovery.Period.ShortRest.Label",
    abbreviation: "ME5E.USES.Recovery.Period.ShortRest.Abbreviation"
  },
  day: {
    label: "ME5E.USES.Recovery.Period.Day.Label",
    abbreviation: "ME5E.USES.Recovery.Period.Day.Label"
  },
  dawn: {
    label: "ME5E.USES.Recovery.Period.Dawn.Label",
    abbreviation: "ME5E.USES.Recovery.Period.Dawn.Label",
    formula: true
  },
  dusk: {
    label: "ME5E.USES.Recovery.Period.Dusk.Label",
    abbreviation: "ME5E.USES.Recovery.Period.Dusk.Label",
    formula: true
  },
  initiative: {
    label: "ME5E.USES.Recovery.Period.Initiative.Label",
    abbreviation: "ME5E.USES.Recovery.Period.Initiative.Label",
    type: "special"
  },
  turnStart: {
    label: "ME5E.USES.Recovery.Period.TurnStart.Label",
    abbreviation: "ME5E.USES.Recovery.Period.TurnStart.Abbreviation",
    type: "combat"
  },
  turnEnd: {
    label: "ME5E.USES.Recovery.Period.TurnEnd.Label",
    abbreviation: "ME5E.USES.Recovery.Period.TurnEnd.Abbreviation",
    type: "combat"
  },
  turn: {
    label: "ME5E.USES.Recovery.Period.Turn.Label",
    abbreviation: "ME5E.USES.Recovery.Period.Turn.Label",
    type: "combat"
  }
};
preLocalize("limitedUsePeriods", { keys: ["label", "abbreviation"] });

Object.defineProperty(ME5E.limitedUsePeriods, "recoveryOptions", {
  get() {
    return [
      ...Object.entries(CONFIG.ME5E.limitedUsePeriods)
        .filter(([, config]) => !config.deprecated)
        .map(([value, { label, type }]) => ({
          value, label, group: game.i18n.localize(`ME5E.USES.Recovery.${type?.capitalize() ?? "Time"}`)
        })),
      { value: "recharge", label: game.i18n.localize("ME5E.USES.Recovery.Recharge.Label") }
    ];
  }
});

/* -------------------------------------------- */

/**
 * Periods at which enchantments can be re-bound to new items.
 * @enum {{ label: string }}
 */
ME5E.enchantmentPeriods = {
  sr: {
    label: "ME5E.ENCHANTMENT.Period.ShortRest"
  },
  lr: {
    label: "ME5E.ENCHANTMENT.Period.LongRest"
  },
  atwill: {
    label: "ME5E.ENCHANTMENT.Period.AtWill"
  }
};
preLocalize("enchantmentPeriods", { key: "label" });

/* -------------------------------------------- */
/*  Armor                                       */
/* -------------------------------------------- */

/**
 * Specific equipment types that modify base AC.
 * @enum {string}
 */
ME5E.armorTypes = {
  light: "ME5E.EquipmentLight",
  medium: "ME5E.EquipmentMedium",
  heavy: "ME5E.EquipmentHeavy",
  natural: "ME5E.EquipmentNatural",
  shield: "ME5E.EquipmentShield"
};
preLocalize("armorTypes");

/* -------------------------------------------- */

/**
 * The set of Armor Proficiencies which a character may have.
 * @enum {string}
 */
ME5E.armorProficiencies = {
  lgt: "ME5E.ArmorLightProficiency",
  med: "ME5E.ArmorMediumProficiency",
  hvy: "ME5E.ArmorHeavyProficiency",
  shl: "ME5E.EquipmentShieldProficiency"
};
preLocalize("armorProficiencies");

/* -------------------------------------------- */

/**
 * A mapping between `ME5E.equipmentTypes` and `ME5E.armorProficiencies` that
 * is used to determine if character has proficiency when adding an item.
 * @enum {(boolean|string)}
 */
ME5E.armorProficienciesMap = {
  natural: true,
  clothing: true,
  light: "lgt",
  medium: "med",
  heavy: "hvy",
  shield: "shl"
};

/* -------------------------------------------- */

/**
 * The basic armor types in 5e. This enables specific armor proficiencies,
 * automated AC calculation in NPCs, and starting equipment.
 * @enum {string}
 */
ME5E.armorIds = {
  breastplate: "Compendium.me5e.equipment24.Item.phbarmBreastplat",
  chainmail: "Compendium.me5e.equipment24.Item.phbarmChainMail0",
  chainshirt: "Compendium.me5e.equipment24.Item.phbarmChainShirt",
  halfplate: "Compendium.me5e.equipment24.Item.phbarmHalfPlateA",
  hide: "Compendium.me5e.equipment24.Item.phbarmHideArmor0",
  leather: "Compendium.me5e.equipment24.Item.phbarmLeatherArm",
  padded: "Compendium.me5e.equipment24.Item.phbarmPaddedArmo",
  plate: "Compendium.me5e.equipment24.Item.phbarmPlateArmor",
  ringmail: "Compendium.me5e.equipment24.Item.phbarmRingMail00",
  scalemail: "Compendium.me5e.equipment24.Item.phbarmScaleMail0",
  splint: "Compendium.me5e.equipment24.Item.phbarmSplintArmo",
  studded: "Compendium.me5e.equipment24.Item.phbarmStuddedLea"
};

/* -------------------------------------------- */

/**
 * The basic shield in 5e.
 * @enum {string}
 */
ME5E.shieldIds = {
  shield: "Compendium.me5e.equipment24.Item.phbarmShield0000"
};

/* -------------------------------------------- */

/**
 * Common armor class calculations.
 * @enum {{ label: string, [formula]: string }}
 */
ME5E.armorClasses = {
  flat: {
    label: "ME5E.ArmorClassFlat",
    formula: "@attributes.ac.flat"
  },
  natural: {
    label: "ME5E.ArmorClassNatural",
    formula: "@attributes.ac.flat"
  },
  default: {
    label: "ME5E.ArmorClassEquipment",
    formula: "@attributes.ac.armor + @attributes.ac.dex"
  },
  mage: {
    label: "ME5E.ArmorClassMage",
    formula: "13 + @abilities.dex.mod"
  },
  draconic: {
    label: "ME5E.ArmorClassDraconic",
    formula: "13 + @abilities.dex.mod"
  },
  unarmoredMonk: {
    label: "ME5E.ArmorClassUnarmoredMonk",
    formula: "10 + @abilities.dex.mod + @abilities.wis.mod"
  },
  unarmoredBarb: {
    label: "ME5E.ArmorClassUnarmoredBarbarian",
    formula: "10 + @abilities.dex.mod + @abilities.con.mod"
  },
  unarmoredBard: {
    label: "ME5E.ArmorClassUnarmoredBard",
    formula: "10 + @abilities.dex.mod + @abilities.cha.mod"
  },
  custom: {
    label: "ME5E.ArmorClassCustom"
  }
};
preLocalize("armorClasses", { key: "label" });

/* -------------------------------------------- */
/*  Other Equipment Types                       */
/* -------------------------------------------- */

/**
 * Equipment types that aren't armor.
 * @enum {string}
 */
ME5E.miscEquipmentTypes = {
  clothing: "ME5E.EQUIPMENT.Type.Clothing.Label",
  ring: "ME5E.EQUIPMENT.Type.Ring.Label",
  rod: "ME5E.EQUIPMENT.Type.Rod.Label",
  trinket: "ME5E.EQUIPMENT.Type.Trinket.Label",
  vehicle: "ME5E.EQUIPMENT.Type.Vehicle.Label",
  wand: "ME5E.EQUIPMENT.Type.Wand.Label",
  wondrous: "ME5E.EQUIPMENT.Type.Wondrous.Label"
};
preLocalize("miscEquipmentTypes", { sort: true });

/* -------------------------------------------- */

/**
 * The set of equipment types for armor, clothing, and other objects which can be worn by the character.
 * @enum {string}
 */
ME5E.equipmentTypes = {
  ...ME5E.miscEquipmentTypes,
  ...ME5E.armorTypes
};
preLocalize("equipmentTypes", { sort: true });

/* -------------------------------------------- */

/**
 * The various types of vehicles in which characters can be proficient.
 * @enum {string}
 */
ME5E.vehicleTypes = {
  air: "ME5E.VEHICLE.Type.Air.label",
  land: "ME5E.VEHICLE.Type.Land.label",
  space: "ME5E.VEHICLE.Type.Space.label",
  water: "ME5E.VEHICLE.Type.Water.label"
};
preLocalize("vehicleTypes", { sort: true });

/* -------------------------------------------- */

/**
 * Enumerate the valid consumable types which are recognized by the system.
 * @enum {SubtypeTypeConfiguration}
 */
ME5E.consumableTypes = {
  ammo: {
    label: "ME5E.CONSUMABLE.Type.Ammunition.Label",
    subtypes: {
      arrow: "ME5E.CONSUMABLE.Type.Ammunition.Arrow",
      crossbowBolt: "ME5E.CONSUMABLE.Type.Ammunition.Bolt",
      energyCell: "ME5E.CONSUMABLE.Type.Ammunition.EnergyCell",
      firearmBullet: "ME5E.CONSUMABLE.Type.Ammunition.BulletFirearm",
      slingBullet: "ME5E.CONSUMABLE.Type.Ammunition.BulletSling",
      blowgunNeedle: "ME5E.CONSUMABLE.Type.Ammunition.Needle"
    }
  },
  potion: {
    label: "ME5E.CONSUMABLE.Type.Potion.Label"
  },
  poison: {
    label: "ME5E.CONSUMABLE.Type.Poison.Label",
    subtypes: {
      contact: "ME5E.CONSUMABLE.Type.Poison.Contact",
      ingested: "ME5E.CONSUMABLE.Type.Poison.Ingested",
      inhaled: "ME5E.CONSUMABLE.Type.Poison.Inhaled",
      injury: "ME5E.CONSUMABLE.Type.Poison.Injury"
    }
  },
  food: {
    label: "ME5E.CONSUMABLE.Type.Food.Label"
  },
  scroll: {
    label: "ME5E.CONSUMABLE.Type.Scroll.Label"
  },
  wand: {
    label: "ME5E.CONSUMABLE.Type.Wand.Label"
  },
  rod: {
    label: "ME5E.CONSUMABLE.Type.Rod.Label"
  },
  trinket: {
    label: "ME5E.CONSUMABLE.Type.Trinket.Label"
  },
  wondrous: {
    label: "ME5E.CONSUMABLE.Type.Wondrous.Label"
  }
};
preLocalize("consumableTypes", { key: "label", sort: true });
preLocalize("consumableTypes.ammo.subtypes", { sort: true });
preLocalize("consumableTypes.poison.subtypes", { sort: true });

/* -------------------------------------------- */

/**
 * Types of containers.
 * @enum {string}
 */
ME5E.containerTypes = {
  backpack: "H8YCd689ezlD26aT",
  barrel: "7Yqbqg5EtVW16wfT",
  basket: "Wv7HzD6dv1P0q78N",
  boltcase: "eJtPBiZtr2pp6ynt",
  bottle: "HZp69hhyNZUUCipF",
  bucket: "mQVYcHmMSoCUnBnM",
  case: "5mIeX824uMklU3xq",
  chest: "2YbuclKfhDL0bU4u",
  flask: "lHS63sC6bypENNlR",
  jug: "0ZBWwjFz3nIAXMLW",
  pot: "M8xM8BLK4tpUayEE",
  pitcher: "nXWdGtzi8DXDLLsL",
  pouch: "9bWTRRDym06PzSAf",
  quiver: "4MtQKPn9qMWCFjDA",
  sack: "CNdDj8dsXVpRVpXt",
  saddlebags: "TmfaFUSZJAotndn9",
  tankard: "uw6fINSmZ2j2o57A",
  vial: "meJEfX3gZgtMX4x2"
};

/* -------------------------------------------- */

/**
 * Type of spellcasting foci.
 * @enum {SpellcastingFocusConfiguration}
 */
ME5E.focusTypes = {
  arcane: {
    label: "ME5E.Focus.Arcane",
    itemIds: {
      crystal: "Compendium.me5e.equipment24.Item.phbafcCrystal000",
      orb: "Compendium.me5e.equipment24.Item.phbafcOrb0000000",
      rod: "Compendium.me5e.equipment24.Item.phbafcRod0000000",
      staff: "Compendium.me5e.equipment24.Item.phbafcStaffalsoa",
      wand: "Compendium.me5e.equipment24.Item.phbafcWand000000"
    }
  },
  druidic: {
    label: "ME5E.Focus.Druidic",
    itemIds: {
      mistletoe: "Compendium.me5e.equipment24.Item.phbdfcSprigofmis",
      woodenstaff: "Compendium.me5e.equipment24.Item.phbdfcWoodenstaf",
      yewwand: "Compendium.me5e.equipment24.Item.phbdfcYewwand000"
    }
  },
  holy: {
    label: "ME5E.Focus.Holy",
    itemIds: {
      amulet: "Compendium.me5e.equipment24.Item.phbhsyAmuletworn",
      emblem: "Compendium.me5e.equipment24.Item.phbhsyEmblemborn",
      reliquary: "Compendium.me5e.equipment24.Item.phbhsyReliquaryh"
    }
  }
};
preLocalize("focusTypes", { key: "label" });

/* -------------------------------------------- */

/**
 * Types of "features" items.
 * @enum {SubtypeTypeConfiguration}
 */
ME5E.featureTypes = {
  background: {
    label: "ME5E.Feature.Background"
  },
  class: {
    label: "ME5E.Feature.Class.Label",
    subtypes: {
      arcaneShot: "ME5E.Feature.Class.ArcaneShot",
      artificerInfusion: "ME5E.Feature.Class.ArtificerPlan",
      channelDivinity: "ME5E.Feature.Class.ChannelDivinity",
      defensiveTactic: "ME5E.Feature.Class.DefensiveTactic",
      eldritchInvocation: "ME5E.Feature.Class.EldritchInvocation",
      elementalDiscipline: "ME5E.Feature.Class.ElementalDiscipline",
      fightingStyle: "ME5E.Feature.Class.FightingStyle",
      huntersPrey: "ME5E.Feature.Class.HuntersPrey",
      ki: "ME5E.Feature.Class.Ki",
      maneuver: "ME5E.Feature.Class.Maneuver",
      metamagic: "ME5E.Feature.Class.Metamagic",
      multiattack: "ME5E.Feature.Class.Multiattack",
      pact: "ME5E.Feature.Class.PactBoon",
      psionicPower: "ME5E.Feature.Class.PsionicPower",
      rune: "ME5E.Feature.Class.Rune",
      superiorHuntersDefense: "ME5E.Feature.Class.SuperiorHuntersDefense"
    }
  },
  monster: {
    label: "ME5E.Feature.Monster"
  },
  race: {
    label: "ME5E.Feature.Species"
  },
  enchantment: {
    label: "ME5E.ENCHANTMENT.Label",
    subtypes: {
      artificerInfusion: "ME5E.Feature.Class.ArtificerPlan",
      rune: "ME5E.Feature.Class.Rune"
    }
  },
  feat: {
    label: "ME5E.Feature.Feat.Label",
    subtypes: {
      general: "ME5E.Feature.Feat.General",
      origin: "ME5E.Feature.Feat.Origin",
      fightingStyle: "ME5E.Feature.Feat.FightingStyle",
      epicBoon: "ME5E.Feature.Feat.EpicBoon"
    }
  },
  supernaturalGift: {
    label: "ME5E.Feature.SupernaturalGift.Label",
    subtypes: {
      blessing: "ME5E.Feature.SupernaturalGift.Blessing",
      charm: "ME5E.Feature.SupernaturalGift.Charm",
      epicBoon: "ME5E.Feature.SupernaturalGift.EpicBoon"
    }
  },
  vehicle: {
    label: "ME5E.Feature.Vehicle.Label"
  }
};
preLocalize("featureTypes", { key: "label" });
preLocalize("featureTypes.class.subtypes", { sort: true });
preLocalize("featureTypes.enchantment.subtypes", { sort: true });
preLocalize("featureTypes.feat.subtypes", { sort: true });
preLocalize("featureTypes.supernaturalGift.subtypes", { sort: true });

/* -------------------------------------------- */

/**
 * The various properties of all item types.
 * @enum {ItemPropertyConfiguration}
 */
ME5E.itemProperties = {
  ada: {
    label: "ME5E.ITEM.Property.Adamantine",
    isPhysical: true
  },
  amm: {
    label: "ME5E.ITEM.Property.Ammunition"
  },
  concentration: {
    label: "ME5E.ITEM.Property.Concentration",
    abbreviation: "ME5E.ConcentrationAbbr",
    icon: "systems/me5e/icons/svg/statuses/concentrating.svg",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.ow58p27ctAnr4VPH",
    isTag: true
  },
  fin: {
    label: "ME5E.ITEM.Property.Finesse"
  },
  fir: {
    label: "ME5E.ITEM.Property.Firearm"
  },
  foc: {
    label: "ME5E.ITEM.Property.Focus"
  },
  hvy: {
    label: "ME5E.ITEM.Property.Heavy"
  },
  lgt: {
    label: "ME5E.ITEM.Property.Light"
  },
  lod: {
    label: "ME5E.ITEM.Property.Loading"
  },
  material: {
    label: "ME5E.ITEM.Property.Material",
    abbreviation: "ME5E.ComponentMaterialAbbr",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.AeH5eDS4YeM9RETC"
  },
  mgc: {
    label: "ME5E.ITEM.Property.Magical",
    icon: "systems/me5e/icons/svg/properties/magical.svg",
    isPhysical: true
  },
  rch: {
    label: "ME5E.ITEM.Property.Reach"
  },
  rel: {
    label: "ME5E.ITEM.Property.Reload"
  },
  ret: {
    label: "ME5E.ITEM.Property.Returning"
  },
  ritual: {
    label: "ME5E.ITEM.Property.Ritual",
    abbreviation: "ME5E.RitualAbbr",
    icon: "systems/me5e/icons/svg/items/spell.svg",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.FjWqT5iyJ89kohdA",
    isTag: true
  },
  sidekick: {
    label: "ME5E.ITEM.Property.Sidekick"
  },
  sil: {
    label: "ME5E.ITEM.Property.Silvered",
    isPhysical: true
  },
  somatic: {
    label: "ME5E.ITEM.Property.Somatic",
    abbreviation: "ME5E.ComponentSomaticAbbr",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.qwUNgUNilEmZkSC9"
  },
  spc: {
    label: "ME5E.ITEM.Property.Special"
  },
  stealthDisadvantage: {
    label: "ME5E.ITEM.Property.StealthDisadvantage"
  },
  thr: {
    label: "ME5E.ITEM.Property.Thrown"
  },
  trait: {
    label: "ME5E.ITEM.Property.Trait"
  },
  two: {
    label: "ME5E.ITEM.Property.TwoHanded"
  },
  ver: {
    label: "ME5E.ITEM.Property.Versatile"
  },
  vocal: {
    label: "ME5E.ITEM.Property.Verbal",
    abbreviation: "ME5E.ComponentVerbalAbbr",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.6UXTNWMCQ0nSlwwx"
  },
  weightlessContents: {
    label: "ME5E.ITEM.Property.WeightlessContents"
  }
};
preLocalize("itemProperties", { keys: ["label", "abbreviation"], sort: true });

/* -------------------------------------------- */

/**
 * The various properties of an item per item type.
 * @enum {object}
 */
ME5E.validProperties = {
  class: new Set([
    "sidekick"
  ]),
  consumable: new Set([
    "mgc"
  ]),
  container: new Set([
    "mgc",
    "weightlessContents"
  ]),
  equipment: new Set([
    "ada",
    "foc",
    "mgc",
    "stealthDisadvantage"
  ]),
  feat: new Set([
    "mgc",
    "trait"
  ]),
  loot: new Set([
    "mgc"
  ]),
  weapon: new Set([
    "ada",
    "amm",
    "fin",
    "fir",
    "foc",
    "hvy",
    "lgt",
    "lod",
    "mgc",
    "rch",
    "rel",
    "ret",
    "sil",
    "spc",
    "thr",
    "two",
    "ver"
  ]),
  spell: new Set([
    "vocal",
    "somatic",
    "material",
    "concentration",
    "ritual"
  ]),
  tool: new Set([
    "foc",
    "mgc"
  ])
};

/* -------------------------------------------- */

/**
 * Types of "loot" items.
 * @enum {{ label: string }}
 */
ME5E.lootTypes = {
  art: {
    label: "ME5E.Loot.Art"
  },
  gear: {
    label: "ME5E.Loot.Gear"
  },
  gem: {
    label: "ME5E.Loot.Gem"
  },
  junk: {
    label: "ME5E.Loot.Junk"
  },
  material: {
    label: "ME5E.Loot.Material"
  },
  resource: {
    label: "ME5E.Loot.Resource"
  },
  trade: {
    label: "ME5E.Loot.Trade"
  },
  treasure: {
    label: "ME5E.Loot.Treasure"
  }
};
preLocalize("lootTypes", { key: "label" });

/* -------------------------------------------- */

/**
 * The valid currency denominations with localized labels, abbreviations, and conversions.
 * The conversion number defines how many of that currency are equal to one GP.
 * @enum {CurrencyConfiguration}
 */
ME5E.currencies = {
  pp: {
    label: "ME5E.CurrencyPP",
    abbreviation: "ME5E.CurrencyAbbrPP",
    conversion: 0.1,
    icon: "systems/me5e/icons/currency/platinum.webp"
  },
  gp: {
    label: "ME5E.CurrencyGP",
    abbreviation: "ME5E.CurrencyAbbrGP",
    conversion: 1,
    icon: "systems/me5e/icons/currency/gold.webp"
  },
  ep: {
    label: "ME5E.CurrencyEP",
    abbreviation: "ME5E.CurrencyAbbrEP",
    conversion: 2,
    icon: "systems/me5e/icons/currency/electrum.webp"
  },
  sp: {
    label: "ME5E.CurrencySP",
    abbreviation: "ME5E.CurrencyAbbrSP",
    conversion: 10,
    icon: "systems/me5e/icons/currency/silver.webp"
  },
  cp: {
    label: "ME5E.CurrencyCP",
    abbreviation: "ME5E.CurrencyAbbrCP",
    conversion: 100,
    icon: "systems/me5e/icons/currency/copper.webp"
  }
};
preLocalize("currencies", { keys: ["label", "abbreviation"] });

/* -------------------------------------------- */

/**
 * Configuration data for crafting costs.
 * @type {CraftingConfiguration}
 */
ME5E.crafting = {
  consumable: {
    days: .5,
    gold: .5
  },
  exceptions: {
    "potion-of-healing": {
      days: 1,
      gold: 25
    }
  },
  magic: {
    common: {
      days: 5,
      gold: 50
    },
    uncommon: {
      days: 10,
      gold: 200
    },
    rare: {
      days: 50,
      gold: 2_000
    },
    veryRare: {
      days: 125,
      gold: 20_000
    },
    legendary: {
      days: 250,
      gold: 100_000
    }
  },
  mundane: {
    days: .1,
    gold: .5
  },
  scrolls: {
    0: {
      days: 1,
      gold: 15
    },
    1: {
      days: 1,
      gold: 25
    },
    2: {
      days: 3,
      gold: 100
    },
    3: {
      days: 5,
      gold: 150
    },
    4: {
      days: 10,
      gold: 1_000
    },
    5: {
      days: 25,
      gold: 1_500
    },
    6: {
      days: 40,
      gold: 10_000
    },
    7: {
      days: 50,
      gold: 12_500
    },
    8: {
      days: 60,
      gold: 15_000
    },
    9: {
      days: 120,
      gold: 50_000
    }
  }
};

/* -------------------------------------------- */
/*  Damage                                      */
/* -------------------------------------------- */

/**
 * Standard dice spread available for things like damage.
 * @type {number[]}
 */
ME5E.dieSteps = [4, 6, 8, 10, 12, 20, 100];

/* -------------------------------------------- */

/**
 * Methods by which damage scales relative to the overall scaling increase.
 * @enum {{ label: string, labelCantrip: string }}
 */
ME5E.damageScalingModes = {
  whole: {
    label: "ME5E.DAMAGE.Scaling.Whole",
    labelCantrip: "ME5E.DAMAGE.Scaling.WholeCantrip"
  },
  half: {
    label: "ME5E.DAMAGE.Scaling.Half",
    labelCantrip: "ME5E.DAMAGE.Scaling.HalfCantrip"
  }
};
preLocalize("damageScalingModes", { keys: ["label", "labelCantrip"] });

/* -------------------------------------------- */

/**
 * Types of damage the can be caused by abilities.
 * @enum {DamageTypeConfiguration}
 */
ME5E.damageTypes = {
  acid: {
    label: "ME5E.DamageAcid",
    icon: "systems/me5e/icons/svg/damage/acid.svg",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.IQhbKRPe1vCPdh8v",
    color: new Color(0x839D50)
  },
  bludgeoning: {
    label: "ME5E.DamageBludgeoning",
    icon: "systems/me5e/icons/svg/damage/bludgeoning.svg",
    isPhysical: true,
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.39LFrlef94JIYO8m",
    color: new Color(0x0000A0)
  },
  cold: {
    label: "ME5E.DamageCold",
    icon: "systems/me5e/icons/svg/damage/cold.svg",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.4xsFUooHDEdfhw6g",
    color: new Color(0xADD8E6)
  },
  fire: {
    label: "ME5E.DamageFire",
    icon: "systems/me5e/icons/svg/damage/fire.svg",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.f1S66aQJi4PmOng6",
    color: new Color(0xFF4500)
  },
  force: {
    label: "ME5E.DamageForce",
    icon: "systems/me5e/icons/svg/damage/force.svg",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.eFTWzngD8dKWQuUR",
    color: new Color(0x800080)
  },
  lightning: {
    label: "ME5E.DamageLightning",
    icon: "systems/me5e/icons/svg/damage/lightning.svg",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.9SaxFJ9bM3SutaMC",
    color: new Color(0x1E90FF)
  },
  necrotic: {
    label: "ME5E.DamageNecrotic",
    icon: "systems/me5e/icons/svg/damage/necrotic.svg",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.klOVUV5G1U7iaKoG",
    color: new Color(0x006400)
  },
  piercing: {
    label: "ME5E.DamagePiercing",
    icon: "systems/me5e/icons/svg/damage/piercing.svg",
    isPhysical: true,
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.95agSnEGTdAmKhyC",
    color: new Color(0xC0C0C0)
  },
  poison: {
    label: "ME5E.DamagePoison",
    icon: "systems/me5e/icons/svg/damage/poison.svg",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.k5wOYXdWPzcWwds1",
    color: new Color(0x8A2BE2)
  },
  psychic: {
    label: "ME5E.DamagePsychic",
    icon: "systems/me5e/icons/svg/damage/psychic.svg",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.YIKbDv4zYqbE5teJ",
    color: new Color(0xFF1493)
  },
  radiant: {
    label: "ME5E.DamageRadiant",
    icon: "systems/me5e/icons/svg/damage/radiant.svg",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.5tcK9buXWDOw8yHH",
    color: new Color(0xFFD700)
  },
  slashing: {
    label: "ME5E.DamageSlashing",
    icon: "systems/me5e/icons/svg/damage/slashing.svg",
    isPhysical: true,
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.sz2XKQ5lgsdPEJOa",
    color: new Color(0x8B0000)
  },
  thunder: {
    label: "ME5E.DamageThunder",
    icon: "systems/me5e/icons/svg/damage/thunder.svg",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.iqsmMHk7FSpiNkQy",
    color: new Color(0x708090)
  }
};
preLocalize("damageTypes", { keys: ["label"], sort: true });

/* -------------------------------------------- */

/**
 * Display aggregated damage in chat cards.
 * @type {boolean}
 */
ME5E.aggregateDamageDisplay = true;

/* -------------------------------------------- */

/**
 * Different types of healing that can be applied using abilities.
 * @enum {DamageTypeConfiguration}
 */
ME5E.healingTypes = {
  healing: {
    label: "ME5E.Healing",
    icon: "systems/me5e/icons/svg/damage/healing.svg",
    color: new Color(0x46C252)
  },
  temphp: {
    label: "ME5E.HealingTemp",
    icon: "systems/me5e/icons/svg/damage/temphp.svg",
    color: new Color(0x4B66DE)
  }
};
preLocalize("healingTypes", { keys: ["label"] });

/* -------------------------------------------- */
/*  Movement                                    */
/* -------------------------------------------- */

/**
 * Types of terrain that can cause difficult terrain.
 * @enum {{ label: string }}
 */
ME5E.difficultTerrainTypes = {
  ice: {
    label: "ME5E.REGIONBEHAVIORS.DIFFICULTTERRAIN.Type.Ice"
  },
  liquid: {
    label: "ME5E.REGIONBEHAVIORS.DIFFICULTTERRAIN.Type.Liquid"
  },
  plants: {
    label: "ME5E.REGIONBEHAVIORS.DIFFICULTTERRAIN.Type.Plants"
  },
  rocks: {
    label: "ME5E.REGIONBEHAVIORS.DIFFICULTTERRAIN.Type.Rocks"
  },
  mud: {
    label: "ME5E.REGIONBEHAVIORS.DIFFICULTTERRAIN.Type.Mud"
  },
  sand: {
    label: "ME5E.REGIONBEHAVIORS.DIFFICULTTERRAIN.Type.Sand"
  },
  slope: {
    label: "ME5E.REGIONBEHAVIORS.DIFFICULTTERRAIN.Type.Slope"
  },
  snow: {
    label: "ME5E.REGIONBEHAVIORS.DIFFICULTTERRAIN.Type.Snow"
  },
  web: {
    label: "ME5E.REGIONBEHAVIORS.DIFFICULTTERRAIN.Type.Webs"
  }
};
preLocalize("difficultTerrainTypes", { key: "label", sort: true });

/* -------------------------------------------- */

/**
 * Types of movement supported by creature actors in the system.
 * @enum {MovementTypeConfiguration}
 */
ME5E.movementTypes = {
  walk: {
    label: "ME5E.MOVEMENT.Type.Speed"
  },
  burrow: {
    label: "ME5E.MOVEMENT.Type.Burrow"
  },
  climb: {
    label: "ME5E.MOVEMENT.Type.Climb",
    walkFallback: true
  },
  fly: {
    label: "ME5E.MOVEMENT.Type.Fly",
    travel: "air"
  },
  swim: {
    label: "ME5E.MOVEMENT.Type.Swim",
    travel: "water",
    walkFallback: true
  }
};
preLocalize("movementTypes", { key: "label" });
patchConfig("movementTypes", "label", { since: "ME5e 5.1", until: "ME5e 5.3" });

/* -------------------------------------------- */

/**
 * Default number of hours per day traveled by specific actor types.
 * @enum {number}
 */
ME5E.travelTimes = {
  group: 8,
  vehicle: 24
};

/* -------------------------------------------- */

/**
 * Types of movement supported by creature actors in the system.
 * @enum {Omit<MovementTypeConfiguration, "travel">}
 */
ME5E.travelTypes = {
  land: {
    label: "ME5E.TRAVEL.Type.Land"
  },
  water: {
    label: "ME5E.TRAVEL.Type.Water"
  },
  air: {
    label: "ME5E.TRAVEL.Type.Air"
  }
};
preLocalize("travelTypes", { key: "label" });

/* -------------------------------------------- */

/**
 * Available travel paces.
 * @type {Readonly<Record<string, TravelPaceConfiguration>>}
 */
ME5E.travelPace = Object.freeze({
  slow: {
    label: "ME5E.TRAVEL.Pace.Slow",
    standard: 18,
    multiplier: 2 / 3,
    round: "down"
  },
  normal: {
    label: "ME5E.TRAVEL.Pace.Normal",
    standard: 24,
    multiplier: 1,
    round: "down"
  },
  fast: {
    label: "ME5E.TRAVEL.Pace.Fast",
    standard: 30,
    multiplier: 4 / 3,
    round: "down"
  }
});
preLocalize("travelPace", { key: "label" });

/* -------------------------------------------- */
/*  Measurement                                 */
/* -------------------------------------------- */

/**
 * Default units used for imperial & metric settings.
 * @enum {{ imperial: string, metric: string }}
 */
ME5E.defaultUnits = {
  length: {
    imperial: "ft",
    metric: "m"
  },
  travel: {
    imperial: "mph",
    metric: "kph"
  },
  volume: {
    imperial: "cubicFoot",
    metric: "liter"
  },
  weight: {
    imperial: "lb",
    metric: "kg"
  }
};

/* -------------------------------------------- */

/**
 * The valid units of measure for movement distances in the game system.
 * @enum {MovementUnitConfiguration}
 */
ME5E.movementUnits = {
  ft: {
    label: "ME5E.UNITS.DISTANCE.Foot.Label",
    abbreviation: "ME5E.UNITS.DISTANCE.Foot.Abbreviation",
    conversion: 1,
    formattingUnit: "foot",
    type: "imperial",
    travelResolution: "round"
  },
  mi: {
    label: "ME5E.UNITS.DISTANCE.Mile.Label",
    abbreviation: "ME5E.UNITS.DISTANCE.Mile.Abbreviation",
    conversion: 5_280,
    formattingUnit: "mile",
    type: "imperial",
    travelResolution: "day"
  },
  m: {
    label: "ME5E.UNITS.DISTANCE.Meter.Label",
    abbreviation: "ME5E.UNITS.DISTANCE.Meter.Abbreviation",
    conversion: 10 / 3, // ME5e uses a simplified 5ft -> 1.5m conversion.
    formattingUnit: "meter",
    type: "metric",
    travelResolution: "round"
  },
  km: {
    label: "ME5E.UNITS.DISTANCE.Kilometer.Label",
    abbreviation: "ME5E.UNITS.DISTANCE.Kilometer.Abbreviation",
    conversion: 10_000 / 3, // Matching simplified conversion
    formattingUnit: "kilometer",
    type: "metric",
    travelResolution: "day"
  }
};
preLocalize("movementUnits", { keys: ["label", "abbreviation"] });

/* -------------------------------------------- */

/**
 * The valid units for measuring travel speed. When being formatted, the formatting unit will be combined with
 * `-per-hour` or `-per-day` to result in the final unit passed to `Intl.NumberFormat`.
 * @enum {TravelUnitConfiguration}
 */
ME5E.travelUnits = {
  mph: {
    label: "ME5E.UNITS.TRAVEL.Mile.Label",
    abbreviationDay: "ME5E.UNITS.TRAVEL.Mile.AbbreviationDay",
    abbreviationHour: "ME5E.UNITS.TRAVEL.Mile.AbbreviationHour",
    formattingUnit: "mile",
    conversion: 1,
    type: "imperial"
  },
  kph: {
    label: "ME5E.UNITS.TRAVEL.Kilometer.Label",
    abbreviationDay: "ME5E.UNITS.TRAVEL.Kilometer.AbbreviationDay",
    abbreviationHour: "ME5E.UNITS.TRAVEL.Kilometer.AbbreviationHour",
    formattingUnit: "kilometer",
    conversion: 0.6,
    type: "metric"
  }
};
preLocalize("travelUnits", { keys: ["label", "abbreviationDay", "abbreviationHour"] });

/* -------------------------------------------- */

/**
 * The types of range that are used for measuring actions and effects.
 * @enum {string}
 */
ME5E.rangeTypes = {
  self: "ME5E.DistSelf",
  touch: "ME5E.DistTouch",
  spec: "ME5E.Special",
  any: "ME5E.DistAny"
};
preLocalize("rangeTypes");

/* -------------------------------------------- */

/**
 * The valid units of measure for the range of an action or effect. A combination of `ME5E.movementUnits` and
 * `ME5E.rangeUnits`.
 * @enum {string}
 */
ME5E.distanceUnits = {
  ...Object.fromEntries(Object.entries(ME5E.movementUnits).map(([k, { label }]) => [k, label])),
  ...ME5E.rangeTypes
};
preLocalize("distanceUnits");

/* -------------------------------------------- */

/**
 * The valid units for measurement of volume.
 * @enum {UnitConfiguration}
 */
ME5E.volumeUnits = {
  cubicFoot: {
    label: "ME5E.UNITS.VOLUME.CubicFoot.Label",
    abbreviation: "ME5E.UNITS.Volume.CubicFoot.Abbreviation",
    counted: "ME5E.UNITS.Volume.CubicFoot.Counted",
    conversion: 1,
    type: "imperial"
  },
  liter: {
    label: "ME5E.UNITS.VOLUME.Liter.Label",
    abbreviation: "ME5E.UNITS.Volume.Liter.Abbreviation",
    conversion: 1 / 28.317,
    type: "metric"
  }
};
preLocalize("volumeUnits", { keys: ["label", "abbreviation"] });

/* -------------------------------------------- */

/**
 * The valid units for measurement of weight.
 * @enum {UnitConfiguration}
 */
ME5E.weightUnits = {
  lb: {
    label: "ME5E.UNITS.WEIGHT.Pound.Label",
    abbreviation: "ME5E.UNITS.WEIGHT.Pound.Abbreviation",
    conversion: 1,
    formattingUnit: "pound",
    type: "imperial"
  },
  tn: {
    label: "ME5E.UNITS.WEIGHT.Ton.Label",
    abbreviation: "ME5E.UNITS.WEIGHT.Ton.Abbreviation",
    counted: "ME5E.UNITS.WEIGHT.Ton.Counted",
    conversion: 2000,
    type: "imperial"
  },
  kg: {
    label: "ME5E.UNITS.WEIGHT.Kilogram.Label",
    abbreviation: "ME5E.UNITS.WEIGHT.Kilogram.Abbreviation",
    conversion: 2.5,
    formattingUnit: "kilogram",
    type: "metric"
  },
  Mg: {
    label: "ME5E.UNITS.WEIGHT.Megagram.Label",
    abbreviation: "ME5E.UNITS.WEIGHT.Megagram.Abbreviation",
    counted: "ME5E.UNITS.WEIGHT.Megagram.Counted",
    conversion: 2500,
    type: "metric"
  }
};
preLocalize("weightUnits", { keys: ["label", "abbreviation"] });

/* -------------------------------------------- */

/**
 * Configure aspects of encumbrance calculation so that it could be configured by modules.
 * @type {EncumbranceConfiguration}
 */
ME5E.encumbrance = {
  currencyPerWeight: {
    imperial: 50,
    metric: 110
  },
  draftMultiplier: 5,
  effects: {
    encumbered: {
      name: "EFFECT.ME5E.StatusEncumbered",
      img: "systems/me5e/icons/svg/statuses/encumbered.svg"
    },
    heavilyEncumbered: {
      name: "EFFECT.ME5E.StatusHeavilyEncumbered",
      img: "systems/me5e/icons/svg/statuses/heavily-encumbered.svg"
    },
    exceedingCarryingCapacity: {
      name: "EFFECT.ME5E.StatusExceedingCarryingCapacity",
      img: "systems/me5e/icons/svg/statuses/exceeding-carrying-capacity.svg"
    }
  },
  threshold: {
    encumbered: {
      imperial: 5,
      metric: 2.5
    },
    heavilyEncumbered: {
      imperial: 10,
      metric: 5
    },
    maximum: {
      imperial: 15,
      metric: 7.5
    }
  },
  speedReduction: {
    encumbered: {
      ft: 10,
      m: 3
    },
    heavilyEncumbered: {
      ft: 20,
      m: 6
    },
    exceedingCarryingCapacity: {
      ft: 5,
      m: 1.5
    }
  },
  baseUnits: {
    default: {
      imperial: "lb",
      metric: "kg"
    }
  }
};
preLocalize("encumbrance.effects", { key: "name" });

/* -------------------------------------------- */
/*  Targeting                                   */
/* -------------------------------------------- */

/**
 * Targeting types that apply to one or more distinct targets.
 * @enum {IndividualTargetDefinition}
 */
ME5E.individualTargetTypes = {
  self: {
    label: "ME5E.TARGET.Type.Self.Label",
    scalar: false
  },
  ally: {
    label: "ME5E.TARGET.Type.Ally.Label",
    counted: "ME5E.TARGET.Type.Ally.Counted"
  },
  enemy: {
    label: "ME5E.TARGET.Type.Enemy.Label",
    counted: "ME5E.TARGET.Type.Enemy.Counted"
  },
  creature: {
    label: "ME5E.TARGET.Type.Creature.Label",
    counted: "ME5E.TARGET.Type.Creature.Counted"
  },
  object: {
    label: "ME5E.TARGET.Type.Object.Label",
    counted: "ME5E.TARGET.Type.Object.Counted"
  },
  space: {
    label: "ME5E.TARGET.Type.Space.Label",
    counted: "ME5E.TARGET.Type.Space.Counted"
  },
  creatureOrObject: {
    label: "ME5E.TARGET.Type.CreatureOrObject.Label",
    counted: "ME5E.TARGET.Type.CreatureOrObject.Counted"
  },
  any: {
    label: "ME5E.TARGET.Type.Any.Label",
    counted: "ME5E.TARGET.Type.Target.Counted"
  },
  willing: {
    label: "ME5E.TARGET.Type.WillingCreature.Label",
    counted: "ME5E.TARGET.Type.WillingCreature.Counted"
  }
};
preLocalize("individualTargetTypes", { key: "label" });

/* -------------------------------------------- */

/**
 * Targeting types that cover an area.
 * @enum {AreaTargetDefinition}
 */
ME5E.areaTargetTypes = {
  circle: {
    label: "ME5E.TARGET.Type.Circle.Label",
    counted: "ME5E.TARGET.Type.Circle.Counted",
    template: "circle",
    sizes: ["radius"]
  },
  cone: {
    label: "ME5E.TARGET.Type.Cone.Label",
    counted: "ME5E.TARGET.Type.Cone.Counted",
    template: "cone",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.DqqAOr5JnX71OCOw",
    sizes: ["length"],
    standard: true
  },
  cube: {
    label: "ME5E.TARGET.Type.Cube.Label",
    counted: "ME5E.TARGET.Type.Cube.Counted",
    template: "rect",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.dRfDIwuaHmUQ06uA",
    sizes: ["width"],
    standard: true
  },
  cylinder: {
    label: "ME5E.TARGET.Type.Cylinder.Label",
    counted: "ME5E.TARGET.Type.Cylinder.Counted",
    template: "circle",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.jZFp4R7tXsIqkiG3",
    sizes: ["radius", "height"],
    standard: true
  },
  line: {
    label: "ME5E.TARGET.Type.Line.Label",
    counted: "ME5E.TARGET.Type.Line.Counted",
    template: "ray",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.6DOoBgg7okm9gBc6",
    sizes: ["length", "width"],
    standard: true
  },
  radius: {
    label: "ME5E.TARGET.Type.Emanation.Label",
    counted: "ME5E.TARGET.Type.Emanation.Counted",
    template: "circle",
    standard: true
  },
  sphere: {
    label: "ME5E.TARGET.Type.Sphere.Label",
    counted: "ME5E.TARGET.Type.Sphere.Counted",
    template: "circle",
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.npdEWb2egUPnB5Fa",
    sizes: ["radius"],
    standard: true
  },
  square: {
    label: "ME5E.TARGET.Type.Square.Label",
    counted: "ME5E.TARGET.Type.Square.Counted",
    template: "rect",
    sizes: ["width"]
  },
  wall: {
    label: "ME5E.TARGET.Type.Wall.Label",
    counted: "ME5E.TARGET.Type.Wall.Counted",
    template: "ray",
    sizes: ["length", "thickness", "height"]
  }
};
preLocalize("areaTargetTypes", { key: "label", sort: true });

Object.defineProperty(ME5E, "areaTargetOptions", {
  get() {
    const { primary, secondary } = Object.entries(this.areaTargetTypes).reduce((obj, [value, data]) => {
      const entry = { value, label: data.label };
      if ( data.standard ) obj.primary.push(entry);
      else obj.secondary.push(entry);
      return obj;
    }, { primary: [], secondary: [] });
    return [{ value: "", label: "" }, ...primary, { rule: true }, ...secondary];
  }
});

/* -------------------------------------------- */

/**
 * The types of single or area targets which can be applied to abilities.
 * @enum {string}
 */
ME5E.targetTypes = {
  ...Object.fromEntries(Object.entries(ME5E.individualTargetTypes).map(([k, v]) => [k, v.label])),
  ...Object.fromEntries(Object.entries(ME5E.areaTargetTypes).map(([k, v]) => [k, v.label]))
};
preLocalize("targetTypes", { sort: true });

/* -------------------------------------------- */

/**
 * Denominations of hit dice which can apply to classes.
 * @type {string[]}
 */
ME5E.hitDieTypes = ["d4", "d6", "d8", "d10", "d12"];

/* -------------------------------------------- */

/**
 * Types of rests.
 * @enum {RestTypeConfiguration}
 */
ME5E.restTypes = {
  short: {
    duration: {
      normal: 60,
      gritty: 480,
      epic: 1
    },
    label: "ME5E.REST.Short.Label",
    icon: "fa-solid fa-utensils",
    activationPeriods: ["shortRest"],
    recoverPeriods: ["sr"],
    recoverSpellSlotTypes: new Set(["pact"])
  },
  long: {
    duration: {
      normal: 480,
      gritty: 10_080,
      epic: 60
    },
    exhaustionDelta: -1,
    label: "ME5E.REST.Long.Label",
    icon: "fa-solid fa-campground",
    activationPeriods: ["longRest"],
    recoverHitDice: true,
    recoverHitPoints: true,
    recoverPeriods: ["lr", "sr"],
    recoverSpellSlotTypes: new Set(["spell", "pact"]),
    recoverTemp: true,
    recoverTempMax: true
  }
};
preLocalize("restTypes", { key: "label" });

/* -------------------------------------------- */

/**
 * The set of possible sensory perception types which an Actor may have.
 * @enum {string}
 */
ME5E.senses = {
  blindsight: "ME5E.SenseBlindsight",
  darkvision: "ME5E.SenseDarkvision",
  tremorsense: "ME5E.SenseTremorsense",
  truesight: "ME5E.SenseTruesight"
};
preLocalize("senses", { sort: true });

/* -------------------------------------------- */
/*  Attacks                                     */
/* -------------------------------------------- */

/**
 * Classifications of attacks based on what is performing them.
 * @enum {{ label: string }}
 */
ME5E.attackClassifications = {
  weapon: {
    label: "ME5E.ATTACK.Classification.Weapon"
  },
  spell: {
    label: "ME5E.ATTACK.Classification.Spell"
  },
  unarmed: {
    label: "ME5E.ATTACK.Classification.Unarmed"
  }
};
preLocalize("attackClassifications", { key: "label" });

/* -------------------------------------------- */

/**
 * Attack modes available for weapons.
 * @enum {string}
 */
ME5E.attackModes = Object.seal({
  oneHanded: {
    label: "ME5E.ATTACK.Mode.OneHanded"
  },
  twoHanded: {
    label: "ME5E.ATTACK.Mode.TwoHanded"
  },
  offhand: {
    label: "ME5E.ATTACK.Mode.Offhand"
  },
  ranged: {
    label: "ME5E.ATTACK.Mode.Ranged"
  },
  thrown: {
    label: "ME5E.ATTACK.Mode.Thrown"
  },
  "thrown-offhand": {
    label: "ME5E.ATTACK.Mode.ThrownOffhand"
  }
});
preLocalize("attackModes", { key: "label" });

/* -------------------------------------------- */

/**
 * Types of attacks based on range.
 * @enum {{ label: string }}
 */
ME5E.attackTypes = Object.seal({
  melee: {
    label: "ME5E.ATTACK.Type.Melee"
  },
  ranged: {
    label: "ME5E.ATTACK.Type.Ranged"
  }
});
preLocalize("attackTypes", { key: "label" });

/* -------------------------------------------- */
/*  Spellcasting                                */
/* -------------------------------------------- */

/**
 * Define the standard slot progression by character level.
 * The entries of this array represent the spell slot progression for a full spell-caster.
 * @type {SpellcastingTable5e}
 */
const SPELL_SLOT_TABLE = ME5E.SPELL_SLOT_TABLE = [
  [2],
  [3],
  [4, 2],
  [4, 3],
  [4, 3, 2],
  [4, 3, 3],
  [4, 3, 3, 1],
  [4, 3, 3, 2],
  [4, 3, 3, 3, 1],
  [4, 3, 3, 3, 2],
  [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 2, 1, 1]
];

/* -------------------------------------------- */

/**
 * Define the pact slot & level progression by pact caster level.
 * @type {SpellcastingTableSingle5e}
 */
const pactCastingProgression = ME5E.pactCastingProgression = {
  1: { slots: 1, level: 1 },
  2: { slots: 2, level: 1 },
  3: { slots: 2, level: 2 },
  5: { slots: 2, level: 3 },
  7: { slots: 2, level: 4 },
  9: { slots: 2, level: 5 },
  11: { slots: 3, level: 5 },
  17: { slots: 4, level: 5 }
};

/* -------------------------------------------- */

/**
 * @typedef {Partial<
 *   SpellcastingModelData & SlotSpellcastingData & SingleLevelSpellcastingData & MultiLevelSpellcasting
 * >} SpellcastingMethod5e
 * @property {SpellcastingTable5e|SpellcastingTableSingle5e} [table]
 */

/**
 * Available spellcasting methods.
 * @type {Record<string, SpellcastingMethod5e>}
 */
ME5E.spellcasting = {
  atwill: {
    label: "ME5E.SPELLCASTING.METHODS.AtWill.label",
    order: -30
  },
  innate: {
    label: "ME5E.SPELLCASTING.METHODS.Innate.label",
    order: -20
  },
  ritual: {
    label: "ME5E.SPELLCASTING.METHODS.Ritual.label",
    order: -10
  },
  pact: {
    label: "ME5E.SPELLCASTING.METHODS.Pact.label",
    type: "single",
    cantrips: true,
    prepares: true,
    order: 10,
    img: "icons/magic/unholy/silhouette-robe-evil-power.webp",
    table: pactCastingProgression,
    progression: {
      pact: {
        label: "ME5E.SPELLCASTING.METHODS.Pact.Full.label",
        divisor: 1
      }
    }
  },
  spell: {
    label: "ME5E.SPELLCASTING.METHODS.Spell.label",
    type: "multi",
    cantrips: true,
    prepares: true,
    order: 20,
    img: "systems/me5e/icons/spell-tiers/{id}.webp",
    table: SPELL_SLOT_TABLE,
    progression: {
      full: {
        label: "ME5E.SPELLCASTING.METHODS.Spell.Full.label",
        divisor: 1
      },
      half: {
        label: "ME5E.SPELLCASTING.METHODS.Spell.Half.label",
        divisor: 2,
        roundUp: true
      },
      third: {
        label: "ME5E.SPELLCASTING.METHODS.Spell.Third.label",
        divisor: 3
      },
      artificer: {
        label: "ME5E.SPELLCASTING.METHODS.Spell.Artificer.label",
        divisor: 2,
        roundUp: true
      }
    }
  }
};
preLocalize("spellcasting", { key: "label" });
preLocalize("spellcasting.spell.progression", { key: "label" });
preLocalize("spellcasting.pact.progression", { key: "label" });

/* -------------------------------------------- */

/**
 * Spell preparation states.
 * @type {Record<string, SpellcastingPreparationState5e>}
 */
ME5E.spellPreparationStates = {
  unprepared: {
    label: "ME5E.SPELLCASTING.STATES.Unprepared",
    value: 0
  },
  prepared: {
    label: "ME5E.SPELLCASTING.STATES.Prepared",
    value: 1
  },
  always: {
    label: "ME5E.SPELLCASTING.STATES.AlwaysPrepared",
    value: 2
  }
};
preLocalize("spellPreparationStates", { key: "label" });

/* -------------------------------------------- */

/**
 * Spell lists that will be registered by the system during init.
 * @type {string[]}
 */
ME5E.SPELL_LISTS = Object.freeze([
]);

/* -------------------------------------------- */

/**
 * @deprecated since 5.1
 * @ignore
 */
ME5E.spellPreparationModes = new Proxy(ME5E.spellcasting, {
  get(target, prop, receiver) {
    foundry.utils.logCompatibilityWarning("CONFIG.ME5E.spellPreparationModes is deprecated, use CONFIG.ME5E.spellcasting"
      + " instead.", { since: "ME5e 5.1", until: "ME5e 5.4" });
    if ( (prop === "prepared") || (prop === "always") ) prop = "spell";
    return Reflect.get(target, prop, receiver);
  },

  set(target, prop, value, receiver) {
    foundry.utils.logCompatibilityWarning("CONFIG.ME5E.spellPreparationModes is deprecated, use CONFIG.ME5E.spellcasting"
      + " instead.", { since: "ME5e 5.1", until: "ME5e 5.4" });
    if ( (prop === "prepared") || (prop === "always") ) prop = "spell";
    return Reflect.set(target, prop, value, receiver);
  }
});

/* -------------------------------------------- */

/**
 * @deprecated since 5.1
 * @ignore
 */
ME5E.spellcastingTypes = new Proxy(ME5E.spellcasting, {
  get(target, prop, receiver) {
    foundry.utils.logCompatibilityWarning("CONFIG.ME5E.spellcastingTypes is deprecated, use CONFIG.ME5E.spellcasting"
      + " instead.", { since: "ME5e 5.1", until: "ME5e 5.4" });
    if ( prop === "leveled" ) prop = "spell";
    return Reflect.get(target, prop, receiver);
  },

  set(target, prop, value, receiver) {
    foundry.utils.logCompatibilityWarning("CONFIG.ME5E.spellcastingTypes is deprecated, use CONFIG.ME5E.spellcasting"
      + " instead.", { since: "ME5e 5.1", until: "ME5e 5.4" });
    if ( prop === "leveled" ) prop = "spell";
    if ( !("type" in value) ) value.type = "single";
    if ( !("table" in value) ) value.table = ME5E.pactCastingProgression;
    if ( !("progression" in value) ) value.progression = { [prop]: { label: value.label } };
    return Reflect.set(target, prop, value, receiver);
  }
});

/* -------------------------------------------- */

/**
 * @ignore
 */
ME5E.spellProgression = new Proxy({}, {
  set() {
    foundry.utils.logCompatibilityWarning("CONFIG.ME5E.spellProgression is read-only. Spell progressions must be set "
      + "on CONFIG.ME5E.spellcasting instead.", { since: "ME5e 5.1", until: "ME5e 5.4" });
    return true;
  }
});


/* -------------------------------------------- */

/**
 * Valid spell levels.
 * @enum {string}
 */
ME5E.spellLevels = {
  0: "ME5E.SpellLevel0",
  1: "ME5E.SpellLevel1",
  2: "ME5E.SpellLevel2",
  3: "ME5E.SpellLevel3",
  4: "ME5E.SpellLevel4",
  5: "ME5E.SpellLevel5",
  6: "ME5E.SpellLevel6",
  7: "ME5E.SpellLevel7",
  8: "ME5E.SpellLevel8",
  9: "ME5E.SpellLevel9"
};
preLocalize("spellLevels");

/* -------------------------------------------- */

/**
 * The available choices for how spell damage scaling may be computed.
 * @enum {string}
 */
ME5E.spellScalingModes = {
  none: "ME5E.SpellNone",
  cantrip: "ME5E.SpellCantrip",
  level: "ME5E.SpellLevel"
};
preLocalize("spellScalingModes", { sort: true });

/* -------------------------------------------- */

/**
 * Schools to which a spell can belong.
 * @enum {SpellSchoolConfiguration}
 */
ME5E.spellSchools = {
  abj: {
    label: "ME5E.SchoolAbj",
    icon: "systems/me5e/icons/svg/schools/abjuration.svg",
    fullKey: "abjuration",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.849AYEWw9FHD6JNz"
  },
  con: {
    label: "ME5E.SchoolCon",
    icon: "systems/me5e/icons/svg/schools/conjuration.svg",
    fullKey: "conjuration",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.TWyKMhZJZGqQ6uls"
  },
  div: {
    label: "ME5E.SchoolDiv",
    icon: "systems/me5e/icons/svg/schools/divination.svg",
    fullKey: "divination",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.HoD2MwzmVbMqj9se"
  },
  enc: {
    label: "ME5E.SchoolEnc",
    icon: "systems/me5e/icons/svg/schools/enchantment.svg",
    fullKey: "enchantment",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.SehPXk24ySBVOwCZ"
  },
  evo: {
    label: "ME5E.SchoolEvo",
    icon: "systems/me5e/icons/svg/schools/evocation.svg",
    fullKey: "evocation",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.kGp1RNuxL2SELLRC"
  },
  ill: {
    label: "ME5E.SchoolIll",
    icon: "systems/me5e/icons/svg/schools/illusion.svg",
    fullKey: "illusion",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.smEk7kvVyslFozrB"
  },
  nec: {
    label: "ME5E.SchoolNec",
    icon: "systems/me5e/icons/svg/schools/necromancy.svg",
    fullKey: "necromancy",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.W0eyiV1FBmngb6Qh"
  },
  trs: {
    label: "ME5E.SchoolTrs",
    icon: "systems/me5e/icons/svg/schools/transmutation.svg",
    fullKey: "transmutation",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.IYWewSailtmv6qEb"
  }
};
preLocalize("spellSchools", { key: "label", sort: true });

/* -------------------------------------------- */

/**
 * Types of spell lists.
 * @enum {string}
 */
ME5E.spellListTypes = {
  class: "TYPES.Item.class",
  subclass: "TYPES.Item.subclass",
  background: "TYPES.Item.background",
  race: "TYPES.Item.race",
  other: "JOURNALENTRYPAGE.ME5E.SpellList.Type.Other"
};
preLocalize("spellListTypes");

/* -------------------------------------------- */

/**
 * Spell scroll item ID within the `ME5E.sourcePacks` compendium or a full UUID for each spell level.
 * @enum {string}
 */
ME5E.spellScrollIds = {
  0: "Compendium.me5e.equipment24.Item.dmgSpellScrollCa",
  1: "Compendium.me5e.equipment24.Item.dmgSpellScroll1s",
  2: "Compendium.me5e.equipment24.Item.dmgSpellScroll2n",
  3: "Compendium.me5e.equipment24.Item.dmgSpellScroll3r",
  4: "Compendium.me5e.equipment24.Item.dmgSpellScroll4t",
  5: "Compendium.me5e.equipment24.Item.dmgSpellScroll5t",
  6: "Compendium.me5e.equipment24.Item.dmgSpellScroll6t",
  7: "Compendium.me5e.equipment24.Item.dmgSpellScroll7t",
  8: "Compendium.me5e.equipment24.Item.dmgSpellScroll8t",
  9: "Compendium.me5e.equipment24.Item.dmgSpellScroll9t"
};

/* -------------------------------------------- */

/**
 * Spell scroll save DCs and attack bonus values based on spell level. If matching level isn't found,
 * then the nearest level lower than it will be selected.
 * @enum {SpellScrollValues}
 */
ME5E.spellScrollValues = {
  0: { dc: 13, bonus: 5 },
  3: { dc: 15, bonus: 7 },
  5: { dc: 17, bonus: 9 },
  7: { dc: 18, bonus: 10 },
  9: { dc: 19, bonus: 11 }
};

/* -------------------------------------------- */

/**
 * Compendium packs used for localized items.
 * @enum {string}
 */
ME5E.sourcePacks = {
  BACKGROUNDS: "me5e.backgrounds",
  CLASSES: "me5e.classes",
  ITEMS: "me5e.items",
  RACES: "me5e.races"
};

/* -------------------------------------------- */

/**
 * Settings that configuration how actors are changed when transformation is applied.
 * @typedef {TransformationConfiguration}
 */
ME5E.transformation = {
  effects: {
    all: {
      label: "ME5E.TRANSFORM.Setting.Effects.All.Label",
      hint: "ME5E.TRANSFORM.Setting.Effects.All.Hint",
      disables: ["effects.*"]
    },
    origin: {
      label: "ME5E.TRANSFORM.Setting.Effects.Origin.Label",
      hint: "ME5E.TRANSFORM.Setting.Effects.Origin.Hint",
      default: true
    },
    otherOrigin: {
      label: "ME5E.TRANSFORM.Setting.Effects.OtherOrigin.Label",
      hint: "ME5E.TRANSFORM.Setting.Effects.OtherOrigin.Hint",
      default: true
    },
    background: {
      label: "ME5E.TRANSFORM.Setting.Effects.Background.Label",
      default: true
    },
    class: {
      label: "ME5E.TRANSFORM.Setting.Effects.Class.Label",
      default: true
    },
    feat: {
      label: "ME5E.TRANSFORM.Setting.Effects.Feature.Label",
      default: true
    },
    equipment: {
      label: "ME5E.TRANSFORM.Setting.Effects.Equipment.Label",
      default: true
    },
    spell: {
      label: "ME5E.TRANSFORM.Setting.Effects.Spell.Label",
      default: true
    }
  },
  keep: {
    physical: {
      label: "ME5E.TRANSFORM.Setting.Keep.Physical.Label",
      hint: "ME5E.TRANSFORM.Setting.Keep.Physical.Hint"
    },
    mental: {
      label: "ME5E.TRANSFORM.Setting.Keep.Mental.Label",
      hint: "ME5E.TRANSFORM.Setting.Keep.Mental.Hint"
    },
    saves: {
      label: "ME5E.TRANSFORM.Setting.Keep.Saves.Label",
      disables: ["merge.saves"]
    },
    skills: {
      label: "ME5E.TRANSFORM.Setting.Keep.Skills.Label",
      disables: ["merge.skills"]
    },
    gearProf: {
      label: "ME5E.TRANSFORM.Setting.Keep.GearProficiency.Label"
    },
    languages: {
      label: "ME5E.TRANSFORM.Setting.Keep.Languages.Label"
    },
    class: {
      label: "ME5E.TRANSFORM.Setting.Keep.Proficiency.Label"
    },
    feats: {
      label: "ME5E.TRANSFORM.Setting.Keep.Features.Label"
    },
    items: {
      label: "ME5E.TRANSFORM.Setting.Keep.Equipment.Label"
    },
    spells: {
      label: "ME5E.TRANSFORM.Setting.Keep.Spells.Label"
    },
    bio: {
      label: "ME5E.TRANSFORM.Setting.Keep.Biography.Label"
    },
    type: {
      label: "ME5E.TRANSFORM.Setting.Keep.CreatureType.Label"
    },
    hp: {
      label: "ME5E.TRANSFORM.Setting.Keep.Health.Label"
    },
    tempHP: {
      label: "ME5E.TRANSFORM.Setting.Keep.TempHP.Label"
    },
    resistances: {
      label: "ME5E.TRANSFORM.Setting.Keep.Resistances.Label"
    },
    vision: {
      label: "ME5E.TRANSFORM.Setting.Keep.Vision.Label",
      default: true
    },
    self: {
      label: "ME5E.TRANSFORM.Setting.Keep.Self.Label",
      hint: "ME5E.TRANSFORM.Setting.Keep.Self.Hint",
      disables: ["keep.*", "merge.*", "minimumAC", "tempFormula"]
    }
  },
  merge: {
    saves: {
      label: "ME5E.TRANSFORM.Setting.Merge.Saves.Label",
      disables: ["keep.saves"]
    },
    skills: {
      label: "ME5E.TRANSFORM.Setting.Merge.Skills.Label",
      disables: ["keep.skills"]
    }
  },
  other: {},
  presets: {
    wildshape: {
      icon: '<i class="fas fa-paw" inert></i>',
      label: "ME5E.TRANSFORM.Preset.WildShape.Label",
      settings: {
        effects: new Set(["otherOrigin", "origin", "feat", "spell", "class", "background"]),
        keep: new Set(["bio", "class", "feats", "hp", "languages", "mental", "tempHP", "type"]),
        merge: new Set(["saves", "skills"]),
        minimumAC: "(13 + @abilities.wis.mod) * sign(@subclasses.moon.levels)",
        spellLists: new Set(["subclass:moon"]),
        tempFormula: "max(@classes.druid.levels, @subclasses.moon.levels * 3)"
      }
    },
    polymorph: {
      icon: '<i class="fas fa-pastafarianism" inert></i>',
      label: "ME5E.TRANSFORM.Preset.Polymorph.Label",
      settings: {
        effects: new Set(["otherOrigin", "origin", "spell"]),
        keep: new Set(["hp", "type"]),
        tempFormula: "@source.attributes.hp.max"
      }
    },
    polymorphSelf: {
      icon: '<i class="fas fa-eye" inert></i>',
      label: "ME5E.TRANSFORM.Preset.Appearance.Label",
      settings: {
        effects: new Set(["all"]),
        keep: new Set(["self"])
      }
    }
  }
};
preLocalize("transformation.effects", { keys: ["label", "hint"] });
preLocalize("transformation.keep", { keys: ["label", "hint"] });
preLocalize("transformation.merge", { keys: ["label", "hint"] });
preLocalize("transformation.other", { keys: ["label", "hint"], sort: true });
preLocalize("transformation.presets", { key: "label", sort: true });

/* -------------------------------------------- */

/**
 * Skill, ability, and tool proficiency levels.
 * The key for each level represents its proficiency multiplier.
 * @enum {string}
 */
ME5E.proficiencyLevels = {
  0: "ME5E.NotProficient",
  1: "ME5E.Proficient",
  0.5: "ME5E.HalfProficient",
  2: "ME5E.Expertise"
};
preLocalize("proficiencyLevels");

/* -------------------------------------------- */

/**
 * Weapon and armor item proficiency levels.
 * @enum {string}
 */
ME5E.weaponAndArmorProficiencyLevels = {
  0: "ME5E.NotProficient",
  1: "ME5E.Proficient"
};
preLocalize("weaponAndArmorProficiencyLevels");

/* -------------------------------------------- */

/**
 * The amount of cover provided by an object. In cases where multiple pieces
 * of cover are in play, we take the highest value.
 * @enum {string}
 */
ME5E.cover = {
  0: "ME5E.None",
  .5: "ME5E.CoverHalf",
  .75: "ME5E.CoverThreeQuarters",
  1: "ME5E.CoverTotal"
};
preLocalize("cover");

/* -------------------------------------------- */

/**
 * A selection of actor attributes that can be tracked on token resource bars.
 * @type {string[]}
 * @deprecated since v10
 */
ME5E.trackableAttributes = [
  "attributes.ac.value", "attributes.init.bonus", "attributes.movement", "attributes.senses",
  "attributes.spell.attack", "attributes.spell.dc", "attributes.spell.level", "details.cr",
  "details.xp.value", "skills.*.passive", "abilities.*.value"
];

/* -------------------------------------------- */

/**
 * A selection of actor and item attributes that are valid targets for item resource consumption.
 * @type {string[]}
 */
ME5E.consumableResources = [
  // Configured during init.
];

/* -------------------------------------------- */

/**
 * Conditions that can affect an actor.
 * @enum {ConditionConfiguration}
 */
ME5E.conditionTypes = {
  bleeding: {
    name: "EFFECT.ME5E.StatusBleeding",
    img: "systems/me5e/icons/svg/statuses/bleeding.svg",
    pseudo: true
  },
  blinded: {
    name: "ME5E.ConBlinded",
    img: "systems/me5e/icons/svg/statuses/blinded.svg",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.uDogReMO6QtH6NDw",
    special: "BLIND"
  },
  burning: {
    name: "EFFECT.ME5E.StatusBurning",
    img: "systems/me5e/icons/svg/statuses/burning.svg",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.mPBGM1vguT5IPzxT",
    pseudo: true
  },
  charmed: {
    name: "ME5E.ConCharmed",
    img: "systems/me5e/icons/svg/statuses/charmed.svg",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.vLAsIUa0FhZNsyLk"
  },
  cursed: {
    name: "EFFECT.ME5E.StatusCursed",
    img: "systems/me5e/icons/svg/statuses/cursed.svg",
    pseudo: true
  },
  dehydration: {
    name: "EFFECT.ME5E.StatusDehydration",
    img: "systems/me5e/icons/svg/statuses/dehydration.svg",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.FZFvLNOX0lHaHZ1k",
    pseudo: true
  },
  deafened: {
    name: "ME5E.ConDeafened",
    img: "systems/me5e/icons/svg/statuses/deafened.svg",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.qlRw66tJhk0zLnwq"
  },
  diseased: {
    name: "ME5E.ConDiseased",
    img: "systems/me5e/icons/svg/statuses/diseased.svg",
    pseudo: true,
    reference: "Compendium.me5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.oNQWvyRZkTOJ8PBq"
  },
  exhaustion: {
    name: "ME5E.ConExhaustion",
    img: "systems/me5e/icons/svg/statuses/exhaustion.svg",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.jSQtPgNm0i4f3Qi3",
    levels: 6,
    reduction: { rolls: 2, speed: 5 }
  },
  falling: {
    name: "EFFECT.ME5E.StatusFalling",
    img: "systems/me5e/icons/svg/statuses/falling.svg",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.kREHL5pgNUOhay9f",
    pseudo: true
  },
  frightened: {
    name: "ME5E.ConFrightened",
    img: "systems/me5e/icons/svg/statuses/frightened.svg",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.93uaingTESo8N1qL"
  },
  grappled: {
    name: "ME5E.ConGrappled",
    img: "systems/me5e/icons/svg/statuses/grappled.svg",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.KbQ1k0OIowtZeQgp"
  },
  incapacitated: {
    name: "ME5E.ConIncapacitated",
    img: "systems/me5e/icons/svg/statuses/incapacitated.svg",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.4i3G895hy99piand",
    neverBlockMovement: true
  },
  invisible: {
    name: "ME5E.ConInvisible",
    img: "systems/me5e/icons/svg/statuses/invisible.svg",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.MQIZ1zRLWRcNOtPN"
  },
  malnutrition: {
    name: "EFFECT.ME5E.StatusMalnutrition",
    img: "systems/me5e/icons/svg/statuses/malnutrition.svg",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.earBo4vQPC1ti4g7",
    pseudo: true
  },
  paralyzed: {
    name: "ME5E.ConParalyzed",
    img: "systems/me5e/icons/svg/statuses/paralyzed.svg",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.RnxZoTglPnLc6UPb",
    statuses: ["incapacitated"]
  },
  petrified: {
    name: "ME5E.ConPetrified",
    img: "systems/me5e/icons/svg/statuses/petrified.svg",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.6vtLuQT9lwZ9N299",
    statuses: ["incapacitated"]
  },
  poisoned: {
    name: "ME5E.ConPoisoned",
    img: "systems/me5e/icons/svg/statuses/poisoned.svg",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.HWs8kEojffqwTSJz"
  },
  prone: {
    name: "ME5E.ConProne",
    img: "systems/me5e/icons/svg/statuses/prone.svg",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.QxCrRcgMdUd3gfzz"
  },
  restrained: {
    name: "ME5E.ConRestrained",
    img: "systems/me5e/icons/svg/statuses/restrained.svg",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.dqLeGdpHtb8FfcxX"
  },
  silenced: {
    name: "EFFECT.ME5E.StatusSilenced",
    img: "systems/me5e/icons/svg/statuses/silenced.svg",
    pseudo: true
  },
  stunned: {
    name: "ME5E.ConStunned",
    img: "systems/me5e/icons/svg/statuses/stunned.svg",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.EjbXjvyQAMlDyANI",
    statuses: ["incapacitated"]
  },
  suffocation: {
    name: "EFFECT.ME5E.StatusSuffocation",
    img: "systems/me5e/icons/svg/statuses/suffocation.svg",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.gAvV8TLyS8UGq00x",
    pseudo: true
  },
  surprised: {
    name: "EFFECT.ME5E.StatusSurprised",
    img: "systems/me5e/icons/svg/statuses/surprised.svg",
    pseudo: true
  },
  transformed: {
    name: "EFFECT.ME5E.StatusTransformed",
    img: "systems/me5e/icons/svg/statuses/transformed.svg",
    pseudo: true
  },
  unconscious: {
    name: "ME5E.ConUnconscious",
    img: "systems/me5e/icons/svg/statuses/unconscious.svg",
    reference: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.fZCRaKEJd4KoQCqH",
    statuses: ["incapacitated"],
    riders: ["prone"]
  }
};
preLocalize("conditionTypes", { key: "name", sort: true });

/* -------------------------------------------- */

/**
 * Various effects of conditions and which conditions apply it. Either keys for the conditions,
 * and with a number appended for a level of exhaustion.
 * @enum {Set<string>}
 */
ME5E.conditionEffects = {
  noMovement: new Set(["exhaustion-5", "grappled", "paralyzed", "petrified", "restrained", "unconscious"]),
  halfMovement: new Set(["exhaustion-2"]),
  crawl: new Set(["prone", "exceedingCarryingCapacity"]),
  petrification: new Set(["petrified"]),
  halfHealth: new Set(["exhaustion-4"]),
  dehydrated: new Set(["dehydration"]),
  malnourished: new Set(["malnutrition"]),
  abilityCheckDisadvantage: new Set(["poisoned", "exhaustion-1"]),
  abilitySaveDisadvantage: new Set(["exhaustion-3"]),
  attackDisadvantage: new Set(["poisoned", "exhaustion-3"]),
  dexteritySaveDisadvantage: new Set(["restrained"]),
  initiativeAdvantage: new Set(["invisible"]),
  initiativeDisadvantage: new Set(["incapacitated", "surprised"])
};

/* -------------------------------------------- */

/**
 * Extra status effects not specified in `conditionTypes`. If the ID matches a core-provided effect, then this
 * data will be merged into the core data.
 * @enum {StatusEffectConfig5e}
 */
ME5E.statusEffects = {
  burrowing: {
    name: "EFFECT.ME5E.StatusBurrowing",
    img: "systems/me5e/icons/svg/statuses/burrowing.svg",
    special: "BURROW"
  },
  concentrating: {
    name: "EFFECT.ME5E.StatusConcentrating",
    img: "systems/me5e/icons/svg/statuses/concentrating.svg",
    special: "CONCENTRATING"
  },
  coverHalf: {
    name: "EFFECT.ME5E.StatusHalfCover",
    img: "systems/me5e/icons/svg/statuses/cover-half.svg",
    order: 2,
    exclusiveGroup: "cover",
    coverBonus: 2
  },
  coverThreeQuarters: {
    name: "EFFECT.ME5E.StatusThreeQuartersCover",
    img: "systems/me5e/icons/svg/statuses/cover-three-quarters.svg",
    order: 3,
    exclusiveGroup: "cover",
    coverBonus: 5
  },
  coverTotal: {
    name: "EFFECT.ME5E.StatusTotalCover",
    img: "systems/me5e/icons/svg/statuses/cover-total.svg",
    order: 4,
    exclusiveGroup: "cover"
  },
  dead: {
    name: "EFFECT.ME5E.StatusDead",
    img: "systems/me5e/icons/svg/statuses/dead.svg",
    special: "DEFEATED",
    order: 1,
    neverBlockMovement: true
  },
  dodging: {
    name: "EFFECT.ME5E.StatusDodging",
    img: "systems/me5e/icons/svg/statuses/dodging.svg"
  },
  ethereal: {
    name: "EFFECT.ME5E.StatusEthereal",
    img: "systems/me5e/icons/svg/statuses/ethereal.svg",
    neverBlockMovement: true
  },
  flying: {
    name: "EFFECT.ME5E.StatusFlying",
    img: "systems/me5e/icons/svg/statuses/flying.svg",
    special: "FLY"
  },
  hiding: {
    name: "EFFECT.ME5E.StatusHiding",
    img: "systems/me5e/icons/svg/statuses/hiding.svg"
  },
  hovering: {
    name: "EFFECT.ME5E.StatusHovering",
    img: "systems/me5e/icons/svg/statuses/hovering.svg",
    special: "HOVER"
  },
  marked: {
    name: "EFFECT.ME5E.StatusMarked",
    img: "systems/me5e/icons/svg/statuses/marked.svg"
  },
  sleeping: {
    name: "EFFECT.ME5E.StatusSleeping",
    img: "systems/me5e/icons/svg/statuses/sleeping.svg",
    statuses: ["incapacitated", "unconscious"]
  },
  stable: {
    name: "EFFECT.ME5E.StatusStable",
    img: "systems/me5e/icons/svg/statuses/stable.svg"
  }
};

/* -------------------------------------------- */

/**
 * Status effects that never block token movement. Populated during the setup process.
 * @type {Set<string>}
 */
ME5E.neverBlockStatuses = new Set();

/* -------------------------------------------- */

/**
 * Configuration for the special bloodied status effect.
 * @type {{ name: string, icon: string, threshold: number }}
 */
ME5E.bloodied = {
  name: "EFFECT.ME5E.StatusBloodied",
  img: "systems/me5e/icons/svg/statuses/bloodied.svg",
  threshold: .5
};

/* -------------------------------------------- */
/*  Languages                                   */
/* -------------------------------------------- */

/**
 * Languages a character can learn.
 * @enum {object}
 */
ME5E.languages = {
  standard: {
    label: "ME5E.Language.Category.Standard",
    selectable: false,
    children: {
      common: "ME5E.Language.Language.Common",
      draconic: "ME5E.Language.Language.Draconic",
      dwarvish: "ME5E.Language.Language.Dwarvish",
      elvish: "ME5E.Language.Language.Elvish",
      giant: "ME5E.Language.Language.Giant",
      gnomish: "ME5E.Language.Language.Gnomish",
      goblin: "ME5E.Language.Language.Goblin",
      halfling: "ME5E.Language.Language.Halfling",
      orc: "ME5E.Language.Language.Orc",
      sign: "ME5E.Language.Language.CommonSign"
    }
  },
  exotic: {
    label: "ME5E.Language.Category.Rare",
    selectable: false,
    children: {
      aarakocra: "ME5E.Language.Language.Aarakocra",
      abyssal: "ME5E.Language.Language.Abyssal",
      cant: "ME5E.Language.Language.ThievesCant",
      celestial: "ME5E.Language.Language.Celestial",
      deep: "ME5E.Language.Language.DeepSpeech",
      druidic: "ME5E.Language.Language.Druidic",
      gith: "ME5E.Language.Language.Gith",
      gnoll: "ME5E.Language.Language.Gnoll",
      infernal: "ME5E.Language.Language.Infernal",
      primordial: {
        label: "ME5E.Language.Language.Primordial",
        children: {
          aquan: "ME5E.Language.Language.Aquan",
          auran: "ME5E.Language.Language.Auran",
          ignan: "ME5E.Language.Language.Ignan",
          terran: "ME5E.Language.Language.Terran"
        }
      },
      sylvan: "ME5E.Language.Language.Sylvan",
      undercommon: "ME5E.Language.Language.Undercommon"
    }
  }
};
preLocalize("languages", { key: "label" });
preLocalize("languages.standard.children", { key: "label", sort: true });
preLocalize("languages.exotic.children", { key: "label", sort: true });
preLocalize("languages.exotic.children.primordial.children", { sort: true });

/* -------------------------------------------- */

/**
 * Communication types that take ranges such as telepathy.
 * @enum {{ label: string }}
 */
ME5E.communicationTypes = {
  telepathy: {
    label: "ME5E.Language.Communication.Telepathy"
  }
};
preLocalize("communicationTypes", { key: "label" });

/* -------------------------------------------- */

/**
 * NPC habitats.
 * @enum {HabitatConfiguration5e}
 */
ME5E.habitats = {
  any: {
    label: "ME5E.Habitat.Categories.Any"
  },
  arctic: {
    label: "ME5E.Habitat.Categories.Arctic"
  },
  coastal: {
    label: "ME5E.Habitat.Categories.Coastal"
  },
  desert: {
    label: "ME5E.Habitat.Categories.Desert"
  },
  forest: {
    label: "ME5E.Habitat.Categories.Forest"
  },
  grassland: {
    label: "ME5E.Habitat.Categories.Grassland"
  },
  hill: {
    label: "ME5E.Habitat.Categories.Hill"
  },
  mountain: {
    label: "ME5E.Habitat.Categories.Mountain"
  },
  planar: {
    label: "ME5E.Habitat.Categories.Planar",
    subtypes: true
  },
  swamp: {
    label: "ME5E.Habitat.Categories.Swamp"
  },
  underdark: {
    label: "ME5E.Habitat.Categories.Underdark"
  },
  underwater: {
    label: "ME5E.Habitat.Categories.Underwater"
  },
  urban: {
    label: "ME5E.Habitat.Categories.Urban"
  }
};
preLocalize("habitats", { key: "label" });

/* -------------------------------------------- */

/**
 * NPC Treasure
 * @enum {TreasureConfiguration5e}
 */
ME5E.treasure = {
  any: {
    label: "ME5E.Treasure.Categories.Any"
  },
  arcana: {
    label: "ME5E.Treasure.Categories.Arcana"
  },
  armaments: {
    label: "ME5E.Treasure.Categories.Armaments"
  },
  implements: {
    label: "ME5E.Treasure.Categories.Implements"
  },
  individual: {
    label: "ME5E.Treasure.Categories.Individual"
  },
  relics: {
    label: "ME5E.Treasure.Categories.Relics"
  }
};
preLocalize("treasure", { key: "label" });

/* -------------------------------------------- */

/**
 * Maximum allowed character level.
 * @type {number}
 */
ME5E.maxLevel = 20;

/**
 * Maximum ability score value allowed by default.
 * @type {number}
 */
ME5E.maxAbilityScore = 20;

/**
 * XP required to achieve each character level.
 * @type {number[]}
 */
ME5E.CHARACTER_EXP_LEVELS = [
  0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000,
  120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000
];

/**
 * XP granted for each challenge rating.
 * @type {number[]}
 */
ME5E.CR_EXP_LEVELS = [
  10, 200, 450, 700, 1100, 1800, 2300, 2900, 3900, 5000, 5900, 7200, 8400, 10000, 11500, 13000, 15000, 18000,
  20000, 22000, 25000, 33000, 41000, 50000, 62000, 75000, 90000, 105000, 120000, 135000, 155000
];

/**
 * XP thresholds for encounter difficulty.
 * @type {number[][]}
 */
ME5E.ENCOUNTER_DIFFICULTY = [
  [0, 0, 0],
  [50, 75, 100],
  [100, 150, 200],
  [150, 225, 400],
  [250, 375, 500],
  [500, 750, 1100],
  [600, 1000, 1400],
  [750, 1300, 1700],
  [1000, 1700, 2100],
  [1300, 2000, 2600],
  [1600, 2300, 3100],
  [1900, 2900, 4100],
  [2200, 3700, 4700],
  [2600, 4200, 5400],
  [2900, 4900, 6200],
  [3300, 5400, 7800],
  [3800, 6100, 9800],
  [4500, 7200, 11700],
  [5000, 8700, 14200],
  [5500, 10700, 17200],
  [6400, 13200, 22000]
];

/**
 * Intervals above the maximum XP that result in an epic boon.
 * @type {number}
 */
ME5E.epicBoonInterval = 30000;

/* -------------------------------------------- */

/**
 * Configurable traits on actors.
 * @enum {TraitConfiguration}
 */
ME5E.traits = {
  saves: {
    labels: {
      title: "ME5E.ClassSaves",
      localization: "ME5E.TraitSavesPlural"
    },
    icon: "icons/magic/life/ankh-gold-blue.webp",
    actorKeyPath: "system.abilities",
    configKey: "abilities",
    labelKeyPath: "label"
  },
  skills: {
    labels: {
      title: "ME5E.Skills",
      localization: "ME5E.TraitSkillsPlural"
    },
    icon: "icons/tools/instruments/harp-yellow-teal.webp",
    actorKeyPath: "system.skills",
    labelKeyPath: "label",
    expertise: true,
    dataType: MappingField
  },
  languages: {
    labels: {
      title: "ME5E.Languages",
      localization: "ME5E.TraitLanguagesPlural",
      all: "ME5E.Language.All"
    },
    icon: "icons/skills/social/diplomacy-peace-alliance.webp"
  },
  armor: {
    labels: {
      title: "ME5E.TraitArmorProf",
      localization: "ME5E.TraitArmorPlural"
    },
    icon: "icons/equipment/chest/breastplate-helmet-metal.webp",
    actorKeyPath: "system.traits.armorProf",
    configKey: "armorProficiencies",
    subtypes: { keyPath: "armor.type", ids: ["armorIds", "shieldIds"] }
  },
  weapon: {
    labels: {
      title: "ME5E.TraitWeaponProf",
      localization: "ME5E.TraitWeaponPlural"
    },
    icon: "icons/skills/melee/weapons-crossed-swords-purple.webp",
    actorKeyPath: "system.traits.weaponProf",
    configKey: "weaponProficiencies",
    subtypes: { keyPath: "weaponType", ids: ["weaponIds"] },
    mastery: true
  },
  tool: {
    labels: {
      title: "ME5E.TraitToolProf",
      localization: "ME5E.TraitToolPlural"
    },
    icon: "icons/skills/trades/smithing-anvil-silver-red.webp",
    actorKeyPath: "system.tools",
    configKey: "toolProficiencies",
    subtypes: { keyPath: "toolType", ids: ["tools"] },
    children: { vehicle: "vehicleTypes" },
    sortCategories: true,
    expertise: true,
    dataType: MappingField
  },
  di: {
    labels: {
      title: "ME5E.DamImm",
      localization: "ME5E.TraitDIPlural"
    },
    icon: "systems/me5e/icons/svg/trait-damage-immunities.svg",
    configKey: "damageTypes"
  },
  dr: {
    labels: {
      title: "ME5E.DamRes",
      localization: "ME5E.TraitDRPlural"
    },
    icon: "systems/me5e/icons/svg/trait-damage-resistances.svg",
    configKey: "damageTypes"
  },
  dv: {
    labels: {
      title: "ME5E.DamVuln",
      localization: "ME5E.TraitDVPlural"
    },
    icon: "systems/me5e/icons/svg/trait-damage-vulnerabilities.svg",
    configKey: "damageTypes"
  },
  dm: {
    labels: {
      title: "ME5E.DamMod",
      localization: "ME5E.TraitDMPlural"
    },
    configKey: "damageTypes",
    dataType: Number
  },
  ci: {
    labels: {
      title: "ME5E.ConImm",
      localization: "ME5E.TraitCIPlural"
    },
    icon: "systems/me5e/icons/svg/trait-condition-immunities.svg",
    configKey: "conditionTypes",
    labelKeyPath: "name"
  }
};
preLocalize("traits", { keys: ["labels.title", "labels.all"] });

/* -------------------------------------------- */

/**
 * Modes used within a trait advancement.
 * @enum {{ label: string, hint: string }}
 */
ME5E.traitModes = {
  default: {
    label: "ME5E.ADVANCEMENT.Trait.Mode.Default.Label",
    hint: "ME5E.ADVANCEMENT.Trait.Mode.Default.Hint"
  },
  expertise: {
    label: "ME5E.ADVANCEMENT.Trait.Mode.Expertise.Label",
    hint: "ME5E.ADVANCEMENT.Trait.Mode.Expertise.Hint"
  },
  forcedExpertise: {
    label: "ME5E.ADVANCEMENT.Trait.Mode.Force.Label",
    hint: "ME5E.ADVANCEMENT.Trait.Mode.Force.Hint"
  },
  upgrade: {
    label: "ME5E.ADVANCEMENT.Trait.Mode.Upgrade.Label",
    hint: "ME5E.ADVANCEMENT.Trait.Mode.Upgrade.Hint"
  },
  mastery: {
    label: "ME5E.ADVANCEMENT.Trait.Mode.Mastery.Label",
    hint: "ME5E.ADVANCEMENT.Trait.Mode.Mastery.Hint"
  }
};
preLocalize("traitModes", { keys: ["label", "hint"] });

/* -------------------------------------------- */

/**
 * Special character flags.
 * @enum {CharacterFlagConfiguration}
 */
ME5E.characterFlags = {
  diamondSoul: {
    name: "ME5E.FlagsDiamondSoul",
    hint: "ME5E.FlagsDiamondSoulHint",
    section: "ME5E.Feats",
    type: Boolean
  },
  enhancedDualWielding: {
    name: "ME5E.FLAGS.EnhancedDualWielding.Name",
    hint: "ME5E.FLAGS.EnhancedDualWielding.Hint",
    section: "ME5E.Feats",
    type: Boolean
  },
  elvenAccuracy: {
    name: "ME5E.FlagsElvenAccuracy",
    hint: "ME5E.FlagsElvenAccuracyHint",
    section: "ME5E.RacialTraits",
    abilities: ["dex", "int", "wis", "cha"],
    type: Boolean
  },
  halflingLucky: {
    name: "ME5E.FlagsHalflingLucky",
    hint: "ME5E.FlagsHalflingLuckyHint",
    section: "ME5E.RacialTraits",
    type: Boolean
  },
  halflingNimbleness: {
    name: "ME5E.FlagsHalflingNimbleness",
    hint: "ME5E.FlagsHalflingNimblenessHint",
    section: "ME5E.RacialTraits",
    type: Boolean
  },
  initiativeAlert: {
    name: "ME5E.FlagsAlert",
    hint: "ME5E.FlagsAlertHint",
    section: "ME5E.Feats",
    type: Boolean
  },
  jackOfAllTrades: {
    name: "ME5E.FlagsJOAT",
    hint: "ME5E.FlagsJOATHint",
    section: "ME5E.Feats",
    type: Boolean
  },
  observantFeat: {
    name: "ME5E.FlagsObservant",
    hint: "ME5E.FlagsObservantHint",
    skills: ["prc", "inv"],
    section: "ME5E.Feats",
    type: Boolean
  },
  tavernBrawlerFeat: {
    name: "ME5E.FlagsTavernBrawler",
    hint: "ME5E.FlagsTavernBrawlerHint",
    section: "ME5E.Feats",
    type: Boolean
  },
  powerfulBuild: {
    name: "ME5E.FlagsPowerfulBuild",
    hint: "ME5E.FlagsPowerfulBuildHint",
    section: "ME5E.RacialTraits",
    type: Boolean
  },
  reliableTalent: {
    name: "ME5E.FlagsReliableTalent",
    hint: "ME5E.FlagsReliableTalentHint",
    section: "ME5E.Feats",
    type: Boolean
  },
  remarkableAthlete: {
    name: "ME5E.FlagsRemarkableAthlete",
    hint: "ME5E.FlagsRemarkableAthleteHint",
    abilities: ["str", "dex", "con"],
    section: "ME5E.Feats",
    type: Boolean
  },
  toolExpertise: {
    name: "ME5E.FlagsToolExpertise",
    hint: "ME5E.FlagsToolExpertiseHint",
    section: "ME5E.Feats",
    type: Boolean
  },
  weaponCriticalThreshold: {
    name: "ME5E.FlagsWeaponCritThreshold",
    hint: "ME5E.FlagsWeaponCritThresholdHint",
    section: "ME5E.Feats",
    type: Number,
    placeholder: 20
  },
  spellCriticalThreshold: {
    name: "ME5E.FlagsSpellCritThreshold",
    hint: "ME5E.FlagsSpellCritThresholdHint",
    section: "ME5E.Feats",
    type: Number,
    placeholder: 20
  },
  meleeCriticalDamageDice: {
    name: "ME5E.FlagsMeleeCriticalDice",
    hint: "ME5E.FlagsMeleeCriticalDiceHint",
    section: "ME5E.Feats",
    type: Number,
    placeholder: 0
  }
};
preLocalize("characterFlags", { keys: ["name", "hint", "section"] });

/* -------------------------------------------- */

/**
 * Different types of actor structures that groups can represent.
 * @enum {object}
 */
ME5E.groupTypes = {
  party: "ME5E.Group.TypeParty",
  encounter: "ME5E.Group.TypeEncounter"
};
preLocalize("groupTypes");

/* -------------------------------------------- */

/**
 * Configuration information for activity types.
 * @enum {ActivityTypeConfiguration}
 */
ME5E.activityTypes = {
  attack: {
    documentClass: activities.AttackActivity
  },
  cast: {
    documentClass: activities.CastActivity
  },
  check: {
    documentClass: activities.CheckActivity
  },
  damage: {
    documentClass: activities.DamageActivity
  },
  enchant: {
    documentClass: activities.EnchantActivity
  },
  forward: {
    documentClass: activities.ForwardActivity
  },
  heal: {
    documentClass: activities.HealActivity
  },
  order: {
    documentClass: activities.OrderActivity,
    configurable: false
  },
  save: {
    documentClass: activities.SaveActivity
  },
  summon: {
    documentClass: activities.SummonActivity
  },
  transform: {
    documentClass: activities.TransformActivity
  },
  utility: {
    documentClass: activities.UtilityActivity
  }
};

/* -------------------------------------------- */

const _ALL_ITEM_TYPES = ["background", "class", "feat", "race", "subclass"];

/**
 * Advancement types that can be added to items.
 * @enum {AdvancementTypeConfiguration}
 */
ME5E.advancementTypes = {
  AbilityScoreImprovement: {
    documentClass: advancement.AbilityScoreImprovementAdvancement,
    validItemTypes: new Set(["background", "class", "race", "feat"])
  },
  HitPoints: {
    documentClass: advancement.HitPointsAdvancement,
    validItemTypes: new Set(["class"])
  },
  ItemChoice: {
    documentClass: advancement.ItemChoiceAdvancement,
    validItemTypes: new Set(_ALL_ITEM_TYPES)
  },
  ItemGrant: {
    documentClass: advancement.ItemGrantAdvancement,
    validItemTypes: new Set(_ALL_ITEM_TYPES)
  },
  ScaleValue: {
    documentClass: advancement.ScaleValueAdvancement,
    validItemTypes: new Set(_ALL_ITEM_TYPES)
  },
  Size: {
    documentClass: advancement.SizeAdvancement,
    validItemTypes: new Set(["race"])
  },
  Subclass: {
    documentClass: advancement.SubclassAdvancement,
    validItemTypes: new Set(["class"])
  },
  Trait: {
    documentClass: advancement.TraitAdvancement,
    validItemTypes: new Set(_ALL_ITEM_TYPES)
  }
};

/* -------------------------------------------- */

/**
 * Default artwork configuration for each Document type and sub-type.
 * @enum {Record<string, string>}
 */
ME5E.defaultArtwork = {
  Actor: {
    character: "systems/me5e/icons/svg/actors/character.svg",
    encounter: "systems/me5e/icons/svg/actors/encounter.svg",
    group: "systems/me5e/icons/svg/actors/group.svg",
    npc: "systems/me5e/icons/svg/actors/npc.svg",
    vehicle: "systems/me5e/icons/svg/actors/vehicle.svg"
  },
  Item: {
    background: "systems/me5e/icons/svg/items/background.svg",
    class: "systems/me5e/icons/svg/items/class.svg",
    consumable: "systems/me5e/icons/svg/items/consumable.svg",
    container: "systems/me5e/icons/svg/items/container.svg",
    equipment: "systems/me5e/icons/svg/items/equipment.svg",
    facility: "systems/me5e/icons/svg/items/facility.svg",
    feat: "systems/me5e/icons/svg/items/feature.svg",
    loot: "systems/me5e/icons/svg/items/loot.svg",
    race: "systems/me5e/icons/svg/items/race.svg",
    spell: "systems/me5e/icons/svg/items/spell.svg",
    subclass: "systems/me5e/icons/svg/items/subclass.svg",
    tool: "systems/me5e/icons/svg/items/tool.svg",
    weapon: "systems/me5e/icons/svg/items/weapon.svg"
  }
};

/* -------------------------------------------- */
/*  Calendar                                    */
/* -------------------------------------------- */

/**
 * Configuration information for the calendar UI.
 * @type {CalendarHUDConfiguration}
 */
ME5E.calendar = {
  application: CalenderHUD,
  calendars: [
    {
      value: "gregorian",
      label: "ME5E.CALENDAR.Gregorian",
      config: foundry.data.SIMPLIFIED_GREGORIAN_CALENDAR_CONFIG
    },
    {
      value: "greyhawk",
      label: "ME5E.CALENDAR.Greyhawk.Name",
      config: CALENDAR_OF_GREYHAWK,
      class: CalendarGreyhawk
    },
    {
      value: "harptos",
      label: "ME5E.CALENDAR.Harptos.Name",
      config: CALENDAR_OF_HARPTOS,
      class: CalendarHarptos
    },
    {
      value: "khorvaire",
      label: "ME5E.CALENDAR.Khorvaire.Name",
      config: CALENDAR_OF_KHORVAIRE,
      class: CalendarKhorvaire
    }
  ],
  formatters: [
    {
      value: "monthDay",
      label: "ME5E.CALENDAR.Formatters.MonthDay.Label",
      formatter: "formatMonthDay",
      group: "ME5E.CALENDAR.Formatters.Date"
    },
    {
      value: "monthDayYear",
      label: "ME5E.CALENDAR.Formatters.MonthDayYear.Label",
      formatter: "formatMonthDayYear",
      group: "ME5E.CALENDAR.Formatters.Date"
    },
    {
      value: "approximateDate",
      label: "ME5E.CALENDAR.Formatters.ApproximateDate.Label",
      formatter: "formatApproximateDate",
      group: "ME5E.CALENDAR.Formatters.Date"
    },
    {
      value: "hoursMinutes",
      label: "ME5E.CALENDAR.Formatters.HoursMinutes.Label",
      formatter: "formatHoursMinutes",
      group: "ME5E.CALENDAR.Formatters.Time"
    },
    {
      value: "hoursMinutesSeconds",
      label: "ME5E.CALENDAR.Formatters.HoursMinutesSeconds.Label",
      formatter: "formatHoursMinutesSeconds",
      group: "ME5E.CALENDAR.Formatters.Time"
    },
    {
      value: "approximateTime",
      label: "ME5E.CALENDAR.Formatters.ApproximateTime.Label",
      formatter: "formatApproximateTime",
      group: "ME5E.CALENDAR.Formatters.Time"
    }
  ]
};
preLocalize("calendar.calendars", { keys: ["label", "group"] });
preLocalize("calendar.formatters", { keys: ["label", "group"] });

/* -------------------------------------------- */
/*  Requests                                    */
/* -------------------------------------------- */

/**
 * Handler functions for named request/response operations
 * @type {Record<string, RequestCallback5e>}
 */
ME5E.requests = {
  rest: Actor5e.handleRestRequest,
  skill: Actor5e.handleSkillCheckRequest
};

/* -------------------------------------------- */
/*  Rules                                       */
/* -------------------------------------------- */

/**
 * Types of rules that can be used in rule pages and the &Reference enricher.
 * @enum {RuleTypeConfiguration}
 */
ME5E.ruleTypes = {
  rule: {
    label: "ME5E.Rule.Type.Rule",
    references: "rules"
  },
  ability: {
    label: "ME5E.Ability",
    references: "enrichmentLookup.abilities"
  },
  areaOfEffect: {
    label: "ME5E.AreaOfEffect.Label",
    references: "areaTargetTypes"
  },
  condition: {
    label: "ME5E.Rule.Type.Condition",
    references: "conditionTypes"
  },
  creatureType: {
    label: "ME5E.CreatureType",
    references: "creatureTypes"
  },
  damage: {
    label: "ME5E.DamageType",
    references: "damageTypes"
  },
  skill: {
    label: "ME5E.Skill",
    references: "enrichmentLookup.skills"
  },
  spellComponent: {
    label: "ME5E.SpellComponent",
    references: "itemProperties"
  },
  spellSchool: {
    label: "ME5E.SpellSchool",
    references: "enrichmentLookup.spellSchools"
  },
  spellTag: {
    label: "ME5E.SpellTag",
    references: "itemProperties"
  },
  weaponMastery: {
    label: "ME5E.WEAPON.Mastery.Label",
    references: "weaponMasteries"
  }
};
preLocalize("ruleTypes", { key: "label" });

/* -------------------------------------------- */

/**
 * List of rules that can be referenced from enrichers.
 * @enum {string}
 */
ME5E.rules = {
  inspiration: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.nkEPI89CiQnOaLYh",
  carryingcapacity: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.1PnjDBKbQJIVyc2t",
  push: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.Hni8DjqLzoqsVjb6",
  lift: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.Hni8DjqLzoqsVjb6",
  drag: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.Hni8DjqLzoqsVjb6",
  encumbrance: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.JwqYf9qb6gJAWZKs",
  hiding: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.plHuoNdS0j3umPNS",
  passiveperception: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.988C2hQNyvqkdbND",
  time: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.eihqNjwpZ3HM4IqY",
  speed: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.HhqeIiSj8sE1v1qZ",
  travelpace: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.eFAISahBloR2X8MX",
  forcedmarch: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.uQWQpRKQ1kWhuvjZ",
  difficultterrainpace: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.hFW5BR2yHHwwgurD",
  climbing: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.KxUXbMrUCIAhv4AF",
  swimming: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.KxUXbMrUCIAhv4AF",
  longjump: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.1U0myNrOvIVBUdJV",
  highjump: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.raPwIkqKSv60ELmy",
  falling: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.kREHL5pgNUOhay9f",
  suffocating: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.BIlnr0xYhqt4TGsi",
  vision: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.O6hamUbI9kVASN8b",
  light: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.O6hamUbI9kVASN8b",
  lightlyobscured: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.MAxtfJyvJV7EpzWN",
  heavilyobscured: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.wPFjfRruboxhtL4b",
  brightlight: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.RnMokVPyKGbbL8vi",
  dimlight: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.n1Ocpbyhr6HhgbCG",
  darkness: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.4dfREIDjG5N4fvxd",
  blindsight: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.tdtmXZbUIOZGSnKT",
  darkvision: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.7vQ1hLQ5fS6SSUqF",
  tremorsense: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.r64UrNusMhwJVnxb",
  truesight: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.be7g0q1xBAwb8drv",
  food: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.jayo7XVgGnRCpTW0",
  water: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.iIEI87J7lr2sqtb5",
  resting: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.dpHJXYLigIdEseIb",
  shortrest: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.1s2swI3UsjUUgbt2",
  longrest: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.6cLtjbHn4KV2R7G9",
  surprise: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.YmOt8HderKveA19K",
  initiative: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.RcwElV4GAcVXKWxo",
  bonusaction: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.2fu2CXsDg8gQmGGw",
  reaction: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.2VqLyxMyMxgXe2wC",
  difficultterrain: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.6tqz947qO8vPyxvD",
  beingprone: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.bV8akkBdVUUG21CO",
  droppingprone: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.hwTLpAtSS5OqQsI1",
  standingup: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.hwTLpAtSS5OqQsI1",
  crawling: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.VWG9qe8PUNtS28Pw",
  movingaroundothercreatures: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.9ZWCknaXCOdhyOrX",
  flying: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.0B1fxfmw0a48tPsc",
  size: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.HWHRQVBVG7K0RVVW",
  space: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.WIA5bs3P45PmO3OS",
  squeezing: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.wKtOwagDAiNfVoPS",
  attack: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.f4fZHwBvpbpzRyn4",
  castaspell: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.iIIDUsmSOkL0xNzF",
  dash: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.6l6nBKip4LqB1sCU",
  disengage: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.w1AGsemFERfjqWNx",
  dodge: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.3YJIuyCMmuUrfmuX",
  help: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.5S8i59qskkd9GGcJ",
  hide: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.rqhOsUY4wWa1oHTy",
  ready: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.nI9tN6Oq7fCV7hcA",
  search: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.ySj4gYZ4ADZoia7R",
  useanobject: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.UDlogfdiT2uYEZz4",
  attackrolls: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.W8uJrd1D8NeOuawp",
  unseenattackers: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.5ZJNwEPlsGurecg5",
  unseentargets: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.5ZJNwEPlsGurecg5",
  rangedattacks: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.S9aclVOCbusLE3kC",
  range: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.HjKXuB8ndjcqOds7",
  rangedattacksinclosecombat: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.qEZvxW0NM7ixSQP5",
  meleeattacks: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.GTk6emvzNxl8Oosl",
  reach: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.hgZ5ZN4B3y7tmFlt",
  unarmedstrike: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.xJjJ4lhymAYXAOvO",
  opportunityattacks: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.eNvzQabiTqTtfzis",
  twoweaponfighting: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.FQTS08uH74A6psL2",
  grappling: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.YSLWJcQCP6kzsPql",
  escapingagrapple: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.2TZKy9YbMN3ZY3h8",
  movingagrappledcreature: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.x5bUdhAD7u5Bt2rg",
  shoving: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.hrdqMF8hRXJdNzJx",
  cover: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.W7f7PcRubNUMIq2S",
  halfcover: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.hv0J61IAfofuhy3Q",
  threequarterscover: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.zAMStUjUrPV10dFm",
  totalcover: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.BKUAxXuPEzxiEOeL",
  hitpoints: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.PFbzoMBviI2DD9QP",
  damagerolls: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.hd26AqKrCqtcQBWy",
  criticalhits: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.gFL1VhSEljL1zvje",
  damagetypes: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.jVOgf7DNEhkzYNIe",
  damageresistance: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.v0WE18nT5SJO8Ft7",
  damagevulnerability: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.v0WE18nT5SJO8Ft7",
  healing: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.ICketFqbFslqKiX9",
  instantdeath: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.8BG05mA0mEzwmrHU",
  deathsavingthrows: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.JL8LePEJQYFdNuLL",
  deathsaves: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.JL8LePEJQYFdNuLL",
  stabilizing: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.r1CgZXLcqFop6Dlx",
  knockingacreatureout: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.PjXBMVcEaWuKjder",
  temporaryhitpoints: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.qOKtJt8CB2qRaTNA",
  temphp: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.qOKtJt8CB2qRaTNA",
  mounting: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.MFpyvUIdcBpC9kIE",
  dismounting: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.MFpyvUIdcBpC9kIE",
  controllingamount: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.khmR2xFk1NxoQUgZ",
  underwatercombat: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.6zVOeLyq4iMnrQT4",
  spelllevel: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.A6k5fS0kFqPXTW3v",
  knownspells: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.oezg742GlxmEwT85",
  preparedspells: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.oezg742GlxmEwT85",
  spellslots: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.Su6wbb0O9UN4ZDIH",
  castingatahigherlevel: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.4H9SLM95OCLfFizz",
  upcasting: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.4H9SLM95OCLfFizz",
  castinginarmor: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.z4A8vHSK2pb8YA9X",
  cantrips: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.jZD5mCTnMPJ9jW67",
  rituals: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.FjWqT5iyJ89kohdA",
  castingtime: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.zRVW8Tvyk6BECjZD",
  bonusactioncasting: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.RP1WL9FXI3aknlxZ",
  reactioncasting: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.t62lCfinwU9H7Lji",
  longercastingtimes: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.gOAIRFCyPUx42axn",
  spellrange: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.RBYPyE5z5hAZSbH6",
  components: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.xeHthAF9lxfn2tII",
  verbal: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.6UXTNWMCQ0nSlwwx",
  spellduration: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.9mp0SRsptjvJcq1e",
  instantaneous: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.kdlgZOpRMB6bGCod",
  concentrating: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.ow58p27ctAnr4VPH",
  spelltargets: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.G80AIQr04sxdVpw4",
  areaofeffect: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.wvtCeGHgnUmh0cuj",
  pointoforigin: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.8HxbRceQQUAhyWRt",
  spellsavingthrows: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.8DajfNll90eeKcmB",
  spellattackrolls: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.qAFzmGZKhVvAEUF3",
  combiningmagicaleffects: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.TMIN963hG773yZzO",
  schoolsofmagic: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.TeF6CKMDRpYpsLd4",
  detectingtraps: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.DZ7AhdQ94xggG4bj",
  disablingtraps: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.DZ7AhdQ94xggG4bj",
  curingmadness: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.6Icem7G3CICdNOkM",
  damagethreshold: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.9LJZhqvCburpags3",
  poisontypes: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.I6OMMWUaYCWR9xip",
  contactpoison: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.kXnCEqqGUWRZeZDj",
  ingestedpoison: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.Y0vsJYSWeQcFpJ27",
  inhaledpoison: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.KUyN4eK1xTBzXsjP",
  injurypoison: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.LUL48OUq6SJeMGc7",
  attunement: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.UQ65OwIyGK65eiOK",
  wearingitems: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.iPB8mGKuQx3X0Z2J",
  wieldingitems: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.iPB8mGKuQx3X0Z2J",
  multipleitemsofthesamekind: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.rLJdvz4Mde8GkEYQ",
  paireditems: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.rd9pCH8yFraSGN34",
  commandword: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.HiXixxLYesv6Ff3t",
  consumables: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.UEPAcZFzQ5x196zE",
  itemspells: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.DABoaeeF6w31UCsj",
  charges: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.NLRXcgrpRCfsA5mO",
  spellscroll: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.gi8IKhtOlBVhMJrN",
  creaturetags: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.9jV1fFF163dr68vd",
  telepathy: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.geTidcFIYWuUvD2L",
  legendaryactions: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.C1awOyZh78pq1xmY",
  lairactions: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.07PtjpMxiRIhkBEp",
  regionaleffects: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.uj8W27NKFyzygPUd",
  disease: "Compendium.me5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.oNQWvyRZkTOJ8PBq",
  d20test: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.nxPH59t3iNtWJxnU",
  advantage: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.lvs9RRDi1UA1Lff8",
  disadvantage: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.fFrHBgqKUMY0Nnco",
  difficultyclass: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.afnB0KZZk2hKtjv4",
  armorclass: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.IL73rq9BlQowdon7",
  abilitycheck: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.XBQqXCoTbvp5Dika",
  savingthrow: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.Vlri6Mp6grn9wt3g",
  challengerating: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.BMoxmXB8pX6bOBus",
  expertise: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.69nu4Sk3V5O15GFf",
  influence: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.4V59Q1dlWjNhpJGo",
  magic: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.iIIDUsmSOkL0xNzF",
  study: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.Nuz0Wx4a4aAPcC34",
  utilize: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.UDlogfdiT2uYEZz4",
  friendly: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.RVcWSqblHIs7SUzn",
  indifferent: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.eYX5eimGuYhHPoj4",
  hostile: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.BNxLbtJofbNGzjsp",
  breakingobjects: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.RXTLVpAwcGm1qtKf",
  hazards: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.5hyEitPd1Kb27fP5",
  bloodied: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.shZaSIlFPpHufPFn",
  jumping: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.aaJOlRhI1H6vAxt9",
  resistance: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.Uk3xhCTvEfx8BN1O",
  stable: "Compendium.me5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.klXWp4c90n7Kt5LB"
};

/* -------------------------------------------- */
/*  Sources                                     */
/* -------------------------------------------- */

/**
 * List of books available as sources.
 * @enum {string}
 */
ME5E.sourceBooks = {};
preLocalize("sourceBooks", { sort: true });

/* -------------------------------------------- */
/*  Themes                                      */
/* -------------------------------------------- */

/**
 * Themes that can be set for the system or on sheets.
 * @enum {string}
 */
ME5E.themes = {
  light: "SHEETS.ME5E.THEME.Light",
  dark: "SHEETS.ME5E.THEME.Dark"
};
preLocalize("themes");

/* -------------------------------------------- */
/*  Enrichment                                  */
/* -------------------------------------------- */

let _enrichmentLookup;
Object.defineProperty(ME5E, "enrichmentLookup", {
  get() {
    const slugify = value => value?.slugify().replaceAll("-", "");
    if ( !_enrichmentLookup ) {
      _enrichmentLookup = {
        abilities: foundry.utils.deepClone(ME5E.abilities),
        languages: _flattenConfig(ME5E.languages, { labelKey: "label", skipEntry: (k, d) => d.selectable === false }),
        skills: foundry.utils.deepClone(ME5E.skills),
        spellSchools: foundry.utils.deepClone(ME5E.spellSchools),
        tools: foundry.utils.deepClone(ME5E.tools)
      };
      const addFullKeys = key => Object.entries(ME5E[key]).forEach(([k, v]) =>
        _enrichmentLookup[key][slugify(v.fullKey)] = { ...v, key: k }
      );
      addFullKeys("abilities");
      addFullKeys("skills");
      addFullKeys("spellSchools");
    }
    return _enrichmentLookup;
  },
  enumerable: true
});

/* -------------------------------------------- */

/**
 * Create a flattened version of a nested config (such as CONFIG.ME5E.languages) so all leaf entries are at
 * a single level.
 * @param {object} config
 * @param {object} [options={}]
 * @param {string} [options.labelKey]        If provided, simplify all included objects to just the label.
 * @param {Function} [options.skipCategory]  Callback passed the key and data that should return a boolean to skip a
 *                                           category but not its children when creating flattened object.
 * @returns {object}
 */
function _flattenConfig(config, { labelKey, skipEntry }={}) {
  const obj = {};
  for ( const [key, data] of Object.entries(config) ) {
    if ( !skipEntry?.(key, data) ) {
      if ( labelKey && (foundry.utils.getType(data) === "Object") ) obj[key] = data[labelKey];
      else obj[key] = data;
    }
    if ( data.children ) Object.assign(obj, _flattenConfig(data.children, { labelKey, skipEntry }));
  }
  return obj;
}

/* -------------------------------------------- */

/**
 * Patch an existing config enum to allow conversion from string values to object values without
 * breaking existing modules that are expecting strings.
 * @param {string} key          Key within ME5E that has been replaced with an enum of objects.
 * @param {string} fallbackKey  Key within the new config object from which to get the fallback value.
 * @param {object} [options]    Additional options passed through to logCompatibilityWarning.
 */
function patchConfig(key, fallbackKey, options) {
  /** @override */
  function toString() {
    const message = `The value of CONFIG.ME5E.${key} has been changed to an object.`
      +` The former value can be acccessed from .${fallbackKey}.`;
    foundry.utils.logCompatibilityWarning(message, options);
    return this[fallbackKey];
  }

  Object.values(ME5E[key]).forEach(o => {
    if ( foundry.utils.getType(o) !== "Object" ) return;
    Object.defineProperty(o, "toString", {value: toString});
  });
}

/* -------------------------------------------- */

export default ME5E;
