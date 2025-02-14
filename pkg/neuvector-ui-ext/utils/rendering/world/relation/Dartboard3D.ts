import { CircleGeometry, Mesh } from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";

import { getHealthStateMaterial } from "../../common/HealthStateMaterial";
import { StackVizConfig } from "../../StackVizConfig";
import { setGeometryColorAttribute } from "../../utils/Util3d";

const SEGMENTS = 18;

const innerGeometry = new CircleGeometry(StackVizConfig.RELATION_CIRCLE_INNER_RADIUS, SEGMENTS).translate(0, 0, 0);
// vertex colorId = 0 for inner color
setGeometryColorAttribute(innerGeometry, 0);

const middleGeometry = new CircleGeometry(StackVizConfig.RELATION_CIRCLE_BLANK_RADIUS, SEGMENTS).translate(0, 0, -0.01);
// vertex colorId = 1 for middle color
setGeometryColorAttribute(middleGeometry, 1);

const outerGeometry = new CircleGeometry(StackVizConfig.RELATION_CIRCLE_OUTER_RADIUS, SEGMENTS).translate(0, 0, -0.02);
// vertex colorId = 2 for outer color
setGeometryColorAttribute(outerGeometry, 2);

export const DARTBOARD_GEOMETRY = BufferGeometryUtils.mergeGeometries(
  [outerGeometry, middleGeometry, innerGeometry],
  false,
);

innerGeometry.dispose();
middleGeometry.dispose();
outerGeometry.dispose();

/**
 * When relation is hovered or selected this dartboard appears
 */

export const createDartboard3D = (healthStateColor: number): Mesh => {
  return new Mesh(DARTBOARD_GEOMETRY, getHealthStateMaterial({ healthStateColor }));
};
