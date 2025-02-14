import { ColumnWeights } from "../algos/hierarchical/hierarchicalCommon";
import { VertexOrderingInLayer } from "../algos/hierarchical/orderLayers";

describe("VertexOrderingInLayer", () => {
  const connectedLayerVertexIds = [2, 4, 8, 5, 3, 1, 6];
  const centerIndexDecimal = (connectedLayerVertexIds.length - 1) / 2; // indices 0,1,2,3,4 -> 2 and indices 0,1,2,3 -> 1.5

  it("should be empty with no data", () => {
    expect(
      new VertexOrderingInLayer(0, connectedLayerVertexIds, [], generateColumnWeights([], []), 1).isEmpty,
    ).toBeTruthy();
  });

  it("should be normal when no foreign relations are present", () => {
    const neighboursVertexIdsInLayer = [1, 3, 5];
    const result = new VertexOrderingInLayer(
      0,
      connectedLayerVertexIds,
      neighboursVertexIdsInLayer,
      generateColumnWeights([], []),
      1,
    );

    expect(result.isEmpty).toBeFalsy();
    expect(result.leftDistance).toBe(0);
    expect(result.rightDistance).toBe(0);

    expect(result.indices).toEqual([5, 4, 3]);
    expect(result.summedScore()).toBe(5 + 4 + 3);

    expect(result.score).toBe(result.summedScore() / neighboursVertexIdsInLayer.length);
  });

  it("should pull left when a left foreign relation is present", () => {
    const neighboursVertexIdsInLayer = [1, 4, 5];
    const foreignWeight = 3;
    const result = new VertexOrderingInLayer(
      0,
      connectedLayerVertexIds,
      neighboursVertexIdsInLayer,
      generateColumnWeights([2], []),
      foreignWeight,
    );

    expect(result.isEmpty).toBeFalsy();
    expect(result.leftDistance).toBe(2);
    expect(result.rightDistance).toBe(0);

    expect(result.indices).toEqual([5, 1, 3]);
    expect(result.summedScore()).toBe(5 + 1 + 3 + (centerIndexDecimal - foreignWeight * (centerIndexDecimal + 1)));

    expect(result.score).toBe(result.summedScore() / (neighboursVertexIdsInLayer.length + 1));
  });

  it("should pull right when a right foreign relation is present", () => {
    const neighboursVertexIdsInLayer = [2, 4, 5];
    const foreignWeight = 5;
    const result = new VertexOrderingInLayer(
      0,
      connectedLayerVertexIds,
      neighboursVertexIdsInLayer,
      generateColumnWeights([], [1]),
      foreignWeight,
    );

    expect(result.isEmpty).toBeFalsy();
    expect(result.leftDistance).toBe(0);
    expect(result.rightDistance).toBe(1);

    expect(result.indices).toEqual([0, 1, 3]);
    expect(result.summedScore()).toBe(0 + 1 + 3 + (centerIndexDecimal + foreignWeight * (centerIndexDecimal + 1)));

    expect(result.score).toBe(result.summedScore() / (neighboursVertexIdsInLayer.length + 1));
  });

  it("should pull in neither direction when a left and right foreign relation are present", () => {
    const neighboursVertexIdsInLayer = [8, 1, 6];
    const foreignWeight = 4;
    const result = new VertexOrderingInLayer(
      0,
      connectedLayerVertexIds,
      neighboursVertexIdsInLayer,
      generateColumnWeights([1], [2]),
      foreignWeight,
    );

    expect(result.isEmpty).toBeFalsy();
    expect(result.leftDistance).toBe(1);
    expect(result.rightDistance).toBe(2);

    expect(result.indices).toEqual([2, 5, 6]);
    expect(result.summedScore()).toBe(
      2 +
        5 +
        6 +
        (centerIndexDecimal - foreignWeight * (centerIndexDecimal + 1)) +
        (centerIndexDecimal + foreignWeight * (centerIndexDecimal + 1)),
    );

    expect(result.score).toBe(result.summedScore() / (neighboursVertexIdsInLayer.length + 2));
  });
});

function generateColumnWeights(left: number[] = [], right: number[] = []) {
  const result: ColumnWeights = new ColumnWeights();
  left.forEach((distance) => result.addLeftRelation(distance));
  right.forEach((distance) => result.addRightRelation(distance));
  return result;
}
