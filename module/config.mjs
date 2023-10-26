import * as advancement from "./documents/advancement/_module.mjs";
import {preLocalize} from "./utils.mjs";
import {config as ruleTypes} from "./data/rule/_module.mjs"

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

ME5E.rules = {
    types: {
        ...ruleTypes
    }
}


/**
 * Configuration data for abilities.
 *
 * @typedef {object} AbilityConfiguration
 * @property {string} label                               Localized label.
 * @property {string} abbreviation                        Localized abbreviation.
 * @property {string} [type]                              Whether this is a "physical" or "mental" ability.
 * @property {Object<number|string>}  [defaults]  Default values for this ability based on actor type.
 *                                                        If a string is used, the system will attempt to fetch.
 *                                                        the value of the specified ability.
 */

/**
 * The set of Ability Scores used within the system.
 * @enum {AbilityConfiguration}
 */
ME5E.abilities = {
    str: {
        label: "ME5E.AbilityStr",
        abbreviation: "ME5E.AbilityStrAbbr",
        type: "physical"
    },
    dex: {
        label: "ME5E.AbilityDex",
        abbreviation: "ME5E.AbilityDexAbbr",
        type: "physical"
    },
    con: {
        label: "ME5E.AbilityCon",
        abbreviation: "ME5E.AbilityConAbbr",
        type: "physical"
    },
    int: {
        label: "ME5E.AbilityInt",
        abbreviation: "ME5E.AbilityIntAbbr",
        type: "mental",
        defaults: {vehicle: 0}
    },
    wis: {
        label: "ME5E.AbilityWis",
        abbreviation: "ME5E.AbilityWisAbbr",
        type: "mental",
        defaults: {vehicle: 0}
    },
    cha: {
        label: "ME5E.AbilityCha",
        abbreviation: "ME5E.AbilityChaAbbr",
        type: "mental",
        defaults: {vehicle: 0}
    }
};
preLocalize("abilities", {keys: ["label", "abbreviation"]});

/**
 * Configure which ability score is used as the default modifier for initiative rolls.
 * @type {string}
 *
 * TODO: Move to actor
 */
ME5E.initiativeAbility = "dex";

/**
 * Configure which ability score is used when calculating hit points per level.
 * @type {string}
 *
 * TODO: Move to actor
 */
ME5E.hitPointsAbility = "con";

/* -------------------------------------------- */

/**
 * Configuration data for skills.
 *
 * @typedef {object} SkillConfiguration
 * @property {string} label    Localized label.
 * @property {string} ability  Key for the default ability used by this skill.
 */

/**
 * The set of skill which can be trained with their default ability scores.
 * @enum {SkillConfiguration}
 */
ME5E.skills = {
    acr: {label: "ME5E.SkillAcr", ability: "dex"},
    ath: {label: "ME5E.SkillAth", ability: "str"},
    dec: {label: "ME5E.SkillDec", ability: "cha"},
    ele: {label: "ME5E.SkillEle", ability: "int"},
    eng: {label: "ME5E.SkillEng", ability: "int"},
    his: {label: "ME5E.SkillHis", ability: "int"},
    ins: {label: "ME5E.SkillIns", ability: "wis"},
    itm: {label: "ME5E.SkillItm", ability: "cha"},
    inv: {label: "ME5E.SkillInv", ability: "int"},
    med: {label: "ME5E.SkillMed", ability: "wis"},
    prc: {label: "ME5E.SkillPrc", ability: "wis"},
    prf: {label: "ME5E.SkillPrf", ability: "cha"},
    per: {label: "ME5E.SkillPer", ability: "cha"},
    sci: {label: "ME5E.SkillSci", ability: "int"},
    slt: {label: "ME5E.SkillSlt", ability: "dex"},
    ste: {label: "ME5E.SkillSte", ability: "dex"},
    sur: {label: "ME5E.SkillSur", ability: "wis"},
    veh: {label: "ME5E.SkillVeh", ability: "dex"}
};
preLocalize("skills", {key: "label", sort: true});

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
 *
 * TODO: Check this is still relevant
 */
ME5E.attunementTypes = {
    NONE: 0,
    REQUIRED: 1,
    ATTUNED: 2
};

/**
 * An enumeration of item attunement states.
 * @type {{"0": string, "1": string, "2": string}}
 *
 * TODO: Check this is still relevant
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
    ass: "ME5E.WeaponAssaultProficiency",
    pis: "ME5E.WeaponHeavyPistolProficiency",
    smg: "ME5E.WeaponSmgProficiency",
    sht: "ME5E.WeaponShotgunProficiency",
    sni: "ME5E.WeaponSniperProficiency",
    mel: "ME5E.WeaponMeleeProficiency"
};
preLocalize("weaponProficiencies");

/**
 * A mapping between `ME5E.weaponTypes` and `ME5E.weaponProficiencies` that
 * is used to determine if character has proficiency when adding an item.
 * @enum {(boolean|string)}
 *
 * TODO: Check this is still necessary
 */
ME5E.weaponProficienciesMap = {
    simpleM: "sim",
    simpleR: "sim",
    martialM: "mar",
    martialR: "mar"
};

/**
 * The basic weapon types in 5e. This enables specific weapon proficiencies or
 * starting equipment provided by classes and backgrounds.
 * @enum {string}
 *
 * TODO: Check this is still necessary
 */
ME5E.weaponIds = {};

/* -------------------------------------------- */

/**
 * The basic ammunition types.
 * @enum {string}
 *
 * TODO: Check this is still necessary
 */
ME5E.ammoIds = {};

/* -------------------------------------------- */

/**
 * The categories into which Tool items can be grouped.
 *
 * @enum {string}
 *
 * TODO: Check if this can be improved
 */
ME5E.toolTypes = {
    art: "ME5E.ToolArtisans",
    game: "ME5E.ToolGamingSet",
    music: "ME5E.ToolMusicalInstrument"
};
preLocalize("toolTypes", {sort: true});

/**
 * The various types of vehicles in which characters can be proficient.
 * @enum {string}
 */
ME5E.vehicleTypes = {
    air: "ME5E.VehicleTypeAir",
    land: "ME5E.VehicleTypeLand",
    space: "ME5E.VehicleTypeSpace",
    water: "ME5E.VehicleTypeWater"
};
preLocalize("vehicleTypes", {sort: true});

/**
 * The various types of starship systems in which characters can be proficient.
 * @enum {string}
 */
ME5E.shipSystemTypes = {
    drive: "ME5E.ShipSystemDrive",
    ews: "ME5E.ShipSystemEws",
    helm: "ME5E.ShipSystemHelm",
    nav: "ME5E.ShipSystemNav",
    scc: "ME5E.ShipSystemSsc",
    weap: "ME5E.ShipSystemWeapons"
};
preLocalize("shipSystemTypes", {sort: true});

/**
 * The categories of tool proficiencies that a character can gain.
 *
 * @enum {string}
 */
ME5E.toolProficiencies = {
    ...ME5E.toolTypes,
    vehicle: "ME5E.ToolVehicle",
    system: "ME5E.ToolShipSystem"
};
preLocalize("toolProficiencies", {sort: true});

/**
 * The basic tool types in 5e. This enables specific tool proficiencies or
 * starting equipment provided by classes and backgrounds.
 * @enum {string}
 *
 * TODO: Check this is still necessary
 */
ME5E.toolIds = {
};

/* -------------------------------------------- */

/**
 * Time periods that accept a numeric value.
 * @enum {string}
 */
ME5E.scalarTimePeriods = {
    turn: "ME5E.TimeTurn",
    round: "ME5E.TimeRound",
    minute: "ME5E.TimeMinute",
    hour: "ME5E.TimeHour",
    day: "ME5E.TimeDay",
    month: "ME5E.TimeMonth",
    year: "ME5E.TimeYear"
};
preLocalize("scalarTimePeriods");

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
 * Various ways in which an item or ability can be activated.
 * @enum {string}
 */
ME5E.abilityActivationTypes = {
    action: "ME5E.Action",
    bonus: "ME5E.BonusAction",
    reaction: "ME5E.Reaction",
    minute: ME5E.timePeriods.minute,
    hour: ME5E.timePeriods.hour,
    day: ME5E.timePeriods.day,
    special: ME5E.timePeriods.spec,
    legendary: "ME5E.LegendaryActionLabel",
    mythic: "ME5E.MythicActionLabel",
    lair: "ME5E.LairActionLabel",
    crew: "ME5E.VehicleCrewAction"
};
preLocalize("abilityActivationTypes");

/* -------------------------------------------- */

/**
 * Different things that an ability can consume upon use.
 * @enum {string}
 *
 * TODO: Consider expanding
 */
ME5E.abilityConsumptionTypes = {
    ammo: "ME5E.ConsumeAmmunition",
    attribute: "ME5E.ConsumeAttribute",
    hitDice: "ME5E.ConsumeHitDice",
    material: "ME5E.ConsumeMaterial",
    charges: "ME5E.ConsumeCharges"
};
preLocalize("abilityConsumptionTypes", {sort: true});

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
    tempmax: 0x440066,
    negmax: 0x550000
};

/* -------------------------------------------- */

/**
 * Default types of creatures.
 * *Note: Not pre-localized to allow for easy fetching of pluralized forms.*
 * @enum {string}
 */
ME5E.creatureTypes = {
    organic: "ME5E.CreatureOrganic",
    synthetic: "ME5E.CreatureSynthetic",
    synthOrganic: "ME5E.CreatureSynthOrganic"
};

/* -------------------------------------------- */

/**
 * Classification types for item action types.
 * @enum {string}
 *
 * TODO: Consider if this needs changing
 */
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
preLocalize("itemCapacityTypes", {sort: true});

/* -------------------------------------------- */

/**
 * List of various item rarities.
 * @enum {string}
 */
ME5E.itemRarity = {
    common: "ME5E.ItemRarityCommon",
    uncommon: "ME5E.ItemRarityUncommon",
    rare: "ME5E.ItemRarityRare",
    spectre: "ME5E.ItemRaritySpectre",
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

/**
 * The types of armour placements that are available
 * @enum {string}
 */
ME5E.armorPlacements = {
    arms: "ME5E.ArmorPlacementArms",
    body: "ME5E.ArmorPlacementBody",
    chest: "ME5E.ArmorPlacementChest",
    head: "ME5E.ArmorPlacementHead",
    legs: "ME5E.ArmorPlacementLegs",
}
preLocalize("armorPlacements");

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
preLocalize("miscEquipmentTypes", {sort: true});

/* -------------------------------------------- */

/**
 * The set of equipment types for armor, clothing, and other objects which can be worn by the character.
 * @enum {string}
 */
ME5E.equipmentTypes = {
    ...ME5E.miscEquipmentTypes,
    ...ME5E.armorTypes
};
preLocalize("equipmentTypes", {sort: true});

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
 *
 * TODO: Check if this can be improved
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
 *
 * TODO: Check if this is still necessary
 */
ME5E.armorIds = {};

/**
 * The basic shield in 5e.
 * @enum {string}
 *
 * TODO: Check if this is still necessary
 */
ME5E.shieldIds = {};

/**
 * Common armor class calculations.
 * @enum {{ label: string, [formula]: string }}
 *
 * TODO: Check if this can be improved
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
    custom: {
        label: "ME5E.ArmorClassCustom"
    }
};
preLocalize("armorClasses", {key: "label"});

/* -------------------------------------------- */

/**
 * Enumerate the valid consumable types which are recognized by the system.
 * @enum {string}
 */
ME5E.consumableTypes = {
    ammo: "ME5E.ConsumableAmmo",
    device: "ME5E.ConsumableDevice",
    grenade: "ME5E.ConsumableGrenade",
    hvyWeap: "ME5E.ConsumableHvyWeap",
    heal: "ME5E.ConsumableHeal",
    mat: "ME5E.ConsumableMat",
    omni: "ME5E.ConsumableOmni",
    trinket: "ME5E.ConsumableTrinket"
};
preLocalize("consumableTypes", {sort: true});

/* -------------------------------------------- */

/**
 * Types of containers.
 * @enum {string}
 *
 * TODO: Check if this is still necessary
 */
ME5E.containerTypes = {};

/* -------------------------------------------- */

// TODO: This all needs revising

/**
 * Configuration data for spellcasting foci.
 *
 * @typedef {object} SpellcastingFocusConfiguration
 * @property {string} label                    Localized label for this category.
 * @property {Object<string>} itemIds  Item IDs or UUIDs.
 */

/**
 * Type of spellcasting foci.
 * @enum {SpellcastingFocusConfiguration}
 */
ME5E.focusTypes = {
    arcane: {
        label: "ME5E.Focus.Arcane",
        itemIds: {
            crystal: "uXOT4fYbgPY8DGdd",
            orb: "tH5Rn0JVRG1zdmPa",
            rod: "OojyyGfh91iViuMF",
            staff: "BeKIrNIvNHRPQ4t5",
            wand: "KA2P6I48iOWlnboO"
        }
    },
    druidic: {
        label: "ME5E.Focus.Druidic",
        itemIds: {
            mistletoe: "xDK9GQd2iqOGH8Sd",
            totem: "PGL6aaM0wE5h0VN5",
            woodenstaff: "FF1ktpb2YSiyv896",
            yewwand: "t5yP0d7YaKwuKKiH"
        }
    },
    holy: {
        label: "ME5E.Focus.Holy",
        itemIds: {
            amulet: "paqlMjggWkBIAeCe",
            emblem: "laVqttkGMW4B9654",
            reliquary: "gP1URGq3kVIIFHJ7"
        }
    }
};

/* -------------------------------------------- */

/**
 * Configuration data for an item with the "feature" type.
 *
 * @typedef {object} FeatureTypeConfiguration
 * @property {string} label                       Localized label for this type.
 * @property {Object<string>} [subtypes]  Enum containing localized labels for subtypes.
 */

/**
 * Types of "features" items.
 * @enum {FeatureTypeConfiguration}
 */
ME5E.featureTypes = {
    background: {
        label: "ME5E.Feature.Background"
    },
    class: {
        label: "ME5E.Feature.Class",
        // TODO: See if this can be improved
        subtypes: {
            arcaneShot: "ME5E.ClassFeature.ArcaneShot",
            artificerInfusion: "ME5E.ClassFeature.ArtificerInfusion",
            channelDivinity: "ME5E.ClassFeature.ChannelDivinity",
            defensiveTactic: "ME5E.ClassFeature.DefensiveTactic",
            eldritchInvocation: "ME5E.ClassFeature.EldritchInvocation",
            elementalDiscipline: "ME5E.ClassFeature.ElementalDiscipline",
            fightingStyle: "ME5E.ClassFeature.FightingStyle",
            huntersPrey: "ME5E.ClassFeature.HuntersPrey",
            ki: "ME5E.ClassFeature.Ki",
            maneuver: "ME5E.ClassFeature.Maneuver",
            metamagic: "ME5E.ClassFeature.Metamagic",
            multiattack: "ME5E.ClassFeature.Multiattack",
            pact: "ME5E.ClassFeature.PactBoon",
            psionicPower: "ME5E.ClassFeature.PsionicPower",
            rune: "ME5E.ClassFeature.Rune",
            superiorHuntersDefense: "ME5E.ClassFeature.SuperiorHuntersDefense"
        }
    },
    monster: {
        label: "ME5E.Feature.Monster"
    },
    race: {
        label: "ME5E.Feature.Race"
    },
    feat: {
        label: "ME5E.Feature.Feat"
    }
};
preLocalize("featureTypes", {key: "label"});
preLocalize("featureTypes.class.subtypes", {sort: true});

/* -------------------------------------------- */

/**
 * @typedef {object} CurrencyConfiguration
 * @property {string} label         Localized label for the currency.
 * @property {string} abbreviation  Localized abbreviation for the currency.
 * @property {number} conversion    Number by which this currency should be multiplied to arrive at a standard value.
 */

/**
 * The valid currency denominations with localized labels, abbreviations, and conversions.
 * The conversion number defines how many of that currency are equal to one GP.
 * @enum {CurrencyConfiguration}
 */
ME5E.currencies = {
    cr: {
        label: "ME5E.CurrencyCR",
        abbreviation: "ME5E.CurrencyAbbrCR"
    }
};
preLocalize("currencies", {keys: ["label", "abbreviation"]});

/* -------------------------------------------- */
/*  Damage Types                                */
/* -------------------------------------------- */

/**
 * Types of damage that are considered physical.
 * @enum {string}
 */
ME5E.physicalDamageTypes = {
    bludgeoning: "ME5E.DamageBludgeoning",
    piercing: "ME5E.DamagePiercing",
    slashing: "ME5E.DamageSlashing"
};
preLocalize("physicalDamageTypes", {sort: true});

/* -------------------------------------------- */

/**
 * Types of damage that can be caused by abilities.
 * @enum {string}
 */
ME5E.damageTypes = {
    ...ME5E.physicalDamageTypes,
    acid: "ME5E.DamageAcid",
    cold: "ME5E.DamageCold",
    fire: "ME5E.DamageFire",
    force: "ME5E.DamageForce",
    lightning: "ME5E.DamageLightning",
    necrotic: "ME5E.DamageNecrotic",
    poison: "ME5E.DamagePoison",
    psychic: "ME5E.DamagePsychic",
    radiant: "ME5E.DamageRadiant",
    thunder: "ME5E.DamageThunder"
};
preLocalize("damageTypes", {sort: true});

/* -------------------------------------------- */

/**
 * Types of damage to which an actor can possess resistance, immunity, or vulnerability.
 * @enum {string}
 * @deprecated
 */
ME5E.damageResistanceTypes = {
    ...ME5E.damageTypes,
    physical: "ME5E.DamagePhysical"
};
preLocalize("damageResistanceTypes", {sort: true});

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
/*  Movement                                    */
/* -------------------------------------------- */

/**
 * The valid units of measure for movement distances in the game system.
 * By default, this uses the imperial units of feet and miles.
 * @enum {string}
 */
ME5E.movementTypes = {
    burrow: "ME5E.MovementBurrow",
    climb: "ME5E.MovementClimb",
    fly: "ME5E.MovementFly",
    swim: "ME5E.MovementSwim",
    walk: "ME5E.MovementWalk"
};
preLocalize("movementTypes", {sort: true});

/* -------------------------------------------- */
/*  Measurement                                 */
/* -------------------------------------------- */

/**
 * The valid units of measure for movement distances in the game system.
 * By default this uses the imperial units of feet and miles.
 * @enum {string}
 */
ME5E.movementUnits = {
    m: "ME5E.DistM",
    km: "ME5E.DistKm",
    ft: "ME5E.DistFt",
    mi: "ME5E.DistMi"
};
preLocalize("movementUnits");

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
    ...ME5E.movementUnits,
    ...ME5E.rangeTypes
};
preLocalize("distanceUnits");

/* -------------------------------------------- */

/**
 * Configure aspects of encumbrance calculation so that it could be configured by modules.
 * @enum {{ imperial: number, metric: number }}
 */
ME5E.encumbrance = {
    strMultiplier: {
        imperial: 15,
        metric: 5
    },
    vehicleWeightMultiplier: {
        imperial: 2204, // 2000 lbs in an imperial ton
        metric: 1000 // 1000 kg in a metric ton
    }
};

/* -------------------------------------------- */
/*  Targeting                                   */
/* -------------------------------------------- */

/**
 * Targeting types that apply to one or more distinct targets.
 * @enum {string}
 */
ME5E.individualTargetTypes = {
    self: "ME5E.TargetSelf",
    ally: "ME5E.TargetAlly",
    enemy: "ME5E.TargetEnemy",
    creature: "ME5E.TargetCreature",
    object: "ME5E.TargetObject",
    space: "ME5E.TargetSpace",
    creatureOrObject: "ME5E.TargetCreatureOrObject",
    any: "ME5E.TargetAny",
    willing: "ME5E.TargetWilling"
};
preLocalize("individualTargetTypes");

/* -------------------------------------------- */

/**
 * Information needed to represent different area of effect target types.
 *
 * @typedef {object} AreaTargetDefinition
 * @property {string} label     Localized label for this type.
 * @property {string} template  Type of `MeasuredTemplate` create for this target type.
 */

/**
 * Targeting types that cover an area.
 * @enum {AreaTargetDefinition}
 */
ME5E.areaTargetTypes = {
    radius: {
        label: "ME5E.TargetRadius",
        template: "circle"
    },
    sphere: {
        label: "ME5E.TargetSphere",
        template: "circle"
    },
    cylinder: {
        label: "ME5E.TargetCylinder",
        template: "circle"
    },
    cone: {
        label: "ME5E.TargetCone",
        template: "cone"
    },
    square: {
        label: "ME5E.TargetSquare",
        template: "rect"
    },
    cube: {
        label: "ME5E.TargetCube",
        template: "rect"
    },
    line: {
        label: "ME5E.TargetLine",
        template: "ray"
    },
    wall: {
        label: "ME5E.TargetWall",
        template: "ray"
    }
};
preLocalize("areaTargetTypes", {key: "label", sort: true});

/* -------------------------------------------- */

/**
 * The types of single or area targets which can be applied to abilities.
 * @enum {string}
 */
ME5E.targetTypes = {
    ...ME5E.individualTargetTypes,
    ...Object.fromEntries(Object.entries(ME5E.areaTargetTypes).map(([k, v]) => [k, v.label]))
};
preLocalize("targetTypes", {sort: true});

/* -------------------------------------------- */

/**
 * Denominations of hit dice which can apply to classes.
 * @type {string[]}
 */
ME5E.hitDieTypes = ["d4", "d6", "d8", "d10", "d12"];

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
preLocalize("senses", {sort: true});

/* -------------------------------------------- */
/*  Spellcasting                                */
/* -------------------------------------------- */

/**
 * Define the standard slot progression by character level.
 *
 * The entries of this array represent the spell slot progression for a full spell-caster.
 * @type {number[][]}
 *
 * TODO: Check if there is a better way to do this
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

/**
 * Configuration data for pact casting progression.
 *
 * @typedef {object} PactProgressionConfig
 * @property {number} slots  Number of spell slots granted.
 * @property {number} level  Level of spells that can be cast.
 */

/**
 * Define the pact slot & level progression by pact caster level.
 * @enum {PactProgressionConfig}
 */
ME5E.pactCastingProgression = {
    1: {slots: 1, level: 1},
    2: {slots: 2, level: 1},
    3: {slots: 2, level: 2},
    5: {slots: 2, level: 3},
    7: {slots: 2, level: 4},
    9: {slots: 2, level: 5},
    11: {slots: 3, level: 5},
    17: {slots: 4, level: 5}
};

/* -------------------------------------------- */

/**
 * Various different ways a spell can be prepared.
 *
 * TODO: This'll need revising
 */
ME5E.spellPreparationModes = {
    prepared: "ME5E.SpellPrepPrepared",
    pact: "ME5E.PactMagic",
    always: "ME5E.SpellPrepAlways",
    atwill: "ME5E.SpellPrepAtWill",
    innate: "ME5E.SpellPrepInnate"
};
preLocalize("spellPreparationModes");

/* -------------------------------------------- */

/**
 * Subset of `ME5E.spellPreparationModes` that consume spell slots.
 * @type {boolean[]}
 *
 * TODO: This'll need revising
 */
ME5E.spellUpcastModes = ["always", "pact", "prepared"];

/* -------------------------------------------- */

/**
 * Configuration data for different types of spellcasting supported.
 *
 * @typedef {object} SpellcastingTypeConfiguration
 * @property {string} label                                                        Localized label.
 * @property {Object<SpellcastingProgressionConfiguration>} [progression]  Any progression modes for this type.
 */

/**
 * Configuration data for a spellcasting progression mode.
 *
 * @typedef {object} SpellcastingProgressionConfiguration
 * @property {string} label             Localized label.
 * @property {number} [divisor=1]       Value by which the class levels are divided to determine spellcasting level.
 * @property {boolean} [roundUp=false]  Should fractional values should be rounded up by default?
 */

/**
 * Different spellcasting types and their progression.
 * @type {SpellcastingTypeConfiguration}
 *
 * TODO: This'll need revising
 */
ME5E.spellcastingTypes = {
    leveled: {
        label: "ME5E.SpellProgLeveled",
        progression: {
            full: {
                label: "ME5E.SpellProgFull",
                divisor: 1
            },
            half: {
                label: "ME5E.SpellProgHalf",
                divisor: 2
            },
            third: {
                label: "ME5E.SpellProgThird",
                divisor: 3
            },
            artificer: {
                label: "ME5E.SpellProgArt",
                divisor: 2,
                roundUp: true
            }
        }
    },
    pact: {
        label: "ME5E.SpellProgPact"
    }
};
preLocalize("spellcastingTypes", {key: "label", sort: true});
preLocalize("spellcastingTypes.leveled.progression", {key: "label"});

/* -------------------------------------------- */

/**
 * Ways in which a class can contribute to spellcasting levels.
 * @enum {string}
 *
 * TODO: This'll need revising
 */
ME5E.spellProgression = {
    none: "ME5E.SpellNone",
    full: "ME5E.SpellProgFull",
    half: "ME5E.SpellProgHalf",
    third: "ME5E.SpellProgThird",
    pact: "ME5E.SpellProgPact",
    artificer: "ME5E.SpellProgArt"
};
preLocalize("spellProgression", {key: "label"});

/* -------------------------------------------- */

/**
 * Valid spell levels.
 * @enum {string}
 *
 * TODO: This'll need revising
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
preLocalize("spellScalingModes", {sort: true});

/* -------------------------------------------- */

/**
 * Types of components that can be required when casting a spell.
 * @enum {object}
 *
 * TODO: This'll need revising
 */
ME5E.spellComponents = {
    vocal: {
        label: "ME5E.ComponentVerbal",
        abbr: "ME5E.ComponentVerbalAbbr"
    },
    somatic: {
        label: "ME5E.ComponentSomatic",
        abbr: "ME5E.ComponentSomaticAbbr"
    },
    material: {
        label: "ME5E.ComponentMaterial",
        abbr: "ME5E.ComponentMaterialAbbr"
    }
};
preLocalize("spellComponents", {keys: ["label", "abbr"]});

/* -------------------------------------------- */

/**
 * Supplementary rules keywords that inform a spell's use.
 * @enum {object}
 *
 * TODO: This'll need revising
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

/* -------------------------------------------- */

/**
 * Schools to which a spell can belong.
 * @enum {string}
 *
 * TODO: This'll need revising
 */
ME5E.spellSchools = {
    abj: "ME5E.SchoolAbj",
    con: "ME5E.SchoolCon",
    div: "ME5E.SchoolDiv",
    enc: "ME5E.SchoolEnc",
    evo: "ME5E.SchoolEvo",
    ill: "ME5E.SchoolIll",
    nec: "ME5E.SchoolNec",
    trs: "ME5E.SchoolTrs"
};
preLocalize("spellSchools", {sort: true});

/* -------------------------------------------- */

/**
 * Spell scroll item ID within the `ME5E.sourcePacks` compendium for each level.
 * @enum {string}
 *
 * TODO: This'll need revising
 */
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

/* -------------------------------------------- */
/*  Weapon Details                              */
/* -------------------------------------------- */

/**
 * The set of types which a weapon item can take.
 * @enum {string}
 */
ME5E.weaponTypes = {
    melee: "ME5E.WeaponMelee",
    pistol: "ME5E.WeaponPistol",
    smg: "ME5E.WeaponSmg",
    assault: "ME5E.WeaponAssault",
    shotgun: "ME5E.WeaponShotgun",
    sniper: "ME5E.WeaponSniper",
    natural: "ME5E.WeaponNatural",
    improv: "ME5E.WeaponImprov",
    siege: "ME5E.WeaponSiege"
};
preLocalize("weaponTypes");

/* -------------------------------------------- */

/**
 * A subset of weapon properties that determine the physical characteristics of the weapon.
 * These properties are used for determining physical resistance bypasses.
 * @enum {string}
 *
 * TODO: This might not be necessary
 */
ME5E.physicalWeaponProperties = {};
preLocalize("physicalWeaponProperties", {sort: true});

/* -------------------------------------------- */

/**
 * The set of weapon property flags which can exist on a weapon.
 * @enum {string}
 */
ME5E.weaponProperties = {
    ...ME5E.physicalWeaponProperties,
    arc: "ME5E.WeaponPropertiesArc",
    bst: "ME5E.WeaponPropertiesBst",
    dbl: "ME5E.WeaponPropertiesDbl",
    fin: "ME5E.WeaponPropertiesFin",
    Het: "ME5E.WeaponPropertiesHet",
    hvy: "ME5E.WeaponPropertiesHvy",
    hip: "ME5E.WeaponPropertiesHip",
    lgt: "ME5E.WeaponPropertiesLgt",
    mel: "ME5E.WeaponPropertiesMel",
    ran: "ME5E.WeaponPropertiesRan",
    rec: "ME5E.WeaponPropertiesRec",
    sil: "ME5E.WeaponPropertiesSil",
    spc: "ME5E.WeaponPropertiesSpc",
    thr: "ME5E.WeaponPropertiesThr",
    two: "ME5E.WeaponPropertiesTwo",
    ven: "ME5E.WeaponPropertiesVen",
    ver: "ME5E.WeaponPropertiesVer",
    wei: "ME5E.WeaponPropertiesWei"
};
preLocalize("weaponProperties", {sort: true});

/* -------------------------------------------- */

/**
 * Compendium packs used for localized items.
 * @enum {string}
 *
 * TODO: This'll need revising
 */
ME5E.sourcePacks = {
    ITEMS: "me5e.items"
};

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
    "attributes.ac.value", "attributes.init.bonus", "attributes.movement", "attributes.senses", "attributes.spelldc",
    "attributes.spellLevel", "details.cr", "details.spellLevel", "details.xp.value", "skills.*.passive",
    "abilities.*.value"
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
 * @enum {string}
 */
ME5E.conditionTypes = {
    blinded: "ME5E.ConBlinded",
    charmed: "ME5E.ConCharmed",
    concentrating: "ME5E.ConConcentrating",
    deafened: "ME5E.ConDeafened",
    diseased: "ME5E.ConDiseased",
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
    primeCold: "ME5E.ConPrimedCold",
    primeFire: "ME5E.ConPrimedFire",
    primeForce: "ME5E.ConPrimedForce",
    primeLightning: "ME5E.ConPrimedLightning",
    primeNecrotic: "ME5E.ConPrimedNecrotic",
    primeRadiant: "ME5E.ConPrimedRadiant",
    prone: "ME5E.ConProne",
    restrained: "ME5E.ConRestrained",
    stunned: "ME5E.ConStunned",
    targeting: "ME5E.ConTargeting",
    unconscious: "ME5E.ConUnconscious"
};
preLocalize("conditionTypes", {sort: true});

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
 * @typedef {object} CharacterFlagConfig
 * @property {string} name
 * @property {string} hint
 * @property {string} section
 * @property {typeof boolean|string|number} type
 * @property {string} placeholder
 * @property {string[]} [abilities]
 * @property {Object<string>} [choices]
 * @property {string[]} [skills]
 */

/* -------------------------------------------- */

/**
 * Trait configuration information.
 *
 * @typedef {object} TraitConfiguration
 * @property {object} labels
 * @property {string} labels.title         Localization key for the trait name.
 * @property {string} labels.localization  Prefix for a localization key that can be used to generate various
 *                                         plural variants of the trait type.
 * @property {string} icon                 Path to the icon used to represent this trait.
 * @property {string} [actorKeyPath]       If the trait doesn't directly map to an entry as `traits.[key]`, where is
 *                                         this trait's data stored on the actor?
 * @property {string} [configKey]          If the list of trait options doesn't match the name of the trait, where can
 *                                         the options be found within `CONFIG.ME5E`?
 * @property {string} [labelKeyPath]       If config is an enum of objects, where can the label be found?
 * @property {object} [subtypes]           Configuration for traits that take some sort of base item.
 * @property {string} [subtypes.keyPath]   Path to subtype value on base items, should match a category key.
 * @property {string[]} [subtypes.ids]     Key for base item ID objects within `CONFIG.ME5E`.
 * @property {object} [children]           Mapping of category key to an object defining its children.
 * @property {boolean} [sortCategories]    Whether top-level categories should be sorted.
 * @property {boolean} [expertise]         Can an actor receive expertise in this trait?
 */

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
        icon: "systems/me5e/icons/svg/trait-saves.svg",
        actorKeyPath: "system.abilities",
        configKey: "abilities",
        labelKeyPath: "label"
    },
    skills: {
        labels: {
            title: "ME5E.Skills",
            localization: "ME5E.TraitSkillsPlural"
        },
        icon: "systems/me5e/icons/svg/trait-skills.svg",
        actorKeyPath: "system.skills",
        labelKeyPath: "label",
        expertise: true
    },
    armor: {
        labels: {
            title: "ME5E.TraitArmorProf",
            localization: "ME5E.TraitArmorPlural"
        },
        icon: "systems/me5e/icons/svg/trait-armor-proficiencies.svg",
        actorKeyPath: "system.traits.armorProf",
        configKey: "armorProficiencies",
        subtypes: {keyPath: "armor.type", ids: ["armorIds", "shieldIds"]}
    },
    weapon: {
        labels: {
            title: "ME5E.TraitWeaponProf",
            localization: "ME5E.TraitWeaponPlural"
        },
        icon: "systems/me5e/icons/svg/trait-weapon-proficiencies.svg",
        actorKeyPath: "system.traits.weaponProf",
        configKey: "weaponProficiencies",
        subtypes: {keyPath: "weaponType", ids: ["weaponIds"]}
    },
    tool: {
        labels: {
            title: "ME5E.TraitToolProf",
            localization: "ME5E.TraitToolPlural"
        },
        icon: "systems/me5e/icons/svg/trait-tool-proficiencies.svg",
        actorKeyPath: "system.tools",
        configKey: "toolProficiencies",
        subtypes: {keyPath: "toolType", ids: ["toolIds"]},
        children: {vehicle: "vehicleTypes"},
        sortCategories: true,
        expertise: true
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
    ci: {
        labels: {
            title: "ME5E.ConImm",
            localization: "ME5E.TraitCIPlural"
        },
        icon: "systems/me5e/icons/svg/trait-condition-immunities.svg",
        configKey: "conditionTypes"
    }
};
preLocalize("traits", {key: "labels.title"});

/* -------------------------------------------- */

/**
 * Modes used within a trait advancement.
 * @enum {object}
 */
ME5E.traitModes = {
    default: {
        label: "ME5E.AdvancementTraitModeDefaultLabel",
        hint: "ME5E.AdvancementTraitModeDefaultHint"
    },
    expertise: {
        label: "ME5E.AdvancementTraitModeExpertiseLabel",
        hint: "ME5E.AdvancementTraitModeExpertiseHint"
    },
    forcedExpertise: {
        label: "ME5E.AdvancementTraitModeForceLabel",
        hint: "ME5E.AdvancementTraitModeForceHint"
    },
    upgrade: {
        label: "ME5E.AdvancementTraitModeUpgradeLabel",
        hint: "ME5E.AdvancementTraitModeUpgradeHint"
    }
};
preLocalize("traitModes", {keys: ["label", "hint"]});

/* -------------------------------------------- */

/**
 * Special character flags.
 * @enum {CharacterFlagConfig}
 *
 * TODO: This'll need revising
 */
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
preLocalize("characterFlags", {keys: ["name", "hint", "section"]});

/**
 * Flags allowed on actors. Any flags not in the list may be deleted during a migration.
 * @type {string[]}
 */
ME5E.allowedActorFlags = ["originalActor"].concat(Object.keys(ME5E.characterFlags));

/* -------------------------------------------- */

/**
 * Advancement types that can be added to items.
 * @enum {*}
 *
 * TODO: This'll need revising
 */
ME5E.advancementTypes = {
    AbilityScoreImprovement: advancement.AbilityScoreImprovementAdvancement,
    HitPoints: advancement.HitPointsAdvancement,
    ItemChoice: advancement.ItemChoiceAdvancement,
    ItemGrant: advancement.ItemGrantAdvancement,
    ScaleValue: advancement.ScaleValueAdvancement
};

/* -------------------------------------------- */

/**
 * Patch an existing config enum to allow conversion from string values to object values without
 * breaking existing modules that are expecting strings.
 * @param {string} key          Key within ME5E that has been replaced with an enum of objects.
 * @param {string} fallbackKey  Key within the new config object from which to get the fallback value.
 * @param {object} [options]    Additional options passed through to logCompatibilityWarning.
 *
 * TODO: This may not be necessary
 */
function patchConfig(key, fallbackKey, options) {
    /** @override */
    function toString() {
        const message = `The value of CONFIG.ME5E.${key} has been changed to an object.`
            + ` The former value can be acccessed from .${fallbackKey}.`;
        foundry.utils.logCompatibilityWarning(message, options);
        return this[fallbackKey];
    }

    Object.values(ME5E[key]).forEach(o => o.toString = toString);
}

/* -------------------------------------------- */

export default ME5E;
