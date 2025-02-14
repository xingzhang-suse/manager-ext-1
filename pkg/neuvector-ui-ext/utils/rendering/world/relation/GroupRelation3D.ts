import first from "lodash/first";
import last from "lodash/last";
import {
  BufferGeometry,
  CatmullRomCurve3,
  type Color,
  Line,
  type LineBasicMaterial,
  LineCurve3,
  type LineDashedMaterial,
  Vector3,
} from "three";

import { PI } from "~/tools/trigonometry";

import type { GroupRelation } from "../../../../common/CoreApi";
import { getLineBasicMaterial, getLineDashedMaterial } from "../../common/BasicMaterials";
import { LOD_LEVEL_HIGH, type LodLevel } from "../../LodLevel";
import { StackVizConfig } from "../../StackVizConfig";

import { AbstractRelation3D } from "./AbstractRelation3D";

const AXIS_Z = new Vector3(0, 0, 1);
const RIGHT_ANGLE = PI / 2;
const WIDTH_DELTA = 0.15; // the distance between the middle of the double line to the line

export class GroupRelation3D extends AbstractRelation3D {
  protected solidLine: Line;
  protected dashedLine: Line;

  constructor(
    relation: GroupRelation,
    sourcePosition: Vector3,
    targetPosition: Vector3,
    routingPoints?: Array<Vector3>,
  ) {
    super(relation, sourcePosition, targetPosition, routingPoints);
  }

  protected renderLine(): void {
    this.sourceDirection.subVectors(this.sourcePosition, first(this.routingPoints) || this.targetPosition).normalize();
    this.targetDirection.subVectors(this.targetPosition, last(this.routingPoints) || this.sourcePosition).normalize();

    const startPoint = new Vector3().subVectors(
      this.sourcePosition,
      this.sourceDirection.clone().multiplyScalar(StackVizConfig.RELATION_OFFSET_FROM_ELEMENT),
    );
    const endPoint = new Vector3().subVectors(
      this.targetPosition,
      this.targetDirection.clone().multiplyScalar(StackVizConfig.RELATION_OFFSET_FROM_ELEMENT),
    );

    const solidLineMaterial = getLineBasicMaterial(StackVizConfig.GROUP_RELATION_COLOR, this.getColorScale());
    const dashedLineMaterial = getLineDashedMaterial(
      StackVizConfig.GROUP_RELATION_COLOR,
      this.getColorScale(),
      0.4,
      0.4,
    );
    if (this.isSpline) {
      // for curve line - build points for a `guide line`  from the source to the target
      // out of this set of points - make 2 sets of points where
      // the each point is adjusted on WIDTH_DELTA from `guide line`'s points
      // display 2 lines from those sets of points
      const vertices = [startPoint, ...this.routingPoints, endPoint];
      const spline = new CatmullRomCurve3(vertices);
      this.curve = spline;
      spline.getPointAt(StackVizConfig.RELATION_CIRCLE_LINE_LOCATION, this.circleLocation);
      const newPoints = spline.getPoints(vertices.length * StackVizConfig.SPLINES_PRECISION_FACTOR);

      const dashedLinePoints: Array<Vector3> = [];
      const length = newPoints.length;
      const direction = new Vector3();
      let i = 0;
      while (i < length) {
        const firstPoint = newPoints[i];
        const secondPoint = newPoints[i + 1];
        if (secondPoint) {
          direction.subVectors(secondPoint, firstPoint).normalize();
        }
        const indent = direction.clone().multiplyScalar(WIDTH_DELTA).applyAxisAngle(AXIS_Z, RIGHT_ANGLE);
        dashedLinePoints.push(firstPoint.clone().add(indent));
        firstPoint.sub(indent);
        i++;
      }

      const lineGeometry = new BufferGeometry().setFromPoints(newPoints);
      this.solidLine = new Line(lineGeometry, solidLineMaterial);
      const otherGeometry = new BufferGeometry().setFromPoints(dashedLinePoints);
      this.dashedLine = new Line(otherGeometry, dashedLineMaterial);
    } else {
      // for straight line
      // build points for a `guide line`  from the source to the target
      // make 2 lines of those points and adjust on WIDTH_DELTA from `guide line`
      // the main reason to keep this implementation is to create less geometries for each relation
      const lineGeometry = new BufferGeometry().setFromPoints([startPoint, endPoint]);

      const indent = this.sourceDirection.clone().multiplyScalar(WIDTH_DELTA).applyAxisAngle(AXIS_Z, RIGHT_ANGLE);
      this.solidLine = new Line(lineGeometry, solidLineMaterial);
      this.solidLine.position.add(indent);

      this.dashedLine = new Line(lineGeometry, dashedLineMaterial);
      this.dashedLine.position.sub(indent);
      this.curve = new LineCurve3(startPoint, endPoint);
      this.circleLocation = new Vector3().lerpVectors(
        startPoint,
        endPoint,
        StackVizConfig.RELATION_CIRCLE_LINE_LOCATION,
      );
    }
    this.add(this.solidLine);
    this.add(this.dashedLine);
    this.dashedLine.computeLineDistances();
  }

  public getColor(): Color {
    return (this.solidLine.material as LineBasicMaterial).color;
  }

  protected disposeLine(): void {
    this.remove(this.solidLine);
    this.remove(this.dashedLine);
    this.dashedLine.geometry.dispose();
    this.solidLine.geometry.dispose();
  }

  protected lineMaterial(colorScale: number): LineDashedMaterial | LineBasicMaterial {
    return getLineBasicMaterial(StackVizConfig.GROUP_RELATION_COLOR, colorScale);
  }

  // hide dashed line when the camera is far away
  // the move of the solid line is not required cuz it's almost not distinguishable on the screen
  public lodUpdate(lod: LodLevel): void {
    this.dashedLine.visible = lod === LOD_LEVEL_HIGH;
  }
}
