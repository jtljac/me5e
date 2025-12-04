import {default as DifficultTerrainRegionBehaviorType} from "./difficult-terrain.mjs";
import {default as RotateAreaRegionBehaviorType} from "./rotate-area.mjs";

export {
  DifficultTerrainRegionBehaviorType,
  RotateAreaRegionBehaviorType
};

export const config = {
  "me5e.difficultTerrain": DifficultTerrainRegionBehaviorType,
  "me5e.rotateArea": RotateAreaRegionBehaviorType
};

export const icons = {
  "me5e.difficultTerrain": "fa-solid fa-hill-rockslide",
  "me5e.rotateArea": "fa-solid fa-arrows-spin"
};
