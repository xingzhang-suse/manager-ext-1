import { CircleGeometry } from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";

import { StackVizConfig } from "../../StackVizConfig";
import { setGeometryColorAttribute } from "../../utils/Util3d";

/**
 * Geometry consists of 3 hexagons lying on top of each other
 */
const outerGeometry = new CircleGeometry(1, 32);
setGeometryColorAttribute(outerGeometry, 2);

const middleGeometry = outerGeometry
  .clone()
  .scale(StackVizConfig.GROUP_MIDDLE_SCALE, StackVizConfig.GROUP_MIDDLE_SCALE, 1)
  .translate(0, 0, 0.01);
setGeometryColorAttribute(middleGeometry, 1);

const innerGeometry = outerGeometry
  .clone()
  .scale(StackVizConfig.GROUP_INNER_SCALE, StackVizConfig.GROUP_INNER_SCALE, 1)
  .translate(0, 0, 0.02);
setGeometryColorAttribute(innerGeometry, 0);

export const GROUP_GEOMETRY = BufferGeometryUtils.mergeGeometries([innerGeometry, middleGeometry], false);

innerGeometry.dispose();
middleGeometry.dispose();
outerGeometry.dispose();
