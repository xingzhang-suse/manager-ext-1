import range from "lodash/range";

import { randomInt } from "~/tools/random-int";

import type { VizEdgeData, VizVertexData } from "../../../stackviz/rendering/RenderInput";
import { T2, identity } from "../../Util";
import { FeedbackArcSetDAG, findFeedbackVertexSequence } from "../algos/findFeedbackArcSet";
import {
  type DummyEdgeGenerator,
  type DummyVertexGenerator,
  type GroupIdx,
  Groupings,
  type HierarchicalDummy,
  type HierarchicalEdgeData,
  type HierarchicalVertexData,
  OrderedLayer,
  OrderedLayers,
  type UnorderedLayers,
} from "../algos/hierarchical/hierarchicalCommon";
import { numberOfCrossings, orderLayers } from "../algos/hierarchical/orderLayers";
import { pathLayering } from "../algos/hierarchical/pathLayering";
import { type DummyPaths, replaceLongEdgesWithDummies } from "../algos/hierarchical/replaceLongEdgesWithDummies";
import { DiEdge } from "../DiEdge";
import { Graph, type GraphElement } from "../Graph";
import type { EdgeId, GraphId, VertexId } from "../graphCommon";
import type { Path } from "../Path";

import {
  type Named,
  type NamedGraph,
  type TextGraph,
  generateRandomTextGraph,
  toTextGraph,
  vertexByName,
} from "./graphTestUtil";

export type LayerGroups = Array<NamedLayers>;
export type NamedLayers = Array<Array<string>>;
export type LayeredTextGraph = [TextGraph, NamedLayers];
export type GroupedLayeredTextGraph = [TextGraph, LayerGroups];
export type GroupedLayeredTextGraphs = Array<GroupedLayeredTextGraph>;

export type HVertexData = Named & HierarchicalVertexData;
export type HEdgeData = Named & HierarchicalEdgeData;
export type HGraph = Graph<HVertexData, HEdgeData>;
export type HElement = GraphElement<HVertexData, HEdgeData>;
export type HPath = Path<HVertexData, HEdgeData>;

export type NamedVizVertexData = Named & VizVertexData;
export type NamedVizEdgeData = Named & VizEdgeData;
export type NamedVizGraph = Graph<NamedVizVertexData, NamedVizEdgeData>;

export const emptyLayeredGraph: LayeredTextGraph = [[], []];
export const simpleTwoLayeredGraph: LayeredTextGraph = [
  ["A->D", "B->C"],
  [
    ["A", "B"],
    ["C", "D"],
  ],
];
export const complexTwoLayeredGraph: LayeredTextGraph = [
  ["A->H", "B->F", "C->F", "C->G", "D->G", "D->E"],
  [
    ["A", "B", "C", "D"],
    ["E", "F", "G", "H"],
  ],
];
export const complexThreeLayerGraph: LayeredTextGraph = [
  ["A->F", "B->E", "C->D", "D->H", "E->G", "F->I"],
  [
    ["A", "B", "C"],
    ["D", "E", "F"],
    ["G", "H", "I"],
  ],
];

export function toVizGraph([graphStrings, groupedLayers]: GroupedLayeredTextGraph, column?: number): NamedVizGraph {
  const graph: NamedVizGraph = toHierarchicalGraph(graphStrings) as NamedVizGraph;

  graph.vertices().forEach((v) => {
    v.data().colId = column || 0;
    v.data().rowId = groupedLayers.findIndex((group: NamedLayers) => {
      return group.some((vertices) => vertices.includes(v.data().name));
    });
  });
  return graph;
}

export function toHierarchicalGraph(graphStrings: TextGraph): HGraph {
  const graph = toTextGraph(graphStrings) as HGraph;

  // convert all vertices and their connected edges that start with a lowercase 'd' to dummies
  let dummyId = 0;
  graph.vertices().forEach((v) => {
    const vertexName = v.data().name;
    if (vertexName.startsWith("d")) {
      v.data().hierarchical = { edgeIdReplacedWithDummies: dummyId };

      // dummy nodes can not have multiple edges connected to them!
      expect(v.inDegree()).toBe(1);
      expect(v.outDegree()).toBe(1);
      v.edges().forEach((edge) => {
        edge.data().hierarchical = { edgeIdReplacedWithDummies: dummyId };
      });

      dummyId++;
    }
  });

  return graph;
}

export function assignRandomGroups(graph: Graph<any, any>): Groupings<number> {
  // the number of groups is random and it should not be too low so it does not catch the issues
  // and should not very high so graph contains of only groups
  const numberOfGroups = randomInt(2, 10);

  const vertexIdsPerGroup: Array<Array<VertexId>> = range(numberOfGroups).map(() => []);
  graph.vertices().forEach((vertex) => {
    vertexIdsPerGroup[randomInt(0, numberOfGroups - 1)].push(vertex.id);
  });

  return new Groupings<number>(vertexIdsPerGroup.map((vertexIds, groupIdx) => T2([groupIdx, vertexIds])));
}

export function crossings([graphStrings, layers]: LayeredTextGraph) {
  const graph = toHierarchicalGraph(graphStrings),
    feedbackVertexSequence = findFeedbackVertexSequence(graph),
    orderedLayers = namedToOrderedLayers(graph, layers);
  return numberOfCrossings(graph, feedbackVertexSequence, orderedLayers);
}

export function orderNamedLayers(
  [graphStrings, layers]: LayeredTextGraph,
  sweeps: number = 1,
  foreignWeightMultiplier: number = 3,
): NamedLayers {
  const graph = toHierarchicalGraph(graphStrings),
    unorderedLayers = namedToUnorderedLayers(graph, layers),
    orderedLayers = orderLayers(graph, unorderedLayers, sweeps, foreignWeightMultiplier);

  return orderedLayers.map((layer) => layer.vertexIds.map((vertexId) => graph.vertexById(vertexId).data()["name"]));
}

export function longestPathLayeringWithNames(text: TextGraph): NamedLayers {
  const graph = toHierarchicalGraph(text),
    feedbackVertexSequence = findFeedbackVertexSequence(graph);

  return pathLayering(graph, feedbackVertexSequence).map((layer) =>
    [...layer.vertexIds].map((vertexId) => graph.vertexById(vertexId).data().name).sort(),
  );
}

export function groupedToOrderedLayers(
  graph: NamedGraph,
  layerGroups: LayerGroups,
  excluding?: Set<string>,
): OrderedLayers {
  const orderedGroups = layerGroups
    .map((layerGroup, groupIdx) => namedToOrderedLayers(graph, layerGroup, groupIdx, excluding).layers)
    .flatMap(identity);
  return new OrderedLayers(orderedGroups);
}

export function namedToOrderedLayers(
  graph: NamedGraph,
  layers: Array<Array<string>>,
  groupIdx?: GroupIdx,
  excluding?: Set<string>,
): OrderedLayers {
  const excluded = !!excluding ? excluding : new Set<string>();
  const orderedLayers = layers
    .map((layer) => ({
      vertexIds: layer.flatMap((name) =>
        excluded.has(name) ? [] : vertexByName(graph, name).map((vertex) => vertex.id),
      ),
      groupIdx: groupIdx,
    }))
    .map(OrderedLayer.of);
  return new OrderedLayers(orderedLayers);
}

export function namedToUnorderedLayers(graph: NamedGraph, layers: Array<Array<string>>): UnorderedLayers {
  return namedToOrderedLayers(graph, layers).map((layer) => ({
    vertexIds: new Set(layer.vertexIds),
  }));
}

export function getLayerId(layers: UnorderedLayers, vertexId: GraphId): number {
  const index = layers.findIndex((layer) => layer.vertexIds.has(vertexId));
  if (index < 0) {
    throw new Error("vertex not found in layers.");
  }
  return index;
}

export function createDummyVertexGenerator(): DummyVertexGenerator<
  Named & HierarchicalVertexData,
  Named & HierarchicalEdgeData
> {
  let vSeq = 0;
  return () => ({
    data: {
      name: `DV${vSeq++}`,
    },
  });
}

export function createDummyEdgeGenerator(): DummyEdgeGenerator<
  Named & HierarchicalVertexData,
  Named & HierarchicalEdgeData
> {
  let eSeq = 0;
  return () => ({
    data: {
      name: `DE${eSeq++}`,
    },
  });
}

export function replaceLongEdgesWithNamedDummies(
  graph: NamedGraph,
  namedLayers: NamedLayers,
): [UnorderedLayers, Map<EdgeId, Path<Named, Named>>] {
  const layers = namedToUnorderedLayers(graph, namedLayers),
    hgraph = graph as Graph<Named & HierarchicalDummy, Named & HierarchicalDummy>,
    dummyPaths = replaceLongEdgesWithDummies(hgraph, layers, createDummyVertexGenerator(), createDummyEdgeGenerator());
  return [layers, dummyPaths];
}

export function assertArrayIncreasesMonotonically(array: Array<number>) {
  if (array.length === 0) return;

  let prev = array[0];
  array.forEach((val) => {
    if (val < prev) {
      throw new Error(
        `Array ${JSON.stringify(
          array,
        )} is not increasing monotonically! Expected ${val} to be equal or greater than ${prev}.`,
      );
    }
    prev = val;
  });
}

export interface RandomGraphOpts {
  /**
   * How many base cases should be combined
   **/
  baseCaseCount: number;
  /**
   * How many vertices between the base case graphs should be shuffled. For example two graphs
   * A->B and C->D with a shuffle count of two might become A->C and B->D.
   * */
  shuffleVertexCount: number;
  /**
   * A division factor by which the number of vertices can be reduced, so that the independent
   * graphs even more connected.
   **/
  reductionFactor: number;
}

export function defaultRandomGraphOpts(): RandomGraphOpts {
  return {
    baseCaseCount: 20,
    shuffleVertexCount: 20,
    reductionFactor: 2,
  };
}

export function forRandomHGraphs(times: number, fn: (graph: HGraph, textGraph?: TextGraph) => void) {
  function randomHierarchicalGraph(): { graph: HGraph; textGraph: TextGraph } {
    const [textGraph, graph] = generateRandomTextGraph(defaultRandomGraphOpts());
    return { graph, textGraph };
  }

  fn(new Graph<HVertexData, HEdgeData>()); // empty graph case
  for (let i = 0; i < times - 1; i++) {
    const { graph, textGraph } = randomHierarchicalGraph();
    fn(graph, textGraph);
  }
}

export function createLayeredDag([graphStrings, layerStrings]: LayeredTextGraph) {
  const graph = toHierarchicalGraph(graphStrings);
  const layers = namedToOrderedLayers(graph, layerStrings);
  const dag = FeedbackArcSetDAG.create(graph);

  return { dag, layers };
}

export function dummyPathsToText(dummyPaths: DummyPaths<HVertexData, HEdgeData>): Array<Array<string>> {
  return [...dummyPaths.values()].map((path) =>
    path.sequence().map((element) => {
      if (element instanceof DiEdge) {
        return `${element.source().data().name}->${element.target().data().name}`;
      }
      return element.data().name;
    }),
  );
}
