import type { LineBasicMaterial, LineDashedMaterial, Vector3 } from "three";

import type { ViewRelation } from "../../../../common/CoreApi";
import { getLineBasicMaterial } from "../../common/BasicMaterials";
import { StackVizConfig } from "../../StackVizConfig";

import { AbstractRelation3D } from "./AbstractRelation3D";

export class Relation3D extends AbstractRelation3D {
  constructor(
    relation: ViewRelation,
    sourcePosition: Vector3,
    targetPosition: Vector3,
    routingPoints?: Array<Vector3>,
  ) {
    super(relation, sourcePosition, targetPosition, routingPoints);
  }

  protected lineMaterial(colorScale: number): LineDashedMaterial | LineBasicMaterial {
    return getLineBasicMaterial(StackVizConfig.HEALTH_STATE_COLORS.RELATION.UNKNOWN, colorScale);
  }

  public lodUpdate(): void {}
}
