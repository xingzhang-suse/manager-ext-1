import { floor } from "~/tools/floor";
import { max } from "~/tools/max";
import { min } from "~/tools/min";
import { times } from "~/tools/times";

import { type LayeredTextGraph, createLayeredDag } from "../__fixtures__/hierarchicalTestUtil";
import {
  type PositionXCoordinates,
  type PositionXTestCase,
  positionXTestCasesFixture,
} from "../__fixtures__/positionX";
import { OrderedLayers } from "../algos/hierarchical/hierarchicalCommon";
import { defaultInitialHierarchicalLayoutOptions } from "../algos/hierarchical/hierarchicalLayout";
import { positionX } from "../algos/hierarchical/positionX";

describe("PositionX", () => {
  testPositionX(positionXTestCasesFixture.emptyGraph);
  testPositionX(positionXTestCasesFixture.innerSegmentsDoNotCross!);
  testPositionX(positionXTestCasesFixture.innerSegmentsCrossDirect!);
  testPositionX(positionXTestCasesFixture.innerSegmentsCrossReversed!);
  testPositionX(positionXTestCasesFixture.innerSegmentsCrossOption3!);
  testPositionX(positionXTestCasesFixture.innerSegmentsCrossOption4!);
  testPositionX(positionXTestCasesFixture.innerSegmentsDoubleConflict!);
  testPositionX(positionXTestCasesFixture.sandwichedInnerSegmentsNoConflicts!);
  testPositionX(positionXTestCasesFixture.sandwichedInnerSegmentsAndRightIntersectingSegments!);
  testPositionX(positionXTestCasesFixture.sandwichedInnerSegmentsAndLeftIntersectingSegments!);
  testPositionX(positionXTestCasesFixture.sandwichedInnerSegmentsAndRightLeftIntersectingSegments!);
  testPositionX(positionXTestCasesFixture.twoLayersIntersectingSegments!);
  testPositionX(positionXTestCasesFixture.graphFromThePaper!);

  function testPositionX(testCase: PositionXTestCase) {
    it(`${testCase.testCaseName}`, () => {
      const expectedCoords = testCase.positionXResult;
      expect(testGraphPositionXResult(testCase.graph!)).toEqual(expectedCoords);
    });
  }

  function testGraphPositionXResult(layeredTextGraph: LayeredTextGraph): PositionXCoordinates {
    const { dag, layers } = createLayeredDag(layeredTextGraph);
    const orderedLayers = new OrderedLayers(layers.layers.reverse());
    const positionXResult = positionX(dag, orderedLayers, defaultInitialHierarchicalLayoutOptions());
    if (positionXResult.size === 0) return [];
    const multiplier = 4; // to compensate non uniform separation and make integer coordinates
    const minX = min(positionXResult.values())!;
    const maxX = max(positionXResult.values())!;
    const width = floor((maxX - minX) * multiplier, 0);
    const emptyCell = " ";
    const resultGrid = times(orderedLayers.size(), () => times(width + 1, () => emptyCell));

    positionXResult.forEach((coord, vertexId) => {
      const vertexName = dag.graph.vertexById(vertexId).data().name;
      const { layerIdx } = orderedLayers.getVertexPositionInLayer(vertexId)!;
      resultGrid[layerIdx][(coord - minX) * multiplier] = vertexName;
    });
    return resultGrid.reverse();
  }
});
