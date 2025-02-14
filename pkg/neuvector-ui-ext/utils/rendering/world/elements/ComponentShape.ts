import { ShapeGeometry } from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";

import { roundedSquareShape } from "../../shapes/Shapes";
import { StackVizConfig } from "../../StackVizConfig";
import { setGeometryColorAttribute } from "../../utils/Util3d";

/**
 * Geometry consists of 3 rounded squares lying on top of each other
 */

const SEGMENTS = 4;
const RADIUS = 0.4;

const outerShape = roundedSquareShape(StackVizConfig.COMPONENT_WIDTH, RADIUS, SEGMENTS);
const outerGeometry = new ShapeGeometry(outerShape);
// vertex colorId = 2 for outer color
setGeometryColorAttribute(outerGeometry, 2);

const middleGeometry = outerGeometry
  .clone()
  .scale(StackVizConfig.COMPONENT_MIDDLE_SCALE, StackVizConfig.COMPONENT_MIDDLE_SCALE, 1)
  .translate(0, 0, 0.01);
// vertex colorId = 1 for middle color
setGeometryColorAttribute(middleGeometry, 1);

const innerGeometry = outerGeometry
  .clone()
  .scale(StackVizConfig.COMPONENT_INNER_SCALE, StackVizConfig.COMPONENT_INNER_SCALE, 1)
  .translate(0, 0, 0.02);
// vertex colorId = 0 for inner color
setGeometryColorAttribute(innerGeometry, 0);

export const COMPONENT_GEOMETRY = BufferGeometryUtils.mergeGeometries([innerGeometry, middleGeometry], false);

innerGeometry.dispose();
middleGeometry.dispose();
outerGeometry.dispose();
