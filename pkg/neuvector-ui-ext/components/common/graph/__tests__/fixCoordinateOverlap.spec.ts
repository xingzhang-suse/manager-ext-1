import { type LayeredTextGraph, createLayeredDag } from "../__fixtures__/hierarchicalTestUtil";
import { componentOverlappedBigGraph, componentOverlappedSmallGraph } from "../__fixtures__/overlappingComponents";
import type { FeedbackArcSetDAG } from "../algos/findFeedbackArcSet";
import {
  Groupings,
  type HierarchicalEdgeData,
  type HierarchicalVertexData,
  type OrderedLayer,
  type OrderedLayers,
} from "../algos/hierarchical/hierarchicalCommon";
import type { HierarchicalLayoutOptions } from "../algos/hierarchical/hierarchicalLayout";
import { type VertexXCoords, getSeparation, positionX } from "../algos/hierarchical/positionX";

describe("PositionX should handle overlapped components as a result of bugs in horizontalCompaction", () => {
  it("in a small graph", () => {
    const options: HierarchicalLayoutOptions<any> = {
      groupings: new Groupings<any>([]), // important! we should enable groupings
      reduceCrossingsSweeps: 4,
      foreignWeightMultiplier: 3,
      vertexWidth: 1,
      betweenDummyNodeWidth: 0.5,
      compactionMaxPlaceBlockDepth: 10000,
      compactionMaxLinkedListIterations: 10000,
      groupRatioX: 16,
      groupRatioY: 9,
      alignmentBias: undefined, // we fix final (balanced) assignment
    };

    const layeredTextGraph: LayeredTextGraph = componentOverlappedSmallGraph();
    const { dag, layers } = createLayeredDag(layeredTextGraph);

    const positionXResult = positionX(dag, layers, options);

    verifySpacingInvariant(dag, layers, positionXResult, options);
  });

  it("in a big graph", () => {
    const options: HierarchicalLayoutOptions<any> = {
      groupings: new Groupings<any>([]), // important! we should enable groupings
      reduceCrossingsSweeps: 4,
      foreignWeightMultiplier: 3,
      vertexWidth: 1,
      betweenDummyNodeWidth: 0.5,
      compactionMaxPlaceBlockDepth: 10000,
      compactionMaxLinkedListIterations: 10000,
      groupRatioX: 16,
      groupRatioY: 9,
      alignmentBias: undefined, // we fix final (balanced) assignment
    };

    const layeredTextGraph: LayeredTextGraph = componentOverlappedBigGraph();
    const { dag, layers } = createLayeredDag(layeredTextGraph);

    const positionXResult = positionX(dag, layers, options);

    verifySpacingInvariant(dag, layers, positionXResult, options);
  });

  function verifySpacingInvariant<V extends HierarchicalVertexData, E extends HierarchicalEdgeData>(
    dag: FeedbackArcSetDAG<V, E>,
    layers: OrderedLayers,
    coords: VertexXCoords,
    options: HierarchicalLayoutOptions<any>,
  ) {
    for (let i = 0; i < layers.size(); i++) {
      const layer: OrderedLayer = layers.get(i);
      for (let i = 1; i < layer.vertexIds.length; i++) {
        const prevId = layer.getVertexByPosition(i - 1)!;
        const currentId = layer.getVertexByPosition(i)!;
        const prevCoord = coords.get(prevId)!;
        const currentCoord = coords.get(currentId)!;
        const separation = getSeparation(dag.graph, options, prevId);
        expect(currentCoord - prevCoord).toBeGreaterThanOrEqual(separation);
      }
    }
  }
});
