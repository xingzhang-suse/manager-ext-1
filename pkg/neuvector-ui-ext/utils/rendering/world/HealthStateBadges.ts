import {
  CircleGeometry,
  Color,
  Group,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  MeshBasicMaterial,
  Quaternion,
  ShaderMaterial,
  Vector3,
} from "three";

import { HealthStateValue } from "../../../generated/CoreApiDtos";
import StackVizFragmentShader from "../common/shaders/StackVizFragmentShader.glsl?raw";
import StackVizColorVertexShader from "../common/shaders/StackVizInstanceVertexShader.glsl?raw";
import { StackVizConfig } from "../StackVizConfig";
import { Text3D } from "../text/Text3D";

export interface HealthStateBadgeMetaData {
  position: Vector3;
  state: HealthStateValue;
  label: string;
  zoomLevel?: number;
  hasOpacity?: boolean;
}

const BADGE_GEOMETRY = new CircleGeometry(1, 24);
const LABEL_VERTICAL_ALIGN = new Vector3(0, StackVizConfig.BADGE_LABEL_VERTICAL_ALIGN, 0); // vertically align numbers
const DEVIATING_COLOR = new Color(StackVizConfig.BADGE_DEVIATING_COLOR);
const CRITICAL_COLOR = new Color(StackVizConfig.BADGE_CRITICAL_COLOR);
const BADGE_SCALE = new Vector3(StackVizConfig.BADGE_SCALE, StackVizConfig.BADGE_SCALE, 1);
const BADGE_SCALE_BIG = new Vector3(StackVizConfig.BADGE_SCALE_BIG, StackVizConfig.BADGE_SCALE_BIG, 1);
const BADGE_BORDER_SCALE = new Vector3(StackVizConfig.BADGE_BORDER_SCALE, StackVizConfig.BADGE_BORDER_SCALE, 1);
const BADGE_BORDER_SCALE_BIG = new Vector3(
  StackVizConfig.BADGE_BORDER_SCALE_BIG,
  StackVizConfig.BADGE_BORDER_SCALE_BIG,
  1,
);

export const renderHealthStateBadges = (healthStateBadges: Array<HealthStateBadgeMetaData>): Group => {
  const result = new Group();
  const size = healthStateBadges.length;
  const badgeMaterial = new ShaderMaterial({
    vertexShader: StackVizColorVertexShader,
    fragmentShader: StackVizFragmentShader,
  });
  const badgeBorderMaterial = new MeshBasicMaterial({ color: 0xffffff });

  /** If you instantiate the geometry outside this function, it would result in the same geometry being shared among all instances,
   * which is not suitable because we want each instance to have its own position and attributes, so it should be cloned
   */
  const badges = new InstancedMesh(BADGE_GEOMETRY.clone(), badgeMaterial, size);
  const badgeBorders = new InstancedMesh(BADGE_GEOMETRY, badgeBorderMaterial, size);
  const badgeLabels = new Group();

  // set the custom per-instance attribute for color and brightness
  const badgeInstanceColors = new InstancedBufferAttribute(new Float32Array(size * 3), 3);
  badges.geometry.setAttribute("aColor", badgeInstanceColors);
  const brightnessColors = new InstancedBufferAttribute(new Float32Array(size * 3), 3);
  badges.geometry.setAttribute("aBrightness", brightnessColors);

  healthStateBadges.forEach(({ state, label, position, zoomLevel = 1, hasOpacity = false }, index) => {
    if (label === "") {
      // badge label can be empty due to failingChecks in Component are empty even though the state of the component is unhealthy
      // in this case don't render the badge at all to omit the confusion
      return;
    }
    // set the color based on the state property of each badge
    const color = state === HealthStateValue.Deviating ? DEVIATING_COLOR : CRITICAL_COLOR;
    badgeInstanceColors.setXYZ(index, color.r, color.g, color.b);
    // set the brightness based on the hasOpacity property of each badge
    brightnessColors.setX(index, hasOpacity ? StackVizConfig.COLOR_FADE : 1);

    const bigBadge = label === "9+";
    // change matrix
    const matrix = prepareMatrix(position, bigBadge ? BADGE_SCALE_BIG : BADGE_SCALE, zoomLevel);
    badges.setMatrixAt(index, matrix);

    const matrixForBorders = prepareMatrix(position, bigBadge ? BADGE_BORDER_SCALE_BIG : BADGE_BORDER_SCALE, zoomLevel);
    badgeBorders.setMatrixAt(index, matrixForBorders);

    // put labels here
    const badgeLabel = new Text3D(label, {
      givenHeight: StackVizConfig.BADGE_LABEL_HEIGHT * zoomLevel,
      maxWidthScale: StackVizConfig.BADGE_LABEL_WIDTH * zoomLevel,
      maxTextLines: 1,
      centered: true,
      color: 0xffffff,
    });
    badgeLabel.position.copy(position).add(LABEL_VERTICAL_ALIGN);
    badgeLabels.add(badgeLabel);
  });
  badges.position.setZ(0.01);
  badgeLabels.position.setZ(0.02);
  return result.add(badges, badgeBorders, badgeLabels);
};

const DUMMY_MATRIX = new Matrix4();
const DUMMY_QUATERNION = new Quaternion();

const prepareMatrix = (position: Vector3, scale: Vector3, zoomLevel: number): Matrix4 => {
  DUMMY_MATRIX.compose(position, DUMMY_QUATERNION, scale);
  DUMMY_MATRIX.scale(new Vector3(zoomLevel, zoomLevel, 1));
  return DUMMY_MATRIX;
};
