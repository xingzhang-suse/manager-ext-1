import { T2 } from "../../Util";
import {
  createDummyEdgeGenerator,
  createDummyVertexGenerator,
  dummyPathsToText,
  toHierarchicalGraph,
} from "../__fixtures__/hierarchicalTestUtil";
import type { VertexSequence } from "../algos/findFeedbackArcSet";
import { Groupings } from "../algos/hierarchical/hierarchicalCommon";
import {
  defaultInitialHierarchicalLayoutOptions,
  getHierarchicalLayout,
  reorderFeedbackVertexSeqByGroupings,
} from "../algos/hierarchical/hierarchicalLayout";

describe("The hierarchical layout function", () => {
  it("generates a proper graph (each neighbor of a vertex is either in the layer above or below)", () => {
    const graph = toHierarchicalGraph(["A->B->C", "A->C", "A->D", "D->B", "C->A"]);
    const { dag, layers, dummyPaths } = getHierarchicalLayout(
      graph,
      createDummyVertexGenerator(),
      createDummyEdgeGenerator(),
      {
        ...defaultInitialHierarchicalLayoutOptions(),
        ...{
          reduceCrossingsSweeps: 2,
          foreignWeightMultiplier: 1,
        },
      },
    );

    expect(layers.map((_) => _.vertexIds.map((_) => graph.vertexById(_).data().name))).toEqual([
      ["C"],
      ["B", "DV2", "DV4"],
      ["D", "DV0", "DV1", "DV3"],
      ["A"],
    ]);
    expect(dummyPathsToText(dummyPaths)).toEqual([
      ["A", "A->DV0", "DV0", "DV0->B", "B"],
      ["A", "A->DV1", "DV1", "DV1->DV2", "DV2", "DV2->C", "C"],
      ["A", "A->DV3", "DV3", "DV3->DV4", "DV4", "DV4->C", "C"],
    ]);

    graph.vertices().map((v) => {
      const vLayer = layers.getVertexPositionInLayer(v.id)!.layerIdx;
      dag
        .inVertices(v)
        .map((inV) => layers.getVertexPositionInLayer(inV.id)!.layerIdx)
        .forEach((inVertexLayer) => {
          expect(inVertexLayer).toEqual(vLayer + 1);
        });
    });
  });
});

describe("The reorderFeedbackVertexSeqByGroupings function", () => {
  it("should make sure that vertices in lower groups are always in a higher position in the vertex feedback sequence", () => {
    const feedbackVertexSeq: VertexSequence = {
      6: 6,
      7: 7,
      8: 8, //  layer group 2
      3: 3,
      4: 4,
      5: 5, // layer group 1
      0: 0,
      1: 1,
      2: 2, // layer group 0
    };

    const groups = [T2([0, [0, 1, 2]]), T2([1, [3, 4, 5]]), T2([2, [6, 7, 8]])];

    expect(reorderFeedbackVertexSeqByGroupings(new Groupings<number>(groups), feedbackVertexSeq)).toEqual({
      6: 0,
      7: 1,
      8: 2,
      3: 3,
      4: 4,
      5: 5,
      0: 6,
      1: 7,
      2: 8,
    });
  });
});
