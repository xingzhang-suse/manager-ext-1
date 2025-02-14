import { ExtrudeGeometry, Group, Mesh, MeshBasicMaterial, Shape } from "three";

import { PI, cos, sin } from "~/tools/trigonometry";

import { StackVizConfig } from "../StackVizConfig";

/**
 *
 * @param size
 * @param borderRadius
 * @param segmentsCount - should be always more then 0
 */
export const roundedSquareShape = (size: number, borderRadius: number, segmentsCount: number): Shape => {
  return createRectangleShape(size, size, borderRadius, segmentsCount);
};

export const createRectangleShape = (width: number, height: number, borderRadius: number, segmentsCount = 4): Shape => {
  function roundCorner(
    shape: Shape,
    cx: number,
    cy: number,
    radius: number,
    startAngle: number,
    segmentsCount: number,
  ) {
    const sweepAngle = PI / (2 * segmentsCount);
    for (let i = 1; i <= segmentsCount; i++) {
      const px = cx + cos(startAngle + i * sweepAngle) * radius;
      const py = cy + sin(startAngle + i * sweepAngle) * radius;
      shape.lineTo(px, py);
    }
  }

  const shape = new Shape();
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  // THREEjs shapes should always be drawn counter-clockwise
  shape.moveTo(halfWidth, -halfHeight + borderRadius);

  shape.lineTo(halfWidth, halfHeight - borderRadius);
  roundCorner(shape, halfWidth - borderRadius, halfHeight - borderRadius, borderRadius, 0, segmentsCount);

  shape.lineTo(-halfWidth + borderRadius, halfHeight);
  roundCorner(shape, -halfWidth + borderRadius, halfHeight - borderRadius, borderRadius, PI / 2, segmentsCount);

  shape.lineTo(-halfWidth, halfHeight - borderRadius);
  roundCorner(shape, -halfWidth + borderRadius, -halfHeight + borderRadius, borderRadius, PI, segmentsCount);

  shape.lineTo(halfWidth - borderRadius, -halfHeight);
  roundCorner(shape, halfWidth - borderRadius, -halfHeight + borderRadius, borderRadius, -PI / 2, segmentsCount);

  return shape;
};

export const createRoundedRectangle = (
  width: number,
  height: number,
  borderRadius = 0.3,
  fillColor = StackVizConfig.GRID_COLOR_PRIMARY,
  hasBorder = true,
): Group => {
  const group = new Group();

  // Create the filling using the custom geometry and the material
  const shape = createRectangleShape(width, height, borderRadius);
  const roundedRectangleGeometry = new ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: false });
  const material = new MeshBasicMaterial({ color: fillColor });
  const fillingMesh = new Mesh(roundedRectangleGeometry, material);
  group.add(fillingMesh);

  if (hasBorder) {
    // Create a borderMesh using the same custom geometry, but with the border material
    const borderMaterial = new MeshBasicMaterial({ color: StackVizConfig.GRID_BORDER_COLOR });
    const borderMesh = new Mesh(roundedRectangleGeometry, borderMaterial);
    borderMesh.scale.set(1.01, 1.01, 1);
    borderMesh.position.z = -0.1;
    group.add(borderMesh);
  }

  return group;
};
