import isUndefined from "lodash/isUndefined";
import range from "lodash/range";

import { max } from "~/tools/max";
import { min } from "~/tools/min";

import { findInArray, firstT2, secondT2 } from "../../../Util";
import type { BiEdge } from "../../BiEdge";
import type { DiEdge } from "../../DiEdge";
import type { EdgeType } from "../../EdgeType";
import { GraphError, type GraphId, type VertexDef, type VertexId } from "../../graphCommon";
import type { Vertex } from "../../Vertex";

import type { VertexXCoords } from "./positionX";

export type UnorderedLayers = Array<UnorderedLayer>;

export interface UnorderedLayer {
  vertexIds: Set<number>; // also ensures O(1) lookups!
  groupIdx?: GroupIdx;
}

export class GroupedLayers {
  private readonly layers: Array<OrderedLayer> = [];
  private vertexesInGroup: number = 0;

  readonly groupIdx: number;

  constructor(groupIdx: number) {
    this.groupIdx = groupIdx;
  }

  addLayer(layer: OrderedLayer) {
    this.layers.push(layer);
    this.vertexesInGroup += layer.vertexIds.length;
  }

  addFirstVertexToLayer(layerIdx: number, vertexId: VertexId) {
    this.layers[layerIdx].addFirst(vertexId);
    this.vertexesInGroup += 1;
  }

  addLastVertexToLayer(layerIdx: number, vertexId: VertexId) {
    this.layers[layerIdx].addLast(vertexId);
    this.vertexesInGroup += 1;
  }

  getLayers() {
    return this.layers;
  }

  vertexCount() {
    return this.vertexesInGroup;
  }

  layerCount() {
    return this.layers.length;
  }
}

export class OrderedLayers {
  readonly layers: Array<OrderedLayer>;

  constructor(layers: Array<OrderedLayer>) {
    this.layers = layers;
  }

  forEach(callbackfn: (value: OrderedLayer, index: number, array: Array<OrderedLayer>) => void, thisArg?: any): void {
    this.layers.forEach(callbackfn, thisArg);
  }

  map<U>(callbackfn: (value: OrderedLayer, index: number, array: Array<OrderedLayer>) => U, thisArg?: any): Array<U> {
    return this.layers.map(callbackfn, thisArg);
  }

  getGroupedLayers(defaultGroupId: number): Map<GroupIdx, GroupedLayers> {
    const groupedLayers = new Map<GroupIdx, GroupedLayers>();
    this.layers.forEach((layer) => {
      const groupIdx = layer.groupIdx === undefined ? defaultGroupId : layer.groupIdx;

      const group = groupedLayers.get(groupIdx) || new GroupedLayers(groupIdx);
      group.addLayer(layer);
      groupedLayers.set(groupIdx, group);
    });
    return groupedLayers;
  }

  size() {
    return this.layers.length;
  }

  get(idx: number) {
    return this.layers[idx];
  }

  getMinMaxForAllGroups(coords: VertexXCoords): { minXGroups: number; maxXGroups: number } {
    let minXGroups = 1; // we dont use Number.POSITIVE_INFINITY because 1 is the maximum minimum we should return
    let maxXGroups = 0;
    let count = 0;
    this.layers.forEach((layer) => {
      const vertexCoords = layer.vertexIds.map((vertexId) => coords.get(vertexId)!);

      minXGroups = min(minXGroups, vertexCoords);
      maxXGroups = max(maxXGroups, vertexCoords);

      count += layer.vertexIds.length;
    });

    if (count === 0) {
      return { minXGroups: 0, maxXGroups: 0 };
    }

    return { minXGroups, maxXGroups };
  }

  getVertexPositionInLayer(vertexId: VertexId): { layerIdx: LayerIdx; position: LayerPositionIdx } | undefined {
    return findInArray(this.layers, (layer, layerIdx) => {
      const position = layer.position(vertexId);
      return position === undefined ? undefined : { layerIdx, position };
    });
  }
}

export interface OrderedLayerData {
  vertexIds: Array<VertexId>;
  groupIdx?: GroupIdx;
}

export class OrderedLayer {
  // Map is constructed on demand when OrderedLayer.position is called
  private vertexToPosition: Map<VertexId, number> | undefined = undefined;

  readonly vertexIds: Array<VertexId>;

  readonly groupIdx?: GroupIdx;

  constructor(vertexIds: Array<VertexId>, groupIdx?: GroupIdx) {
    this.groupIdx = groupIdx;
    this.vertexIds = vertexIds;
  }

  private rebuildMap() {
    if (isUndefined(this.vertexToPosition)) {
      this.vertexToPosition = new Map<VertexId, number>();
      this.vertexIds.forEach((vertexId, idx) => this.vertexToPosition!.set(vertexId, idx));
    }
  }

  static of(layer: OrderedLayerData): OrderedLayer {
    return new OrderedLayer(layer.vertexIds, layer.groupIdx);
  }

  position(vertexId: VertexId): LayerPositionIdx | undefined {
    this.rebuildMap();
    return this.vertexToPosition!.get(vertexId);
  }

  getVertexByPosition(pos: LayerPositionIdx): VertexId | undefined {
    this.rebuildMap();
    return this.vertexIds[pos];
  }

  addLast(vertexId: VertexId) {
    this.vertexIds.push(vertexId);
    this.vertexToPosition = undefined;
  }

  addFirst(vertexId: VertexId) {
    this.vertexIds.unshift(vertexId);
    this.vertexToPosition = undefined;
  }
}

export type LayerIdx = number;

export type LayerPositionIdx = number;

interface CanBeDummy {
  edgeIdReplacedWithDummies?: number;
}

export interface VertexData extends CanBeDummy {
  layer?: LayerIdx;
  groupIdx?: number;
  order?: number;
  columnWeights?: ColumnWeights;
  xCoord?: number;
}

interface EdgeData extends CanBeDummy {}

export interface HierarchicalElement<T> {
  hierarchical?: T;
}

export type HierarchicalVertexData = HierarchicalElement<VertexData>;
export type HierarchicalEdgeData = HierarchicalElement<EdgeData>;

export type HierarchicalDummy = HierarchicalElement<CanBeDummy>;

export type DummyVertexGenerator<V, E> = (replaceEdge: EdgeType<V, E>) => VertexDef<V>;
export type DummyEdgeGenerator<V, E> = (replaceEdge: EdgeType<V, E>) => { data: E; id?: GraphId };

export function isDummy<V extends HierarchicalVertexData, E extends HierarchicalEdgeData>(
  graphElement: Vertex<V, E> | BiEdge<V, E> | DiEdge<V, E>,
): boolean {
  const data = graphElement.data();
  return data.hierarchical?.edgeIdReplacedWithDummies !== undefined;
}

/**
 * A group contains zero or more vertices and each group's position in the hierarchy is defined by its id.
 * The groups with the lowest numbers are positioned at the bottom part of the screen, where typically the sinks are also
 * positioned due to the pathLayering algorithm (sinks at the bottom, sources at the top).
 */
export type GroupIdx = number;

/**
 * Immutable class that defines which vertices belong to which groups. Groups are ordered.
 */
export class Groupings<T> {
  private readonly vertexIdGroupLookup = new Map<VertexId, GroupIdx>();

  private readonly _groups: Array<[T, Array<VertexId>]>;

  constructor(_groups: Array<[T, Array<VertexId>]>) {
    this._groups = _groups;
    _groups.forEach(([, vertexIds], groupIdx) => {
      vertexIds.forEach((vertexId) => this.vertexIdGroupLookup.set(vertexId, groupIdx));
    });
  }

  get groups(): Array<T> {
    return this._groups.map(firstT2);
  }

  groupIdxByVertexId(vertexId: VertexId): GroupIdx {
    const groupIdx = this.vertexIdGroupLookup.get(vertexId);
    if (isUndefined(groupIdx)) throw new VertexNotFoundInGroupingError(vertexId);
    return groupIdx;
  }

  verticesByGroupIdx(groupIdx: GroupIdx): Array<VertexId> {
    const group = this._groups[groupIdx];
    if (isUndefined(group)) {
      new GroupNotFoundError(`Group with index ${groupIdx} not found.`);
    }
    return secondT2(group);
  }

  get groupIndices(): Array<GroupIdx> {
    return range(this._groups.length);
  }
}

export class VertexNotFoundInGroupingError extends GraphError {
  public static NAME = "VertexNotFoundInGroupingError";
  public id: number;

  constructor(id: number) {
    super(VertexNotFoundInGroupingError.NAME, `Vertex with id '${id}' not found in groupings map!`);
    this.id = id;
  }
}

export class GroupNotFoundError extends GraphError {
  public static NAME = "GroupNotFoundError";
  public msg: string;

  constructor(msg: string) {
    super(GroupNotFoundError.NAME, msg);
    this.msg = msg;
  }
}

export class ColumnWeights {
  public left: ColumnWeight = new ColumnWeight();
  public right: ColumnWeight = new ColumnWeight();

  addLeftRelation(distance: number): ColumnWeights {
    this.left.addRelation(distance);
    return this;
  }

  addRightRelation(distance: number): ColumnWeights {
    this.right.addRelation(distance);
    return this;
  }
}

class ColumnWeight {
  public numRelations = 0;
  public maxDistance = 0;

  addRelation(distance: number) {
    this.maxDistance = max(this.maxDistance, distance);
    this.numRelations++;
  }
}
