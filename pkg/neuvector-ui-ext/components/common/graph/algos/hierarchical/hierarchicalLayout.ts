import { toKeys } from "~/tools/to-keys";

import { arrayToNumDict } from "../../../Util";
import type { Graph } from "../../Graph";
import type { EdgeId } from "../../graphCommon";
import type { Path } from "../../Path";
import { FeedbackArcSetDAG, type VertexSequence, findFeedbackVertexSequence } from "../findFeedbackArcSet";

import type {
  DummyEdgeGenerator,
  DummyVertexGenerator,
  Groupings,
  HierarchicalEdgeData,
  HierarchicalVertexData,
  OrderedLayers,
} from "./hierarchicalCommon";
import { orderLayers } from "./orderLayers";
import { pathLayering } from "./pathLayering";
import { type BiasX, type BiasY, type VertexXCoords, positionX } from "./positionX";
import { type DummyPaths, replaceLongEdgesWithDummies } from "./replaceLongEdgesWithDummies";

export function defaultInitialHierarchicalLayoutOptions(): InitialHierarchicalLayoutOptions {
  return {
    reduceCrossingsSweeps: 8,
    foreignWeightMultiplier: 3,
    vertexWidth: 1,
    betweenDummyNodeWidth: 0.5,
    compactionMaxPlaceBlockDepth: 10000,
    compactionMaxLinkedListIterations: 10000,
    groupRatioX: 16,
    groupRatioY: 9,
  };
}

export interface PositionBias {
  biasX: BiasX;
  biasY: BiasY;
}

export interface InitialHierarchicalLayoutOptions {
  maxWidth?: {
    W: number;
    c: number;
  };

  /**
   * How many times crossing reduction should occur. A minimum of 2 is advised.
   */
  reduceCrossingsSweeps: number;

  /**
   * When providing columns to the layout function, the layout algorithm is performed once for each column.
   * In order to account for relations from components in one column to another column,
   * they are used within the orderLayers functions. Each relation has a weight, which either pulls to the left or right.
   * The foreignWeightMultiplier is multiplied with this weight in order to give cross-domain relations more weight.
   *
   * Use a value >= 1. (Or 0 to exclude foreign relations from calculating the order.)
   */
  foreignWeightMultiplier: number;

  /**
   * Separation width between 2 real vertexes and between real vertex and dummy
   */
  vertexWidth: number;
  /**
   * Separation width between 2 dummy vertexes
   */
  betweenDummyNodeWidth: number;

  /**
   * Infinite loop control over the horizontalCompaction.place_block recursion.
   */
  compactionMaxPlaceBlockDepth: number;

  /**
   * Infinite loop control over horizontalCompaction linked list while cycle.
   */
  compactionMaxLinkedListIterations: number;
  /**
   * X coordinate ratio maintained during positioning orphans.
   */
  groupRatioX: number;
  /**
   * Y coordinate ratio maintained during positioning orphans.
   */
  groupRatioY: number;
  /**
   * fixed X/Y-biased layout, used only for testing purposes
   */
  alignmentBias?: PositionBias;
}

export interface GraphDependentHierarchicalLayoutOptions<G> {
  /**
   * What layer groups exist?
   */
  groupings?: Groupings<G>;
}

export interface HierarchicalLayoutOptions<G>
  extends InitialHierarchicalLayoutOptions,
    GraphDependentHierarchicalLayoutOptions<G> {}

/**
 * Separate results of the hierarchical layout algorithm. The results are also encoded into the graph.
 */
export interface HierarchicalLayout<V, E> {
  /**
   * Which vertices have been assigned to which layers.
   */
  layers: OrderedLayers;

  /**
   * Which Edges have been replaces with which paths.
   */
  dummyPaths: Map<EdgeId, Path<V, E>>;

  /**
   * The x coordinates for each vertex.
   */
  coords: VertexXCoords;
}

/**
 * Modifies the graph in such a way that each vertex is assigned to a layer. Some edges are replaced
 * with paths of dummy vertices and edges.
 *
 * @param inOutGraph The graph to be modified
 * @param dummyVertexGenerator How to generate vertices.
 * @param dummyEdgeGenerator How to generate edges.
 * @param options How to calculate layers.
 * @returns A HierarchicalLayout. The Graph is also modified!
 */
export function hierarchicalLayout<V extends HierarchicalVertexData, E extends HierarchicalEdgeData>(
  inOutGraph: Graph<V, E>,
  dummyVertexGenerator: DummyVertexGenerator<V, E>,
  dummyEdgeGenerator: DummyEdgeGenerator<V, E>,
  options: HierarchicalLayoutOptions<any>,
): HierarchicalLayout<V, E> {
  const { coords, layers, dummyPaths } = getHierarchicalLayout(
    inOutGraph,
    dummyVertexGenerator,
    dummyEdgeGenerator,
    options,
  );

  // update the graph vertices and edges with all new hierarchical info
  layers.forEach((layer, layerIdx) => {
    layer.vertexIds.forEach((vertexId, orderIdx) => {
      const vertex = inOutGraph.vertexById(vertexId),
        vertexData = vertex.data();

      vertexData.hierarchical = vertexData.hierarchical || {};
      vertexData.hierarchical.layer = layerIdx;
      vertexData.hierarchical.groupIdx = layer.groupIdx;
      vertexData.hierarchical.order = orderIdx;
      vertexData.hierarchical.xCoord = coords.get(vertexId);
    });
  });

  return {
    layers,
    dummyPaths,
    coords,
  };
}

export function getHierarchicalLayout<V extends HierarchicalVertexData, E extends HierarchicalEdgeData>(
  inOutGraph: Graph<V, E>,
  dummyVertexGenerator: DummyVertexGenerator<V, E>,
  dummyEdgeGenerator: DummyEdgeGenerator<V, E>,
  options: HierarchicalLayoutOptions<any>,
): {
  dag: FeedbackArcSetDAG<V, E>;
  dummyPaths: DummyPaths<V, E>;
  layers: OrderedLayers;
  coords: VertexXCoords;
} {
  let feedbackVertexSeq = findFeedbackVertexSequence(inOutGraph);

  if (options.groupings) {
    feedbackVertexSeq = reorderFeedbackVertexSeqByGroupings(options.groupings, feedbackVertexSeq);
  }

  const unorderedLayers = pathLayering(inOutGraph, feedbackVertexSeq, options.groupings, options.maxWidth);

  const dummyPaths = replaceLongEdgesWithDummies(inOutGraph, unorderedLayers, dummyVertexGenerator, dummyEdgeGenerator);

  const layers = orderLayers(
    inOutGraph,
    unorderedLayers,
    options.reduceCrossingsSweeps,
    options.foreignWeightMultiplier,
  );

  const dag = new FeedbackArcSetDAG(inOutGraph, feedbackVertexSeq);

  const coords = positionX(dag, layers, options);

  return { dag, layers, coords, dummyPaths };
}

export function reorderFeedbackVertexSeqByGroupings(
  groupings: Groupings<any>,
  feedbackVertexSeq: VertexSequence,
): VertexSequence {
  const reorderedVertices = toKeys(feedbackVertexSeq)
    .map(Number)
    .map((vertexId) => ({
      vertexId: vertexId,
      groupIdx: groupings.groupIdxByVertexId(vertexId),
      fasOrder: feedbackVertexSeq[vertexId],
    }))
    .sort((a, b) => {
      if (a.groupIdx !== b.groupIdx) {
        return b.groupIdx - a.groupIdx;
      }

      return a.fasOrder - b.fasOrder;
    });

  return arrayToNumDict(
    reorderedVertices,
    (v) => v.vertexId,
    (v, idx) => idx,
  );
}
