import { isPresent } from "~/tools/is-present";
import { sum } from "~/tools/sum";

import type { Graph } from "../../Graph";
import { graphId } from "../../GraphElement";
import { type VertexSequence, outVerticesWithFeedbackSeqApplied } from "../findFeedbackArcSet";

import {
  ColumnWeights,
  type HierarchicalVertexData,
  OrderedLayer,
  type OrderedLayerData,
  OrderedLayers,
  type UnorderedLayers,
} from "./hierarchicalCommon";

export class VertexOrderingInLayer {
  private readonly _vertexId: number;

  private readonly foreignColumnWeights: ColumnWeights;

  private readonly indicesForThisVertex: Array<number>;

  private readonly numberOfLeftRelations: number;
  private readonly numberOfRightRelations: number;

  private readonly divideFactor: number;

  private readonly center: number;

  private readonly leftForeignWeight: number;
  private readonly rightForeignWeight: number;

  constructor(
    _vertexId: number,
    allVertexIds: Array<number>,
    neighbourIds: Array<number>,
    foreignColumnWeights: ColumnWeights,
    foreignWeightMultiplier: number,
  ) {
    this.foreignColumnWeights = foreignColumnWeights;
    this._vertexId = _vertexId;

    const excludeForeign = foreignWeightMultiplier < 1;
    // each value in this Map points to the index in the `allVertexIds` array
    const indexByVertexId = new Map<number, number>(allVertexIds.map((vertexId, index) => [vertexId, index]));
    this.indicesForThisVertex = neighbourIds.map((vertexId) => indexByVertexId.get(vertexId)).filter(isPresent);
    this.numberOfLeftRelations = this.foreignColumnWeights.left.numRelations;
    this.numberOfRightRelations = this.foreignColumnWeights.right.numRelations;
    this.divideFactor =
      this.indicesForThisVertex.length +
      (excludeForeign ? 0 : this.numberOfLeftRelations + this.numberOfRightRelations);
    this.center = (allVertexIds.length - 1) / 2; // 0,1,2,3,4 -> 2 and 0,1,2,3 -> 1.5

    // with a foreignWeightMultiplier of 1, this means every left foreign relation generates a score of -1
    // and every right foreign relation a score of allVertexIds.length
    // while 0.5 would actually move them inward (so don't do that)
    this.leftForeignWeight = excludeForeign ? 0 : this.center - foreignWeightMultiplier * (this.center + 1);
    this.rightForeignWeight = excludeForeign ? 0 : this.center + foreignWeightMultiplier * (this.center + 1);
  }

  summedScore() {
    return (
      sum(this.indicesForThisVertex) +
      this.leftForeignWeight * this.numberOfLeftRelations +
      this.rightForeignWeight * this.numberOfRightRelations
    );
  }

  get score(): number {
    const summedScore = this.summedScore();

    if (this.isEmpty) return summedScore;
    return summedScore / this.divideFactor;
  }

  get vertexId() {
    return this._vertexId;
  }

  get indices() {
    return this.indicesForThisVertex;
  }

  get isEmpty(): boolean {
    return this.divideFactor === 0;
  }

  get leftDistance(): number {
    return this.foreignColumnWeights.left.maxDistance;
  }

  get rightDistance(): number {
    return this.foreignColumnWeights.right.maxDistance;
  }

  compareTo(other: VertexOrderingInLayer): number {
    const deltaScore = this.score - other.score;

    if (deltaScore !== 0) return deltaScore;

    const deltaDistance = (this.leftDistance - other.leftDistance) * -1 + this.rightDistance - other.rightDistance;

    if (deltaDistance !== 0) return deltaDistance;

    return this.vertexId - other.vertexId;
  }

  static compare(a: VertexOrderingInLayer, b: VertexOrderingInLayer): number {
    return a.compareTo(b);
  }
}

/**
 * Reduces the number of crossings between layer v1 and v2, by calculating for each vertex in v2 the average position of their neigbours in v1.
 * All vertices in v2 are sorted accordingly and ties are broken by comparing the vertexId.
 * See http://www.csd.uoc.gr/~hy583/papers/ch10.pdf for an description of reducing crossings by using the baryCenter.
 *
 * @param graph A proper graph i.e. for all edges in the graph it holds that the difference between the layers of its vertices is not greater than one.
 * @param unorderedLayers
 * @param reduceCrossingsSweeps The number of times that a sweep is performed on all layers, to reduce to number of crossings.
 * All odd counts iterate from top to bottom, while all even counts iterate from bottom to top.
 * @param foreignWeightMultiplier
 * @returns {OrderedLayers}
 */
export function orderLayers<V extends HierarchicalVertexData, E>(
  graph: Graph<V, E>,
  unorderedLayers: UnorderedLayers,
  reduceCrossingsSweeps: number,
  foreignWeightMultiplier: number,
): OrderedLayers {
  function reduceCrossingsBetween(currentLayer: OrderedLayerData, connectedLayer: OrderedLayerData): OrderedLayerData {
    const vertexScores: Array<VertexOrderingInLayer> = currentLayer.vertexIds
      .map((id) => graph.vertexById(id))
      .map((vertex) => {
        const columnWeights = vertex.data().hierarchical?.columnWeights ?? new ColumnWeights();

        return new VertexOrderingInLayer(
          vertex.id,
          connectedLayer.vertexIds,
          vertex.neighborIds(),
          columnWeights,
          foreignWeightMultiplier,
        );
      });

    return {
      vertexIds: vertexScores.sort(VertexOrderingInLayer.compare).map((b) => b.vertexId),
      groupIdx: currentLayer.groupIdx,
    };
  }

  const orderedLayers: Array<OrderedLayerData> = unorderedLayers.map((layer) => ({
    vertexIds: [...layer.vertexIds],
    groupIdx: layer.groupIdx,
  }));

  if (reduceCrossingsSweeps <= 0 || unorderedLayers.length === 0) {
    return new OrderedLayers(orderedLayers.map(OrderedLayer.of));
  }

  for (let sweep = 0; sweep < reduceCrossingsSweeps; sweep++) {
    if (sweep % 2 === 0) {
      // Bottom-up sweep (layer 0 is visualized at the bottom)
      for (let layerIdx = 1; layerIdx < orderedLayers.length; layerIdx++) {
        orderedLayers[layerIdx] = reduceCrossingsBetween(orderedLayers[layerIdx], orderedLayers[layerIdx - 1]);
      }
    } else {
      // Top down sweep
      for (let layerIdx = orderedLayers.length - 2; layerIdx >= 0; layerIdx--) {
        orderedLayers[layerIdx] = reduceCrossingsBetween(orderedLayers[layerIdx], orderedLayers[layerIdx + 1]);
      }
    }
  }

  return new OrderedLayers(orderedLayers.map(OrderedLayer.of));
}

/**
 * Beware: O(|E|^2) performance! Use for testing only.
 */
export function numberOfCrossings<V, E>(
  graph: Graph<V, E>,
  feedbackVertexSeq: VertexSequence,
  layers: OrderedLayers,
): number {
  function numberOfCrossingsBetween<V, E>(
    graph: Graph<V, E>,
    feedbackVertexSeq: VertexSequence,
    layer1: Array<number>,
    layer2: Array<number>,
  ): number {
    let totalCrossings = 0;

    for (let firstIdx = 0; firstIdx < layer1.length; firstIdx++) {
      const outVerticesOfFirst = outVerticesWithFeedbackSeqApplied(
        feedbackVertexSeq,
        graph.vertexById(layer1[firstIdx]),
      ).map(graphId);
      const outVertexIndicesOfFirstInLayer2 = outVerticesOfFirst.map((vertexId) =>
        layer2.findIndex((id) => id === vertexId),
      );

      for (let secondIdx = firstIdx + 1; secondIdx < layer1.length; secondIdx++) {
        const outVerticesOfSecond = outVerticesWithFeedbackSeqApplied(
          feedbackVertexSeq,
          graph.vertexById(layer1[secondIdx]),
        ).map(graphId);
        const outVertexIndicesOfSecondInLayer2 = outVerticesOfSecond.map((vertexId) =>
          layer2.findIndex((id) => id === vertexId),
        );

        const crossingsArray: Array<Array<number>> = outVertexIndicesOfFirstInLayer2.map((firstOutIdx) =>
          outVertexIndicesOfSecondInLayer2.map((secondOutIdx) => (firstOutIdx > secondOutIdx ? 1 : 0)),
        );
        totalCrossings += sum(crossingsArray.flat());
      }
    }

    return totalCrossings;
  }

  let totalCrossings = 0;
  layers.forEach((layer, idx) => {
    if (idx !== 0) {
      totalCrossings += numberOfCrossingsBetween(
        graph,
        feedbackVertexSeq,
        layers.get(idx - 1).vertexIds,
        layers.get(idx).vertexIds,
      );
    }
  });
  return totalCrossings;
}
