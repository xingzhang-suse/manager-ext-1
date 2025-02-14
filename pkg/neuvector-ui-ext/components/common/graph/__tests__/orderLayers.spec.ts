import {
  complexThreeLayerGraph,
  complexTwoLayeredGraph,
  crossings,
  emptyLayeredGraph,
  orderNamedLayers,
  simpleTwoLayeredGraph,
} from "../__fixtures__/hierarchicalTestUtil";

describe("The orderLayers function", () => {
  it("should return an empty array when given an empty array of layers.", () => {
    expect(orderNamedLayers(emptyLayeredGraph)).toEqual([]);
  });

  it("should return an arbitrarily ordered layer when given only one layer.", () => {
    const layers = orderNamedLayers([["a<->b->c"], [["a", "b", "c"]]]);
    expect(layers.length).toBe(1);

    ["a", "b", "c"].forEach((name) => {
      expect(layers[0]).toContain(name);
    });
    expect(layers[0].length).toBe(3);
  });

  it("should reduce the number of crossing to 0, when given a simple two-layered graph.", () => {
    const layers = orderNamedLayers(simpleTwoLayeredGraph);
    expect(crossings([simpleTwoLayeredGraph[0], layers])).toBe(0);
  });

  it("should reduce the number of crossing to 0, when given a complex two-layered graph.", () => {
    const layers = orderNamedLayers(complexTwoLayeredGraph);
    expect(crossings([complexTwoLayeredGraph[0], layers])).toBe(0);
  });

  it("should reduce the number of crossing to 0, when given a complex three-layered graph.", () => {
    const layers = orderNamedLayers(complexThreeLayerGraph);
    expect(crossings([complexThreeLayerGraph[0], layers])).toBe(0);
  });
});

describe("The numberOfCrossings function", () => {
  it("should return 0 when an empty array of layers is passed", () => {
    expect(crossings(emptyLayeredGraph)).toBe(0);
  });

  it("should return 0 when there is only one layer.", () => {
    expect(crossings([["A", "B"], [["A", "B"]]])).toBe(0);
  });

  it("should return the correct number of crossings with a simple two-layered graph.", () => {
    expect(crossings(simpleTwoLayeredGraph)).toBe(1);
  });

  it("should return the correct number of crossings with a complex two-layered graph.", () => {
    expect(crossings(complexTwoLayeredGraph)).toBe(8);
  });

  it("should return the correct number of crossings with a complex three-layered graph.", () => {
    expect(crossings(complexThreeLayerGraph)).toBe(4);
  });
});
