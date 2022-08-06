import { preLocalize } from "./utils.mjs";
import {Character5e, Npc5e} from "./documents/actor/_module.mjs";
import {
  AELikeRule,
  InvalidPredicate,
  EqPredicate, EquPredicate, GtePredicate, GtPredicate, LtePredicate, LtPredicate,
  ActorTypePredicate, HasItemPredicate,
  AllPredicate, AnyPredicate, InversePredicate, OnePredicate
} from "./rules/_module.mjs";

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

ME5E.Actor = {
  /**
   * A mapping of Actor Types to Actor Classes
   * @type {Object<String, Actor5e>}
   */
  documentClasses: {
    character: Character5e,
    npc: Npc5e,
    // vehicle: Vehicle5e
  }
};

let XorPredicate;
ME5E.Rule = {
  /**
   * A mapping of Rule Types to Rule Classes
   * @type {Object<String, Rule5e>}
   */
  types: {
    activeEffectLike: AELikeRule
  },

  /**
   * A mapping of Predicate Types to Predicate Classes
   * @type {Object<String, Predicate5e>}
   */
  predicates: {
    invalid: InvalidPredicate,

    // Compound
    all: AllPredicate,
    any: AnyPredicate,
    one: OnePredicate,
    inverse: InversePredicate,

    // Simple
    eq: EqPredicate,
    equ: EquPredicate,
    gt: GtPredicate,
    gte: GtePredicate,
    lt: LtPredicate,
    lte: LtePredicate,
    "has-item": HasItemPredicate,
    "actor-type": ActorTypePredicate
  }
};

/**
 * The set of Ability Scores used within the system.
 * @enum {string}
 */
ME5E.abilities = {
  str: "ME5E.AbilityStr",
  dex: "ME5E.AbilityDex",
  con: "ME5E.AbilityCon",
  int: "ME5E.AbilityInt",
  wis: "ME5E.AbilityWis",
  cha: "ME5E.AbilityCha"
};
preLocalize("abilities");

/**
 * Localized abbreviations for Ability Scores.
 * @enum {string}
 */
ME5E.abilityAbbreviations = {
  str: "ME5E.AbilityStrAbbr",
  dex: "ME5E.AbilityDexAbbr",
  con: "ME5E.AbilityConAbbr",
  int: "ME5E.AbilityIntAbbr",
  wis: "ME5E.AbilityWisAbbr",
  cha: "ME5E.AbilityChaAbbr",
  hon: "ME5E.AbilityHonAbbr",
  san: "ME5E.AbilitySanAbbr"
};
preLocalize("abilityAbbreviations");

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
 * @enum {number}
 */
ME5E.attunementTypes = {
  NONE: 0,
  REQUIRED: 1,
  ATTUNED: 2
};

/**
 * An enumeration of item attunement states.
 * @type {{"0": string, "1": string, "2": string}}
 */
ME5E.attunements = {
  0: "ME5E.AttunementNone",
  1: "ME5E.AttunementRequired",
  2: "ME5E.AttunementAttuned"
};
preLocalize("attunements");

/* -------------------------------------------- */

/**
 * General weapon categories.
 * @enum {string}
 */
ME5E.weaponProficiencies = {
  ar: "ME5E.WeaponARProficiency",
  hp: "ME5E.WeaponHPProficiency",
  smg: "ME5E.WeaponSMGProficiency",
  sg: "ME5E.WeaponSGProficiency",
  sr: "ME5E.WeaponSRProficiency",
  melee: "ME5E.WeaponMeleeProficiency"
};
preLocalize("weaponProficiencies");

/**
 * The basic weapon types in 5e. This enables specific weapon proficiencies or
 * starting equipment provided by classes and backgrounds.
 * @enum {string}
 */
ME5E.weaponIds = {

};

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
 * The basic tool types in 5e. This enables specific tool proficiencies or
 * starting equipment provided by classes and backgrounds.
 * @enum {string}
 */
ME5E.toolIds = {
};

/* -------------------------------------------- */

/**
 * The various lengths of time over which effects can occur.
 * @enum {string}
 */
ME5E.timePeriods = {
  inst: "ME5E.TimeInst",
  turn: "ME5E.TimeTurn",
  round: "ME5E.TimeRound",
  minute: "ME5E.TimeMinute",
  hour: "ME5E.TimeHour",
  day: "ME5E.TimeDay",
  month: "ME5E.TimeMonth",
  year: "ME5E.TimeYear",
  perm: "ME5E.TimePerm",
  spec: "ME5E.Special"
};
preLocalize("timePeriods");

/* -------------------------------------------- */

/**
 * Various ways in which an item or ability can be activated.
 * @enum {string}
 */
ME5E.abilityActivationTypes = {
  none: "ME5E.None",
  action: "ME5E.Action",
  bonus: "ME5E.BonusAction",
  reaction: "ME5E.Reaction",
  minute: ME5E.timePeriods.minute,
  hour: ME5E.timePeriods.hour,
  day: ME5E.timePeriods.day,
  special: ME5E.timePeriods.spec,
  legendary: "ME5E.LegendaryActionLabel",
  lair: "ME5E.LairActionLabel",
  crew: "ME5E.VehicleCrewAction"
};
preLocalize("abilityActivationTypes", { sort: true });

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
 * Creature sizes.
 * @enum {string}
 */
ME5E.actorSizes = {
  tiny: "ME5E.SizeTiny",
  sm: "ME5E.SizeSmall",
  med: "ME5E.SizeMedium",
  lg: "ME5E.SizeLarge",
  huge: "ME5E.SizeHuge",
  grg: "ME5E.SizeGargantuan"
};
preLocalize("actorSizes");

/**
 * Default token image size for the values of `ME5E.actorSizes`.
 * @enum {number}
 */
ME5E.tokenSizes = {
  tiny: 0.5,
  sm: 1,
  med: 1,
  lg: 2,
  huge: 3,
  grg: 4
};

/**
 * Colors used to visualize temporary and temporary maximum HP in token health bars.
 * @enum {number}
 */
ME5E.tokenHPColors = {
  damage: 0xFF0000,
  healing: 0x00FF00,
  temp: 0x66CCFF,
  negmax: 0x550000
};

/* -------------------------------------------- */

/**
 * Default types of creatures.
 * *Note: Not pre-localized to allow for easy fetching of pluralized forms.*
 * @enum {string}
 */
ME5E.creatureTypes = {
  construct: "ME5E.CreatureConstruct",
  organic: "ME5E.CreatureOrganic",
  synthetic: "ME5E.CreatureSynthetic",
  synthOrganic: "ME5E.CreatureSynthOrganic"
};

/* -------------------------------------------- */

/**
 * Classification types for item action types.
 * @enum {string}
 */
// TODO: Consider changing to MPAK/RPAK
ME5E.itemActionTypes = {
  mwak: "ME5E.ActionMWAK",
  rwak: "ME5E.ActionRWAK",
  msak: "ME5E.ActionMSAK",
  rsak: "ME5E.ActionRSAK",
  save: "ME5E.ActionSave",
  heal: "ME5E.ActionHeal",
  abil: "ME5E.ActionAbil",
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
  spectre: "ME5E.ItemRaritySpectre"
};
preLocalize("itemRarity");

/* -------------------------------------------- */

/**
 * Enumerate the lengths of time over which an item can have limited use ability.
 * @enum {string}
 */
ME5E.limitedUsePeriods = {
  sr: "ME5E.ShortRest",
  lr: "ME5E.LongRest",
  day: "ME5E.Day",
  charges: "ME5E.Charges"
};
preLocalize("limitedUsePeriods");

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

ME5E.armorPlacement = {
  chest: "ME5E.EquipmentArmourChest",
  arms: "ME5E.EquipmentArmourArms",
  legs: "ME5E.EquipmentArmourLegs",
  head: "ME5E.EquipmentArmourHead",
  body: "ME5E.EquipmentArmourBody"
};
preLocalize("armorPlacement");

/* -------------------------------------------- */

/**
 * Equipment types that aren't armor.
 * @enum {string}
 */
ME5E.miscEquipmentTypes = {
  clothing: "ME5E.EquipmentClothing",
  trinket: "ME5E.EquipmentTrinket",
  vehicle: "ME5E.EquipmentVehicle"
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
  air: "ME5E.VehicleTypeAir",
  land: "ME5E.VehicleTypeLand",
  water: "ME5E.VehicleTypeWater",
  space: "ME5E.VehicleTypeSpace"
};
preLocalize("vehicleTypes", { sort: true });

/* -------------------------------------------- */

/**
 * The set of Armor Proficiencies which a character may have.
 * @type {object}
 */
ME5E.armorProficiencies = {
  lgt: ME5E.equipmentTypes.light,
  med: ME5E.equipmentTypes.medium,
  hvy: ME5E.equipmentTypes.heavy,
  shl: "ME5E.EquipmentShieldProficiency"
};
preLocalize("armorProficiencies");

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

/**
 * The basic armor types in 5e. This enables specific armor proficiencies,
 * automated AC calculation in NPCs, and starting equipment.
 * @enum {string}
 */
ME5E.armorIds = {
};

/**
 * The basic shield in 5e.
 * @enum {string}
 */
ME5E.shieldIds = {
};

/**
 * Common armor class calculations.
 * @enum {{ label: string, [formula]: string }}
 */
// TODO: Change
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
  custom: {
    label: "ME5E.ArmorClassCustom"
  }
};
preLocalize("armorClasses", { key: "label" });

/* -------------------------------------------- */

/**
 * Enumerate the valid consumable types which are recognized by the system.
 * @enum {string}
 */
// TODO: Revise
ME5E.consumableTypes = {
  ammo: "ME5E.ConsumableAmmunition",
  potion: "ME5E.ConsumablePotion",
  poison: "ME5E.ConsumablePoison",
  food: "ME5E.ConsumableFood",
  scroll: "ME5E.ConsumableScroll",
  wand: "ME5E.ConsumableWand",
  rod: "ME5E.ConsumableRod",
  trinket: "ME5E.ConsumableTrinket"
};
preLocalize("consumableTypes", { sort: true });

/* -------------------------------------------- */

/**
 * The valid currency denominations with localized labels, abbreviations, and conversions.
 * @enum {{
 *   label: string,
 *   abbreviation: string,
 *   [conversion]: {into: string, each: number}
 * }}
 */
ME5E.currencies = {
  cr: {
    label: "ME5E.CurrencyCR",
    abbreviation: "ME5E.CurrencyAbbrCR"
  }
};
preLocalize("currencies", { keys: ["label", "abbreviation"] });

/* -------------------------------------------- */

/**
 * Types of damage the can be caused by abilities.
 * @enum {string}
 */
ME5E.damageTypes = {
  acid: "ME5E.DamageAcid",
  bludgeoning: "ME5E.DamageBludgeoning",
  cold: "ME5E.DamageCold",
  fire: "ME5E.DamageFire",
  force: "ME5E.DamageForce",
  lightning: "ME5E.DamageLightning",
  necrotic: "ME5E.DamageNecrotic",
  piercing: "ME5E.DamagePiercing",
  poison: "ME5E.DamagePoison",
  psychic: "ME5E.DamagePsychic",
  radiant: "ME5E.DamageRadiant",
  slashing: "ME5E.DamageSlashing",
  thunder: "ME5E.DamageThunder"
};
preLocalize("damageTypes", { sort: true });

/**
 * Types of damage to which an actor can possess resistance, immunity, or vulnerability.
 * @enum {string}
 */
ME5E.damageResistanceTypes = {
  ...ME5E.damageTypes,
  physical: "ME5E.DamagePhysical"
};
preLocalize("damageResistanceTypes", { sort: true });

/* -------------------------------------------- */

/**
 * The valid units of measure for movement distances in the game system.
 * By default this uses the imperial units of feet and miles.
 * @enum {string}
 */
ME5E.movementTypes = {
  burrow: "ME5E.MovementBurrow",
  climb: "ME5E.MovementClimb",
  fly: "ME5E.MovementFly",
  swim: "ME5E.MovementSwim",
  walk: "ME5E.MovementWalk"
};
preLocalize("movementTypes", { sort: true });

/**
 * The valid units of measure for movement distances in the game system.
 * By default this uses the imperial units of feet and miles.
 * @enum {string}
 */
ME5E.movementUnits = {
  ft: "ME5E.DistFt",
  mi: "ME5E.DistMi",
  m: "ME5E.DistM",
  km: "ME5E.DistKm"
};
preLocalize("movementUnits");

/**
 * The valid units of measure for the range of an action or effect.
 * This object automatically includes the movement units from `ME5E.movementUnits`.
 * @enum {string}
 */
ME5E.distanceUnits = {
  none: "ME5E.None",
  self: "ME5E.DistSelf",
  touch: "ME5E.DistTouch",
  spec: "ME5E.Special",
  any: "ME5E.DistAny",
  ...ME5E.movementUnits
};
preLocalize("distanceUnits");

/* -------------------------------------------- */

/**
 * Configure aspects of encumbrance calculation so that it could be configured by modules.
 * @enum {{ imperial: number, metric: number }}
 */
ME5E.encumbrance = {
  currencyPerWeight: {
    imperial: 50,
    metric: 110
  },
  strMultiplier: {
    imperial: 15,
    metric: 6.8
  },
  vehicleWeightMultiplier: {
    imperial: 2000, // 2000 lbs in an imperial ton
    metric: 1000 // 1000 kg in a metric ton
  }
};

/* -------------------------------------------- */

/**
 * The types of single or area targets which can be applied to abilities.
 * @enum {string}
 */
ME5E.targetTypes = {
  none: "ME5E.None",
  self: "ME5E.TargetSelf",
  creature: "ME5E.TargetCreature",
  ally: "ME5E.TargetAlly",
  enemy: "ME5E.TargetEnemy",
  object: "ME5E.TargetObject",
  space: "ME5E.TargetSpace",
  radius: "ME5E.TargetRadius",
  sphere: "ME5E.TargetSphere",
  cylinder: "ME5E.TargetCylinder",
  cone: "ME5E.TargetCone",
  square: "ME5E.TargetSquare",
  cube: "ME5E.TargetCube",
  line: "ME5E.TargetLine",
  wall: "ME5E.TargetWall"
};
preLocalize("targetTypes", { sort: true });

/* -------------------------------------------- */

/**
 * Mapping between `ME5E.targetTypes` and `MeasuredTemplate` shape types to define
 * which templates are produced by which area of effect target type.
 * @enum {string}
 */
ME5E.areaTargetTypes = {
  cone: "cone",
  cube: "rect",
  cylinder: "circle",
  line: "ray",
  radius: "circle",
  sphere: "circle",
  square: "rect",
  wall: "ray"
};

/* -------------------------------------------- */

/**
 * Different types of healing that can be applied using abilities.
 * @enum {string}
 */
ME5E.healingTypes = {
  healing: "ME5E.Healing",
  temphp: "ME5E.HealingTemp"
};
preLocalize("healingTypes");

/* -------------------------------------------- */

/**
 * Denominations of hit dice which can apply to classes.
 * @type {string[]}
 */
ME5E.hitDieTypes = ["d6", "d8", "d10", "d12"];

/* -------------------------------------------- */

/**
 * The set of possible sensory perception types which an Actor may have.
 * @enum {string}
 */
ME5E.senses = {
  blindsight: "ME5E.SenseBlindsight",
  darkvision: "ME5E.SenseDarkvision",
  truesight: "ME5E.SenseTruesight",
  infrared: "ME5E.SenseInfrared"
};
preLocalize("senses", { sort: true });

/* -------------------------------------------- */

/**
 * The set of skill which can be trained.
 * @enum {string}
 */
ME5E.skills = {
  acr: "ME5E.SkillAcr",
  ath: "ME5E.SkillAth",
  dec: "ME5E.SkillDec",
  elc: "ME5E.SkillElc",
  eng: "ME5E.SkillEng",
  his: "ME5E.SkillHis",
  ins: "ME5E.SkillIns",
  itm: "ME5E.SkillItm",
  inv: "ME5E.SkillInv",
  med: "ME5E.SkillMed",
  prc: "ME5E.SkillPrc",
  prf: "ME5E.SkillPrf",
  per: "ME5E.SkillPer",
  sci: "ME5E.SkillSci",
  slt: "ME5E.SkillSlt",
  ste: "ME5E.SkillSte",
  sur: "ME5E.SkillSur",
  veh: "ME5E.SkillVeh"
};
preLocalize("skills", { sort: true });

/* -------------------------------------------- */

/**
 * Various different ways a spell can be prepared.
 */
// TODO: This definitely needs changing
ME5E.spellPreparationModes = {
  prepared: "ME5E.SpellPrepPrepared",
  pact: "ME5E.PactMagic",
  always: "ME5E.SpellPrepAlways",
  atwill: "ME5E.SpellPrepAtWill",
  innate: "ME5E.SpellPrepInnate"
};
preLocalize("spellPreparationModes");

/**
 * Subset of `ME5E.spellPreparationModes` that consume spell slots.
 * @type {boolean[]}
 */
ME5E.spellUpcastModes = ["always", "pact", "prepared"];

/**
 * Ways in which a class can contribute to spellcasting levels.
 * @enum {string}
 */
// TODO: Definitely needs fixing
ME5E.spellProgression = {
  none: "ME5E.SpellNone",
  full: "ME5E.SpellProgFull",
  half: "ME5E.SpellProgHalf",
  third: "ME5E.SpellProgThird",
  pact: "ME5E.SpellProgPact",
  artificer: "ME5E.SpellProgArt"
};
preLocalize("spellProgression");

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
 * The set of types which a weapon item can take.
 * @enum {string}
 */
// TODO: This is 100% broken
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
 * The set of weapon property flags which can exist on a weapon.
 * @enum {string}
 */
ME5E.weaponProperties = {
  arc: "ME5E.WeaponPropertiesArc",
  bur: "ME5E.WeaponPropertiesBur",
  dbt: "ME5E.WeaponPropertiesDbt",
  fin: "ME5E.WeaponPropertiesFin",
  het: "ME5E.WeaponPropertiesHet",
  hvy: "ME5E.WeaponPropertiesHvy",
  hip: "ME5E.WeaponPropertiesHip",
  lgt: "ME5E.WeaponPropertiesLgt",
  mel: "ME5E.WeaponPropertiesMel",
  rng: "ME5E.WeaponPropertiesRng",
  rch: "ME5E.WeaponPropertiesRch",
  rec: "ME5E.WeaponPropertiesRec",
  sil: "ME5E.WeaponPropertiesSil",
  spc: "ME5E.WeaponPropertiesSpc",
  thr: "ME5E.WeaponPropertiesThr",
  two: "ME5E.WeaponPropertiesTwo",
  ver: "ME5E.WeaponPropertiesVer",
  wgt: "ME5E.WeaponPropertiesWgt"
};
preLocalize("weaponProperties", { sort: true });

/**
 * Types of components that can be required when casting a spell.
 * @enum {object}
 */
// TODO: If there is only one that's always there then why mention it
ME5E.spellComponents = {
  somatic: {
    label: "ME5E.ComponentSomatic",
    abbr: "ME5E.ComponentSomaticAbbr"
  }
};
preLocalize("spellComponents", {keys: ["label", "abbr"]});

/**
 * Supplementary rules keywords that inform a spell's use.
 * @enum {object}
 */
ME5E.spellTags = {
  concentration: {
    label: "ME5E.Concentration",
    abbr: "ME5E.ConcentrationAbbr"
  },
  ritual: {
    label: "ME5E.Ritual",
    abbr: "ME5E.RitualAbbr"
  }
};
preLocalize("spellTags", {keys: ["label", "abbr"]});

/**
 * Schools to which a spell can belong.
 * @enum {string}
 */
ME5E.spellSchools = {
  bio: "ME5E.SchoolBio",
  tec: "ME5E.SchoolTec",
  com: "ME5E.SchoolCom"
};
preLocalize("spellSchools", { sort: true });

/**
 * Valid spell levels.
 * @enum {string}
 */
// TODO: Is this worth making powers
ME5E.spellLevels = {
  0: "ME5E.SpellLevel0",
  1: "ME5E.SpellLevel1",
  2: "ME5E.SpellLevel2",
  3: "ME5E.SpellLevel3",
  4: "ME5E.SpellLevel4"
};
preLocalize("spellLevels");

/**
 * Compendium packs used for localized items.
 * @enum {string}
 */
ME5E.sourcePacks = {
  ITEMS: "me5e.items"
};

/**
 * Define the standard slot progression by character level.
 * The entries of this array represent the spell slot progression for a full spell-caster.
 * @type {number[][]}
 */
// TODO: Definitely needs changing
ME5E.SPELL_SLOT_TABLE = [
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
 * Skill, ability, and tool proficiency levels.
 * The key for each level represents its proficiency multiplier.
 * @enum {string}
 */
ME5E.proficiencyLevels = {
  0: "ME5E.NotProficient",
  0.5: "ME5E.HalfProficient",
  1: "ME5E.Proficient",
  2: "ME5E.Expertise"
};
preLocalize("proficiencyLevels");

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
 */
// TODO: This'll need changing definitely
ME5E.trackableAttributes = [
  "attributes.ac.value", "attributes.init.value", "attributes.movement", "attributes.senses", "attributes.spelldc",
  "attributes.spellLevel", "details.cr", "details.spellLevel", "details.xp.value", "skills.*.passive",
  "abilities.*.value"
];

/* -------------------------------------------- */

/**
 * A selection of actor and item attributes that are valid targets for item resource consumption.
 * @type {string[]}
 */
// TODO: This'll need changing definitely
ME5E.consumableResources = [
  "item.quantity", "item.weight", "item.duration.value", "currency", "details.xp.value", "abilities.*.value",
  "attributes.senses", "attributes.movement", "attributes.ac.flat", "item.armor.value", "item.target", "item.range",
  "item.save.dc"
];

/* -------------------------------------------- */

/**
 * Conditions that can effect an actor.
 * @enum {string}
 */
// TODO: Consider concentration automation
ME5E.conditionTypes = {
  blinded: "ME5E.ConBlinded",
  charmed: "ME5E.ConCharmed",
  deafened: "ME5E.ConDeafened",
  exhaustion: "ME5E.ConExhaustion",
  frightened: "ME5E.ConFrightened",
  frozen: "ME5E.ConFrozen",
  grappled: "ME5E.ConGrappled",
  incapacitated: "ME5E.ConIncapacitated",
  indoctrinated: "ME5E.ConIndoctrinated",
  invisible: "ME5E.ConInvisible",
  lifted: "ME5E.ConLifted",
  paralyzed: "ME5E.ConParalyzed",
  poisoned: "ME5E.ConPoisoned",
  primedForce: "ME5E.ConPrimedForce",
  primedNecrotic: "ME5E.ConPrimedNecrotic",
  primedFire: "ME5E.ConPrimedFire",
  primedCold: "ME5E.ConPrimedCold",
  primedLightning: "ME5E.ConPrimedLightning",
  prone: "ME5E.ConProne",
  restrained: "ME5E.ConRestrained",
  stunned: "ME5E.ConStunned",
  targeting: "ME5E.ConTargeting",
  unconscious: "ME5E.ConUnconscious"
};
preLocalize("conditionTypes", { sort: true });

/**
 * Maximum allowed character level.
 * @type {number}
 */
ME5E.maxLevel = 20;

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
 * Special character flags.
 * @enum {{
 *   name: string,
 *   hint: string,
 *   [abilities]: string[],
 *   [choices]: Object<string, string>,
 *   [skills]: string[],
 *   section: string,
 *   type: any,
 *   placeholder: any
 * }}
 */
// TODO: This'll need changing
ME5E.characterFlags = {
  diamondSoul: {
    name: "ME5E.FlagsDiamondSoul",
    hint: "ME5E.FlagsDiamondSoulHint",
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
  initiativeAdv: {
    name: "ME5E.FlagsInitiativeAdv",
    hint: "ME5E.FlagsInitiativeAdvHint",
    section: "ME5E.Feats",
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

/**
 * Flags allowed on actors. Any flags not in the list may be deleted during a migration.
 * @type {string[]}
 */
ME5E.allowedActorFlags = Object.keys(ME5E.characterFlags);

export default ME5E;
