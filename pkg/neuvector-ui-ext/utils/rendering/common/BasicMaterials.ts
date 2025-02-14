import memoize from "lodash/memoize";
import { Color, LineBasicMaterial, LineDashedMaterial, MeshBasicMaterial } from "three";

/**
 * In application we use limited number of colors
 * This cache is intended to store MeshBasicMaterials different by color
 *
 * Materials stored in this cache should **NOT** be disposed by destroying Mesh where they were used
 */
export const getMeshBasicMaterial = memoize((color: number): MeshBasicMaterial => new MeshBasicMaterial({ color }));

export const getLineBasicMaterial = memoize(
  (color: number, colorScale: number): LineBasicMaterial =>
    new LineBasicMaterial({ color: new Color(color).multiplyScalar(colorScale) }),
  (color: number, colorScale: number) => `${color}-${colorScale}`,
);

export const getLineDashedMaterial = memoize(
  (color: number, colorScale: number, dashSize = 0.5, gapSize = 0.5): LineDashedMaterial => {
    return new LineDashedMaterial({
      color: new Color(color).multiplyScalar(colorScale),
      dashSize,
      gapSize,
    });
  },
  (color: number, colorScale: number, dashSize = 0.5, gapSize = 0.5) => `${color}-${colorScale}-${dashSize}-${gapSize}`,
);

/**
 * Clears in StackVizContext destroy event
 */
export const clearBasicMaterialCaches = (): void => {
  getMeshBasicMaterial.cache.clear?.();
  getLineBasicMaterial.cache.clear?.();
  getLineDashedMaterial.cache.clear?.();
};
