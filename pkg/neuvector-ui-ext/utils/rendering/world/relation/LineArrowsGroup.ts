import { Euler, InstancedMesh, Matrix4, MeshBasicMaterial, Quaternion, Shape, ShapeGeometry, Vector3 } from "three";

import { hypot } from "~/tools/trigonometry";

import { DependencyDirection } from "../../../../generated/CoreApiDtos";
import { StackVizConfig } from "../../StackVizConfig";

import type { AbstractRelation3D } from "./AbstractRelation3D";

const edge = hypot(0.1, 0.1);
const centerY = hypot(edge, edge);
const coneShape = new Shape();
coneShape.moveTo(0, 0);
coneShape.lineTo(-0.5, -0.7);
coneShape.lineTo(-0.4, -0.8);
coneShape.lineTo(0, -centerY);
coneShape.lineTo(0.4, -0.8);
coneShape.lineTo(0.5, -0.7);
coneShape.lineTo(0, 0);
export const CONE_GEOMETRY = new ShapeGeometry(coneShape);

CONE_GEOMETRY.scale(StackVizConfig.RELATION_CONE_HEADWIDTH, StackVizConfig.RELATION_CONE_HEADLENGTH, 1);

export const DIRECTION = new Vector3(0, 1, 0); // normalised direction vector of Line Arrow in the 2d space
export const PERPENDICULAR_TO_DIRECTION = new Vector3(1, 0, 0); // normalised perpendicular to the direction vector of Line Arrow in the 2d space

export class LineArrowsGroup {
  // InstancedMesh cannot share it's material
  private readonly material: MeshBasicMaterial;
  public mesh: InstancedMesh;

  constructor(relations: Array<AbstractRelation3D>) {
    this.material = new MeshBasicMaterial();
    // relation can have 2 arrows
    this.mesh = new InstancedMesh(CONE_GEOMETRY, this.material, relations.length * 2);
    let index = 0;
    relations.forEach((relation) => {
      const mapIndices = [];
      const direction = relation.relationDirection();
      const color = relation.getColor();
      if (direction === DependencyDirection.OneWay || direction === DependencyDirection.Both) {
        // target
        const matrix = prepareMatrix(relation.targetPosition, relation.targetDirection);
        this.mesh.setMatrixAt(index, matrix);
        this.mesh.setColorAt(index, color);
        mapIndices.push(index);
        index++;
      }
      if (direction === DependencyDirection.Both) {
        // source
        const matrix = prepareMatrix(relation.sourcePosition, relation.sourceDirection);
        this.mesh.setMatrixAt(index, matrix);
        this.mesh.setColorAt(index, color);
        mapIndices.push(index);
        index++;
      }
    });
  }

  public destroy(): void {
    this.mesh.dispose();
    this.material.dispose();
  }
}

const SCALE = new Vector3(1, 1, 1);
const DUMMY_EULER = new Euler();
const getRotation = (direction: Vector3): Euler => {
  const angle = direction.angleTo(DIRECTION);

  const sign = direction.dot(PERPENDICULAR_TO_DIRECTION) >= 0 ? -1 : 1;
  DUMMY_EULER.set(0, 0, sign * angle);
  return DUMMY_EULER;
};

const DUMMY_MATRIX = new Matrix4();
const DUMMY_QUATERNION = new Quaternion();

const prepareMatrix = (position: Vector3, direction: Vector3): Matrix4 => {
  const rotation = getRotation(direction);
  DUMMY_QUATERNION.setFromEuler(rotation);
  DUMMY_MATRIX.compose(position, DUMMY_QUATERNION, SCALE);
  return DUMMY_MATRIX;
};
