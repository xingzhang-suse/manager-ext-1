import first from "lodash/first";
import last from "lodash/last";
import {
  BufferGeometry,
  CatmullRomCurve3,
  type Color,
  type Curve,
  Line,
  type LineBasicMaterial,
  LineCurve3,
  type LineDashedMaterial,
  type Mesh,
  Vector3,
} from "three";

import {
  type DependencyDirection,
  type GroupRelation,
  HealthStateValue,
  type IndirectRelation,
  type NodeId,
  ViewElementRetrievalSource,
  type ViewRelation,
  isViewRelation,
} from "../../../../common/CoreApi";
import { healthStateToColorForRelationsForViz } from "../../../../common/functions";
import { DestroyableObject3D } from "../../common/DestroyableObject3D";
import type { LodLevel } from "../../LodLevel";
import { ComponentModel } from "../../model/ComponentModel";
import { GroupModel } from "../../model/GroupModel";
import type { HasNode } from "../../stackVizCommon";
import { StackVizConfig } from "../../StackVizConfig";
import type { InteractionObject } from "../InteractionMesh";

import { createDartboard3D } from "./Dartboard3D";

export abstract class AbstractRelation3D
  extends DestroyableObject3D
  implements HasNode<IndirectRelation | GroupRelation | ViewRelation>
{
  // the dartboard is going to be added lazily, so don't use this field directly
  private _dartboard: Mesh | undefined;
  protected line: Line;
  protected curve: Curve<Vector3>;
  protected relation: IndirectRelation | GroupRelation | ViewRelation;

  public routingPoints: Array<Vector3>;

  public sourcePosition: Vector3;
  public sourceDirection = new Vector3(); // the direction of the line towards the source

  public targetPosition: Vector3;
  public targetDirection = new Vector3(); // the direction of the line towards the target

  public circleLocation = new Vector3(); // location for the dartboard

  public isSpline: boolean;

  public peers: Array<InteractionObject> = [];

  constructor(
    relation: IndirectRelation | GroupRelation | ViewRelation,
    sourcePosition: Vector3,
    targetPosition: Vector3,
    routingPoints?: Array<Vector3>,
  ) {
    super();
    this.relation = relation;
    this.routingPoints = routingPoints || [];
    this.sourcePosition = sourcePosition;
    this.targetPosition = targetPosition;

    this.isSpline = StackVizConfig.USE_SPLINES && this.routingPoints.length > 0;
  }

  public getColor(): Color {
    return (this.line.material as LineBasicMaterial).color;
  }

  protected getColorScale(): number {
    // Scaling of color is adapted when a relation is part of a big unfocussed relation group, to improve visibility in the graph
    for (const peer of this.peers) {
      // We might predicate this on relation count. Right we keep it consistent and do all relations from extended components.
      if (
        peer instanceof ComponentModel &&
        peer.component.retrievalSource == ViewElementRetrievalSource.VisualizerSettings
      ) {
        return StackVizConfig.EXTENDED_RELATION_COLOR_FACTOR;
      }

      // We might predicate this on relation count. Right we keep it consistent and do all relations from extended components.
      if (
        peer instanceof GroupModel &&
        peer.group.classifier.retrievalSource == ViewElementRetrievalSource.VisualizerSettings
      ) {
        return StackVizConfig.EXTENDED_RELATION_COLOR_FACTOR;
      }
    }

    return 1.0;
  }

  public create(): void {
    this.renderLine();

    if (this.getHealthState() !== HealthStateValue.Unknown) {
      this.addDartboard();
    }
  }

  protected disposeLine(): void {
    this.remove(this.line);
    this.line.geometry.dispose();
  }

  destroy(): void {
    super.destroy();
    this.peers = [];
    this.disposeLine();
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

    const geometry = new BufferGeometry();
    if (this.isSpline) {
      const vertices = [startPoint, ...this.routingPoints, endPoint];
      const curve = new CatmullRomCurve3(vertices);
      this.curve = curve;
      const points = curve.getPoints(vertices.length * StackVizConfig.SPLINES_PRECISION_FACTOR);
      curve.getPointAt(StackVizConfig.RELATION_CIRCLE_LINE_LOCATION, this.circleLocation);
      geometry.setFromPoints(points);
    } else {
      this.curve = new LineCurve3(startPoint, endPoint);
      this.circleLocation = new Vector3().lerpVectors(
        startPoint,
        endPoint,
        StackVizConfig.RELATION_CIRCLE_LINE_LOCATION,
      );
      geometry.setFromPoints([startPoint, endPoint]);
    }

    this.line = new Line(geometry, this.lineMaterial(this.getColorScale()));
    this.add(this.line);
  }

  protected abstract lineMaterial(colorScale: number): LineDashedMaterial | LineBasicMaterial;

  // ----- relation utility ----
  public source(): NodeId {
    return this.relation.source;
  }

  public target(): NodeId {
    return this.relation.target;
  }

  public relationDirection(): DependencyDirection {
    return this.relation.dependencyDirection;
  }

  public getNode(): IndirectRelation | GroupRelation | ViewRelation {
    return this.relation;
  }

  get nodeId(): NodeId | undefined {
    return this.relation.id;
  }

  protected getHealthState(): HealthStateValue {
    if (isViewRelation(this.relation)) {
      return this.relation.state?.healthState ?? HealthStateValue.Uninitialized;
    }
    return HealthStateValue.Unknown;
  }

  // ------- dartboard ------
  protected updateDartboardPosition(position: Vector3): void {
    this.dartboard.position.copy(position).setZ(1);
  }

  public hideDartboard(): void {
    if (this.getHealthState() === HealthStateValue.Unknown) {
      this.dartboard.visible = false;
    }
  }

  public showDartboard(): void {
    this.dartboard.visible = true;
  }

  private addDartboard(): void {
    this._dartboard = createDartboard3D(healthStateToColorForRelationsForViz(this.getHealthState()));
    this.updateDartboardPosition(this.circleLocation);
    // place dartboard on top of moving points
    this._dartboard.position.setZ(StackVizConfig.RELATION_MOVING_POINTS_Z_INDEX + 0.01);
    this.hideDartboard();
    this.add(this.dartboard);
  }

  // lazy add Dartboard
  private get dartboard(): Mesh {
    if (!this._dartboard) {
      this.addDartboard();
    }
    return this._dartboard!;
  }

  public getCurve(): Curve<Vector3> {
    return this.curve;
  }

  public abstract lodUpdate(lod: LodLevel): void;
}
