import isUndefined from "lodash/isUndefined";
import memoize from "lodash/memoize";
import uniqBy from "lodash/uniqBy";

import type { Record } from "~/tools/record";

import type { DiEdge } from "../DiEdge";
import type { EdgeType } from "../EdgeType";
import type { Graph } from "../Graph";
import type { GraphId } from "../graphCommon";
import { type GraphElementBase, graphId } from "../GraphElement";
import type { Vertex } from "../Vertex";

interface Degrees {
  inDegree: number;
  outDegree: number;
}

interface DeltaDegree {
  vertexId: GraphId;
  deltaDegree: number;
}

export type VertexSequence = Record<number, number, "+">;

export class FeedbackArcSetDAG<V, E> {
  readonly outVertices: (v: Vertex<V, E>) => Array<Vertex<V, E>>;
  readonly inVertices: (v: Vertex<V, E>) => Array<Vertex<V, E>>;

  readonly graph: Graph<V, E>;

  readonly feedbackVertexSeq: VertexSequence;

  constructor(graph: Graph<V, E>, feedbackVertexSeq: VertexSequence) {
    this.feedbackVertexSeq = feedbackVertexSeq;
    this.graph = graph;
    // These two functions are used to determine cached unique in- and out-degree based on the graph with the vertex feedback sequence applied
    // It is important that multiple edges that share the same source and the same target are counted uniquely.
    this.outVertices = memoize(
      (v: Vertex<V, E>): Array<Vertex<V, E>> => outVerticesWithFeedbackSeqApplied(feedbackVertexSeq, v),
      graphId, // memoize key
    );
    this.inVertices = memoize(
      (v: Vertex<V, E>): Array<Vertex<V, E>> => inVerticesWithFeedbackSeqApplied(feedbackVertexSeq, v),
      graphId, // memoize key
    );
  }

  static create<V1, E1>(graph: Graph<V1, E1>): FeedbackArcSetDAG<V1, E1> {
    const feedbackVertexSeq = findFeedbackVertexSequence(graph);
    return new FeedbackArcSetDAG(graph, feedbackVertexSeq);
  }
}

export function diEdgeInFas<V, E>(feedbackVertexSeq: VertexSequence, diEdge: DiEdge<V, E>): boolean {
  return feedbackVertexSeq[diEdge.sourceId] > feedbackVertexSeq[diEdge.targetId];
}

function uniqueGraphElements<T extends GraphElementBase<any, any>>(graphElements: Array<T>): Array<T> {
  return uniqBy(graphElements, (ge) => ge.id);
}

/**
 * Returns the out vertices based on the feedback vertex sequence. Based on that sequence
 * directed edges may be inverted and all bidirectional edges will become directional.
 *
 * Bi-edges are interpreted as di-edges by looking at the feedback vertex sequence. Edges can
 * only point from lower to higher order in the feedback vertex sequence, otherwise they will cause
 * loops.
 */
export function outVerticesWithFeedbackSeqApplied<V, E>(
  feedbackVertexSeq: VertexSequence,
  v: Vertex<V, E>,
): Array<Vertex<V, E>> {
  // any vertices that are added after the FAS is calculated will be let through (useful for dummmies that are lateron
  // during the hierarchical layout calculation)
  if (isUndefined(feedbackVertexSeq[v.id])) {
    return v.outVertices();
  }

  const reversedInEdgeTargets = v
    .inDiEdges()
    .filter((e) => diEdgeInFas(feedbackVertexSeq, e))
    .map((e) => e.source());
  const outEdgeTargetNotInFas = v
    .outDiEdges()
    .filter((e) => !diEdgeInFas(feedbackVertexSeq, e))
    .map((e) => e.target());

  const biEdgesConvertedToDiEdges = v
    .biEdges()
    .map((e) => e.other(v))
    .filter((other) => feedbackVertexSeq[other.id] > feedbackVertexSeq[v.id]);

  return uniqueGraphElements([...reversedInEdgeTargets, ...outEdgeTargetNotInFas, ...biEdgesConvertedToDiEdges]);
}

/**
 * Returns the in vertices based on the feedback vertex sequence. Based on that sequence
 * directed edges may be inverted and all bidirectional edges will become directional.
 *
 * Bi-edges are interpreted as di-edges by looking at the feedback vertex sequence. Edges can
 * only point from lower to higher order in the feedback vertex sequence, otherwise they will cause
 * loops.
 */
export function inVerticesWithFeedbackSeqApplied<V, E>(
  feedbackVertexSeq: VertexSequence,
  v: Vertex<V, E>,
): Array<Vertex<V, E>> {
  // any vertices that are added after the FAS is calculated will be let through (useful for dummmies that are lateron
  // during the hierarchical layout calculation)
  if (isUndefined(feedbackVertexSeq[v.id])) {
    return v.inVertices();
  }

  const reversedOutEdgeSources = v
    .outDiEdges()
    .filter((e) => diEdgeInFas(feedbackVertexSeq, e))
    .map((e) => e.target());
  const inEdgeSourcesNotInFas = v
    .inDiEdges()
    .filter((e) => !diEdgeInFas(feedbackVertexSeq, e))
    .map((e) => e.source());

  const biEdgesConvertedToDiEdges = v
    .biEdges()
    .map((e) => e.other(v))
    .filter((other) => feedbackVertexSeq[other.id] < feedbackVertexSeq[v.id]);

  return uniqueGraphElements([...reversedOutEdgeSources, ...inEdgeSourcesNotInFas, ...biEdgesConvertedToDiEdges]);
}

/**
 * Implementation of: A FAST & EFFECTIVE HEURISTIC FOR THE FEEDBACK ARC SET PROBLEM
 * see http://www.csd.uoc.gr/~hy583/papers/ch10.pdf (enhanced greedy heuristic)
 *
 * See http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.47.7745&rep=rep1&type=pdf (doi = 10.1.1.47.7745) for original paper
 * Later paper assumes the arc set is retrieved by following a vertex sequence from left to right, yet this implementation
 * skips that part.
 *
 * @param graph
 * @returns {EdgeType<V, E>[]}
 */
export function findFeedbackArcSet<V, E>(graph: Graph<V, E>): Array<EdgeType<V, E>> {
  return getFeedbackArcSetFromVertexSeq(graph, findFeedbackVertexSequence(graph));
}

export function getFeedbackArcSetFromVertexSeq<V, E>(
  graph: Graph<V, E>,
  feedbackVertexSeq: VertexSequence,
): Array<EdgeType<V, E>> {
  const fasDiEdges = graph
    .diEdges()
    .filter((diEdge) => feedbackVertexSeq[diEdge.sourceId] > feedbackVertexSeq[diEdge.targetId]);
  return [...fasDiEdges, ...graph.biEdges()];
}

/**
 * Returns a vertex feedback sequence that places sources at the front and sinks at the back in such a way that
 * any edge pointing from a higher position in the sequence to a lower position in the sequence is considered to be
 * a feedback arc.
 */
export function findFeedbackVertexSequence<V, E>(graph: Graph<V, E>): VertexSequence {
  const degrees = new Map<number, Degrees>();
  for (const [key, vertex] of graph.verticesMap().entries()) {
    degrees.set(key, {
      inDegree: vertex.inDiDegree(),
      outDegree: vertex.outDegree(),
    });
  }

  const vertices = new Set(degrees.keys());
  const sources = new Set(graph.sources().map((v) => v.id));
  const sinks = new Set(graph.sinks().map((v) => v.id));
  const sLeft: Array<GraphId> = [];
  const sRight: Array<GraphId> = [];

  function deleteVertex(vertex: Vertex<V, E>) {
    vertices.delete(vertex.id);
    sources.delete(vertex.id);
    sinks.delete(vertex.id);
    degrees.delete(vertex.id);

    // decrease degrees of remaining neighbors
    vertex.inDiVertexIds().forEach((sourceVertexId) => {
      const degreesSourceVertex = degrees.get(sourceVertexId);
      if (degreesSourceVertex) {
        degreesSourceVertex.outDegree = degreesSourceVertex.outDegree - 1;
        if (degreesSourceVertex.outDegree === 0) {
          sinks.add(sourceVertexId);
        }
      }
    });
    vertex.outDiVertexIds().forEach((targetVertexId) => {
      const degreesTargetVertex = degrees.get(targetVertexId);
      if (degreesTargetVertex) {
        degreesTargetVertex.inDegree = degreesTargetVertex.inDegree - 1;
        if (degreesTargetVertex.inDegree === 0) {
          sources.add(targetVertexId);
        }
      }
    });
  }

  function calcDeltaDegree(d: Degrees): number {
    return d.outDegree - d.inDegree;
  }

  while (vertices.size > 0) {
    while (sinks.size > 0) {
      const vertex = graph.vertexById(sinks.values().next().value as number);
      deleteVertex(vertex);
      sRight.push(vertex.id);
    }

    while (sources.size > 0) {
      const vertex = graph.vertexById(sources.values().next().value as number);
      deleteVertex(vertex);
      sLeft.push(vertex.id);
    }

    if (vertices.size > 0) {
      const verticesValues = [...vertices.values()];
      const firstVertexId = verticesValues[0];
      const vIdMaxDeltaDegree = verticesValues.reduce<DeltaDegree>(
        (acc, vId) => {
          const totalDegree = calcDeltaDegree(degrees.get(vId)!);
          if (totalDegree > acc.deltaDegree) {
            return { vertexId: vId, deltaDegree: totalDegree };
          }

          return acc;
        },
        {
          vertexId: firstVertexId,
          deltaDegree: calcDeltaDegree(degrees.get(firstVertexId)!),
        },
      ).vertexId;

      const vertex = graph.vertexById(vIdMaxDeltaDegree);

      deleteVertex(vertex);
      sLeft.push(vertex.id);
    }
  }

  let order = 0;
  const result: VertexSequence = {};
  sLeft.forEach((vertexId) => {
    result[vertexId] = order;
    order++;
  });
  for (let i = sRight.length - 1; i >= 0; i--) {
    result[sRight[i]] = order;
    order++;
  }
  return result;
}
