export const registerSystemSettings = function() {

    /**
     * Track the system version upon which point a migration was last applied
     */
    game.settings.register("me5e", "systemMigrationVersion", {
        name: "System Migration Version",
        scope: "world",
        config: false,
        type: String,
        default: ""
    });

    /**
     * Register resting variants
     */
    game.settings.register("me5e", "restVariant", {
        name: "SETTINGS.5eRestN",
        hint: "SETTINGS.5eRestL",
        scope: "world",
        config: true,
        default: "normal",
        type: String,
        choices: {
            "normal": "SETTINGS.5eRestPHB",
            "gritty": "SETTINGS.5eRestGritty",
            "epic": "SETTINGS.5eRestEpic"
        }
    });

    /**
     * Register diagonal movement rule setting
     */
    game.settings.register("me5e", "diagonalMovement", {
        name: "SETTINGS.5eDiagN",
        hint: "SETTINGS.5eDiagL",
        scope: "world",
        config: true,
        default: "555",
        type: String,
        choices: {
            "555": "SETTINGS.5eDiagPHB",
            "5105": "SETTINGS.5eDiagDMG",
            "EUCL": "SETTINGS.5eDiagEuclidean"
        },
        onChange: rule => canvas.grid.diagonalRule = rule
    });

    /**
     * Register Initiative formula setting
     */
    game.settings.register("me5e", "initiativeDexTiebreaker", {
        name: "SETTINGS.5eInitTBN",
        hint: "SETTINGS.5eInitTBL",
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });

    /**
     * Require Currency Carrying Weight
     */
    game.settings.register("me5e", "currencyWeight", {
        name: "SETTINGS.5eCurWtN",
        hint: "SETTINGS.5eCurWtL",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });

    /**
     * Option to disable XP bar for session-based or story-based advancement.
     */
    game.settings.register("me5e", "disableExperienceTracking", {
        name: "SETTINGS.5eNoExpN",
        hint: "SETTINGS.5eNoExpL",
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });

    /**
     * Option to automatically collapse Item Card descriptions
     */
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

    /**
     * Option to allow GMs to restrict polymorphing to GMs only.
     */
    game.settings.register('me5e', 'allowPolymorphing', {
        name: 'SETTINGS.5eAllowPolymorphingN',
        hint: 'SETTINGS.5eAllowPolymorphingL',
        scope: 'world',
        config: true,
        default: false,
        type: Boolean
    });

    /**
     * Remember last-used polymorph settings.
     */
    game.settings.register('me5e', 'polymorphSettings', {
        scope: 'client',
        default: {
            keepPhysical: false,
            keepMental: false,
            keepSaves: false,
            keepSkills: false,
            mergeSaves: false,
            mergeSkills: false,
            keepClass: false,
            keepFeats: false,
            keepSpells: false,
            keepItems: false,
            keepBio: false,
            keepVision: true,
            transformTokens: true
        }
    });

    /**
     * Option to replace imperial weight units with metric weight units.
     */
    game.settings.register("me5e", "metricWeightUnits", {
        name: "SETTINGS.5eMetricN",
        hint: "SETTINGS.5eMetricL",
        scope: "world",
        config: true,
        type: Boolean,
        default: true
    });
};
