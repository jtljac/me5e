import { log } from "./utils.mjs";

/**
 * Perform a system migration for the entire World, applying migrations for Actors, Items, and Compendium packs.
 * @param {object} [options={}]
 * @param {boolean} [options.bypassVersionCheck=false]  Bypass certain migration restrictions gated behind system
 *                                                      version stored in item stats.
 * @returns {Promise}      A Promise which resolves once the migration is completed
 */
export async function migrateWorld({ bypassVersionCheck=false }={}) {
  const version = game.system.version;
  const progress = ui.notifications.info("MIGRATION.5eBegin", {
    console: false, format: { version }, permanent: true, progress: true
  });
  const { packs, packDocuments } = game.packs.reduce((obj, pack) => {
    if ( _shouldMigrateCompendium(pack) ) {
      obj.packs.push(pack);
      obj.packDocuments += pack.index.size;
    }
    return obj;
  }, { packs: [], packDocuments: 0 });

  const totalDocuments = game.actors.size + game.items.size + game.macros.size + game.tables.size
    + game.scenes.reduce((total, s) => total + s.tokens.size, 0) + packDocuments;

  // Methods
  let migrated = 0;
  const incrementProgress = () => progress.update({ pct: ++migrated / totalDocuments });
  const logError = (err, type, name) => {
    err.message = `Failed me5e system migration for ${type} ${name}: ${err.message}`;
    console.error(err);
    hasErrors = true;
  };

  let hasErrors = false;

  const migrationData = await getMigrationData();
  await migrateSettings();

  // Migrate World Actors
  const actors = game.actors.map(a => [a, true])
    .concat(Array.from(game.actors.invalidDocumentIds).map(id => [game.actors.getInvalid(id), false]));
  for ( const [actor, valid] of actors ) {
    try {
      const flags = { bypassVersionCheck, persistSourceMigration: false };
      const source = valid ? actor.toObject() : game.data.actors.find(a => a._id === actor.id);

      let updateData = migrateActorData(actor, source, migrationData, flags, { actorUuid: actor.uuid });

      // Apply update data
      if ( !foundry.utils.isEmpty(updateData) ) {
        log(`Migrating Actor document ${actor.name}`);

        if ( flags.persistSourceMigration ) {
          updateData = foundry.utils.mergeObject(source, updateData, {inplace: false});
        }

        await actor.update(updateData, {
          enforceTypes: false, diff: valid && !flags.persistSourceMigration,
          recursive: !flags.persistSourceMigration, render: false
        });
      }
    } catch(err) {
      logError(err, "Actor", actor.name);
    }
    incrementProgress();
  }

  // Migrate World Items
  const items = game.items.map(i => [i, true])
    .concat(Array.from(game.items.invalidDocumentIds).map(id => [game.items.getInvalid(id), false]));
  for ( const [item, valid] of items ) {
    try {
      const flags = { bypassVersionCheck, persistSourceMigration: false };
      const source = valid ? item.toObject() : game.data.items.find(i => i._id === item.id);

      let updateData = migrateItemData(item, source, migrationData, flags);

      if ( !foundry.utils.isEmpty(updateData) ) {
        log(`Migrating Item document ${item.name}`);

        if ( flags.persistSourceMigration ) {
          if ( "effects" in updateData ) updateData.effects = source.effects.map(effect => foundry.utils.mergeObject(
            effect, updateData.effects.find(e => e._id === effect._id) ?? {}, { inplace: false, performDeletions: true }
          ));

          updateData = foundry.utils.mergeObject(source, updateData, { inplace: false, performDeletions: true });
        }

        await item.update(updateData, {
          enforceTypes: false, diff: valid && !flags.persistSourceMigration,
          recursive: !flags.persistSourceMigration, render: false
        });
      }
    } catch(err) {
      logError(err, "Item", item.name);
    }

    incrementProgress();
  }

  // Migrate World Macros
  for ( const m of game.macros ) {
    try {
      const updateData = migrateMacroData(m.toObject(), migrationData);

      if ( !foundry.utils.isEmpty(updateData) ) {
        log(`Migrating Macro document ${m.name}`);
        await m.update(updateData, {enforceTypes: false, render: false});
      }
    } catch(err) {
      logError(err, "Macro", m.name);
    }

    incrementProgress();
  }

  // Migrate World Roll Tables
  for ( const table of game.tables ) {
    try {
      const updateData = migrateRollTableData(table.toObject(), migrationData);

      if ( !foundry.utils.isEmpty(updateData) ) {
        log(`Migrating RollTable document ${table.name}`);
        await table.update(updateData, { enforceTypes: false, render: false });
      }
    } catch(err) {
      logError(err, "RollTable", table.name);
    }

    incrementProgress();
  }

  // Migrate Actor Override Tokens
  for ( const s of game.scenes ) {
    try {
      const updateData = migrateSceneData(s, migrationData);

      if ( !foundry.utils.isEmpty(updateData) ) {
        log(`Migrating Scene document ${s.name}`);
        await s.update(updateData, {enforceTypes: false, render: false});
      }
    } catch(err) {
      logError(err, "Scene", s.name);
    }

    // Migrate ActorDeltas individually in order to avoid issues with ActorDelta bulk updates.
    for ( const token of s.tokens ) {
      if ( token.actorLink || !token.actor ) {
        incrementProgress();
        continue;
      }

      try {
        const flags = { bypassVersionCheck, persistSourceMigration: false };
        const source = token.actor.toObject();
        let updateData = migrateActorData(token.actor, source, migrationData, flags, { actorUuid: token.actor.uuid });

        if ( !foundry.utils.isEmpty(updateData) ) {
          log(`Migrating ActorDelta document ${token.actor.name} [${token.delta.id}] in Scene ${s.name}`);

          if ( flags.persistSourceMigration ) {
            updateData = foundry.utils.mergeObject(source, updateData, { inplace: false });
          } else {
            // Workaround for core issue of bulk updating ActorDelta collections.
            ["items", "effects"].forEach(col => {
              for ( const [i, update] of (updateData[col] ?? []).entries() ) {
                const original = token.actor[col].get(update._id);

                updateData[col][i] = foundry.utils.mergeObject(original.toObject(), update, { inplace: false });
              }
            });
          }

          await token.actor.update(updateData, {
            enforceTypes: false, diff: !flags.persistSourceMigration,
            recursive: !flags.persistSourceMigration, render: false
          });
        }
      } catch(err) {
        logError(err, "ActorDelta", `[${token.id}]`);
      }

      incrementProgress();
    }
  }

  // Migrate World Compendium Packs
  for ( let p of packs ) {
    await migrateCompendium(p, { incrementProgress });
  }
  const legacyFolder = game.folders.find(f => f.type === "Compendium" && f.name === "D&D SRD Content");
  if ( legacyFolder ) legacyFolder.update({ name: "D&D Legacy Content" });

  // Set the migration as complete
  game.settings.set("me5e", "systemMigrationVersion", game.system.version);
  progress.element?.classList.add(hasErrors ? "warning" : "success");
  progress.update({ message: "MIGRATION.5eComplete", format: { version }, pct: 1 });
}

/* -------------------------------------------- */

/**
 * Determine whether a compendium pack should be migrated during `migrateWorld`.
 * @param {Compendium} pack
 * @returns {boolean}
 */
function _shouldMigrateCompendium(pack) {
  // We only care about actor, item or scene migrations
  if ( !["Actor", "Item", "Scene"].includes(pack.documentName) ) return false;

  // World compendiums should all be migrated, system ones should never be migrated
  if ( pack.metadata.packageType === "world" ) return true;
  if ( pack.metadata.packageType === "system" ) return false;

  // Module compendiums should only be migrated if they don't have a download or manifest URL
  const module = game.modules.get(pack.metadata.packageName);
  return !module.download && !module.manifest;
}

/* -------------------------------------------- */

/**
 * Apply migration rules to all Documents within a single Compendium pack
 * @param {CompendiumCollection} pack       Pack to be migrated.
 * @param {object} [options={}]
 * @param {boolean} [options.bypassVersionCheck=false]  Bypass certain migration restrictions gated behind system
 *                                                      version stored in item stats.
 * @param {Function} [options.incrementProgress]        Function that can be called to increment the progress bar.
 * @param {boolean} [options.strict=false]  Migrate errors should stop the whole process.
 * @returns {Promise}
 */
export async function migrateCompendium(pack, { bypassVersionCheck=false, incrementProgress, strict=false }={}) {
  const documentName = pack.documentName;
  if ( !["Actor", "Item", "Scene"].includes(documentName) ) return;

  const migrationData = await getMigrationData();

  // Unlock the pack for editing
  const wasLocked = pack.locked;
  try {
    await pack.configure({locked: false});
    game.compendiumArt.enabled = false;

    // Begin by requesting server-side data model migration and get the migrated content
    const documents = await pack.getDocuments();

    // Iterate over compendium entries - applying fine-tuned migration functions
    for ( let doc of documents ) {
      let updateData = {};
      try {
        const flags = { bypassVersionCheck, persistSourceMigration: false };
        const source = doc.toObject();

        switch ( documentName ) {
          case "Actor":
            updateData = migrateActorData(doc, source, migrationData, flags, { actorUuid: doc.uuid });
            break;
          case "Item":
            updateData = migrateItemData(doc, source, migrationData, flags);
            break;
          case "Scene":
            updateData = migrateSceneData(source, migrationData, flags);
            break;
        }

        // Save the entry, if data was changed
        if ( foundry.utils.isEmpty(updateData) ) continue;
        if ( flags.persistSourceMigration ) updateData = foundry.utils.mergeObject(source, updateData);

        await doc.update(updateData, { diff: !flags.persistSourceMigration });

        log(`Migrated ${documentName} document ${doc.name} in Compendium ${pack.collection}`);
      }

      // Handle migration failures
      catch(err) {
        err.message = `Failed me5e system migration for document ${doc.name} in pack ${pack.collection}: ${err.message}`;
        console.error(err);

        if ( strict ) throw err;
      }

      finally {
        incrementProgress?.();
      }
    }

    log(`Migrated all ${documentName} documents from Compendium ${pack.collection}`);
  } finally {
    // Apply the original locked status for the pack
    await pack.configure({locked: wasLocked});
    game.compendiumArt.enabled = true;
  }
}

/* -------------------------------------------- */

/**
 * Update all compendium packs using the new system data model.
 * @param {object} [options={}]
 * @param {boolean} [options.bypassVersionCheck=false]  Bypass certain migration restrictions gated behind system
 *                                                      version stored in item stats.
 * @param {boolean} [options.migrate=true]  Also perform a system migration before refreshing.
 */
export async function refreshAllCompendiums(options) {
  for ( const pack of game.packs ) {
    await refreshCompendium(pack, options);
  }
}

/* -------------------------------------------- */

/**
 * Update all Documents in a compendium using the new system data model.
 * @param {CompendiumCollection} pack  Pack to refresh.
 * @param {object} [options={}]
 * @param {boolean} [options.bypassVersionCheck=false]  Bypass certain migration restrictions gated behind system
 *                                                      version stored in item stats.
 * @param {boolean} [options.migrate=true]  Also perform a system migration before refreshing.
 */
export async function refreshCompendium(pack, { bypassVersionCheck, migrate=true }={}) {
  if ( !pack?.documentName ) return;
  if ( migrate ) {
    try {
      await migrateCompendium(pack, { bypassVersionCheck, strict: true });
    } catch( err ) {
      err.message = `Failed me5e system migration pack ${pack.collection}: ${err.message}`;
      console.error(err);
      return;
    }
  }

  game.compendiumArt.enabled = false;
  const DocumentClass = CONFIG[pack.documentName].documentClass;
  const wasLocked = pack.locked;
  await pack.configure({locked: false});

  ui.notifications.info(`Beginning to refresh Compendium ${pack.collection}`);
  const documents = await pack.getDocuments();
  for ( const doc of documents ) {
    const data = doc.toObject();
    await doc.delete();
    await DocumentClass.create(data, {keepId: true, keepEmbeddedIds: true, pack: pack.collection});
  }
  await pack.configure({locked: wasLocked});
  game.compendiumArt.enabled = true;
  ui.notifications.info(`Refreshed all documents from Compendium ${pack.collection}`);
}

/* -------------------------------------------- */

/**
 * Migrate system settings to new data types.
 */
export async function migrateSettings() {
  // Nothing Yet
}

/* -------------------------------------------- */
/*  Document Type Migration Helpers             */
/* -------------------------------------------- */

/**
 * Migrate a single Actor document to incorporate latest data model changes
 * Return an Object of updateData to be applied
 * @param {Actor5e} actor               Full actor instance.
 * @param {object} actorData            The actor data object to update.
 * @param {object} [migrationData]      Additional data to perform the migration.
 * @param {object} [flags={}]           Track the needs migration flag.
 * @param {object} [options]
 * @param {string} [options.actorUuid]  The UUID of the actor.
 * @returns {object}                    The updateData to apply.
 */
export function migrateActorData(actor, actorData, migrationData, flags={}, { actorUuid }={}) {
  const updateData = {};

  // Migrate embedded effects
  if ( actorData.effects ) {
    const effects = migrateEffects(actorData, migrationData);

    if ( effects.length > 0 ) updateData.effects = effects;
  }

  // Migrate Owned Items
  if ( !actorData.items ) return updateData;
  const items = actor.items.reduce((arr, i) => {
    // Migrate the Owned Item
    const itemData = i instanceof CONFIG.Item.documentClass ? i.toObject() : i;
    const itemFlags = { bypassVersionCheck: flags.bypassVersionCheck ?? false, persistSourceMigration: false };
    let itemUpdate = migrateItemData(i, itemData, migrationData, itemFlags);

    // Update the Owned Item
    if ( itemFlags.persistSourceMigration ) flags.persistSourceMigration = true;
    arr.push({ itemData, itemUpdate });

    return arr;
  }, []).map(({ itemData, itemUpdate }) => {
    if ( flags.persistSourceMigration ) {
      if ( "effects" in itemUpdate ) itemUpdate.effects = itemData.effects.map(effect => foundry.utils.mergeObject(
        effect, itemUpdate.effects.find(e => e._id === effect._id) ?? {}, { inplace: false, performDeletions: true }
      ));

      itemUpdate = foundry.utils.mergeObject(itemData, itemUpdate, { inplace: false, performDeletions: true });
    }

    return foundry.utils.isEmpty(itemUpdate) ? null : { ...itemUpdate, _id: itemData._id };
  }).filter(_ => _);

  if ( items.length > 0 ) updateData.items = items;

  return updateData;
}

/* -------------------------------------------- */

/**
 * Migrate a single Item document to incorporate latest data model changes
 *
 * @param {Item5e} item             Full item instance.
 * @param {object} itemData         Item data to migrate.
 * @param {object} [migrationData]  Additional data to perform the migration.
 * @param {object} [flags={}]       Track the needs migration flag.
 * @returns {object}                The updateData to apply.
 */
export function migrateItemData(item, itemData, migrationData, flags={}) {
  const updateData = {};

  // Migrate embedded effects
  if ( itemData.effects ) {
    const effects = migrateEffects(itemData, migrationData, updateData, flags);

    if ( effects.length > 0 ) updateData.effects = effects;
  }

  // Migrate properties
  const migratedProperties = foundry.utils.getProperty(itemData, "flags.me5e.migratedProperties");
  if ( migratedProperties?.length ) {
    flags.persistSourceMigration = true;
    const properties = new Set(foundry.utils.getProperty(itemData, "system.properties") ?? [])
      .union(new Set(migratedProperties));
    updateData["system.properties"] = Array.from(properties);
    updateData["flags.me5e.-=migratedProperties"] = null;
  }

  if ( foundry.utils.getProperty(itemData, "flags.me5e.persistSourceMigration") ) {
    flags.persistSourceMigration = true;
    updateData["flags.me5e.-=persistSourceMigration"] = null;
  }

  return updateData;
}

/* -------------------------------------------- */

/**
 * Migrate any active effects attached to the provided parent.
 * @param {object} parent            Data of the parent being migrated.
 * @param {object} [migrationData]   Additional data to perform the migration.
 * @param {object} [itemUpdateData]  Update data for the item to apply changes back to item.
 * @param {object} [flags={}]        Track the needs migration flag.
 * @returns {object[]}               Updates to apply on the embedded effects.
 */
export function migrateEffects(parent, migrationData, itemUpdateData, flags={}) {
  if ( !parent.effects ) return [];
  return parent.effects.reduce((arr, e) => {
    const effectData = e instanceof CONFIG.ActiveEffect.documentClass ? e.toObject() : e;

    // Migrate Data
    let effectUpdate = migrateEffectData(effectData, migrationData, { parent });

    // No other current migrations

    if ( !foundry.utils.isEmpty(effectUpdate) ) {
      effectUpdate._id = effectData._id;
      arr.push(foundry.utils.expandObject(effectUpdate));
    }

    return arr;
  }, []);
}

/* -------------------------------------------- */

/**
 * Migrate the provided active effect data.
 * @param {object} effect            Effect data to migrate.
 * @param {object} [migrationData]   Additional data to perform the migration.
 * @param {object} [options]         Additional options.
 * @param {object} [options.parent]  Parent of this effect.
 * @returns {object}                 The updateData to apply.
 */
export const migrateEffectData = function(effect, migrationData, { parent }={}) {
  const updateData = {};

  // Nothing Yet

  return updateData;
};

/* -------------------------------------------- */

/**
 * Migrate a single Macro document to incorporate latest data model changes.
 * @param {object} macro            Macro data to migrate
 * @param {object} [migrationData]  Additional data to perform the migration
 * @returns {object}                The updateData to apply
 */
export const migrateMacroData = function(macro, migrationData) {
  const updateData = {};

  // Nothing Yet

  return updateData;
};

/* -------------------------------------------- */

/**
 * Migrate a single RollTable document to incorporate the latest data model changes.
 * @param {object} table            Roll table data to migrate.
 * @param {object} [migrationData]  Additional data to perform the migration.
 * @returns {object}                The update delta to apply.
 */
export function migrateRollTableData(table, migrationData) {
  const updateData = {};

  // Nothing Yet

  if ( !table.results?.length ) return updateData;

  const results = table.results.reduce((arr, result) => {
    const resultUpdate = {};

    // Nothing Yet

    if ( !foundry.utils.isEmpty(resultUpdate) ) {
      resultUpdate._id = result._id;
      arr.push(foundry.utils.expandObject(resultUpdate));
    }

    return arr;
  }, []);

  if ( results.length ) updateData.results = results;
  return updateData;
}

/* -------------------------------------------- */

/**
 * Migrate a single Scene document to incorporate changes to the data model of its actor data overrides
 * Return an Object of updateData to be applied
 * @param {object} scene            The Scene data to Update
 * @param {object} [migrationData]  Additional data to perform the migration
 * @returns {object}                The updateData to apply
 */
export const migrateSceneData = function(scene, migrationData) {
  const tokens = scene.tokens.reduce((arr, token) => {
    const t = token instanceof foundry.abstract.DataModel ? token.toObject() : token;
    const update = {};

    // Nothing Yet

    if ( !game.actors.has(t.actorId) ) update.actorId = null;
    if ( !foundry.utils.isEmpty(update) ) arr.push({ ...update, _id: t._id });
    return arr;
  }, []);

  if ( tokens.length ) return { tokens };
  return {};
};

/* -------------------------------------------- */


/**
 * Fetch bundled data for large-scale migrations.
 *
 * @returns {Promise<object>}  Object containing large scale migraiton data
 */
export async function getMigrationData() {
  const data = {};
  try {
    // Nothing yet
  } catch(err) {
    console.warn(`Failed to retrieve icon migration data: ${err.message}`);
  }
  return data;
}

/* -------------------------------------------- */
/*  Low level migration utilities
/* -------------------------------------------- */

/**
 * A general tool to purge flags from all documents in a Compendium pack.
 * @param {CompendiumCollection} pack   The compendium pack to clean.
 * @private
 */
export async function purgeFlags(pack) {
  const cleanFlags = flags => {
    const flags5e = flags.me5e || null;
    return flags5e ? {me5e: flags5e} : {};
  };
  await pack.configure({locked: false});
  const content = await pack.getDocuments();
  for ( let doc of content ) {
    const update = {flags: cleanFlags(doc.flags)};
    if ( pack.documentName === "Actor" ) {
      update.items = doc.items.map(i => {
        i.flags = cleanFlags(i.flags);
        return i;
      });
    }
    await doc.update(update, {recursive: false});
    log(`Purged flags from ${doc.name}`);
  }
  await pack.configure({locked: true});
}
