import {ClassFeatures} from "./classFeatures.js";

// Namespace Configuration Values
export const ME5E = {};

// ASCII Artwork
ME5E.ASCII = `_______________________________
______      ______ _____ _____
|  _  \\___  |  _  \\  ___|  ___|
| | | ( _ ) | | | |___ \\| |__
| | | / _ \\/\\ | | |   \\ \\  __|
| |/ / (_>  < |/ //\\__/ / |___
|___/ \\___/\\/___/ \\____/\\____/
_______________________________`;


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
    "sim": "ME5E.WeaponSimpleProficiency",
    "mar": "ME5E.WeaponMartialProficiency"
};

/**
 * A map of weapon item proficiency to actor item proficiency
 * Used when a new player owned item is created
 * @type {Object}
 */
ME5E.weaponProficienciesMap = {
    "natural": true,
    "simpleM": "sim",
    "simpleR": "sim",
    "martialM": "mar",
    "martialR": "mar"
};

/**
 * The basic weapon types in 5e. This enables specific weapon proficiencies or
 * starting equipment provided by classes and backgrounds.
 *
 * @enum {string}
 */
ME5E.weaponIds = {
    "battleaxe": "I0WocDSuNpGJayPb",
    "blowgun": "wNWK6yJMHG9ANqQV",
    "club": "nfIRTECQIG81CvM4",
    "dagger": "0E565kQUBmndJ1a2",
    "dart": "3rCO8MTIdPGSW6IJ",
    "flail": "UrH3sMdnUDckIHJ6",
    "glaive": "rOG1OM2ihgPjOvFW",
    "greataxe": "1Lxk6kmoRhG8qQ0u",
    "greatclub": "QRCsxkCwWNwswL9o",
    "greatsword": "xMkP8BmFzElcsMaR",
    "halberd": "DMejWAc8r8YvDPP1",
    "handaxe": "eO7Fbv5WBk5zvGOc",
    "handcrossbow": "qaSro7kFhxD6INbZ",
    "heavycrossbow": "RmP0mYRn2J7K26rX",
    "javelin": "DWLMnODrnHn8IbAG",
    "lance": "RnuxdHUAIgxccVwj",
    "lightcrossbow": "ddWvQRLmnnIS0eLF",
    "lighthammer": "XVK6TOL4sGItssAE",
    "longbow": "3cymOVja8jXbzrdT",
    "longsword": "10ZP2Bu3vnCuYMIB",
    "mace": "Ajyq6nGwF7FtLhDQ",
    "maul": "DizirD7eqjh8n95A",
    "morningstar": "dX8AxCh9o0A9CkT3",
    "net": "aEiM49V8vWpWw7rU",
    "pike": "tC0kcqZT9HHAO0PD",
    "quarterstaff": "g2dWN7PQiMRYWzyk",
    "rapier": "Tobce1hexTnDk4sV",
    "scimitar": "fbC0Mg1a73wdFbqO",
    "shortsword": "osLzOwQdPtrK3rQH",
    "sickle": "i4NeNZ30ycwPDHMx",
    "spear": "OG4nBBydvmfWYXIk",
    "shortbow": "GJv6WkD7D2J6rP6M",
    "sling": "3gynWO9sN4OLGMWD",
    "trident": "F65ANO66ckP8FDMa",
    "warpick": "2YdfjN1PIIrSHZii",
    "warhammer": "F0Df164Xv1gWcYt0",
    "whip": "QKTyxoO0YDnAsbYe"
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
    "vehicle": "ME5E.ToolVehicle"
};

/**
 * The basic tool types in 5e. This enables specific tool proficiencies or
 * starting equipment provided by classes and backgrounds.
 *
 * @enum {string}
 */
ME5E.toolIds = {
    "alchemist": "SztwZhbhZeCqyAes",
    "bagpipes": "yxHi57T5mmVt0oDr",
    "brewer": "Y9S75go1hLMXUD48",
    "calligrapher": "jhjo20QoiD5exf09",
    "card": "YwlHI3BVJapz4a3E",
    "carpenter": "8NS6MSOdXtUqD7Ib",
    "cartographer": "fC0lFK8P4RuhpfaU",
    "chess": "23y8FvWKf9YLcnBL",
    "cobbler": "hM84pZnpCqKfi8XH",
    "cook": "Gflnp29aEv5Lc1ZM",
    "dice": "iBuTM09KD9IoM5L8",
    "disg": "IBhDAr7WkhWPYLVn",
    "drum": "69Dpr25pf4BjkHKb",
    "dulcimer": "NtdDkjmpdIMiX7I2",
    "flute": "eJOrPcAz9EcquyRQ",
    "forg": "cG3m4YlHfbQlLEOx",
    "glassblower": "rTbVrNcwApnuTz5E",
    "herb": "i89okN7GFTWHsvPy",
    "horn": "aa9KuBy4dst7WIW9",
    "jeweler": "YfBwELTgPFHmQdHh",
    "leatherworker": "PUMfwyVUbtyxgYbD",
    "lute": "qBydtUUIkv520DT7",
    "lyre": "EwG1EtmbgR3bM68U",
    "mason": "skUih6tBvcBbORzA",
    "navg": "YHCmjsiXxZ9UdUhU",
    "painter": "ccm5xlWhx74d6lsK",
    "panflute": "G5m5gYIx9VAUWC3J",
    "pois": "il2GNi8C0DvGLL9P",
    "potter": "hJS8yEVkqgJjwfWa",
    "shawm": "G3cqbejJpfB91VhP",
    "smith": "KndVe2insuctjIaj",
    "thief": "woWZ1sO5IUVGzo58",
    "tinker": "0d08g1i5WXnNrCNA",
    "viol": "baoe3U5BfMMMxhCU",
    "weaver": "ap9prThUB2y9lDyj",
    "woodcarver": "xKErqkLo4ASYr5EP"
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
    "aberration": "ME5E.CreatureAberration",
    "beast": "ME5E.CreatureBeast",
    "celestial": "ME5E.CreatureCelestial",
    "construct": "ME5E.CreatureConstruct",
    "dragon": "ME5E.CreatureDragon",
    "elemental": "ME5E.CreatureElemental",
    "fey": "ME5E.CreatureFey",
    "fiend": "ME5E.CreatureFiend",
    "giant": "ME5E.CreatureGiant",
    "humanoid": "ME5E.CreatureHumanoid",
    "monstrosity": "ME5E.CreatureMonstrosity",
    "ooze": "ME5E.CreatureOoze",
    "plant": "ME5E.CreaturePlant",
    "undead": "ME5E.CreatureUndead"
};


/* -------------------------------------------- */

/**
 * Classification types for item action types
 * @type {Object}
 */
ME5E.itemActionTypes = {
    "mwak": "ME5E.ActionMWAK",
    "rwak": "ME5E.ActionRWAK",
    "msak": "ME5E.ActionMSAK",
    "rsak": "ME5E.ActionRSAK",
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
    "air": "ME5E.VehicleTypeAir",
    "land": "ME5E.VehicleTypeLand",
    "water": "ME5E.VehicleTypeWater"
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
 * The basic armor types in 5e. This enables specific armor proficiencies,
 * automated AC calculation in NPCs, and starting equipment.
 *
 * @enum {string}
 */
ME5E.armorIds = {
    "breastplate": "SK2HATQ4abKUlV8i",
    "chainmail": "rLMflzmxpe8JGTOA",
    "chainshirt": "p2zChy24ZJdVqMSH",
    "halfplate": "vsgmACFYINloIdPm",
    "hide": "n1V07puo0RQxPGuF",
    "leather": "WwdpHLXGX5r8uZu5",
    "padded": "GtKV1b5uqFQqpEni",
    "plate": "OjkIqlW2UpgFcjZa",
    "ringmail": "nsXZejlmgalj4he9",
    "scalemail": "XmnlF5fgIO3tg6TG",
    "splint": "cKpJmsJmU8YaiuqG",
    "studded": "TIV3B1vbrVHIhQAm"
};

/**
 * The basic shield in 5e.
 *
 * @enum {string}
 */
ME5E.shieldIds = {
    "shield": "sSs3hSzkKBMNBgTs"
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
    "potion": "ME5E.ConsumablePotion",
    "poison": "ME5E.ConsumablePoison",
    "food": "ME5E.ConsumableFood",
    "scroll": "ME5E.ConsumableScroll",
    "wand": "ME5E.ConsumableWand",
    "rod": "ME5E.ConsumableRod",
    "trinket": "ME5E.ConsumableTrinket"
};

/* -------------------------------------------- */

/**
 * The valid currency denominations supported by the 5e system
 * @type {Object}
 */
ME5E.currencies = {
    "pp": "ME5E.CurrencyPP",
    "gp": "ME5E.CurrencyGP",
    "ep": "ME5E.CurrencyEP",
    "sp": "ME5E.CurrencySP",
    "cp": "ME5E.CurrencyCP"
};


/**
 * Define the upwards-conversion rules for registered currency types
 * @type {{string, object}}
 */
ME5E.currencyConversion = {
    cp: {into: "sp", each: 10},
    sp: {into: "ep", each: 5},
    ep: {into: "gp", each: 2},
    gp: {into: "pp", each: 10}
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
    "walk": "ME5E.MovementWalk"
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
    "km": "ME5E.DistKm"
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
    "tremorsense": "ME5E.SenseTremorsense",
    "truesight": "ME5E.SenseTruesight"
};

/* -------------------------------------------- */

/**
 * The set of skill which can be trained
 * @type {Object}
 */
ME5E.skills = {
    "acr": "ME5E.SkillAcr",
    "ani": "ME5E.SkillAni",
    "arc": "ME5E.SkillArc",
    "ath": "ME5E.SkillAth",
    "dec": "ME5E.SkillDec",
    "his": "ME5E.SkillHis",
    "ins": "ME5E.SkillIns",
    "itm": "ME5E.SkillItm",
    "inv": "ME5E.SkillInv",
    "med": "ME5E.SkillMed",
    "nat": "ME5E.SkillNat",
    "prc": "ME5E.SkillPrc",
    "prf": "ME5E.SkillPrf",
    "per": "ME5E.SkillPer",
    "rel": "ME5E.SkillRel",
    "slt": "ME5E.SkillSlt",
    "ste": "ME5E.SkillSte",
    "sur": "ME5E.SkillSur"
};


/* -------------------------------------------- */

ME5E.spellPreparationModes = {
    "prepared": "ME5E.SpellPrepPrepared",
    "pact": "ME5E.PactMagic",
    "always": "ME5E.SpellPrepAlways",
    "atwill": "ME5E.SpellPrepAtWill",
    "innate": "ME5E.SpellPrepInnate"
};

ME5E.spellUpcastModes = ["always", "pact", "prepared"];

ME5E.spellProgression = {
    "none": "ME5E.SpellNone",
    "full": "ME5E.SpellProgFull",
    "half": "ME5E.SpellProgHalf",
    "third": "ME5E.SpellProgThird",
    "pact": "ME5E.SpellProgPact",
    "artificer": "ME5E.SpellProgArt"
};

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
    "simpleM": "ME5E.WeaponSimpleM",
    "simpleR": "ME5E.WeaponSimpleR",
    "martialM": "ME5E.WeaponMartialM",
    "martialR": "ME5E.WeaponMartialR",
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
    "ada": "ME5E.WeaponPropertiesAda",
    "amm": "ME5E.WeaponPropertiesAmm",
    "fin": "ME5E.WeaponPropertiesFin",
    "fir": "ME5E.WeaponPropertiesFir",
    "foc": "ME5E.WeaponPropertiesFoc",
    "hvy": "ME5E.WeaponPropertiesHvy",
    "lgt": "ME5E.WeaponPropertiesLgt",
    "lod": "ME5E.WeaponPropertiesLod",
    "mgc": "ME5E.WeaponPropertiesMgc",
    "rch": "ME5E.WeaponPropertiesRch",
    "rel": "ME5E.WeaponPropertiesRel",
    "ret": "ME5E.WeaponPropertiesRet",
    "sil": "ME5E.WeaponPropertiesSil",
    "spc": "ME5E.WeaponPropertiesSpc",
    "thr": "ME5E.WeaponPropertiesThr",
    "two": "ME5E.WeaponPropertiesTwo",
    "ver": "ME5E.WeaponPropertiesVer"
};


// Spell Components
ME5E.spellComponents = {
    "V": "ME5E.ComponentVerbal",
    "S": "ME5E.ComponentSomatic",
    "M": "ME5E.ComponentMaterial"
};

// Spell Schools
ME5E.spellSchools = {
    "abj": "ME5E.SchoolAbj",
    "con": "ME5E.SchoolCon",
    "div": "ME5E.SchoolDiv",
    "enc": "ME5E.SchoolEnc",
    "evo": "ME5E.SchoolEvo",
    "ill": "ME5E.SchoolIll",
    "nec": "ME5E.SchoolNec",
    "trs": "ME5E.SchoolTrs"
};

// Spell Levels
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

// Spell Scroll Compendium UUIDs
ME5E.spellScrollIds = {
    0: "rQ6sO7HDWzqMhSI3",
    1: "9GSfMg0VOA2b4uFN",
    2: "XdDp6CKh9qEvPTuS",
    3: "hqVKZie7x9w3Kqds",
    4: "DM7hzgL836ZyUFB1",
    5: "wa1VF8TXHmkrrR35",
    6: "tI3rWx4bxefNCexS",
    7: "mtyw4NS1s7j2EJaD",
    8: "aOrinPg7yuDZEuWr",
    9: "O4YbkJkLlnsgUszZ"
};

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
 * @type {Array[]}
 */
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
    1: "ME5E.Proficient",
    0.5: "ME5E.HalfProficient",
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
    "deafened": "ME5E.ConDeafened",
    "diseased": "ME5E.ConDiseased",
    "exhaustion": "ME5E.ConExhaustion",
    "frightened": "ME5E.ConFrightened",
    "grappled": "ME5E.ConGrappled",
    "incapacitated": "ME5E.ConIncapacitated",
    "invisible": "ME5E.ConInvisible",
    "paralyzed": "ME5E.ConParalyzed",
    "petrified": "ME5E.ConPetrified",
    "poisoned": "ME5E.ConPoisoned",
    "prone": "ME5E.ConProne",
    "restrained": "ME5E.ConRestrained",
    "stunned": "ME5E.ConStunned",
    "unconscious": "ME5E.ConUnconscious"
};

// Languages
ME5E.languages = {
    "common": "ME5E.LanguagesCommon",
    "aarakocra": "ME5E.LanguagesAarakocra",
    "abyssal": "ME5E.LanguagesAbyssal",
    "aquan": "ME5E.LanguagesAquan",
    "auran": "ME5E.LanguagesAuran",
    "celestial": "ME5E.LanguagesCelestial",
    "deep": "ME5E.LanguagesDeepSpeech",
    "draconic": "ME5E.LanguagesDraconic",
    "druidic": "ME5E.LanguagesDruidic",
    "dwarvish": "ME5E.LanguagesDwarvish",
    "elvish": "ME5E.LanguagesElvish",
    "giant": "ME5E.LanguagesGiant",
    "gith": "ME5E.LanguagesGith",
    "gnomish": "ME5E.LanguagesGnomish",
    "goblin": "ME5E.LanguagesGoblin",
    "gnoll": "ME5E.LanguagesGnoll",
    "halfling": "ME5E.LanguagesHalfling",
    "ignan": "ME5E.LanguagesIgnan",
    "infernal": "ME5E.LanguagesInfernal",
    "orc": "ME5E.LanguagesOrc",
    "primordial": "ME5E.LanguagesPrimordial",
    "sylvan": "ME5E.LanguagesSylvan",
    "terran": "ME5E.LanguagesTerran",
    "cant": "ME5E.LanguagesThievesCant",
    "undercommon": "ME5E.LanguagesUndercommon"
};

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
