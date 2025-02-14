import { BufferAttribute, type BufferGeometry, InstancedMesh, type Material, type Object3D } from "three";

export const setGeometryColorAttribute = (geometry: BufferGeometry, colorId: number): void => {
  const verticesCount = geometry.getAttribute("position").count;
  geometry.setAttribute("aColorId", new BufferAttribute(new Float32Array(verticesCount).fill(colorId), 1));
};

/**
 * traverse all descendants of object3D to release used resources
 * never release GEOMETRY - they are all reusable right now
 * in case for InstancedMesh it's important to dispose the Material
 * TODO check other places like sprites and so on
 * @param object3D
 */
export const cleanupResources = (object3D: Object3D): void => {
  object3D.traverse((child) => {
    if (child instanceof InstancedMesh) {
      (child.material as undefined | Material)?.dispose();
      child.dispose();
    }
  });
};
