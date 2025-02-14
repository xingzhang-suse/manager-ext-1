import type { Graph } from "../../Graph";
import type { Vertex } from "../../Vertex";
import { FeedbackArcSetDAG, type VertexSequence } from "../findFeedbackArcSet";

import type { Groupings, UnorderedLayers } from "./hierarchicalCommon";

export function pathLayering<V, E>(
  graph: Graph<V, E>,
  feedbackVertexSeq: VertexSequence,
  groupings?: Groupings<any>,
  maxWidth?: { W: number; c: number },
): UnorderedLayers {
  if (groupings) {
    return groupings.groupIndices.flatMap((groupIdx) =>
      pathLayeringForGroup(
        graph,
        feedbackVertexSeq,
        new Set(groupings.verticesByGroupIdx(groupIdx)),
        maxWidth,
        groupIdx,
      ),
    );
  } else {
    return pathLayeringForGroup(graph, feedbackVertexSeq, graph.vertexIds(), maxWidth);
  }
}

/**
 * Based on: "A Heuristic for Minimum-Width GraphLayering with Consideration of Dummy Nodes".
 * DOI: 10.1007/978-3-540-24838-5_42
 */
function pathLayeringForGroup<V, E>(
  graph: Graph<V, E>,
  feedbackVertexSeq: VertexSequence,
  verticesInGroup: Set<number>,
  maxWidth?: { W: number; c: number },
  groupIdx?: number,
): UnorderedLayers {
  if (verticesInGroup.size <= 0) return [];

  // it might be tempting to have this type as an input to this function, so that the feedbackVertexSeq does not need
  // to be passed, but the graph is modified for dummy vertices lateron in the hierarchical layout algorithm and then
  // the caches inside this data type need to be invalidated, so it safer to not expose it while the graph is still subject
  // to change.
  const dag = new FeedbackArcSetDAG(graph, feedbackVertexSeq);

  const remainingVertices = new Map<number, Vertex<V, E>>();
  verticesInGroup.forEach((vertexId) => remainingVertices.set(vertexId, dag.graph.vertexById(vertexId)));

  if (remainingVertices.size === 0) return [];
  const verticesPerLayer: Set<number>[] = [];
  let currentLayer = new Set<number>();
  let widthCurrent = 0;
  let widthUp = 0;

  verticesPerLayer.push(currentLayer);

  const previousLayeredVertices = new Set<number>(); // Z
  const currentLayerVertices = new Set<number>();

  function candidates(): Vertex<V, E>[] {
    const candidates = [...remainingVertices.values()].filter((v) =>
      dag
        .outVertices(v)
        .every((neighbor) => previousLayeredVertices.has(neighbor.id) || !verticesInGroup.has(neighbor.id)),
    ); // N+(v) ⊆ Z
    if (maxWidth) {
      return candidates.sort((v1, v2) => dag.outVertices(v1).length - dag.outVertices(v2).length); // Conditional Select
    } else {
      return candidates;
    }
  }

  let currentCandidates: Vertex<V, E>[] = candidates();
  const cMultipliedW = maxWidth ? maxWidth.c * maxWidth.W : 1;

  while (remainingVertices.size > 0) {
    const v = currentCandidates.pop();
    if (v) {
      currentLayer.add(v.id);
      currentLayerVertices.add(v.id);
      remainingVertices.delete(v.id);

      if (maxWidth) {
        widthCurrent -= dag.outVertices(v).length + 1;
        widthUp += dag.inVertices(v).length;
      }
    }

    const conditionUp =
      maxWidth && (widthUp >= cMultipliedW || (widthCurrent > maxWidth.W && dag.outVertices(v!).length < 1));
    if (!v || conditionUp) {
      const newCurrentLayer = new Set<number>();
      verticesPerLayer.push(newCurrentLayer);
      currentLayer = newCurrentLayer;
      currentLayerVertices.forEach((value) => previousLayeredVertices.add(value));
      currentLayerVertices.clear();

      if (maxWidth) {
        widthCurrent = widthUp;
        widthUp = 0;
      }

      if (currentCandidates.length === 0) {
        currentCandidates = candidates();
      }
    }
  }

  return verticesPerLayer.map((layer) => ({
    vertexIds: layer,
    groupIdx: groupIdx,
  }));
}
