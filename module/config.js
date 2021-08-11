import {ClassFeatures} from "./classFeatures.js";

// Namespace Configuration Values
export const ME5E = {};

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
 * The set of Ability Scores used within the system
 * @type {Object}
 */
ME5E.abilities = {
    "str": "ME5E.AbilityStr",
    "dex": "ME5E.AbilityDex",
    "con": "ME5E.AbilityCon",
    "int": "ME5E.AbilityInt",
    "wis": "ME5E.AbilityWis",
    "cha": "ME5E.AbilityCha"
};

ME5E.abilityAbbreviations = {
    "str": "ME5E.AbilityStrAbbr",
    "dex": "ME5E.AbilityDexAbbr",
    "con": "ME5E.AbilityConAbbr",
    "int": "ME5E.AbilityIntAbbr",
    "wis": "ME5E.AbilityWisAbbr",
    "cha": "ME5E.AbilityChaAbbr"
};

/* -------------------------------------------- */

/**
 * Character alignment options
 * @type {Object}
 */
ME5E.alignments = {
    'lg': "ME5E.AlignmentLG",
    'ng': "ME5E.AlignmentNG",
    'cg': "ME5E.AlignmentCG",
    'ln': "ME5E.AlignmentLN",
    'tn': "ME5E.AlignmentTN",
    'cn': "ME5E.AlignmentCN",
    'le': "ME5E.AlignmentLE",
    'ne': "ME5E.AlignmentNE",
    'ce': "ME5E.AlignmentCE"
};

/* -------------------------------------------- */

/**
 * An enumeration of item attunement types
 * @enum {number}
 */
ME5E.attunementTypes = {
    NONE: 0,
    REQUIRED: 1,
    ATTUNED: 2
};

/**
 * An enumeration of item attunement states
 * @type {{"0": string, "1": string, "2": string}}
 */
ME5E.attunements = {
    0: "ME5E.AttunementNone",
    1: "ME5E.AttunementRequired",
    2: "ME5E.AttunementAttuned"
};

/* -------------------------------------------- */


ME5E.weaponProficiencies = {
    "ar": "ME5E.WeaponProfAR",
    "hp": "ME5E.WeaponProfHP",
    "smg": "ME5E.WeaponProfSMG",
    "sg": "ME5E.WeaponProfSG",
    "sr": "ME5E.WeaponProfSR",
    "m": "ME5E.WeaponProfM"
};

/* -------------------------------------------- */


/**
 * The categories into which Tool items can be grouped.
 *
 * @enum {string}
 */
ME5E.toolTypes = {
    "art": "ME5E.ToolArtisans",
    "game": "ME5E.ToolGamingSet",
    "music": "ME5E.ToolMusicalInstrument"
};

/**
 * The categories of tool proficiencies that a character can gain.
 *
 * @enum {string}
 */
ME5E.toolProficiencies = {
    ...ME5E.toolTypes,
    "vehicle": "ME5E.ToolVehicle",
    "ship": "ME5E.ToolShip"
};

/* -------------------------------------------- */

/**
 * This Object defines the various lengths of time which can occur
 * @type {Object}
 */
ME5E.timePeriods = {
    "inst": "ME5E.TimeInst",
    "turn": "ME5E.TimeTurn",
    "round": "ME5E.TimeRound",
    "minute": "ME5E.TimeMinute",
    "hour": "ME5E.TimeHour",
    "day": "ME5E.TimeDay",
    "month": "ME5E.TimeMonth",
    "year": "ME5E.TimeYear",
    "perm": "ME5E.TimePerm",
    "spec": "ME5E.Special"
};


/* -------------------------------------------- */

/**
 * This describes the ways that an ability can be activated
 * @type {Object}
 */
ME5E.abilityActivationTypes = {
    "none": "ME5E.None",
    "action": "ME5E.Action",
    "bonus": "ME5E.BonusAction",
    "reaction": "ME5E.Reaction",
    "minute": ME5E.timePeriods.minute,
    "hour": ME5E.timePeriods.hour,
    "day": ME5E.timePeriods.day,
    "special": ME5E.timePeriods.spec,
    "legendary": "ME5E.LegendaryActionLabel",
    "lair": "ME5E.LairActionLabel",
    "crew": "ME5E.VehicleCrewAction"
};

/* -------------------------------------------- */


ME5E.abilityConsumptionTypes = {
    "ammo": "ME5E.ConsumeAmmunition",
    "attribute": "ME5E.ConsumeAttribute",
    "material": "ME5E.ConsumeMaterial",
    "charges": "ME5E.ConsumeCharges"
};


/* -------------------------------------------- */

// Creature Sizes
ME5E.actorSizes = {
    "tiny": "ME5E.SizeTiny",
    "sm": "ME5E.SizeSmall",
    "med": "ME5E.SizeMedium",
    "lg": "ME5E.SizeLarge",
    "huge": "ME5E.SizeHuge",
    "grg": "ME5E.SizeGargantuan"
};

ME5E.tokenSizes = {
    "tiny": 1,
    "sm": 1,
    "med": 1,
    "lg": 2,
    "huge": 3,
    "grg": 4
};

/**
 * Colors used to visualize temporary and temporary maximum HP in token health bars
 * @enum {number}
 */
ME5E.tokenHPColors = {
    temp: 0x66CCFF,
    tempmax: 0x440066,
    negmax: 0x550000
};

/* -------------------------------------------- */

/**
 * Creature types
 * @type {Object}
 */
ME5E.creatureTypes = {
    "synorg": "ME5E.CreatureSynorg",
    "organic": "ME5E.CreatureOrganic",
    "synthetic": "ME5E.CreatureSynthetic"
};


/* -------------------------------------------- */

/**
 * Classification types for item action types
 * @type {Object}
 */
ME5E.itemActionTypes = {
    "mwak": "ME5E.ActionMWAK",
    "rwak": "ME5E.ActionRWAK",
    "mpak": "ME5E.ActionMPAK",
    "rpak": "ME5E.ActionRPAK",
    "save": "ME5E.ActionSave",
    "heal": "ME5E.ActionHeal",
    "abil": "ME5E.ActionAbil",
    "util": "ME5E.ActionUtil",
    "other": "ME5E.ActionOther"
};

/* -------------------------------------------- */

ME5E.itemCapacityTypes = {
    "items": "ME5E.ItemContainerCapacityItems",
    "weight": "ME5E.ItemContainerCapacityWeight"
};

/* -------------------------------------------- */

/**
 * List of various item rarities.
 * @enum {String}
 */
ME5E.itemRarity = {
    "common": "ME5E.ItemRarityCommon",
    "uncommon": "ME5E.ItemRarityUncommon",
    "rare": "ME5E.ItemRarityRare",
    "veryRare": "ME5E.ItemRarityVeryRare",
    "legendary": "ME5E.ItemRarityLegendary",
    "artifact": "ME5E.ItemRarityArtifact"
};

/* -------------------------------------------- */

/**
 * Enumerate the lengths of time over which an item can have limited use ability
 * @type {Object}
 */
ME5E.limitedUsePeriods = {
    "sr": "ME5E.ShortRest",
    "lr": "ME5E.LongRest",
    "day": "ME5E.Day",
    "charges": "ME5E.Charges"
};

/* -------------------------------------------- */

/**
 * Specific equipment types that modify base AC
 * @type {object}
 */
ME5E.armorTypes = {
    "light": "ME5E.EquipmentLight",
    "medium": "ME5E.EquipmentMedium",
    "heavy": "ME5E.EquipmentHeavy",
    "natural": "ME5E.EquipmentNatural",
    "shield": "ME5E.EquipmentShield"
};

ME5E.armorLocation = {
    "head": "ME5E.EquipmentHead",
    "chest": "ME5E.EquipmentChest",
    "arms": "ME5E.EquipmentArms",
    "legs": "ME5E.EquipmentLegs",
}

/* -------------------------------------------- */

/**
 * The set of equipment types for armor, clothing, and other objects which can be worn by the character
 * @type {Object}
 */
ME5E.equipmentTypes = {
    "bonus": "ME5E.EquipmentBonus",
    "clothing": "ME5E.EquipmentClothing",
    "trinket": "ME5E.EquipmentTrinket",
    "vehicle": "ME5E.EquipmentVehicle",
    ...ME5E.armorTypes
};

/* -------------------------------------------- */

/**
 * The various types of vehicles in which characters can be proficient.
 * @enum {string}
 */
ME5E.vehicleTypes = {
    "air": "ME5E.VehicleAir",
    "land": "ME5E.VehicleLand",
    "water": "ME5E.VehicleWater",
    "space": "ME5E.VehicleSpace"
};

/**
 * The various types of ship systems in which characters can be proficient.
 * @enum {string}
 */
ME5E.shipTypes = {
    "drive": "ME5E.ShipDrive",
    "ews": "ME5E.ShipEWS",
    "helm": "ME5E.ShipHelm",
    "nav": "ME5E.ShipNavigation",
    "ssc": "ME5E.ShipSSC",
    "weap": "ME5E.ShipWeapons"
};

/* -------------------------------------------- */

/**
 * The set of Armor Proficiencies which a character may have
 * @type {Object}
 */
ME5E.armorProficiencies = {
    "lgt": ME5E.equipmentTypes.light,
    "med": ME5E.equipmentTypes.medium,
    "hvy": ME5E.equipmentTypes.heavy,
    "shl": "ME5E.EquipmentShieldProficiency"
};

/**
 * A map of armor item proficiency to actor item proficiency
 * Used when a new player owned item is created
 * @type {Object}
 */
ME5E.armorProficienciesMap = {
    "natural": true,
    "clothing": true,
    "light": "lgt",
    "medium": "med",
    "heavy": "hvy",
    "shield": "shl"
};

/**
 * Common armor class calculations.
 * @enum {object}
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
        formula: "@attributes.ac.base + @abilities.dex.mod"
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

/* -------------------------------------------- */

/**
 * Enumerate the valid consumable types which are recognized by the system
 * @type {Object}
 */
ME5E.consumableTypes = {
    "ammo": "ME5E.ConsumableAmmunition",
    "grenade": "ME5E.ConsumableGrenade",
    "medi": "ME5E.ConsumableMediGel",
    "omni": "ME5E.ConsumableOmniGel",
    "omniprog": "ME5E.ConsumableOmniProgram"
};

/* -------------------------------------------- */

/**
 * The valid currency denominations supported by the 5e system
 * @type {Object}
 */
ME5E.currencies = {
    "cr": "ME5E.CurrencyCr"
};

/* -------------------------------------------- */


// Damage Types
ME5E.damageTypes = {
    "acid": "ME5E.DamageAcid",
    "bludgeoning": "ME5E.DamageBludgeoning",
    "cold": "ME5E.DamageCold",
    "fire": "ME5E.DamageFire",
    "force": "ME5E.DamageForce",
    "lightning": "ME5E.DamageLightning",
    "necrotic": "ME5E.DamageNecrotic",
    "piercing": "ME5E.DamagePiercing",
    "poison": "ME5E.DamagePoison",
    "psychic": "ME5E.DamagePsychic",
    "radiant": "ME5E.DamageRadiant",
    "slashing": "ME5E.DamageSlashing",
    "thunder": "ME5E.DamageThunder"
};

// Damage Resistance Types
ME5E.damageResistanceTypes = mergeObject(foundry.utils.deepClone(ME5E.damageTypes), {
    "physical": "ME5E.DamagePhysical"
});


/* -------------------------------------------- */

/**
 * The valid units of measure for movement distances in the game system.
 * By default this uses the imperial units of feet and miles.
 * @type {Object<string,string>}
 */
ME5E.movementTypes = {
    "burrow": "ME5E.MovementBurrow",
    "climb": "ME5E.MovementClimb",
    "fly": "ME5E.MovementFly",
    "swim": "ME5E.MovementSwim",
    "walk": "ME5E.MovementWalk",
    "zerog": "ME5E.MovementZeroG",
    "lowg": "ME5E.MovementLowG",
    "highg": "ME5E.MovementHighG"
};

/**
 * The valid units of measure for movement distances in the game system.
 * By default this uses the imperial units of feet and miles.
 * @type {Object<string,string>}
 */
ME5E.movementUnits = {
    "ft": "ME5E.DistFt",
    "mi": "ME5E.DistMi",
    "m": "ME5E.DistM",
    "km": "ME5E.DistKm",
    "ftlu": "ME5E.DistFTLU"
};

/**
 * The valid units of measure for the range of an action or effect.
 * This object automatically includes the movement units from ME5E.movementUnits
 * @type {Object<string,string>}
 */
ME5E.distanceUnits = {
    "none": "ME5E.None",
    "self": "ME5E.DistSelf",
    "touch": "ME5E.DistTouch",
    "spec": "ME5E.Special",
    "any": "ME5E.DistAny"
};
for(let [k, v] of Object.entries(ME5E.movementUnits)) {
    ME5E.distanceUnits[k] = v;
}

/* -------------------------------------------- */


/**
 * Configure aspects of encumbrance calculation so that it could be configured by modules
 * @type {Object}
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
 * This Object defines the types of single or area targets which can be applied
 * @type {Object}
 */
ME5E.targetTypes = {
    "none": "ME5E.None",
    "self": "ME5E.TargetSelf",
    "creature": "ME5E.TargetCreature",
    "ally": "ME5E.TargetAlly",
    "enemy": "ME5E.TargetEnemy",
    "object": "ME5E.TargetObject",
    "space": "ME5E.TargetSpace",
    "radius": "ME5E.TargetRadius",
    "sphere": "ME5E.TargetSphere",
    "cylinder": "ME5E.TargetCylinder",
    "cone": "ME5E.TargetCone",
    "square": "ME5E.TargetSquare",
    "cube": "ME5E.TargetCube",
    "line": "ME5E.TargetLine",
    "wall": "ME5E.TargetWall"
};


/* -------------------------------------------- */


/**
 * Map the subset of target types which produce a template area of effect
 * The keys are ME5E target types and the values are MeasuredTemplate shape types
 * @type {Object}
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

// Healing Types
ME5E.healingTypes = {
    "healing": "ME5E.Healing",
    "temphp": "ME5E.HealingTemp"
};


/* -------------------------------------------- */


/**
 * Enumerate the denominations of hit dice which can apply to classes
 * @type {string[]}
 */
ME5E.hitDieTypes = ["d6", "d8", "d10", "d12"];


/* -------------------------------------------- */

/**
 * The set of possible sensory perception types which an Actor may have
 * @enum {string}
 */
ME5E.senses = {
    "blindsight": "ME5E.SenseBlindsight",
    "darkvision": "ME5E.SenseDarkvision",
    "truesight": "ME5E.SenseTruesight",
    "infrared": "ME5E.SenseInfraredSight"
};

/* -------------------------------------------- */

/**
 * The set of skill which can be trained
 * @type {Object}
 */
ME5E.skills = {
    "acr": "ME5E.SkillAcr",
    "ath": "ME5E.SkillAth",
    "dec": "ME5E.SkillDec",
    "ele": "ME5E.SkillEle",
    "eng": "ME5E.SkillEng",
    "his": "ME5E.SkillHis",
    "ins": "ME5E.SkillIns",
    "itm": "ME5E.SkillItm",
    "inv": "ME5E.SkillInv",
    "med": "ME5E.SkillMed",
    "prc": "ME5E.SkillPrc",
    "prf": "ME5E.SkillPrf",
    "per": "ME5E.SkillPer",
    "sci": "ME5E.SkillSci",
    "slt": "ME5E.SkillSlt",
    "ste": "ME5E.SkillSte",
    "sur": "ME5E.SkillSur",
    "veh": "ME5E.SkillVeh"
};


/* -------------------------------------------- */

ME5E.spellPreparationModes = {
    "prepared": "ME5E.SpellPrepPrepared",
    "always": "ME5E.SpellPrepAlways",
    "atwill": "ME5E.SpellPrepAtWill",
    "innate": "ME5E.SpellPrepInnate"
};

ME5E.spellUpcastModes = ["always", "pact", "prepared"];

/* -------------------------------------------- */

/**
 * The available choices for how spell damage scaling may be computed
 * @type {Object}
 */
ME5E.spellScalingModes = {
    "none": "ME5E.SpellNone",
    "cantrip": "ME5E.SpellCantrip",
    "level": "ME5E.SpellLevel"
};

/* -------------------------------------------- */


/**
 * Define the set of types which a weapon item can take
 * @type {Object}
 */
ME5E.weaponTypes = {
    "ar": "ME5E.WeaponAR",
    "hp": "ME5E.WeaponHP",
    "smg": "ME5E.WeaponSMG",
    "sg": "ME5E.WeaponSG",
    "sr": "ME5E.WeaponSR",
    "m": "ME5E.WeaponM",
    "natural": "ME5E.WeaponNatural",
    "improv": "ME5E.WeaponImprov",
    "siege": "ME5E.WeaponSiege"
};


/* -------------------------------------------- */

/**
 * Define the set of weapon property flags which can exist on a weapon
 * @type {Object}
 */
ME5E.weaponProperties = {
    "arc": "ME5E.WeaponPropertiesArc",
    "bur": "ME5E.WeaponPropertiesBur",
    "dt": "ME5E.WeaponPropertiesDT",
    "fin": "ME5E.WeaponPropertiesFin",
    "het": "ME5E.WeaponPropertiesHet",
    "hip": "ME5E.WeaponPropertiesHip",
    "hvy": "ME5E.WeaponPropertiesHvy",
    "lgt": "ME5E.WeaponPropertiesLgt",
    "mel": "ME5E.WeaponPropertiesMel",
    "rng": "ME5E.WeaponPropertiesRng",
    "rch": "ME5E.WeaponPropertiesRch",
    "rec": "ME5E.WeaponPropertiesRec",
    "sil": "ME5E.WeaponPropertiesSil",
    "spc": "ME5E.WeaponPropertiesSpc",
    "thr": "ME5E.WeaponPropertiesThr",
    "two": "ME5E.WeaponPropertiesTwo",
    "ver": "ME5E.WeaponPropertiesVer",
    "wgt": "ME5E.WeaponPropertiesWgt"
};

// Spell Schools
ME5E.spellSchools = {
    "bio": "ME5E.SchoolBio",
    "com": "ME5E.SchoolCom",
    "tch": "ME5E.SchoolTch"
};

// Spell Levels
ME5E.spellLevels = {
    0: "ME5E.SpellLevel0",
    1: "ME5E.SpellLevel1",
    2: "ME5E.SpellLevel2",
    3: "ME5E.SpellLevel3",
    4: "ME5E.SpellLevel4",
    5: "ME5E.SpellLevel5"
}

/**
 * Compendium packs used for localized items.
 * @enum {string}
 */
ME5E.sourcePacks = {
    ITEMS: "me5e.items"
};

/* -------------------------------------------- */

// Polymorph options.
ME5E.polymorphSettings = {
    keepPhysical: 'ME5E.PolymorphKeepPhysical',
    keepMental: 'ME5E.PolymorphKeepMental',
    keepSaves: 'ME5E.PolymorphKeepSaves',
    keepSkills: 'ME5E.PolymorphKeepSkills',
    mergeSaves: 'ME5E.PolymorphMergeSaves',
    mergeSkills: 'ME5E.PolymorphMergeSkills',
    keepClass: 'ME5E.PolymorphKeepClass',
    keepFeats: 'ME5E.PolymorphKeepFeats',
    keepSpells: 'ME5E.PolymorphKeepSpells',
    keepItems: 'ME5E.PolymorphKeepItems',
    keepBio: 'ME5E.PolymorphKeepBio',
    keepVision: 'ME5E.PolymorphKeepVision'
};

/* -------------------------------------------- */

/**
 * Skill, ability, and tool proficiency levels
 * Each level provides a proficiency multiplier
 * @type {Object}
 */
ME5E.proficiencyLevels = {
    0: "ME5E.NotProficient",
    0.5: "ME5E.HalfProficient",
    1: "ME5E.Proficient",
    2: "ME5E.Expertise"
};

/* -------------------------------------------- */

/**
 * The amount of cover provided by an object.
 * In cases where multiple pieces of cover are
 * in play, we take the highest value.
 */
ME5E.cover = {
    0: 'ME5E.None',
    .5: 'ME5E.CoverHalf',
    .75: 'ME5E.CoverThreeQuarters',
    1: 'ME5E.CoverTotal'
};

/* -------------------------------------------- */


// Condition Types
ME5E.conditionTypes = {
    "blinded": "ME5E.ConBlinded",
    "charmed": "ME5E.ConCharmed",
    "concentration": "ME5E.ConConcentration",
    "deafened": "ME5E.ConDeafened",
    "exhaustion": "ME5E.ConExhaustion",
    "frightened": "ME5E.ConFrightened",
    "frozen": "ME5E.ConFrozen",
    "grappled": "ME5E.ConGrappled",
    "incapacitated": "ME5E.ConIncapacitated",
    "indoctrinated": "ME5E.ConIndoctrinated",
    "invisible": "ME5E.ConInvisible",
    "lifted": "ME5E.ConLifted",
    "paralyzed": "ME5E.ConParalyzed",
    "poisoned": "ME5E.ConPoisoned",
    "primedfor": "ME5E.ConPrimedForce",
    "primednec": "ME5E.ConPrimedNecrotic",
    "primedfir": "ME5E.ConPrimedFire",
    "primedcol": "ME5E.ConPrimedCold",
    "primedlig": "ME5E.ConPrimedLightning",
    "prone": "ME5E.ConProne",
    "restrained": "ME5E.ConRestrained",
    "stunned": "ME5E.ConStunned",
    "targeting": "ME5E.ConTargeting",
    "unconscious": "ME5E.ConUnconscious"
};

// Languages
ME5E.languages = {
    "galactic": "ME5E.LanguagesGalactic",
    "thessian": "ME5E.LanguagesThessian",
    "khelish": "ME5E.LanguagesKhelish",
}

// Character Level XP Requirements
ME5E.CHARACTER_EXP_LEVELS = [
    0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000,
    120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000]
;

// Challenge Rating XP Levels
ME5E.CR_EXP_LEVELS = [
    10, 200, 450, 700, 1100, 1800, 2300, 2900, 3900, 5000, 5900, 7200, 8400, 10000, 11500, 13000, 15000, 18000,
    20000, 22000, 25000, 33000, 41000, 50000, 62000, 75000, 90000, 105000, 120000, 135000, 155000
];

// Character Features Per Class And Level
ME5E.classFeatures = ClassFeatures;

// Configure Optional Character Flags
ME5E.characterFlags = {
    "diamondSoul": {
        name: "ME5E.FlagsDiamondSoul",
        hint: "ME5E.FlagsDiamondSoulHint",
        section: "ME5E.Feats",
        type: Boolean
    },
    "elvenAccuracy": {
        name: "ME5E.FlagsElvenAccuracy",
        hint: "ME5E.FlagsElvenAccuracyHint",
        section: "ME5E.RacialTraits",
        type: Boolean
    },
    "halflingLucky": {
        name: "ME5E.FlagsHalflingLucky",
        hint: "ME5E.FlagsHalflingLuckyHint",
        section: "ME5E.RacialTraits",
        type: Boolean
    },
    "initiativeAdv": {
        name: "ME5E.FlagsInitiativeAdv",
        hint: "ME5E.FlagsInitiativeAdvHint",
        section: "ME5E.Feats",
        type: Boolean
    },
    "initiativeAlert": {
        name: "ME5E.FlagsAlert",
        hint: "ME5E.FlagsAlertHint",
        section: "ME5E.Feats",
        type: Boolean
    },
    "jackOfAllTrades": {
        name: "ME5E.FlagsJOAT",
        hint: "ME5E.FlagsJOATHint",
        section: "ME5E.Feats",
        type: Boolean
    },
    "observantFeat": {
        name: "ME5E.FlagsObservant",
        hint: "ME5E.FlagsObservantHint",
        skills: ['prc', 'inv'],
        section: "ME5E.Feats",
        type: Boolean
    },
    "powerfulBuild": {
        name: "ME5E.FlagsPowerfulBuild",
        hint: "ME5E.FlagsPowerfulBuildHint",
        section: "ME5E.RacialTraits",
        type: Boolean
    },
    "reliableTalent": {
        name: "ME5E.FlagsReliableTalent",
        hint: "ME5E.FlagsReliableTalentHint",
        section: "ME5E.Feats",
        type: Boolean
    },
    "remarkableAthlete": {
        name: "ME5E.FlagsRemarkableAthlete",
        hint: "ME5E.FlagsRemarkableAthleteHint",
        abilities: ['str', 'dex', 'con'],
        section: "ME5E.Feats",
        type: Boolean
    },
    "weaponCriticalThreshold": {
        name: "ME5E.FlagsWeaponCritThreshold",
        hint: "ME5E.FlagsWeaponCritThresholdHint",
        section: "ME5E.Feats",
        type: Number,
        placeholder: 20
    },
    "spellCriticalThreshold": {
        name: "ME5E.FlagsSpellCritThreshold",
        hint: "ME5E.FlagsSpellCritThresholdHint",
        section: "ME5E.Feats",
        type: Number,
        placeholder: 20
    },
    "meleeCriticalDamageDice": {
        name: "ME5E.FlagsMeleeCriticalDice",
        hint: "ME5E.FlagsMeleeCriticalDiceHint",
        section: "ME5E.Feats",
        type: Number,
        placeholder: 0
    }
};

// Configure allowed status flags
ME5E.allowedActorFlags = ["isPolymorphed", "originalActor"].concat(Object.keys(ME5E.characterFlags));
