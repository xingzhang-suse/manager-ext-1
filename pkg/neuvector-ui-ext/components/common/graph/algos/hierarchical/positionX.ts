import { abs } from "~/tools/abs";
import { floor } from "~/tools/floor";
import { Logger } from "~/tools/logger";
import { max } from "~/tools/max";
import { min } from "~/tools/min";

import { IllegalStateError } from "../../../../common/errors";
import { NumberBiSet } from "../../../datatypes/NumberBiSet";
import type { Graph } from "../../Graph";
import type { VertexId } from "../../graphCommon";
import type { Vertex } from "../../Vertex";
import type { FeedbackArcSetDAG } from "../findFeedbackArcSet";

import {
  type HierarchicalEdgeData,
  type HierarchicalVertexData,
  type OrderedLayer,
  type OrderedLayers,
  isDummy,
} from "./hierarchicalCommon";
import type { HierarchicalLayoutOptions } from "./hierarchicalLayout";

export enum BiasY {
  UP,
  DOWN,
}
export enum BiasX {
  LEFT,
  RIGHT,
}

export interface Alignment {
  root: Map<VertexId, VertexId>;
  align: Map<VertexId, VertexId>;
}

export class Assignment {
  private _adjustment: number;
  readonly coords: Map<VertexId, XCoord>;

  readonly minX: number;

  readonly maxX: number;

  readonly biasX: BiasX;

  readonly biasY: BiasY;

  constructor(coords: Map<VertexId, XCoord>, minX: number, maxX: number, biasX: BiasX, biasY: BiasY) {
    this.biasY = biasY;
    this.biasX = biasX;
    this.maxX = maxX;
    this.minX = minX;
    this.coords = coords;
  }

  get adjustment(): number {
    return this._adjustment;
  }

  set adjustment(value: number) {
    this._adjustment = value;
  }
}

export type XCoord = number;
export type VertexXCoords = Map<VertexId, XCoord>;

export type Type1Conflicts = NumberBiSet;
/**
 * Assignment of X coordinate for a vertex in a layer to minimize the crossings.
 * "Fast and Simple Horizontal Coordinate Assignment" Ulrik Brandes and Boris Kopf
 * See http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.64.4457&rep=rep1&type=pdf
 *
 * @param {FeedbackArcSetDAG<V, E>} dag A proper graph i.e. for all edges in the graph it holds that the difference between the layers of its vertices is not greater than one.
 * @param {OrderedLayers} orderedLayers
 * @param {HierarchicalLayoutOptions<any>} options
 * @returns {VertexXCoords}
 */

export function positionX<V extends HierarchicalVertexData, E extends HierarchicalEdgeData>(
  dag: FeedbackArcSetDAG<V, E>,
  orderedLayers: OrderedLayers,
  options: HierarchicalLayoutOptions<any>,
): VertexXCoords {
  const conflictsType1 = findType1Conflicts(dag, orderedLayers);
  const { upperNeighbours, lowerNeighbours } = getUpperLowerNeighbours(dag, orderedLayers);
  const assignments: Array<Assignment> = [];
  const { alignmentBias } = options;
  if (alignmentBias) {
    Logger.namespace("positionX").warn(
      `PositionX is called for the specific bias ${alignmentBias} which has to be used purely for debug and testing purposes.`,
    );
    const neighbours = alignmentBias.biasY === BiasY.UP ? upperNeighbours : lowerNeighbours;

    const alignment = verticalAlignment(
      dag,
      orderedLayers,
      conflictsType1,
      neighbours,
      alignmentBias.biasX,
      alignmentBias.biasY,
    );
    const assignment = horizontalCompaction(
      dag,
      orderedLayers,
      alignment,
      alignmentBias.biasX,
      alignmentBias.biasY,
      options,
    );
    assignments.push(assignment);
  } else {
    [BiasX.LEFT, BiasX.RIGHT].forEach((biasX) => {
      [BiasY.UP, BiasY.DOWN].forEach((biasY) => {
        const neighbours = biasY === BiasY.UP ? upperNeighbours : lowerNeighbours;
        const alignment = verticalAlignment(dag, orderedLayers, conflictsType1, neighbours, biasX, biasY);
        const assignment = horizontalCompaction(dag, orderedLayers, alignment, biasX, biasY, options);
        assignments.push(assignment);
      });
    });
  }

  const smallest = findSmallestWidthAssignment(assignments);
  alignCoordinates(assignments, smallest);
  const coords = balance(dag, assignments, options);
  fixCoordinateOverlap(dag, orderedLayers, options, coords);
  return coords;
}
/**
 * The original paper "Fast and Simple Horizontal Coordinate Assignment" Ulrik Brandes and Boris Kopf
 * (http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.64.4457&rep=rep1&type=pdf)
 * has two mistakes and implementation of horizontalCompaction has been done by the original paper
 * and therefore inherited them.
 *
 * Later on the authors released additional paper with the fixes.
 * "Erratum: Fast and Simple Horizontal Coordinate Assignment" Ulrik Brandes, Julian Walter, and Johannes Zink (https://arxiv.org/pdf/2008.01252.pdf)
 *
 * The fixes from the paper were not implemented due to complexity, possibility of bugs and performance reasons.
 * Considering the fact that the issues are rare, the decision has been made to implement the fix where X coordinate
 * of vertex is adjusted after balancing step such that vertexes do not overlap.
 * The adjustment is done by shifting components to the right if the minimal distance between adjacent vertexes is not preserved.
 *
 * @param {FeedbackArcSetDAG<V, E>} dag
 * @param {OrderedLayers} orderedLayers
 * @param {HierarchicalLayoutOptions<any>} options
 * @param {VertexXCoords} inOutCoords
 */

function fixCoordinateOverlap<V extends HierarchicalVertexData, E extends HierarchicalEdgeData>(
  dag: FeedbackArcSetDAG<V, E>,
  orderedLayers: OrderedLayers,
  options: HierarchicalLayoutOptions<any>,
  inOutCoords: VertexXCoords,
) {
  let overlapFirstOccurrenceHappened = false;
  orderedLayers.forEach((layer: OrderedLayer, layerIdx: number) => {
    for (let i = 1; i < layer.vertexIds.length; i++) {
      const vertexIdPrev = layer.getVertexByPosition(i - 1)!;
      const vertexIdCurrent = layer.getVertexByPosition(i)!;
      const xCoordPrev = inOutCoords.get(vertexIdPrev)!;
      const xCoordCurrent = inOutCoords.get(vertexIdCurrent)!;
      const distanceBetweenVertexes = xCoordCurrent - xCoordPrev;
      const minDistanceBetweenVertexes = getSeparation(dag.graph, options, vertexIdPrev);
      if (distanceBetweenVertexes < minDistanceBetweenVertexes) {
        inOutCoords.set(vertexIdCurrent, xCoordPrev + minDistanceBetweenVertexes);
        if (!overlapFirstOccurrenceHappened) {
          Logger.namespace("fixCoordinateOverlap").warn(
            `Vertex overlap detected! First occurrence in layer: ${layerIdx}\n` +
              `, groupIdx: ${layer.groupIdx}, between vertexes [${vertexIdPrev}, ${vertexIdCurrent}], and positions [${
                i - 1
              }, ${i}].`,
          );
        }
        overlapFirstOccurrenceHappened = true;
      }
    }
  });
}

/**
 * Looking for type 1 conflicts - a non-inner segment crosses an inner segment.
 * Inner segment is segment that connects two dummy nodes.
 * Non inner segment is segment that connects two non dummy nodes or dummy and not dummy node.
 * (Section 2 of the paper)
 * @param {FeedbackArcSetDAG<V, E>} dag
 * @param {OrderedLayers} orderedLayers
 * @returns {Map<V, Set<E>>}
 */
export function findType1Conflicts<V extends HierarchicalVertexData, E extends HierarchicalEdgeData>(
  dag: FeedbackArcSetDAG<V, E>,
  orderedLayers: OrderedLayers,
): Type1Conflicts {
  const conflicts = new NumberBiSet();

  const graph = dag.graph;

  /**
   * Dummy can have only one out and one in vertex.
   * @param {Vertex<V extends HierarchicalVertexData, E extends HierarchicalEdgeData>} vertex
   * @param {OrderedLayer} l
   * @returns {Vertex<V extends HierarchicalVertexData, E extends HierarchicalEdgeData>}
   */
  function getInnerSegmentUpperNeighbor(vertex: Vertex<V, E>): Vertex<V, E> | undefined {
    if (isDummy<V, E>(vertex)) {
      const outVertices = dag.outVertices(vertex);
      const outVertexIsDummy = outVertices.find((v) => isDummy<V, E>(v));
      if (outVertexIsDummy) {
        return outVertices[0];
      }
    }

    return undefined;
  }

  // we can skip the first layer and the last layer, because they are guaranteed to not have dummy vertices and thus
  // can not host inner segments.
  for (let i = 1; i < orderedLayers.size() - 2; i++) {
    const upper = orderedLayers.get(i);
    const current = orderedLayers.get(i + 1);

    let k0 = -1;
    let l = 0;

    current.vertexIds.forEach((vertexId, l1) => {
      const vertex = graph.vertexById(vertexId);
      const innerSegmentUpperNeighbor = getInnerSegmentUpperNeighbor(vertex);
      const lastIdxCurrentLayer = current.vertexIds.length - 1;
      const lastIdxUpperLayer = upper.vertexIds.length - 1;
      if (l1 === lastIdxCurrentLayer || innerSegmentUpperNeighbor) {
        const k1 = innerSegmentUpperNeighbor ? upper.position(innerSegmentUpperNeighbor.id) : lastIdxUpperLayer;
        if (k1 === undefined) {
          throw new IllegalStateError(
            `Could not find position of innerSegmentUpperNeighbor (${innerSegmentUpperNeighbor?.id}) on layer (${i}).  lastIdxUpperLayer=${lastIdxUpperLayer}`,
          );
        }
        while (l <= l1) {
          const predecessorId = current.vertexIds[l];
          const predecessor = graph.vertexById(predecessorId);
          dag.outVertices(predecessor).forEach((upperPredecessorNeighbor) => {
            const k = upper.position(upperPredecessorNeighbor.id);
            if (k === undefined) {
              throw new IllegalStateError(
                `Could not find position of upperPredecessorNeighbor (${upperPredecessorNeighbor.id}) on layer (${i}).`,
              );
            }
            if (k < k0 || k > k1) {
              conflicts.add(predecessor.id, upperPredecessorNeighbor.id);
            }
          });
          l += 1;
        }
        k0 = k1;
      }
    });
  }

  return conflicts;
}

export function getUpperLowerNeighbours<V, E>(
  dag: FeedbackArcSetDAG<V, E>,
  layers: OrderedLayers,
): { upperNeighbours: Map<VertexId, Array<VertexId>>; lowerNeighbours: Map<VertexId, Array<VertexId>> } {
  // We need to have a list of neighbors (either upper or lower based on the biasY) that is ordered
  // by their position in their (upper or lower) layer. Getting upper/lower neighbors in linear time
  // requires us to build this data structure. This runs in O(|E|).
  // Since we know that each in vertex is on the previous layer and all outgoing vertices are on the next
  // layer, we can build this data structure by pushing onto the neighbor list of each lower vertex its
  // upper neighbors in the order of the layer.
  const upperNeighbours = new Map<VertexId, Array<VertexId>>();
  const lowerNeighbours = new Map<VertexId, Array<VertexId>>();
  layers.forEach((layer) => {
    layer.vertexIds.forEach((vertexId) => {
      const vertex = dag.graph.vertexById(vertexId);

      // Upper neighbours
      dag.inVertices(vertex).forEach((lowerNeighbor) => {
        const neighborList = upperNeighbours.get(lowerNeighbor.id) || [];
        neighborList.push(vertexId);
        upperNeighbours.set(lowerNeighbor.id, neighborList);
      });

      // Lower neighbours
      dag.outVertices(vertex).forEach((lowerNeighbor) => {
        const neighborList = lowerNeighbours.get(lowerNeighbor.id) || [];
        neighborList.push(vertexId);
        lowerNeighbours.set(lowerNeighbor.id, neighborList);
      });
    });
  });
  return {
    upperNeighbours: upperNeighbours,
    lowerNeighbours: lowerNeighbours,
  };
}

// 0 ->  []
// 1 -> [ 0 ]
// 2 -> [ 0, 1]
// 3 ->  [ 1 ]
// 4 -> [ 1, 2]
function medianOf(d: number, reverse: boolean): Array<number> {
  if (d === 0) {
    return [];
  }

  const median = floor(d / 2, 0);
  if (d % 2 === 0) {
    return reverse ? [median, median - 1] : [median - 1, median];
  }
  return [median];
}

export function verticalAlignment<V, E>(
  dag: FeedbackArcSetDAG<V, E>,
  layers: OrderedLayers,
  conflicts: Type1Conflicts,
  neighbours: Map<VertexId, Array<VertexId>>,
  biasX: BiasX,
  biasY: BiasY,
): Alignment {
  // Undefined key for "root" and "align" means key = value, vertex is mapped to itself
  // so if a vertex id is NOT in the keys list of the root map then it is a root.
  const root = new Map<VertexId, VertexId>();
  const align = new Map<VertexId, VertexId>();

  if (layers.size() === 0) {
    return { root: root, align: align };
  }

  const loopI =
    biasY === BiasY.UP
      ? {
          start: 1,
          end: layers.size(),
          increment: 1,
        }
      : {
          start: layers.size() - 2,
          end: -1,
          increment: -1,
        };

  for (let i = loopI.start; i !== loopI.end; i += loopI.increment) {
    // when BiasY is UP we consider the upper neighbors, when down lower neighbors
    const otherLayer = layers.get(i - loopI.increment);
    const layer = layers.get(i);

    let r = biasX === BiasX.LEFT ? -1 : otherLayer.vertexIds.length;

    const loopK =
      biasX === BiasX.LEFT
        ? {
            start: 0,
            end: layer.vertexIds.length,
            increment: 1,
          }
        : {
            start: layer.vertexIds.length - 1,
            end: -1,
            increment: -1,
          };

    for (let k = loopK.start; k !== loopK.end; k += loopK.increment) {
      const vertexId = layer.vertexIds[k];
      const neighborIds = neighbours.get(vertexId) || [];

      medianOf(neighborIds.length, biasX === BiasX.RIGHT).forEach((m) => {
        if (align.get(vertexId) === undefined) {
          const candidateId = neighborIds[m];
          const candidateNeighbourPosition = otherLayer.position(candidateId)!;

          const hasConflict = conflicts.contains(candidateId, vertexId);
          const shouldNotCrossLastAlignment =
            biasX === BiasX.LEFT ? candidateNeighbourPosition > r : candidateNeighbourPosition < r;
          if (!hasConflict && shouldNotCrossLastAlignment) {
            align.set(candidateId, vertexId);
            root.set(vertexId, root.get(candidateId) || candidateId);
            align.set(vertexId, root.get(vertexId) || vertexId);
            r = candidateNeighbourPosition;
          }
        }
      });
    }
  }

  return { root: root, align: align };
}

export function getSeparation<V extends HierarchicalVertexData, E extends HierarchicalEdgeData>(
  graph: Graph<V, E>,
  options: HierarchicalLayoutOptions<any>,
  v1: VertexId,
) {
  if (isDummy<V, E>(graph.vertexById(v1))) {
    return options.betweenDummyNodeWidth;
  }
  return options.vertexWidth;
}

export function horizontalCompaction<V extends HierarchicalVertexData, E extends HierarchicalEdgeData>(
  dag: FeedbackArcSetDAG<V, E>,
  layers: OrderedLayers,
  alignment: Alignment,
  biasX: BiasX,
  biasY: BiasY,
  options: HierarchicalLayoutOptions<any>,
): Assignment {
  const { root, align } = alignment;

  const sink = new Map<VertexId, VertexId>();

  // coordinates that are relative to the sink
  const relativeCoords = new Map<VertexId, number>();
  // how much we need to shift each coordinate for each sink
  const shiftCoords = new Map<VertexId, number>();

  // This is to prevent infinite loops
  const maxPlaceBlockDepth = options.compactionMaxPlaceBlockDepth;
  const maxLinkedListIterations = options.compactionMaxLinkedListIterations;

  function placeBlock(v: VertexId, stopCounter: number) {
    throwIfInfiniteLoop(stopCounter, maxPlaceBlockDepth, "Maximal recursive calls to placeBlock reached.");
    if (relativeCoords.has(v)) {
      return;
    }
    relativeCoords.set(v, 0);
    let w = v;
    let linkedListIterations = maxLinkedListIterations;
    do {
      linkedListIterations -= 1;
      throwIfInfiniteLoop(linkedListIterations, maxLinkedListIterations, "Maximal linked list iterations reached.");

      const orderW = layers.getVertexPositionInLayer(w)!;
      throwIfUndefined(orderW, "Could not find position of vertex.", w);

      const isWNotOnTheBoundry =
        biasX === BiasX.LEFT ? orderW.position > 0 : orderW.position < layers.get(orderW.layerIdx).vertexIds.length - 1;
      if (isWNotOnTheBoundry) {
        const positionIncrement = biasX === BiasX.LEFT ? 1 : -1;
        const predecessorSuccessor = layers.get(orderW.layerIdx).vertexIds[orderW.position - positionIncrement];

        throwIfPredecessorSuccessorUndefined(predecessorSuccessor, orderW.layerIdx, orderW.position);

        const u = root.get(predecessorSuccessor) || predecessorSuccessor;

        placeBlock(u, stopCounter - 1);

        const sinkU = sink.get(u) || u;
        const isVSink = !sink.has(v);
        if (isVSink) {
          sink.set(v, sinkU);
        }

        if (sink.get(v) !== sinkU) {
          if (biasX === BiasX.LEFT) {
            const coordX = relativeCoords.get(v)! - relativeCoords.get(u)! - getSeparation(dag.graph, options, w);
            const minCoord = min(coordX, shiftCoords.get(sinkU));
            shiftCoords.set(sinkU, minCoord);
          } else {
            const coordX = -(
              abs(relativeCoords.get(v)! - relativeCoords.get(u)!) - getSeparation(dag.graph, options, w)
            );
            const maxCoord = max(coordX, shiftCoords.get(sinkU));
            shiftCoords.set(sinkU, maxCoord);
          }
        } else {
          const coordV =
            biasX === BiasX.LEFT
              ? max(relativeCoords.get(v)!, relativeCoords.get(u)! + getSeparation(dag.graph, options, w))
              : min(relativeCoords.get(v)!, relativeCoords.get(u)! - getSeparation(dag.graph, options, w));

          relativeCoords.set(v, coordV);
        }
      }
      w = align.get(w)!;
    } while (w !== undefined && w !== v);
  }

  dag.graph.vertices().forEach((vertex) => {
    const isVertexRoot = !root.has(vertex.id);
    if (isVertexRoot) {
      placeBlock(vertex.id, maxPlaceBlockDepth);
    }
  });

  // Unlike in the paper we have two set of coordinates, because the order of processing roots and none roots matters.
  // This is a bug in the paper.
  const absoluteCoords = new Map<VertexId, number>();

  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  dag.graph.vertices().forEach((vertex) => {
    const rootV = root.get(vertex.id) || vertex.id;
    const rootCoord = relativeCoords.get(rootV)!;
    const sinkRootV = sink.get(rootV) || rootV;
    const shiftSinkRootV = shiftCoords.get(sinkRootV) || 0;
    const vertexCoord = rootCoord + shiftSinkRootV;
    absoluteCoords.set(vertex.id, vertexCoord);
    minX = min(minX, vertexCoord);
    maxX = max(maxX, vertexCoord);
  });

  return new Assignment(absoluteCoords, minX, maxX, biasX, biasY);
}

export function findSmallestWidthAssignment(assignments: Array<Assignment>): Assignment {
  return assignments.reduce((left, right) => {
    const leftWidth = left.maxX - left.minX;
    const rightWidth = right.maxX - right.minX;
    return leftWidth < rightWidth ? left : right;
  });
}

export function alignCoordinates(assignments: Array<Assignment>, smallestWidthAssignment: Assignment) {
  let smallestMinCoord = smallestWidthAssignment.minX;
  let smallestMaxCoord = smallestWidthAssignment.maxX;

  // in case of negative coordinates we want coordinates to start at 0..+Infinity
  if (smallestMinCoord !== 0) {
    smallestMaxCoord = smallestMaxCoord - smallestMinCoord;
    smallestMinCoord = 0;
  }

  assignments.forEach((assignment) => {
    assignment.adjustment =
      assignment.biasX === BiasX.LEFT ? smallestMinCoord - assignment.minX : smallestMaxCoord - assignment.maxX;
  });
}

const ACTUAL_ALIGNMENT_LEFT_DOWN = 0;
const ACTUAL_ALIGNMENT_LEFT_UP = 1;
const ACTUAL_ALIGNMENT_RIGHT_DOWN = 2;
const ACTUAL_ALIGNMENT_RIGHT_UP = 3;

export function balance<V, E>(
  dag: FeedbackArcSetDAG<V, E>,
  assignments: Array<Assignment>,
  options: HierarchicalLayoutOptions<any>,
): VertexXCoords {
  const resultCoords = new Map<VertexId, XCoord>();
  if (options.alignmentBias) {
    dag.graph.vertices().forEach((vertex) => {
      resultCoords.set(vertex.id, assignments[0].coords.get(vertex.id)! + assignments[0].adjustment);
    });
  } else {
    // Since the layer 0 starts at the bottom, the actual alignment indexes are the following:
    dag.graph.vertices().forEach((vertex) => {
      const sorted = [
        assignments[ACTUAL_ALIGNMENT_LEFT_UP].coords.get(vertex.id)! + assignments[ACTUAL_ALIGNMENT_LEFT_UP].adjustment,
        assignments[ACTUAL_ALIGNMENT_RIGHT_UP].coords.get(vertex.id)! +
          assignments[ACTUAL_ALIGNMENT_RIGHT_UP].adjustment,
        assignments[ACTUAL_ALIGNMENT_LEFT_DOWN].coords.get(vertex.id)! +
          assignments[ACTUAL_ALIGNMENT_LEFT_DOWN].adjustment,
        assignments[ACTUAL_ALIGNMENT_RIGHT_DOWN].coords.get(vertex.id)! +
          assignments[ACTUAL_ALIGNMENT_RIGHT_DOWN].adjustment,
      ].sort((x, y) => x - y);
      resultCoords.set(vertex.id, (sorted[1] + sorted[2]) / 2.0);
    });
  }
  return resultCoords;
}

function throwIfPredecessorSuccessorUndefined(value: any, layerIdx: number, position: number) {
  if (value === undefined) {
    throw new IllegalStateError(`Could not find vertex on layer ${layerIdx}, position ${position - 1}.`);
  }
}

function throwIfInfiniteLoop(loopCounter: number, maxIterations: number, message: string) {
  if (loopCounter === 0) {
    throw new IllegalStateError(`${message} maxIterations=${maxIterations}`);
  }
}

function throwIfUndefined(value: any, message: string, w: VertexId) {
  if (value === undefined) {
    throw new IllegalStateError(`${message} (${w}).`);
  }
}
