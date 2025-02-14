import head from "lodash/head";
import memoize from "lodash/memoize";
import { Box3, Group, Scene, type Vector2, Vector3 } from "three";

import { Logger } from "~/tools/logger";
import type { Record } from "~/tools/record";
import { sign } from "~/tools/sign";

import {
  type GroupRelation,
  type IndirectRelation,
  type NodeId,
  Type,
  type ViewComponent,
  type ViewRelation,
  isGroupRelation,
} from "../../../common/CoreApi";
import { IllegalStateError } from "../../../common/errors";
import { isDummy } from "../../../generic/graph/algos/hierarchical/hierarchicalCommon";
import { removeChildren } from "../common/DestroyableObject3D";
import { HoverComponentStartEvent, HoverHiddenConnectionsStartEvent, HoverLayerStartEvent } from "../Events";
import type { LodLevel } from "../LodLevel";
import { ComponentModel } from "../model/ComponentModel";
import { GroupGrid } from "../model/GroupGrid";
import { GroupModel } from "../model/GroupModel";
import type { AllRelationTypes, VizGraph, VizHierarchicalLayout, VizVertex, VizVertexGroup } from "../RenderInput";
import { StackVizConfig } from "../StackVizConfig";
import type { StackVizContext } from "../StackVizContext";
import { getClosestTargetAnchorPoint } from "../utils/AnchorPoint";
import { restoreCameraParameters, storeCameraParameters } from "../utils/CameraDataStorage";
import { isGraphDifferFromStored } from "../utils/GraphDataStorage";
import { revealComponentsWithHiddenConnections } from "../utils/HiddenRelationsUtils";
import { type VisualizerSelection, VisualizerSelectionStorage } from "../utils/VisualizerSelectionStorage";

import { Components3D } from "./Components3D";
import { Grid3D, type MaskedLayer, isMaskedLayer } from "./Grid3D";
import { Groups3D } from "./Groups3D";
import { InteractionMesh, type InteractionObject } from "./InteractionMesh";
import { AbstractRelation3D } from "./relation/AbstractRelation3D";
import { GroupRelation3D } from "./relation/GroupRelation3D";
import { IndirectRelation3D } from "./relation/IndirectRelation3D";
import { LineArrowsGroup } from "./relation/LineArrowsGroup";
import { MovingPoints3D } from "./relation/MovingPoints3D";
import { Relation3D } from "./relation/Relation3D";

interface PerColumnLookup<T> {
  colId?: T;
}

const COMPONENT_V_SPACE = StackVizConfig.COMPONENT_HEIGHT * 3;
const COMPONENT_H_SPACE = StackVizConfig.COMPONENT_WIDTH * 3;
const RELATIONS_Z_OVER_BACKGROUND = 0.5;
const INTERACTIONS_Z_OVER_BACKGROUND = 0.1;

const log = Logger.namespace("StackVizScene");

/**
 * Welcome to our 3d world, the place where we attach elements to the Scene
 *
 */
export class World {
  private groupGrid: GroupGrid | undefined;
  private readonly components = new Map<NodeId, ComponentModel>();
  private readonly groups = new Map<NodeId, GroupModel>();

  // 3d elements
  private scene: Scene;
  private readonly mask: Scene;
  private groups3D: Groups3D | undefined;
  private components3D: Components3D | undefined;
  private grid3D: Grid3D | undefined;
  private lineArrowsGroup: LineArrowsGroup | undefined;
  private _relations3DGroups = new Group();
  private readonly interactionMesh: InteractionMesh;
  private hoverMovingPoints: MovingPoints3D | undefined;
  private selectMovingPoints: MovingPoints3D | undefined;
  // end 3d elements

  private _width = 0;
  private _height = 0;
  private stackVizContext: StackVizContext;
  private readonly visualizerSelectionStorage = new VisualizerSelectionStorage();

  constructor(stackVizContext: StackVizContext) {
    this.stackVizContext = stackVizContext;
    this.interactionMesh = new InteractionMesh(stackVizContext);
    this.scene = new Scene();
    this.mask = new Scene();
  }

  /**
   * Used when the user is leaving the visualizer completely, release all resources used for visualiser
   */
  public destroy(): void {
    this.visualizerSelectionStorage.clearSelection();
    this.interactionMesh.destroy();
    this.clear();
    // We could refactor the whole file to avoid this workaround
    // but... as you can see, there's no test AT ALL and a change this big can break the whole visualizer
    this.stackVizContext = undefined!;
  }

  /**
   * Used when visualiser is open and running, but recieves the new portion of data - so it deletes the previous data
   * @private
   * hammer way to clear all the way
   */
  private clear(): void {
    // save camera parameters in order to compare with the last one
    storeCameraParameters(this.stackVizContext.camera.getParameters());
    log.info("Clearing existing scene");

    // clean models
    this.groupGrid = undefined;
    this.components.forEach((component) => component.destroy());
    this.components.clear();
    this.groups.forEach((group) => group.destroy());
    this.groups.clear();

    // clean 3d world
    this.interactionMesh.reset();
    this.components3D?.unHoverExtra();

    this.lineArrowsGroup?.destroy();
    this.lineArrowsGroup = undefined;

    this.components3D?.destroy();
    this.hoverMovingPoints?.destroy();
    this.selectMovingPoints?.destroy();
    this.groups3D?.destroy();
    this.grid3D?.destroy();

    removeChildren(this._relations3DGroups);
    this.scene.clear();
    this.mask.clear();
  }

  /**
   * use this place if you want to add animations
   */
  public update(): void {
    this.hoverMovingPoints?.update();
    this.selectMovingPoints?.update();
  }

  public lodUpdate(lod: LodLevel): void {
    this.components3D?.lodUpdate(lod);
    this.groups3D?.lodUpdate(lod);
    this.grid3D?.lodUpdate(lod);
    this._relations3DGroups.children.forEach((rel: AbstractRelation3D) => {
      rel.lodUpdate(lod);
    });
  }

  public resetHover(): void {
    this.interactionMesh.resetHover();
    this.components3D?.unHoverExtra();
  }

  public restoreSelection(): void {
    const selection = this.visualizerSelectionStorage.getSelection();
    this.selectInteraction(selection);
  }

  public applySelection(selection: VisualizerSelection): void {
    this.visualizerSelectionStorage.setSelection(selection);
    this.selectInteraction(selection);
  }

  public clearSelection(): void {
    this.visualizerSelectionStorage.clearSelection();
    this.resetInteractionSelect();
  }

  public findHoverable(
    mousePosition: Vector2,
  ): { element: InteractionObject | MaskedLayer; isExtra: boolean } | undefined {
    const hoverLayer = this.findMasksUnder(mousePosition);
    if (hoverLayer) {
      return {
        element: hoverLayer,
        isExtra: false,
      };
    }
    // TODOs revisit intersections
    const hoverElementExtra = this.findComponentExtra(mousePosition);
    if (hoverElementExtra) {
      return {
        element: hoverElementExtra,
        isExtra: true,
      };
    }
    const hoverElement = this.findMouseTarget(mousePosition);
    if (hoverElement) {
      return {
        element: hoverElement,
        isExtra: false,
      };
    }
    return undefined;
  }

  public hoverInteraction(data: { element: InteractionObject | MaskedLayer; isExtra: boolean } | undefined): void {
    // hover/ clean hover
    if (!data) {
      this.components3D?.unHoverExtra();
      this.interactionMesh.resetHover();
      this.stackVizContext.domElement.style.cursor = "grab";
    } else if (data.isExtra) {
      const component = data.element as ComponentModel;
      const hover = this.components3D?.hoverExtra(data.element as ComponentModel);
      this.interactionMesh.resetHover();
      const componentNodeId = component.getNode().id;
      const hiddenConnectionsCount = componentNodeId
        ? this.components3D?.getHiddenConnectionPerNode(componentNodeId)
        : 0;

      if (hiddenConnectionsCount && hover) {
        this.stackVizContext.eventSource.next(
          new HoverHiddenConnectionsStartEvent(hover.hiddenRelationsBox, hiddenConnectionsCount),
        );
      }

      if (this.stackVizContext.isInteractionMode()) {
        this.stackVizContext.domElement.style.cursor = "pointer";
      }
    } else if (isMaskedLayer(data.element)) {
      this.interactionMesh.resetHover();
      this.stackVizContext.eventSource.next(
        new HoverLayerStartEvent(data.element.boundingBox, data.element.lockReason),
      );
    } else {
      this.components3D?.unHoverExtra();
      if (data.element instanceof AbstractRelation3D) {
        if (this.stackVizContext.isInteractionMode()) {
          this.interactionMesh.hover([data.element, ...data.element.peers], []);
          this.stackVizContext.domElement.style.cursor = "pointer";
        }
      } else {
        const [hovered, ...highlighted] = this.collectHoverHighlights([data.element], 2);
        this.interactionMesh.hover([hovered], highlighted);
        if (data.element instanceof ComponentModel) {
          const isSpotlightedComponent = data.element.hasIdentifier(
            this.stackVizContext.spotlightedComponentIdentifier,
          );

          this.stackVizContext.eventSource.next(
            new HoverComponentStartEvent(
              data.element.getBoundingBox(isSpotlightedComponent).translate(data.element.position),
              data.element.getNode(),
            ),
          );

          if (this.stackVizContext.isInteractionMode() || this.stackVizContext.isComponentSelectMode()) {
            this.stackVizContext.domElement.style.cursor = "pointer";
          }
        } else {
          // instanceof GroupModel
          if (this.stackVizContext.isInteractionMode()) {
            this.stackVizContext.domElement.style.cursor = "pointer";
          }
        }
      }
    }

    this.hoverMovingPoints?.activate(this.interactionMesh.getInteractedRelations());
  }

  private get3dElement({
    elementId,
    groupId,
    indirectRelationId,
    groupRelationId,
  }: VisualizerSelection): InteractionObject | undefined {
    if (elementId) {
      return this.components.get(elementId) || this.findRelation3dByRelationIdAndType(elementId, Type.ViewRelation);
    }
    if (groupId) {
      return this.groups.get(groupId);
    }
    if (indirectRelationId) {
      return this.findRelation3dByRelationIdAndType(indirectRelationId, Type.IndirectRelation);
    }
    if (groupRelationId) {
      return this.findRelation3dByRelationIdAndType(groupRelationId, Type.GroupRelation);
    }
  }

  public selectInteraction(visualizerSelection: VisualizerSelection): void {
    const element = this.get3dElement(visualizerSelection);
    const selection: Array<InteractionObject> = [];
    if (element) {
      selection.push(element);
      if (element instanceof AbstractRelation3D) {
        selection.push(...element.peers);
      }
    }

    this.interactionMesh.select(selection);
    this.selectMovingPoints?.activate(this.interactionMesh.getSelectedRelations());
    this.hoverMovingPoints?.activate(this.interactionMesh.getInteractedRelations()); // Redo hover to ditch hover after selection
  }

  public resetInteractionSelect(): void {
    this.interactionMesh.resetSelect();
    this.selectMovingPoints?.activate([]);
  }

  private collectHoverHighlights(
    elements: Array<InteractionObject>,
    depth: number,
    acc: Array<InteractionObject> = [],
  ): Array<InteractionObject> {
    if (elements.length === 0 || depth < 0) {
      return acc;
    }

    const peers = elements.flatMap((element) => {
      const result: Array<InteractionObject> = [];
      element.peers.forEach((peer) => {
        if (!acc.includes(peer)) {
          result.push(peer);
        }
      });
      return result;
    });

    return this.collectHoverHighlights(peers, depth - 1, acc.concat(elements));
  }

  // TODOs revisit intersections
  /**
   * Looks for an interacting part of element under the mouse position on the Scene
   */
  public findMouseTarget({ x, y }: Vector2): InteractionObject | undefined {
    return this.findGroupsUnder(x, y) || this.findComponentsUnder(x, y) || this.findRelationsUnder(x, y);
  }

  public findComponentExtra({ x, y }: Vector2): ComponentModel | undefined {
    const model = this.stackVizContext.camera.findIntersection(
      x,
      y,
      this.components3D!.getHiddenConnectionsIntersections(),
    );
    return model?.userData.component as ComponentModel;
  }

  public findComponentsUnder(px: number, py: number): ComponentModel | undefined {
    const model = this.stackVizContext.camera.findIntersection(px, py, this.components3D!.getIntersections());
    return model?.userData.component as ComponentModel;
  }

  public findGroupsUnder(px: number, py: number): GroupModel | undefined {
    const model = this.stackVizContext.camera.findIntersection(px, py, this.groups3D!.getIntersections());
    return model?.userData.group as GroupModel;
  }

  public findMasksUnder({ x, y }: Vector2): MaskedLayer | undefined {
    const model = this.stackVizContext.camera.findIntersection(
      x,
      y,
      this.mask.children.flatMap((obj) => obj.children),
    );
    if (model) {
      const coordinates = this.stackVizContext.camera.getCameraCoordinates(x, y);
      return {
        ...model.userData.layer,
        boundingBox: new Box3(
          coordinates.clone().add(new Vector3(-1, -1, 0)),
          coordinates.clone().add(new Vector3(1, 1, 0)),
        ),
      };
    }
  }

  public findRelationsUnder(px: number, py: number): AbstractRelation3D | undefined {
    return head(
      this.stackVizContext.camera.findIntersections<AbstractRelation3D>(
        px,
        py,
        this._relations3DGroups.children as Array<AbstractRelation3D>,
      ),
    );
  }

  private findRelation3dByRelationIdAndType(id: NodeId, type: Type): AbstractRelation3D | undefined {
    return (this._relations3DGroups.children as Array<AbstractRelation3D>).find((rel3d: AbstractRelation3D) => {
      const node = rel3d.getNode();
      return node._type === type && node.id === id;
    });
  }

  // display the Graph
  public loadHierarchicalGraph(
    graph: VizGraph,
    rows: Array<VizVertexGroup>,
    cols: Array<VizVertexGroup>,
    layoutData: Array<VizHierarchicalLayout>,
    neighborsNotInQuery: ReadonlyMap<NodeId, number>,
  ): void {
    this.clear();
    log.info("Loading new scene from graph.");

    // --- util functions
    function getLayout(colId: number = -1): VizHierarchicalLayout {
      if (colId >= 0) {
        return layoutData[cols.findIndex((col) => col.id === colId)];
      }

      return layoutData[0];
    }

    const memoizedGetLayout = memoize(getLayout);

    function getLayerIdxsPerGroup(colId: number = -1): PerColumnLookup<Array<number>> {
      const layerIdxsPerGroupIdx: Record<number, [number], "+"> = {};
      memoizedGetLayout(colId).layers.forEach((layer, layerIdx) => {
        // This is a pretty tricky logic since having an undefined as element or index is valid
        // Plus: no tests
        if (!layerIdxsPerGroupIdx[layer.groupIdx!]) {
          layerIdxsPerGroupIdx[layer.groupIdx!] = [layerIdx];
        } else {
          layerIdxsPerGroupIdx[layer.groupIdx!].push(layerIdx);
        }
      });
      return layerIdxsPerGroupIdx;
    }

    const memoizedGetLayerIdxsPerGroup = memoize(getLayerIdxsPerGroup);

    function getVertexWidthsForColumn(colId: number) {
      const layout = memoizedGetLayout(colId);
      let min = 0;
      let max = 0;

      layout.layers.forEach((layer) => {
        for (const vertexId of layer.vertexIds) {
          const value = graph.vertexById(vertexId).data().hierarchical?.xCoord || 0;
          if (value < min) {
            min = value;
          }
          if (value > max) {
            max = value;
          }
        }
      });

      const minX = min * COMPONENT_H_SPACE;
      const maxX = max * COMPONENT_H_SPACE;

      return { minX, totalWidth: maxX - minX };
    }

    const memoizedGetVertexWidthsForColumn = memoize(getVertexWidthsForColumn);

    const element3DPos = (vertex: VizVertex): Vector3 => {
      const vertexData = vertex.data();
      const colId = vertexData.colId;
      const layout: VizHierarchicalLayout = memoizedGetLayout(colId);
      const layerIdx = vertexData.hierarchical?.layer;
      // Not much to do. undefined is a valid entry here
      const layer = layout.layers.get(layerIdx!);
      const groupIdx = layer.groupIdx;
      // X Axis of the component is determined by getting the widths of all components/routingpoints on that layer and then
      // adding them up to the point of the component itself.
      // The colId being undefined is handled internally by the getLayout function.
      const { minX, totalWidth } = memoizedGetVertexWidthsForColumn(colId!);
      const x = (vertexData.hierarchical?.xCoord || 0) * COMPONENT_H_SPACE - minX - totalWidth / 2;
      // Y Axis of the component is determined by the `layer` of the VizVertex. A group contains a number of layers
      // so the lowest layer in the group is subtracted. Then it is centered by the number of layers in the group.
      const [lowestLayerIdxOfGroup, layersInGroup] =
        groupIdx !== undefined
          ? [memoizedGetLayerIdxsPerGroup(colId)[groupIdx][0], memoizedGetLayerIdxsPerGroup(colId)[groupIdx].length]
          : [0, layout.layers.size()];
      const y =
        ((layerIdx || 0) - lowestLayerIdxOfGroup - layersInGroup / 2) * COMPONENT_V_SPACE + COMPONENT_V_SPACE / 2;

      return new Vector3(x, y, 0);
    };

    const dummyVertexWorldPos = (dummyVertex: VizVertex): Vector3 => {
      const dummyVertexData = dummyVertex.data();
      const posInCell = element3DPos(dummyVertex);
      const colIdx = cols && dummyVertexData.colId ? cols.findIndex((col) => col.id === dummyVertexData.colId) : 0;
      const dummyContainingCell = this.groupGrid!.cellByIdx(dummyVertexData.hierarchical?.groupIdx || 0, colIdx);
      if (!dummyContainingCell) {
        // TODO think about not throwing errors
        throw new IllegalStateError(
          `Could not find cell with rowIdx: ${dummyVertexData.hierarchical?.groupIdx || 0}, colIdx: ${colIdx}.`,
        );
      }
      return posInCell.add(dummyContainingCell.position);
    };
    // --- util functions end

    // ------------------------------------
    // ---------- START HERE --------------------------
    // ------------------------------------
    const elementVertices = graph.vertices().filter((props) => !isDummy(props));
    const relationsEdges = graph.edges().filter((props) => !isDummy(props));

    // first create the three.js Scene to which we will add the world objects
    this.scene = new Scene();
    // create the model of Grid with data about rows and columns, the grid is empty right now
    this.groupGrid = new GroupGrid(rows, cols);

    const maybeVertex =
      this.stackVizContext.spotlightedComponentIdentifier != null
        ? elementVertices.find((vertex) => {
            const domainObject = vertex.data().domainObject;
            return (
              domainObject._type == Type.ViewComponent &&
              (domainObject as ViewComponent).identifiers?.includes(
                this.stackVizContext.spotlightedComponentIdentifier!,
              )
            );
          })
        : undefined;
    const spotlightedComponentLayer = maybeVertex?.data().hierarchical?.layer ?? -1;

    // ------------- CREATE COMPONENTS AND GROUPS -------------
    // create a transitive models for components and groups
    // add to them the information about their placement in the related cells
    elementVertices.forEach((vertex) => {
      const vertexData = vertex.data();
      const pos = element3DPos(vertex);
      const cell = this.groupGrid!.cellById(vertexData.rowId, vertexData.colId);
      if (!cell) {
        log.error(
          `Could not find cell with rowId: ${vertexData.rowId}, colId: ${vertexData.colId}. Failed to create vertex`,
          vertex,
        );
        return;
      }
      let model: ComponentModel | GroupModel;
      const domainObject = vertexData.domainObject;
      switch (domainObject._type) {
        case Type.ViewComponent:
          model = new ComponentModel(domainObject, neighborsNotInQuery.get(domainObject.id!) ?? 0);
          this.components.set(domainObject.id!, model);
          break;
        case Type.TypeGroup:
          model = new GroupModel(domainObject);
          this.groups.set(domainObject.id!, model);
          break;
        default:
          log.error(`Failed to create vertex of unknown type ${domainObject._type}`);
          return;
      }

      const layerIdx = vertexData.hierarchical?.layer || -1;
      // if spotlightedComponentLayer is defined add extra space before and after layer, move other layers
      const yShiftSign = spotlightedComponentLayer < 0 ? 0 : sign(layerIdx - spotlightedComponentLayer);
      model.position.set(pos.x, pos.y + yShiftSign * StackVizConfig.COMPONENT_HEIGHT * StackVizConfig.ZOOM_LEVEL, 0);
      cell.addContent(model);
    });

    // setup the Grid
    // in this place we update the components and groups world positions
    this.groupGrid.setup();

    // create the actual 3d Grid out of the model and add it to the scene
    this.grid3D = new Grid3D(this.stackVizContext, this.groupGrid);

    // create the actual 3d components and groups and add them to the scene
    // in current way the components and groups are not highly coupled to the cells
    // and we could manage them as a single instance
    this.components3D = new Components3D(this.stackVizContext, this.components);
    this.groups3D = new Groups3D(this.stackVizContext, this.groups);

    // ---------------------------------------------
    // ------------- CREATE RELATIONS --------------
    // ---------------------------------------------
    const unRoutedRelations3D = relationsEdges.map((relationEdge) => {
      const relation = relationEdge.data().domainObject;
      const source = this.getSourceVertexElement3dForRelationOrThrow(relation);
      const target = this.getTargetVertexElement3dForRelationOrThrow(relation);

      const targetPointPosition = getClosestTargetAnchorPoint(
        source.position,
        target,
        this.isSpotlightedComponent(relation.target),
      );
      const sourcePointPosition = getClosestTargetAnchorPoint(
        targetPointPosition,
        source,
        this.isSpotlightedComponent(relation.source),
      );

      const relation3d = this.createRelation3D(relation, sourcePointPosition.setZ(0), targetPointPosition.setZ(0));
      relation3d.peers.push(source, target);
      source.peers.push(relation3d);
      target.peers.push(relation3d);
      return relation3d;
    });

    const allDummyPaths =
      cols && !(cols.length === 0)
        ? cols.flatMap((col) => [...memoizedGetLayout(col.id).dummyPaths.values()])
        : [...memoizedGetLayout(-1).dummyPaths.values()];

    const routedRelations3D = allDummyPaths.map((dummyPath) => {
      const anyFirstDummyVertex = <VizVertex>dummyPath.elementByIndex(2);
      const originalRelation = anyFirstDummyVertex.data().domainObject as AllRelationTypes;
      const path = originalRelation.source !== dummyPath.firstId ? dummyPath.reverse() : dummyPath;
      const source = this.getSourceVertexElement3dForRelationOrThrow(originalRelation);
      const target = this.getTargetVertexElement3dForRelationOrThrow(originalRelation);
      const dummyPathVertices = path.vertices();
      const dummyVertices = path.vertices().slice(1, dummyPathVertices.length - 1);
      const routingPoints = dummyVertices.map(dummyVertexWorldPos);
      const firstDummyVertex = <VizVertex>path.elementByIndex(2);
      const lastDummyVertex = <VizVertex>path.elementByIndex(path.sequenceLength - 3);

      const targetPointPosition = getClosestTargetAnchorPoint(
        dummyVertexWorldPos(lastDummyVertex),
        target,
        this.isSpotlightedComponent(originalRelation.target),
      );
      const sourcePointPosition = getClosestTargetAnchorPoint(
        dummyVertexWorldPos(firstDummyVertex),
        source,
        this.isSpotlightedComponent(originalRelation.source),
      );

      const relation3d = this.createRelation3D(
        originalRelation,
        sourcePointPosition.setZ(0),
        targetPointPosition.setZ(0),
        routingPoints,
      );
      relation3d.peers.push(source, target);
      source.peers.push(relation3d);
      target.peers.push(relation3d);
      return relation3d;
    });

    const allRelations3D = [...unRoutedRelations3D, ...routedRelations3D];
    allRelations3D.forEach((r) => r.create());
    this._relations3DGroups = new Group();
    allRelations3D.forEach((rel3D) => this._relations3DGroups.add(rel3D));

    // move relations up a bit to handle z-fighting
    this._relations3DGroups.position.z = RELATIONS_Z_OVER_BACKGROUND;
    this.scene.add(this._relations3DGroups);

    // ----------- Line arrows -------------
    this.lineArrowsGroup = new LineArrowsGroup(allRelations3D);
    this.lineArrowsGroup.mesh.position.z = 1;
    this.scene.add(this.lineArrowsGroup.mesh);

    // -----------------------------------
    // ----------- Interaction Mesh -------------
    // -----------------------------------
    this.interactionMesh.position.setZ(INTERACTIONS_Z_OVER_BACKGROUND);
    this.scene.add(this.interactionMesh);

    // ------------------------------------------------
    // ----------- Moving Relations' points -------------
    // ------------------------------------------------
    this.hoverMovingPoints = new MovingPoints3D(this.stackVizContext);
    this.selectMovingPoints = new MovingPoints3D(this.stackVizContext);

    // -----------------------------------
    // ----------- Finish 2D -------------
    // -----------------------------------

    this._width = this.groupGrid.width();
    this._height = this.groupGrid.height();

    // -----------------------------------
    // ---- Enable hidden connections ----
    // -----------------------------------
    if (this.stackVizContext.isInteractionMode()) {
      revealComponentsWithHiddenConnections(this.components, this.components3D);
    }

    // ---------------------------------
    // ----------- Reset the camera if topology has changed -----------
    // ---------------------------------
    const needsToUpdate = isGraphDifferFromStored(this.components, this.groups);
    const cameraParams = restoreCameraParameters();
    if (!needsToUpdate) {
      this.stackVizContext.camera.applyParams(cameraParams);
    }

    // -----------------------------------
    // ------------- FINISH --------------
    // -----------------------------------
  }

  public getWidth(): number {
    return this._width;
  }

  public getHeight(): number {
    return this._height;
  }

  getThreeScene() {
    return this.scene;
  }

  getMask() {
    return this.mask;
  }

  // Todos, throw for now, think about better way
  private getSourceVertexElement3dForRelationOrThrow(relation: AllRelationTypes): ComponentModel | GroupModel {
    let vertexElement: ComponentModel | GroupModel | undefined;
    if (isGroupRelation(relation) && relation.isSourceGroup) {
      vertexElement = this.groups.get(relation.source);
    } else {
      vertexElement = this.components.get(relation.source);
    }
    if (vertexElement) {
      return vertexElement;
    }

    throw new IllegalStateError(`Cannot find source 3D vertex element for node: ${relation}`);
  }

  // Todos, throw for now, think about better way
  private getTargetVertexElement3dForRelationOrThrow(relation: AllRelationTypes): ComponentModel | GroupModel {
    let vertexElement: ComponentModel | GroupModel | undefined;
    if (isGroupRelation(relation) && relation.isTargetGroup) {
      vertexElement = this.groups.get(relation.target);
    } else {
      vertexElement = this.components.get(relation.target);
    }
    if (vertexElement) {
      return vertexElement;
    }
    throw new IllegalStateError(`Cannot find target 3D vertex element for node: ${relation}`);
  }

  /**
   * Set camera on the specified component
   */
  public lightOn(viewElement: ViewComponent, animate = false): void {
    const stackVizElement = this.components.get(viewElement.id!);

    if (stackVizElement) {
      this.stackVizContext.camera.lookAt(stackVizElement.position, animate);
    }
  }

  private createRelation3D(
    domainObject: AllRelationTypes,
    sourcePosition: Vector3,
    targetPosition: Vector3,
    routingPoints?: Array<Vector3>,
  ): Relation3D | IndirectRelation3D | GroupRelation3D {
    const domainObjectType = domainObject._type;
    switch (domainObjectType) {
      case Type.IndirectRelation:
        return new IndirectRelation3D(domainObject as IndirectRelation, sourcePosition, targetPosition, routingPoints);

      case Type.ViewRelation:
        return new Relation3D(domainObject as ViewRelation, sourcePosition, targetPosition, routingPoints);

      case Type.GroupRelation:
        return new GroupRelation3D(domainObject as GroupRelation, sourcePosition, targetPosition, routingPoints);

      default:
        throw new IllegalStateError(`Could not create relation 3D for domain object with type '${domainObjectType}'.`);
    }
  }

  private isSpotlightedComponent(component: NodeId): boolean {
    return this.components.get(component)?.hasIdentifier(this.stackVizContext.spotlightedComponentIdentifier) ?? false;
  }
}
