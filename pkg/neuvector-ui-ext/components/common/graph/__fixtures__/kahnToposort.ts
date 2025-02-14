import type { Record } from "~/tools/record";
import { toKeys } from "~/tools/to-keys";

import type { Graph } from "../Graph";
import type { Vertex } from "../Vertex";

/**
 * @param graph input graph
 * @returns sorted vertices or empty when the graph could not be sorted
 * because it is cyclic.
 */
export function kahnToposort<V, E>(graph: Graph<V, E>): Array<Vertex<V, E>> | undefined {
  if (graph.vertexCount() === 0) {
    return [];
  }

  if (graph.biEdgeCount() > 0) {
    return undefined;
  }

  const sources = graph.sources();
  if (sources.length === 0) {
    // graph that has vertices, but none of these
    // vertices have 0 incoming edges is cyclic
    return undefined;
  }

  const result: Array<Vertex<V, E>> = [];
  const erasedEdges: Record<number, boolean, "+"> = [];

  while (sources.length > 0) {
    const n = sources.pop()!;
    result.push(n);

    n.outEdges()
      .filter((e) => !erasedEdges[e.id])
      .forEach((e) => {
        erasedEdges[e.id] = true;
        const m = e.other(n);
        if (m.inEdges().filter((e) => !erasedEdges[e.id]).length === 0) {
          sources.push(m);
        }
      });
  }

  if (toKeys(erasedEdges).length < graph.edgeCount()) {
    return undefined;
  }

  return result;
}

export function isCyclic<V, E>(graph: Graph<V, E>): boolean {
  return !kahnToposort(graph);
}
