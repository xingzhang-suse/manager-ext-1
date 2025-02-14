import range from "lodash/range";

import { abs } from "~/tools/abs";
import { max } from "~/tools/max";
import { min } from "~/tools/min";
import type { Record } from "~/tools/record";

import { extend } from "../../../../common/functions";
import type { EdgeType } from "../../EdgeType";
import type { Graph, GraphElement, GraphElementSequence } from "../../Graph";
import { type EdgeId, type GraphId, IllegalStateGraphError } from "../../graphCommon";
import { graphId } from "../../GraphElement";
import { Path } from "../../Path";
import type { Vertex } from "../../Vertex";

import type {
  DummyEdgeGenerator,
  DummyVertexGenerator,
  HierarchicalDummy,
  UnorderedLayers,
} from "./hierarchicalCommon";

export type DummyPaths<V, E> = Map<EdgeId, Path<V, E>>;

/**
 * For edges in the inOutGraph whose vertices span more than 1 layer, the edge is replaced with dummy vertices and edges
 * in such a way that each layer contains a dummy vertex. The dummy vertices are inserted into inOutUnorderedLayers.
 *
 * The dummy vertices and edges are inserted in the graph, and a Path is created starting from the source dummy edge up and
 * until the target dummy edge. The vertex data of the source and target of the dummy path are untouched, but are
 * included in the sequence of the path.
 *
 * The dummy paths created in the graph are returned.
 */
export function replaceLongEdgesWithDummies<V extends HierarchicalDummy, E extends HierarchicalDummy>(
  inOutGraph: Graph<V, E>,
  inOutUnorderedLayers: UnorderedLayers,
  dummyVertexGenerator: DummyVertexGenerator<V, E>,
  dummyEdgeGenerator: DummyEdgeGenerator<V, E>,
): DummyPaths<V, E> {
  function toLayerIdxLookup(unorderedLayers: UnorderedLayers): Record<number, number> {
    const lookup: Record<number, number, "+"> = {};
    for (let layerIdx = 0; layerIdx < unorderedLayers.length; layerIdx++) {
      unorderedLayers[layerIdx].vertexIds.forEach((vertexId) => {
        lookup[vertexId] = layerIdx;
      });
    }
    return lookup;
  }

  function getLayerIdx(vId: GraphId): number {
    const l = layerIdxLookup[vId];
    if (l === undefined) {
      throw new IllegalStateGraphError(`Could not find layer for vertex with id '${vId}'.`);
    }
    return l;
  }

  function insertDummies(edge: EdgeType<V, E>): Path<V, E> {
    const layerA = getLayerIdx(edge.aId);
    const layerB = getLayerIdx(edge.bId);
    const aToB = layerA > layerB;

    const startVertexId = aToB ? edge.aId : edge.bId;
    const endVertexId = aToB ? edge.bId : edge.aId;
    const startLayer = aToB ? layerA : layerB;
    const endLayer = aToB ? layerB : layerA;

    inOutGraph.removeEdgeById(edge.id);

    let targetLayerIds = range(min(startLayer, endLayer) + 1, max(startLayer, endLayer));
    if (startLayer > endLayer) targetLayerIds = targetLayerIds.reverse();

    const dummyVertices = targetLayerIds.map((layerIdx) => {
      const vertexDef = dummyVertexGenerator(edge);
      return {
        layerIdx: layerIdx,
        vertex: inOutGraph.addVertex(vertexDef),
      };
    });

    const dummySequence: GraphElementSequence<V, E> = [];
    const verticesPath: Array<Vertex<V, E>> = [
      inOutGraph.vertexById(startVertexId),
      ...dummyVertices.map((d) => d.vertex),
      inOutGraph.vertexById(endVertexId),
    ];

    for (let i = 0; i < verticesPath.length - 1; i++) {
      const dummyEdgeDef = extend(dummyEdgeGenerator(edge), {
        sourceId: verticesPath[i].id,
        targetId: verticesPath[i + 1].id,
      });

      dummySequence.push(verticesPath[i]);
      dummySequence.push(inOutGraph.addEdge(dummyEdgeDef));
    }
    dummySequence.push(verticesPath[verticesPath.length - 1]);

    const dummyPath = new Path(
      true,
      dummySequence.map(
        graphId as (value: GraphElement<V, E>, index: number, array: Array<GraphElement<V, E>>) => number,
      ),
      inOutGraph,
    );

    dummySequence
      .filter((element) => element.id !== startVertexId && element.id !== endVertexId)
      .forEach((element) => {
        const elementData = element.data();
        elementData.hierarchical = elementData.hierarchical || {};
        elementData.hierarchical.edgeIdReplacedWithDummies = edge.id;
      });

    dummyVertices.forEach((dummy) => inOutUnorderedLayers[dummy.layerIdx].vertexIds.add(dummy.vertex.id));

    return dummyPath;
  }

  const layerIdxLookup = toLayerIdxLookup(inOutUnorderedLayers);
  const result = new Map<EdgeId, Path<V, E>>();
  inOutGraph
    .edges()
    .filter((edge) => abs(getLayerIdx(edge.aId) - getLayerIdx(edge.bId)) > 1)
    .forEach((edge) => {
      result.set(edge.id, insertDummies(edge));
    });

  return result;
}
