import { Box3, Vector3 } from "three";

import type { Record } from "~/tools/record";

import type { HealthStateValue, NodeId, TypeGroup } from "../../../common/CoreApi";
import { StackVizConfig } from "../StackVizConfig";
import type { InteractionObject } from "../world/InteractionMesh";

export type GroupRenderScale = 1 | 1.25 | 1.5;

const GROUP_SIZE = new Vector3(StackVizConfig.GROUP_SIZE_RADIUS, StackVizConfig.GROUP_SIZE_RADIUS, 0);
const SIZE_MAP = {
  1: GROUP_SIZE.clone(),
  1.25: GROUP_SIZE.clone().multiplyScalar(1.25),
  1.5: GROUP_SIZE.clone().multiplyScalar(1.5),
} satisfies Record<GroupRenderScale>;

const CENTER = new Vector3();

/**
 * Transitive model of TypeGroup to handle and store some data before it is going to be actually rendered
 *
 * contains some shortcuts for TypeGroup data, also stores some information related to the rendering
 */
export class GroupModel {
  public position: Vector3 = new Vector3(); // position of TypeGroup in the World space
  public readonly group: TypeGroup;
  public readonly groupSizeScale: GroupRenderScale;
  public peers: Array<InteractionObject> = []; // peers to highlight

  constructor(group: TypeGroup) {
    this.group = group;
    this.groupSizeScale = renderScale(group.components.length);
  }

  public destroy(): void {
    this.peers = [];
  }

  public getNode(): TypeGroup {
    return this.group;
  }

  public getNodeId(): NodeId {
    return this.group.id!;
  }

  public getGroupSize(): number {
    return this.group.components.length;
  }

  public getHealthState(): HealthStateValue {
    return this.group.classifier.health;
  }

  public getComponentType(): NodeId {
    return this.group.classifier.componentType;
  }

  // ----- for rendering
  // -------------------
  public getGroupScale(): Vector3 {
    return SIZE_MAP[this.groupSizeScale];
  }
  // the bounding box to determine the sizes of TypeGroup in the World
  public getBoundingBox(): Box3 {
    return new Box3().setFromCenterAndSize(CENTER, this.getGroupScale().clone().multiplyScalar(2));
  }
}

const renderScale = (groupSize: number): GroupRenderScale => {
  if (groupSize > 150) return 1.5;
  if (groupSize > 100) return 1.25;
  return 1;
};
