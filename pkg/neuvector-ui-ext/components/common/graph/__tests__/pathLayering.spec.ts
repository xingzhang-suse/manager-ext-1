import uniq from "lodash/uniq";

import { createChapter10Graph } from "../__fixtures__/graphTestUtil";
import {
  assertArrayIncreasesMonotonically,
  assignRandomGroups,
  forRandomHGraphs,
  getLayerId,
  longestPathLayeringWithNames,
} from "../__fixtures__/hierarchicalTestUtil";
import { findFeedbackVertexSequence, outVerticesWithFeedbackSeqApplied } from "../algos/findFeedbackArcSet";
import { reorderFeedbackVertexSeqByGroupings } from "../algos/hierarchical/hierarchicalLayout";
import { pathLayering } from "../algos/hierarchical/pathLayering";

describe("The Longest-Path Layering algorithm", () => {
  it("should produce an empty set when the graph is empty.", () => {
    expect(longestPathLayeringWithNames([])).toEqual([]);
  });

  it("should produce distinct layers for chains.", () => {
    expect(longestPathLayeringWithNames(["A->B->C"])).toEqual([["C"], ["B"], ["A"]]);
  });

  it("should produce two distinct layers for a graph with only a bi-edge.", () => {
    expect(longestPathLayeringWithNames(["A<->B"])).toEqual([["B"], ["A"]]);
  });

  it("should produce two distinct layers for a graph with a cycle.", () => {
    expect(longestPathLayeringWithNames(["A->B->A"])).toEqual([["B"], ["A"]]);
  });

  it("should produce three layers for a tree of three layers.", () => {
    expect(longestPathLayeringWithNames(["A->B", "A->C", "A->D", "B->E", "B->F", "C->G", "D->H", "D->I"])).toEqual([
      ["E", "F", "G", "H", "I"],
      ["B", "C", "D"],
      ["A"],
    ]);
  });

  it("should work with more complex graphs (figure 9.14 chapter 10 of handbook of graph drawing)", () => {
    expect(longestPathLayeringWithNames(createChapter10Graph(true))).toEqual([
      ["A1", "D1", "D2", "D3", "D4"],
      ["C1", "C2", "C3", "C4"],
      ["B1", "B2", "B3"],
      ["A2", "A3", "A4"],
    ]);
  });

  it("should have layers, where each layer only contains out-vertices for lower layers.", () => {
    forRandomHGraphs(100, (graph) => {
      const feedbackVertexSequence = findFeedbackVertexSequence(graph);
      const layers = pathLayering(graph, feedbackVertexSequence);

      graph.vertices().forEach((vertex) => {
        const outVertices = outVerticesWithFeedbackSeqApplied(feedbackVertexSequence, vertex);

        outVertices.forEach((outVertex) => {
          expect(getLayerId(layers, outVertex.id)).toBeLessThan(getLayerId(layers, vertex.id));
        });
      });
    });
  });
});

describe("The Longest-Path Layering algorithm with layer groups", () => {
  it("guarantees certain properties hold with random generated graphs.", () => {
    forRandomHGraphs(100, (graph) => {
      const groupings = assignRandomGroups(graph),
        feedbackVertexSequence = reorderFeedbackVertexSeqByGroupings(groupings, findFeedbackVertexSequence(graph)),
        unorderedLayers = pathLayering(graph, feedbackVertexSequence, groupings);

      // no empty layers
      unorderedLayers.forEach((layer) => {
        expect(layer.vertexIds.size).toBeGreaterThan(0);
      });

      // All vertices in a layer belong to the same group.
      unorderedLayers.forEach((layer) => {
        expect(uniq([...layer.vertexIds].map((vertexId) => groupings.groupIdxByVertexId(vertexId))).length).toBe(1);
      });

      // The groups assigned to layers are increasing monotonically
      const layersAssignedToGroups = unorderedLayers.map((layer) =>
        groupings.groupIdxByVertexId(layer.vertexIds.values().next().value! as number),
      );
      assertArrayIncreasesMonotonically(layersAssignedToGroups);

      // For every vertex in a layer, it holds that all outgoing neighbours (with the feedbackVertexSequence applied) are in a lower layer or in a lower group.
      graph.vertices().forEach((vertex) => {
        const currentLayerIdx = unorderedLayers.findIndex((layer) => layer.vertexIds.has(vertex.id));
        expect(currentLayerIdx).toBeGreaterThan(-1);

        outVerticesWithFeedbackSeqApplied(feedbackVertexSequence, vertex).forEach((outVertex) => {
          const layerIdx = unorderedLayers.findIndex((layer) => layer.vertexIds.has(outVertex.id));
          expect(layerIdx).toBeGreaterThan(-1);
          expect(layerIdx).toBeLessThan(currentLayerIdx);
        });
      });
    });
  });
});
