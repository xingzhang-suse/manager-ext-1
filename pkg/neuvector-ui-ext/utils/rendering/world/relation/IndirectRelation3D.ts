import type { LineBasicMaterial, LineDashedMaterial, Vector3 } from "three";

import type { IndirectRelation } from "../../../../common/CoreApi";
import { getLineDashedMaterial } from "../../common/BasicMaterials";
import { StackVizConfig } from "../../StackVizConfig";

import { AbstractRelation3D } from "./AbstractRelation3D";

export class IndirectRelation3D extends AbstractRelation3D {
  constructor(
    relation: IndirectRelation,
    sourcePosition: Vector3,
    targetPosition: Vector3,
    routingPoints?: Array<Vector3>,
  ) {
    super(relation, sourcePosition, targetPosition, routingPoints);
  }
  protected renderLine(): void {
    super.renderLine();
    //necessary for the dashed line material to work
    this.line.computeLineDistances();
  }

  protected lineMaterial(colorScale: number): LineDashedMaterial | LineBasicMaterial {
    return getLineDashedMaterial(StackVizConfig.INDIRECT_RELATION_COLOR, colorScale);
  }

  public lodUpdate(): void {}
}
