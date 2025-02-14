import { Object3D } from "three";

export class DestroyableObject3D extends Object3D {
  constructor() {
    super();
    this.addEventListener("removed", this.destroy);
  }

  public destroy(): void {
    removeChildren(this);
    this.removeEventListener("removed", this.destroy);
  }
}

/**
 * The proper way to remove all children from THREE.js Object3D instance
 */
export const removeChildren = (object3D: Object3D): void => {
  object3D.remove(...object3D.children);
};
