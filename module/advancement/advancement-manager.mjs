import Advancement from "./advancement.mjs";

/**
 * Internal type used to manage each step within the advancement process.
 *
 * @typedef {object} AdvancementStep
 * @property {string} type                Step type from "forward", "reverse", "restore", or "delete".
 * @property {AdvancementFlow} [flow]     Flow object for the advancement being applied by this step.
 * @property {Item5e} [item]              For "delete" steps only, the item to be removed.
 * @property {object} [class]             Contains data on class if step was triggered by class level change.
 * @property {Item5e} [class.item]        Class item that caused this advancement step.
 * @property {number} [class.level]       Level the class should be during this step.
 * @property {boolean} [automatic=false]  Should the manager attempt to apply this step without user interaction?
 */

/**
 * Application for controlling the advancement workflow and displaying the interface.
 *
 * @param {Actor5e} actor        Actor on which this advancement is being performed.
 * @param {object} [options={}]  Additional application options.
 */
export default class AdvancementManager extends Application {
  constructor(actor, options={}) {
    super(options);

    /**
     * The original actor to which changes will be applied when the process is complete.
     * @type {Actor5e}
     */
    this.actor = actor;

    /**
     * Individual steps that will be applied in order.
     * @type {object}
     */
    this.steps = [];

    /**
     * Step being currently displayed.
     * @type {number|null}
     * @private
     */
    this._stepIndex = null;

    /**
     * Is the prompt currently advancing through un-rendered steps?
     * @type {boolean}
     * @private
     */
    this._advancing = false;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["me5e", "advancement", "flow"],
      template: "systems/me5e/templates/advancement/advancement-manager.hbs",
      width: 460,
      height: "auto"
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  get title() {
    const visibleSteps = this.steps.filter(s => !s.automatic);
    const visibleIndex = visibleSteps.indexOf(this.step);
    const step = visibleIndex < 0 ? "" : game.i18n.format("ME5E.AdvancementManagerSteps", {
      current: visibleIndex + 1,
      total: visibleSteps.length
    });
    return `${game.i18n.localize("ME5E.AdvancementManagerTitle")} ${step}`;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  get id() {
    return `actor-${this.actor.id}-advancement`;
  }

  /* -------------------------------------------- */

  /**
   * Get the step that is currently in progress.
   * @type {object|null}
   */
  get step() {
    return this.steps[this._stepIndex] ?? null;
  }

  /* -------------------------------------------- */

  /**
   * Get the step before the current one.
   * @type {object|null}
   */
  get previousStep() {
    return this.steps[this._stepIndex - 1] ?? null;
  }

  /* -------------------------------------------- */

  /**
   * Get the step after the current one.
   * @type {object|null}
   */
  get nextStep() {
    const nextIndex = this._stepIndex === null ? 0 : this._stepIndex + 1;
    return this.steps[nextIndex] ?? null;
  }

  /* -------------------------------------------- */
  /*  Factory Methods                             */
  /* -------------------------------------------- */

  /**
   * Construct a manager for a newly added item.
   * @param {Actor5e} actor         Actor to which the item is added to.
   * @param {Item5e} item           The item that was just added.
   * @param {object} options        Rendering options passed to the application.
   * @returns {AdvancementManager}  Prepared manager. Steps count can be used to determine if advancements are needed.
   */
  static forNewItem(actor, item, options={}) {
    const manager = new this(actor, options);

    if (item.type === "class") {
      return manager.createLevelChangeSteps(item, 0, 1);
    }

    // All other items, just create some flows up to current character level (or class level for subclasses)
    let flows;
    if (item.type === "subclass") {
      flows = manager.constructor.flowsForItem(item, 0, (item.class?.system.levels ?? 0));
    } else {
      flows = manager.constructor.flowsForItem(item, -1, actor.system.details.level + 1);
    }
    manager.steps.push(...flows.map(flow => ({flow, item})));

    return manager;
  }

  /* -------------------------------------------- */

  /**
   * Construct a manager for modifying choices on an item at a specific level.
   * @param {Actor5e} actor         Actor from which the choices should be modified.
   * @param {object} itemId         ID of the item whose choices are to be changed.
   * @param {number} level          Level at which the choices are being changed.
   * @param {object} options        Rendering options passed to the application.
   * @returns {AdvancementManager}  Prepared manager. Steps count can be used to determine if advancements are needed.
   */
  static forModifyChoices(actor, itemId, level, options) {
    const manager = new this(actor, options);
    const clonedItem = manager.clone.items.get(itemId);
    if ( !clonedItem ) return manager;

    const currentLevel = clonedItem.system.levels ?? clonedItem.class?.system.levels
      ?? manager.clone.system.details.level;

    const flows = Array.fromRange(currentLevel + 1).slice(level)
      .flatMap(l => this.flowsForLevel(clonedItem, l));

    // Revert advancements through changed level
    flows.reverse().forEach(flow => manager.steps.push({ type: "reverse", flow, automatic: true }));

    // Create forward advancements for level being changed
    flows.reverse().filter(f => f.level === level).forEach(flow => manager.steps.push({ type: "forward", flow }));

    // Create restore advancements for other levels
    flows.filter(f => f.level > level).forEach(flow => manager.steps.push({ type: "restore", flow, automatic: true }));

    return manager;
  }

  /* -------------------------------------------- */

  /**
   * Construct a manager for a change in a class's levels.
   * @param {Actor5e} actor         Actor whose level has changed.
   * @param {Item5e} classItem      The class being changed.
   * @param {number} levelDelta     Levels by which to increase or decrease the class.
   * @param {object} options        Rendering options passed to the application.
   * @returns {AdvancementManager}  Prepared manager. Steps count can be used to determine if advancements are needed.
   */
  static forLevelChange(actor, classItem, levelDelta, options={}) {
    const manager = new this(actor, options);

    return manager.createLevelChangeSteps(classItem, classItem.system.levels, levelDelta);
  }

  /* -------------------------------------------- */

  /**
   * Create steps based on the provided level change data.
   * @param {Item5e} classItem      the class being changed.
   * @param {number} startingLevel  The level of the item before
   * @param {number} levelDelta     Levels by which to increase or decrease the item.
   * @returns {AdvancementManager}  Manager with new steps.
   * @private
   */
  createLevelChangeSteps(classItem, startingLevel, levelDelta) {
    const pushSteps = (flows, item) => this.steps.push(...flows.map(flow => ({flow, item, automatic: levelDelta < 0})));

    pushSteps(this.constructor.flowsForItem(classItem, startingLevel, levelDelta), classItem);
    if (classItem.subclass) pushSteps(this.constructor.flowsForItem(classItem.subclass, startingLevel, levelDelta), classItem.subclass);

    this.actor.items.contents.forEach((i) => {
      if ( ["class", "subclass"].includes(i.type) ) return;
      pushSteps(this.constructor.flowsForItem(i, this.actor.system.details.level, this.actor.system.details.level + levelDelta), i);
    });

    this.steps.push({item: classItem, automatic: true, changes:{toUpdate: [{_id: classItem._id, "system.levels": startingLevel + levelDelta}]}});

    return this;
  }

  /* -------------------------------------------- */

  /**
   * Creates advancement flows for an item's advancements from the starting level by a delta.
   * @param {Item5e} item          Item that has advancement.
   * @param {number} startingLevel The initial level before the change
   * @param {number} levelDelta    The change in level
   * @returns {AdvancementFlow[]}  Created flow applications.
   * @protected
   */
  static flowsForItem(item, startingLevel, levelDelta) {
    let start = startingLevel + 1;
    let end = start + levelDelta;
    if (start > end) {
      const temp = start;
      start = end;
      end = temp;
    }

    return Object.values(item.advancement.getByTypeInLevelRange(start, end))
      .map(( advancements) => {
        return new advancements[0].constructor.metadata.apps.flow(item, advancements, startingLevel, levelDelta);
      });
  }

  /* -------------------------------------------- */
  /*  Form Rendering                              */
  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    if ( !this.step ) return {};

    // Prepare information for subheading
    const item = this.step.flow.item;
    const startingLevel = this.step.flow.startingLevel;
    const levelDelta = this.step.flow.levelDelta;

    const visibleSteps = this.steps.filter(s => !s.automatic);
    const visibleIndex = visibleSteps.indexOf(this.step);

    return {
      actor: this.clone,
      flowId: this.step.flow.id,
      header: item.name,
      subheader: startingLevel !== 0
        ? game.i18n.format("ME5E.AdvancementLevelChangeHeader", {
            oldLevel: (startingLevel === -1) ? "-" : startingLevel,
            newLevel: startingLevel + levelDelta
          })
        : "",
      steps: {
        current: visibleIndex + 1,
        total: visibleSteps.length,
        hasPrevious: visibleIndex > 0,
        hasNext: visibleIndex < visibleSteps.length - 1
      }
    };
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  render(...args) {
    if ( this.steps.length && (this._stepIndex === null) ) this._stepIndex = 0;

    // Ensure the level on the class item matches the specified level
    if ( this.step?.class ) {
      let level = this.step.class.level;
      if ( this.step.type === "reverse" ) level -= 1;
      this.step.class.item.updateSource({"system.levels": level});
      this.clone.reset();
    }

    /**
     * A hook event that fires when an AdvancementManager is about to be processed.
     * @function me5e.preAdvancementManagerRender
     * @memberof hookEvents
     * @param {AdvancementManager} advancementManager The advancement manager about to be rendered
     */
    const allowed = Hooks.call("me5e.preAdvancementManagerRender", this);

    // Abort if not allowed
    if ( allowed === false ) return this;

    if ( this.step?.automatic ) {
      if ( this._advancing ) return this;
      this._forward();
      return this;
    }

    return super.render(...args);
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async _render(force, options) {
    await super._render(force, options);
    if ( (this._state !== Application.RENDER_STATES.RENDERED) || !this.step ) return;

    // Render the step
    this.step.flow._element = null;
    await this.step.flow._render(force, options);
    this.setPosition();
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);
    html.find("button[data-action]").click(event => {
      const buttons = html.find("button");
      buttons.attr("disabled", true);
      html.find(".error").removeClass("error");
      try {
        switch ( event.currentTarget.dataset.action ) {
          case "restart":
            if ( !this.previousStep ) return;
            return this._restart(event);
          case "previous":
            if ( !this.previousStep ) return;
            return this._backward(event);
          case "next":
          case "complete":
            return this._forward(event);
        }
      } finally {
        buttons.attr("disabled", false);
      }
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async close(options={}) {
    if ( !options.skipConfirmation ) {
      return new Dialog({
        title: `${game.i18n.localize("ME5E.AdvancementManagerCloseTitle")}: ${this.actor.name}`,
        content: game.i18n.localize("ME5E.AdvancementManagerCloseMessage"),
        buttons: {
          close: {
            icon: '<i class="fas fa-times"></i>',
            label: game.i18n.localize("ME5E.AdvancementManagerCloseButtonStop"),
            callback: () => super.close(options)
          },
          continue: {
            icon: '<i class="fas fa-chevron-right"></i>',
            label: game.i18n.localize("ME5E.AdvancementManagerCloseButtonContinue")
          }
        },
        default: "close"
      }).render(true);
    }
    await super.close(options);
  }

  /* -------------------------------------------- */
  /*  Process                                     */
  /* -------------------------------------------- */

  /**
   * Advance through the steps until one requiring user interaction is encountered.
   * @param {Event} [event]  Triggering click event if one occurred.
   * @returns {Promise}
   * @private
   */
  async _forward(event) {
    this._advancing = true;
    try {
      do {
        const flow = this.step.flow;

        if(flow) this.step.changes = await flow.getChanges(event);

        this._stepIndex++;
      } while ( this.step?.automatic );
    } catch(error) {
      if ( !(error instanceof Advancement.ERROR) ) throw error;
      ui.notifications.error(error.message);
      this.step.automatic = false;
    } finally {
      this._advancing = false;
    }

    if ( this.step ) this.render(true);
    else this._complete();
  }

  /* -------------------------------------------- */

  /**
   * Reverse through the steps until one requiring user interaction is encountered.
   * @param {Event} [event]                  Triggering click event if one occurred.
   * @param {object} [options]               Additional options to configure behavior.
   * @param {boolean} [options.render=true]  Whether to render the Application after the step has been reversed. Used
   *                                         by the restart workflow.
   * @returns {Promise}
   * @private
   */
  async _backward(event, { render=true }={}) {
    this._advancing = true;
    try {
      do {
        delete this.step.change;
        this._stepIndex--;
        if ( !this.step ) break;
        const flow = this.step.flow;
      } while ( this.step?.automatic );
    } catch(error) {
      if ( !(error instanceof Advancement.ERROR) ) throw error;
      ui.notifications.error(error.message);
      this.step.automatic = false;
    } finally {
      this._advancing = false;
    }

    if ( !render ) return;
    if ( this.step ) this.render(true);
    else this.close({ skipConfirmation: true });
  }

  /* -------------------------------------------- */

  /**
   * Reset back to the manager's initial state.
   * @param {MouseEvent} [event]  The triggering click event if one occurred.
   * @returns {Promise}
   * @private
   */
  async _restart(event) {
    const restart = await Dialog.confirm({
      title: game.i18n.localize("ME5E.AdvancementManagerRestartConfirmTitle"),
      content: game.i18n.localize("ME5E.AdvancementManagerRestartConfirm")
    });
    if ( !restart ) return;
    // While there is still a renderable step.
    while ( this.steps.slice(0, this._stepIndex).some(s => !s.automatic) ) {
      await this._backward(event, {render: false});
    }
    this.render(true);
  }

  /* -------------------------------------------- */

  /**
   * Apply changes to actual actor after all choices have been made.
   * @param {Event} event  Button click that triggered the change.
   * @returns {Promise}
   * @private
   */
  async _complete(event) {
    // Gather changes to embedded items
    const { toCreate, toUpdate, toDelete, advancementUpdates } = this.steps.reduce((acc, step) => {
      if (step.changes.toCreate) acc.toCreate.push(...step.changes.toCreate);
      if (step.changes.toDelete) acc.toDelete.push(...step.changes.toDelete);
      if (step.changes.toUpdate) acc.toUpdate.push(...step.changes.toUpdate);
      if (step.changes.advancementUpdates) {
        let item = acc.advancementUpdates[step.item._id];
        if (!item) acc.advancementUpdates[step.item._id] = item = {};

        for (const [advancementId, change] of Object.entries(step.changes.advancementUpdates)) {
          item[advancementId] = change;
        }
      }
      return acc;
    }, {toCreate: [], toUpdate: [], toDelete: [], advancementUpdates: {}});

    //

    /**
     * A hook event that fires at the final stage of a character's advancement process, before actor and item updates
     * are applied.
     * @function me5e.preAdvancementManagerComplete
     * @memberof hookEvents
     * @param {AdvancementManager} advancementManager  The advancement manager.
     * @param {object[]} toCreate                      Items that will be created on the actor.
     * @param {object[]} toUpdate                      Items that will be updated on the actor.
     * @param {string[]} toDelete                      IDs of items that will be deleted on the actor.
     * @param {Object} advancementUpdates              Item IDs mapped to advancements and their updates
     */
    if ( Hooks.call("me5e.preAdvancementManagerComplete", this, toCreate, toUpdate, toDelete, advancementUpdates) === false ) {
      console.log("AdvancementManager completion was prevented by the 'preAdvancementManagerComplete' hook.");
      return this.close({ skipConfirmation: true });
    }

    // Apply changes from clone to original actor
    await Promise.all([
      ...Object.entries(advancementUpdates).map(([itemId, update]) => this.actor.items.get(itemId).updateAdvancements(update)),
      this.actor.createEmbeddedDocuments("Item", toCreate, { keepId: true, isAdvancement: true }),
      this.actor.updateEmbeddedDocuments("Item", toUpdate, { isAdvancement: true }),
      this.actor.deleteEmbeddedDocuments("Item", toDelete, {cleanupAdvancements: true, isAdvancement: true})
    ]);

    /**
     * A hook event that fires when an AdvancementManager is done modifying an actor.
     * @function me5e.advancementManagerComplete
     * @memberof hookEvents
     * @param {AdvancementManager} advancementManager The advancement manager that just completed
     */
    Hooks.callAll("me5e.advancementManagerComplete", this);

    // Close prompt
    return this.close({ skipConfirmation: true });
  }
}
