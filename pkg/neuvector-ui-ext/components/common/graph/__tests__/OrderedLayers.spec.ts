import { floor } from "~/tools/floor";
import { toArray } from "~/tools/to-array";

import { type LayeredTextGraph, createLayeredDag } from "../__fixtures__/hierarchicalTestUtil";
import {
  type GroupIdx,
  type GroupedLayers,
  OrderedLayer,
  OrderedLayers,
} from "../algos/hierarchical/hierarchicalCommon";
import { DEFAULT_GROUP_ID } from "../algos/hierarchical/orphans";
import type { Graph } from "../Graph";
import type { VertexId } from "../graphCommon";

describe("getGroupedLayers", () => {
  it("should return correctly grouped layers", () => {
    /**
     *     - A --
     *    /  |   \
     *   dB  dC  dD
     *  -|---|----|---
     *   dE  dF  dG
     *    \  |  /
     *     - H -
     */
    const layeredTextGraph: LayeredTextGraph = [
      ["A->dB->dE->H", "A->dC->dF->H", "A->dD->dG->H"],
      [["A"], ["dB", "dC", "dD"], ["dE", "dF", "dG"], ["H"]],
    ];
    const { dag, layers } = createLayeredDag(layeredTextGraph);
    const coords = new Map<VertexId, number>();
    const newLayers = layers.map((layer, idx) => {
      layer.vertexIds.forEach((vertexId, idx) => coords.set(vertexId, idx + 1));
      return new OrderedLayer(layer.vertexIds, floor(idx / 2, 0) + 1);
    });
    const newOrderedLayers = new OrderedLayers(newLayers);
    const layerGroups: Map<GroupIdx, GroupedLayers> = newOrderedLayers.getGroupedLayers(DEFAULT_GROUP_ID);

    expect(layerGroups.size).toBe(2);
    expect(toArray(layerGroups.keys())).toEqual([1, 2]);

    expect(verticesInGroup(dag.graph, layerGroups.get(1)!)).toEqual(["A", "dB", "dC", "dD"]);
    expect(verticesInGroup(dag.graph, layerGroups.get(2)!)).toEqual(["H", "dE", "dF", "dG"]);
  });

  it("should return correctly grouped layers if group is not set (in case of no grouping by layer)", () => {
    /**
     *     - A --
     *    /  |   \
     *   B   C   D
     */
    const layeredTextGraph: LayeredTextGraph = [
      ["A->B", "A->C", "A->D"],
      [["A"], ["B", "C", "D"]],
    ];
    const { dag, layers } = createLayeredDag(layeredTextGraph);
    const layerGroups: Map<GroupIdx, GroupedLayers> = layers.getGroupedLayers(DEFAULT_GROUP_ID);

    expect(layerGroups.size).toBe(1);
    expect(toArray(layerGroups.keys())).toEqual([-1]);

    expect(verticesInGroup(dag.graph, layerGroups.get(-1)!)).toEqual(["A", "B", "C", "D"]);
  });

  function verticesInGroup(graph: Graph<any, any>, layers: GroupedLayers): Array<string> {
    return layers
      .getLayers()
      .flatMap((layer) => layer.vertexIds.map((vId) => graph.vertexById(vId).data()["name"]))
      .sort();
  }
});

describe("getMinMaxForAllGroups", () => {
  it("should correctly return min and max for all groups", () => {
    /**
     *     - A -- --
     *    /  |   \  \
     *   dB  dC  dD K
     *  -|---|----|---
     *   dE  dF  dG
     *    \  |  /
     *     - H -
     */
    const layeredTextGraph: LayeredTextGraph = [
      ["A->dB->dE->H", "A->dC->dF->H", "A->dD->dG->H", "A->K"],
      [["A"], ["dB", "dC", "dD", "K"], ["dE", "dF", "dG"], ["H"]],
    ];
    const { layers } = createLayeredDag(layeredTextGraph);
    const coords = new Map<VertexId, number>();
    const newLayers = layers.map((layer, idx) => {
      layer.vertexIds.forEach((vertexId, idx) => coords.set(vertexId, idx + 1));
      return new OrderedLayer(layer.vertexIds, floor(idx / 2, 0) + 1);
    });
    const newOrderedLayers = new OrderedLayers(newLayers);

    const { minXGroups, maxXGroups } = newOrderedLayers.getMinMaxForAllGroups(coords);
    expect(minXGroups).toBe(1);
    expect(maxXGroups).toBe(4);
  });

  it("should correctly return min/max if graph has no vertices", () => {
    const layeredTextGraph: LayeredTextGraph = [[], [[]]];
    const { layers } = createLayeredDag(layeredTextGraph);
    const coords = new Map<VertexId, number>();
    const newLayers = layers.map((layer) => {
      return new OrderedLayer(layer.vertexIds, 0);
    });
    const newOrderedLayers = new OrderedLayers(newLayers);

    const { minXGroups, maxXGroups } = newOrderedLayers.getMinMaxForAllGroups(coords);
    expect(minXGroups).toBe(0);
    expect(maxXGroups).toBe(0);
  });
});
