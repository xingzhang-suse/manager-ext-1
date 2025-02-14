import isEqual from "lodash/isEqual";
import type { Vector3 } from "three";

import type { NodeId } from "../../../common/CoreApi";
import type { ComponentModel } from "../model/ComponentModel";
import type { GroupModel } from "../model/GroupModel";

/**
 * This places is used to store a sketchy snapshot of the visualiser
 * based on the component's and group's position on the scene
 *
 * used to distinguish whenever the new topology differs from the previous one
 */

let componentsMap = new Map<NodeId, Vector3>();
let groupsMap = new Map<NodeId, Vector3>();

/**
 * Check if graph is differs from the stored one and updates the stored one
 */
export const isGraphDifferFromStored = (
  components: Map<NodeId, ComponentModel>,
  groups: Map<NodeId, GroupModel>,
): boolean => {
  let result = true;
  const newComponentsDataMap = new Map<NodeId, Vector3>();
  const newGroupsDataMap = new Map<NodeId, Vector3>();
  components.forEach((component, nodeId) => {
    newComponentsDataMap.set(nodeId!, component.position);
  });

  groups.forEach((group, nodeId) => {
    newGroupsDataMap.set(nodeId!, group.position);
  });
  if (isEqual(componentsMap, newComponentsDataMap) && isEqual(groupsMap, newGroupsDataMap)) {
    result = false;
  }

  componentsMap = newComponentsDataMap;
  groupsMap = newGroupsDataMap;

  return result;
};
