import {
  CircleGeometry,
  Color,
  DynamicDrawUsage,
  Group,
  InstancedMesh,
  Matrix4,
  MeshBasicMaterial,
  type Vector3,
} from "three";

import { floor } from "~/tools/floor";
import { max } from "~/tools/max";

import { StackVizConfig } from "../../StackVizConfig";
import type { StackVizContext } from "../../StackVizContext";

import type { AbstractRelation3D } from "./AbstractRelation3D";

/**
 * Hover over relation is causing those moving points to appear
 * basically, it's a set of equi-spaced points on the relation,
 * and they're moving towards relation's direction
 *
 * This class responsible to render all of those points over all relations at once
 */
export class MovingPoints3D {
  private readonly stackVizContext: StackVizContext;

  // 3d related elements
  private readonly mesh = new Group();
  private points: InstancedMesh | undefined;
  private material: MeshBasicMaterial | undefined;

  // state, is used internally for rendering
  private pointsOnRelationMap: Array<{ relation: AbstractRelation3D; positions: Array<number> }> = [];
  private elapsedTime = 0; // elapsed time since hover started

  constructor(stackVizContext: StackVizContext) {
    // setup
    this.stackVizContext = stackVizContext;

    // render/add to the scene
    this.render();
  }

  public destroy(): void {
    this.clearActive();
    this.mesh.clear();
  }

  /**
   * Just adding a dummy mesh to the scene
   * this mesh is a basis for all points
   */
  private render(): void {
    this.mesh.position.setZ(StackVizConfig.RELATION_MOVING_POINTS_Z_INDEX); // above the relations but under the components
    this.stackVizContext.world.getThreeScene().add(this.mesh);
  }

  // clear everything but don't delete the main mesh from the scene
  private clearActive() {
    if (this.points) {
      this.elapsedTime = 0;
      this.pointsOnRelationMap = [];
      this.mesh.remove(this.points);
      this.points.dispose();
      this.material?.dispose();
    }
  }

  /**
   * Adding a lot of points is quite a heavy operation for threejs, but gladly we have InstancedMesh to overcome it
   * based on the input parameters - relations,
   * clear all previously rendered elements and build points from the scratch on top of those relations
   */
  public activate(relations: Array<AbstractRelation3D>): void {
    this.clearActive();
    //don't tempt fate
    if (relations.length >= StackVizConfig.RELATION_MOVING_POINTS_LIMIT) {
      return;
    }

    let totalCount = 0; // we need this value to initialise the InstancedMesh, it tells to threejs how many points are going to be rendered overall
    // first calculate how many points are going to be rendered for single relation
    // then get their equi-spaced interpolated positions over relation and store in the map for future needs
    relations.forEach((relation) => {
      const interpolatedPositions = [];
      const curve = relation.getCurve();
      const curveLength = curve.getLength();
      // in case if RELATION_MOVING_POINTS_STEP_BETWEEN is more than curveLength, take at least 1 point
      const count = max(1, floor(curveLength / StackVizConfig.RELATION_MOVING_POINTS_STEP_BETWEEN, 0));
      for (let i = 0; i <= count; i++) {
        interpolatedPositions.push(i / count); // equi-spaced interpolated positions on the relation
      }
      totalCount += interpolatedPositions.length;
      this.pointsOnRelationMap.push({
        relation,
        positions: interpolatedPositions,
      });
    });

    this.material = new MeshBasicMaterial();
    this.points = new InstancedMesh(geometry, this.material, totalCount);
    this.points.instanceMatrix.setUsage(DynamicDrawUsage);

    // relation by relation, point byt point, add all points to the InstancedMesh
    for (let pointIndex = 0, index = 0; index < this.pointsOnRelationMap.length; index++) {
      const { relation, positions } = this.pointsOnRelationMap[index];

      for (let positionIndex = 0; positionIndex < positions.length; positionIndex++, pointIndex++) {
        const position = relation.getCurve().getPointAt(positions[positionIndex]);
        const matrix = prepareMatrix(position);
        this.points.setMatrixAt(pointIndex, matrix);

        const color = getMovingPointsColor();
        this.points.setColorAt(pointIndex, color); // color the points
      }
    }

    this.mesh.add(this.points);
  }

  public update(): void {
    // if points are defined - move them!
    if (this.points) {
      // technically it's not a time, just a counter for updates, let's keep them as integer to avoid the floating surprises
      // should be reset after each hover action
      this.elapsedTime++;

      const distancePassed = StackVizConfig.RELATION_MOVING_POINTS_SPEED * this.elapsedTime;

      for (let pointIndex = 0, index = 0; index < this.pointsOnRelationMap.length; index++) {
        const { relation, positions } = this.pointsOnRelationMap[index];
        const curve = relation.getCurve();
        const curveLength = curve.getLength();
        // interpolated, but in the range [0, +Infinity]
        const distancePassedInterpolated = distancePassed / curveLength;

        for (let positionIndex = 0; positionIndex < positions.length; positionIndex++, pointIndex++) {
          // get the new position on the relation in the range [0, 1]
          const newInterpolatedPosition = (positions[positionIndex] + distancePassedInterpolated) % 1;
          const position = curve.getPointAt(newInterpolatedPosition);
          const matrix = prepareMatrix(position);
          this.points.setMatrixAt(pointIndex, matrix);
        }
      }
      this.points.instanceMatrix.needsUpdate = true;
    }
  }
}

const geometry = new CircleGeometry(1, 24);

const dummyMatrix = new Matrix4();

const prepareMatrix = (position: Vector3): Matrix4 => {
  dummyMatrix.makeScale(StackVizConfig.RELATION_MOVING_POINTS_SCALE, StackVizConfig.RELATION_MOVING_POINTS_SCALE, 1);
  dummyMatrix.setPosition(position);
  return dummyMatrix;
};

const getMovingPointsColor = (): Color => {
  return new Color(StackVizConfig.RELATION_MOVING_POINTS_COLOR_UNKNOWN);
};
