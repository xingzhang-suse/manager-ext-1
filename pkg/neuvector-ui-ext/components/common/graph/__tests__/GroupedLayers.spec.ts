import { GroupedLayers, OrderedLayer } from "../algos/hierarchical/hierarchicalCommon";

describe("GroupedLayers", () => {
  it("should correctly return empty layers and 0 vertex count", () => {
    const groupedLayers = new GroupedLayers(1);
    expect(groupedLayers.getLayers()).toEqual([]);
    expect(groupedLayers.vertexCount()).toEqual(0);
    expect(groupedLayers.layerCount()).toEqual(0);
  });

  it("should correctly return layers information if layers has 0 or 1 vertex", () => {
    const groupedLayers = new GroupedLayers(1);
    const emptyLayer = new OrderedLayer([], 0);
    groupedLayers.addLayer(emptyLayer);
    expect(groupedLayers.getLayers()).toEqual([emptyLayer]);
    expect(groupedLayers.vertexCount()).toEqual(0);
    expect(groupedLayers.layerCount()).toEqual(1);

    const layerWithOneVertex = new OrderedLayer([1], 1);
    groupedLayers.addLayer(layerWithOneVertex);

    expect(groupedLayers.getLayers()).toEqual([emptyLayer, layerWithOneVertex]);
    expect(groupedLayers.vertexCount()).toEqual(1);
    expect(groupedLayers.layerCount()).toEqual(2);
  });

  it("should correctly return vertexCounts for multiple layers", () => {
    const groupedLayers = new GroupedLayers(1);
    const layer1 = new OrderedLayer([1, 2], 0);
    const layer2 = new OrderedLayer([3, 4], 0);
    groupedLayers.addLayer(layer1);
    groupedLayers.addLayer(layer2);
    expect(groupedLayers.getLayers()).toEqual([layer1, layer2]);
    expect(groupedLayers.vertexCount()).toEqual(4);
    expect(groupedLayers.layerCount()).toEqual(2);
  });

  it("should correctly add vertexes to layer in the group", () => {
    const groupedLayers = new GroupedLayers(1);
    const layer1 = new OrderedLayer([1, 2], 0);
    const layer2 = new OrderedLayer([3, 4], 0);
    groupedLayers.addLayer(layer1);
    groupedLayers.addLayer(layer2);
    groupedLayers.addFirstVertexToLayer(0, 5);
    groupedLayers.addLastVertexToLayer(1, 6);
    expect(groupedLayers.getLayers()[0].vertexIds).toEqual([5, 1, 2]);
    expect(groupedLayers.getLayers()[1].vertexIds).toEqual([3, 4, 6]);
  });
});
