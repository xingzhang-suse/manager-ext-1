import intersection from "lodash/intersection";
import without from "lodash/without";
import {
  CircleGeometry,
  Color,
  EdgesGeometry,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  MeshBasicMaterial,
  Quaternion,
  Vector3,
} from "three";

import { DestroyableObject3D } from "../common/DestroyableObject3D";
import { ComponentModel } from "../model/ComponentModel";
import { GroupModel } from "../model/GroupModel";
import { StackVizConfig } from "../StackVizConfig";
import type { StackVizContext } from "../StackVizContext";
import { cleanupResources } from "../utils/Util3d";

import { AbstractRelation3D } from "./relation/AbstractRelation3D";

const DISK_GEOMETRY = new CircleGeometry(1, 32);
const COLLAR_GEOMETRY = new EdgesGeometry(DISK_GEOMETRY);

const DUMMY_MATRIX = new Matrix4();
const DUMMY_QUATERNION = new Quaternion();
const DUMMY_SCALE = new Vector3(1, 1, 1);

const prepareMatrix = (position: Vector3, scale: Vector3 = DUMMY_SCALE): Matrix4 => {
  DUMMY_MATRIX.compose(position, DUMMY_QUATERNION, scale);
  return DUMMY_MATRIX;
};

const CONFIGURATION = {
  relationScale: 0.95,
  componentScale: 0.85,
};

const RELATION_SCALE = new Vector3(1, 1, 1).multiplyScalar(CONFIGURATION.relationScale);
const COMPONENT_SCALE = new Vector3(1, 1, 1).multiplyScalar(
  StackVizConfig.COMPONENT_WIDTH * CONFIGURATION.componentScale,
);
const COMPONENT_SCALE_SPOTLIGHTED = new Vector3(1, 1, 1).multiplyScalar(
  StackVizConfig.COMPONENT_WIDTH * StackVizConfig.ZOOM_LEVEL * CONFIGURATION.componentScale,
);

const DISK_COLORS = {
  select: new Color("#B3DCFF"),
  hover: new Color("#CCE8FF"),
  hoverSelect: new Color("#CCE8FF"),
  highlight: new Color("#E7E8EA"),
  highlightSelect: new Color("#E7E8EA"),
};

const COLLAR_COLORS = {
  select: new Color("#008AFF"),
  hoverSelect: new Color("#29A2FF"),
  highlightSelect: new Color("#9FA5AD"),
};
const selectLineMaterial = new LineBasicMaterial({
  color: COLLAR_COLORS.select,
});

const hoverSelectLineMaterial = new LineBasicMaterial({
  color: COLLAR_COLORS.hoverSelect,
});

const highlightSelectLineMaterial = new LineBasicMaterial({
  color: COLLAR_COLORS.highlightSelect,
});

export type InteractionObject = AbstractRelation3D | ComponentModel | GroupModel;

/**
 * This class is responsible for render hovered/highlighted/selected effects for visualiser's elements
 */
export class InteractionMesh extends DestroyableObject3D {
  private relations: Array<AbstractRelation3D> = [];
  private mesh: InstancedMesh | undefined;

  private hovered: Array<InteractionObject> = [];
  private highlighted: Array<InteractionObject> = [];
  private selected: Array<InteractionObject> = [];

  private readonly stackVizContext: StackVizContext;

  constructor(stackVizContext: StackVizContext) {
    super();

    this.stackVizContext = stackVizContext;
  }

  public resetHover(): void {
    this.hovered = [];
    this.highlighted = [];
    this.render();
  }

  public resetSelect(): void {
    this.selected = [];
    this.render();
  }

  public hover(hovered: Array<InteractionObject>, highlighted: Array<InteractionObject>): void {
    this.hovered = hovered;
    this.highlighted = highlighted;
    this.render();
  }

  public select(selected: Array<InteractionObject>): void {
    this.selected = selected;
    this.render();
  }

  private render() {
    this.clearRender();

    // assume that it's not possible to have the same hoveredSelected and highlightSelected
    const hoveredSelected = intersection(this.selected, this.hovered);
    const hovered = without(this.hovered, ...hoveredSelected);
    const highlightSelected = intersection(this.selected, this.highlighted);
    const highlighted = without(this.highlighted, ...highlightSelected);
    const selected = without(this.selected, ...hoveredSelected, ...highlightSelected);

    const count =
      hoveredSelected.length + hovered.length + highlightSelected.length + highlighted.length + selected.length;

    const material = new MeshBasicMaterial();
    this.mesh = new InstancedMesh(DISK_GEOMETRY, material, count);

    let index = 0;
    index = this.applyDisk(hoveredSelected, DISK_COLORS.hoverSelect, this.mesh, index, hoverSelectLineMaterial);
    index = this.applyDisk(hovered, DISK_COLORS.hover, this.mesh, index);
    index = this.applyDisk(
      highlightSelected,
      DISK_COLORS.highlightSelect,
      this.mesh,
      index,
      highlightSelectLineMaterial,
    );
    index = this.applyDisk(highlighted, DISK_COLORS.highlight, this.mesh, index);
    this.applyDisk(selected, DISK_COLORS.select, this.mesh, index, selectLineMaterial);
    this.add(this.mesh);

    this.relations.forEach((relation) => relation.showDartboard());
  }

  private applyDisk(
    objects: Array<InteractionObject>,
    diskColor: Color,
    mesh: InstancedMesh,
    index: number,
    lineMaterial?: LineBasicMaterial,
  ): number {
    objects.forEach((object) => {
      const position: Vector3 = new Vector3();
      let scale: Vector3;
      switch (true) {
        case object instanceof AbstractRelation3D:
          position.copy((object as AbstractRelation3D).circleLocation);
          scale = RELATION_SCALE;
          this.relations.push(object as AbstractRelation3D);
          break;
        case object instanceof GroupModel:
          scale = (object as GroupModel)
            .getGroupScale()
            .clone()
            .addScalar(StackVizConfig.INTERACTION_MESH_DISK_SIZE_FOR_GROUPS);
          position.set(object.position.x, object.position.y, 0);
          break;
        case object instanceof ComponentModel:
          scale = (object as ComponentModel).hasIdentifier(this.stackVizContext.spotlightedComponentIdentifier)
            ? COMPONENT_SCALE_SPOTLIGHTED
            : COMPONENT_SCALE;
          position.set(object.position.x, object.position.y, 0);
          break;
        default: {
          scale = DUMMY_SCALE;
          break;
        }
      }

      if (lineMaterial) {
        const collar = new LineSegments(COLLAR_GEOMETRY, lineMaterial);
        collar.scale.copy(scale);
        collar.position.copy(position);
        collar.position.setZ(0.01);
        this.add(collar);
      }

      const matrix = prepareMatrix(position, scale);
      mesh.setMatrixAt(index, matrix);
      mesh.setColorAt(index, diskColor);
      index++;
    });
    return index;
  }

  private clearRender(): void {
    cleanupResources(this);
    this.clear();
    this.relations.forEach((relation) => relation.hideDartboard());
    this.relations = [];
  }

  public reset(): void {
    this.clearRender();
    this.hovered = [];
    this.highlighted = [];
    this.selected = [];
  }

  public getInteractedRelations(): Array<AbstractRelation3D> {
    return [...this.hovered, ...this.highlighted].filter((el) => {
      return el instanceof AbstractRelation3D && !this.selected.find((obj) => obj.getNode().id == el.getNode().id);
    }) as Array<AbstractRelation3D>;
  }

  public getSelectedRelations(): Array<AbstractRelation3D> {
    return [...this.selected].filter((el) => {
      return el instanceof AbstractRelation3D;
    }) as Array<AbstractRelation3D>;
  }
}
