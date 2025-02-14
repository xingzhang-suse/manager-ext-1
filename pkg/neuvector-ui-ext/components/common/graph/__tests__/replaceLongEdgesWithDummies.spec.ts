import { diEdgeByName, edgeByName, toTextGraph, vertexByName } from "../__fixtures__/graphTestUtil";
import {
  type HEdgeData,
  type HElement,
  type HPath,
  type HVertexData,
  type LayeredTextGraph,
  complexThreeLayerGraph,
  complexTwoLayeredGraph,
  emptyLayeredGraph,
  getLayerId,
  namedToUnorderedLayers,
  replaceLongEdgesWithNamedDummies,
  toHierarchicalGraph,
} from "../__fixtures__/hierarchicalTestUtil";
import { createAndValidatePath } from "../__fixtures__/pathUtils";
import { replaceLongEdgesWithDummies } from "../algos/hierarchical/replaceLongEdgesWithDummies";

function containsDummyData(element: HElement): boolean {
  return !!element.data().hierarchical && element.data().hierarchical!.edgeIdReplacedWithDummies !== undefined;
}

function expectDummyDataInPath(path: HPath) {
  expect(containsDummyData(path.first())).toBe(false);
  path
    .sequence()
    .slice(1, path.sequenceLength - 1)
    .forEach((element) => {
      expect(containsDummyData(element)).toBe(true);
    });
  expect(containsDummyData(path.last())).toBe(false);
}

describe("The replaceLongEdgesWithDummies function", () => {
  it("should not replace anything in an empty graph", () => {
    expectNotReplaceAnything(emptyLayeredGraph);
  });

  it("should not replace anything in a complex two-layered graph.", () => {
    expectNotReplaceAnything(complexTwoLayeredGraph);
  });

  it("should not replace anything in a complex three-layered graph.", () => {
    expectNotReplaceAnything(complexThreeLayerGraph);
  });

  function expectNotReplaceAnything(layeredTextGraph: LayeredTextGraph) {
    const graph = toTextGraph(layeredTextGraph[0]);
    replaceLongEdgesWithDummies<any, any>(
      graph,
      namedToUnorderedLayers(graph, layeredTextGraph[1]),
      () => {
        throw new Error("No dummy vertices should be generated");
      },
      () => {
        throw new Error("No dummy edges should be generated");
      },
    );
  }

  it("should create a directed path over multiple layers when a directed edge spans multiple ascending layers", () => {
    const graph = toHierarchicalGraph(["V1->V2<-V1", "V1->V4"]),
      [eV1toV4] = edgeByName(graph, "V1->V4"),
      [layers, dummyPaths] = replaceLongEdgesWithNamedDummies(graph, [["V1"], ["V2"], [], ["V4"]]),
      [dV0, dV1, v1, v4] = vertexByName(graph, "DV0", "DV1", "V1", "V4"),
      [dE0, dE1, dE2] = diEdgeByName(graph, "DE0", "DE1", "DE2");

    expect(graph.findEdge((edge) => edge.data().name === "V1->V4")).toBeUndefined();
    const path = createAndValidatePath<HVertexData, HEdgeData>([v4, dE0, dV0, dE1, dV1, dE2, v1], graph); // V4->DV0->DV1->V1
    expectDummyDataInPath(path);
    expect(getLayerId(layers, dV0.id)).toBe(2);
    expect(getLayerId(layers, dV1.id)).toBe(1);
    expect(dE0.isBiEdge() || dE1.isBiEdge() || dE2.isBiEdge()).toBe(false);

    expect(dummyPaths.get(eV1toV4.id)?.sequenceLength).toEqual(7);
  });

  it("should create a directed path over multiple layers when an directed edge spans multiple descending layers", () => {
    const graph = toHierarchicalGraph(["V1->V2<-V1", "V4->V1"]),
      [eV1toV4] = edgeByName(graph, "V4->V1"),
      [layers, dummyPaths] = replaceLongEdgesWithNamedDummies(graph, [["V1"], ["V2"], [], ["V4"]]),
      [dV0, dV1, v1, v4] = vertexByName(graph, "DV0", "DV1", "V1", "V4"),
      [dE0, dE1, dE2] = diEdgeByName(graph, "DE0", "DE1", "DE2");

    expect(graph.findEdge((edge) => edge.data().name === "V4->V1")).toBeUndefined();
    const path = createAndValidatePath<HVertexData, HEdgeData>([v4, dE0, dV0, dE1, dV1, dE2, v1], graph); // V4->DV0->DV1->V1
    expectDummyDataInPath(path);
    expect(getLayerId(layers, dV0.id)).toBe(2);
    expect(getLayerId(layers, dV1.id)).toBe(1);
    expect(dE0.isBiEdge() || dE1.isBiEdge() || dE2.isBiEdge()).toBe(false);

    expect(dummyPaths.get(eV1toV4.id)?.sequenceLength).toEqual(7);
  });
});
