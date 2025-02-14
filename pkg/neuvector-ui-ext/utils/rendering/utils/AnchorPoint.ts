import { Vector3 } from "three";

import type { ComponentModel } from "../model/ComponentModel";
import { GroupModel } from "../model/GroupModel";

export function getClosestTargetAnchorPoint(
  sourcePos: Vector3,
  target: ComponentModel | GroupModel,
  isSpotlightedComponent: boolean,
): Vector3 {
  const targetPosition = target.position;
  if (target instanceof GroupModel) {
    const targetPoint = new Vector3().subVectors(targetPosition, sourcePos); // calculate vector between target and source
    targetPoint.setLength(targetPoint.length() - target.getGroupScale().x); // reduce the length of this vector on the group's radius
    return targetPoint.add(sourcePos); // add it back to point from the source position to get the final target position
  }
  const anchorPoints = target.getAnchorPoints(isSpotlightedComponent);
  let resultPointPosition = targetPosition.clone().add(anchorPoints[0]);
  let smallestDistance = resultPointPosition.distanceTo(sourcePos);

  for (let i = 1; i < anchorPoints.length; i++) {
    const point = anchorPoints[i];
    const pointPosition = targetPosition.clone().add(point);
    const pos = pointPosition.distanceTo(sourcePos);
    if (pos < smallestDistance) {
      smallestDistance = pos;
      resultPointPosition = pointPosition;
    }
  }
  return resultPointPosition;
}
