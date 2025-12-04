import _ActorDataModel from "./abstract/actor-data-model.mjs";
import _ItemDataModel from "./abstract/item-data-model.mjs";
import _SparseDataModel from "./abstract/sparse-data-model.mjs";
import _SystemDataModel from "./abstract/system-data-model.mjs";

export default class SystemDataModel extends _SystemDataModel {
  constructor(...args) {
    foundry.utils.logCompatibilityWarning(
      "`me5e.dataModels.SystemDataModel has been moved to `me5e.dataModels.abstract.SystemDataModel",
      { since: "ME5e 5.1", until: "ME5e 6.0", once: true }
    );
    super(...args);
  }
}

export class ActorDataModel extends _ActorDataModel {
  constructor(...args) {
    foundry.utils.logCompatibilityWarning(
      "`me5e.dataModels.ActorDataModel has been moved to `me5e.dataModels.abstract.ActorDataModel",
      { since: "ME5e 5.1", until: "ME5e 6.0", once: true }
    );
    super(...args);
  }
}

export class ItemDataModel extends _ItemDataModel {
  constructor(...args) {
    foundry.utils.logCompatibilityWarning(
      "`me5e.dataModels.ItemDataModel has been moved to `me5e.dataModels.abstract.ItemDataModel",
      { since: "ME5e 5.1", until: "ME5e 6.0", once: true }
    );
    super(...args);
  }
}

export class SparseDataModel extends _SparseDataModel {
  constructor(...args) {
    foundry.utils.logCompatibilityWarning(
      "`me5e.dataModels.SparseDataModel has been moved to `me5e.dataModels.abstract.SparseDataModel",
      { since: "ME5e 5.1", until: "ME5e 6.0", once: true }
    );
    super(...args);
  }
}
