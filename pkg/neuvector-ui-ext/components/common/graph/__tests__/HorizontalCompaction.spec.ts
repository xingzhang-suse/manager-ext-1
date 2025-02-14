import { extend } from "../../../common/functions";
import { type LayeredTextGraph, createLayeredDag } from "../__fixtures__/hierarchicalTestUtil";
import {
  type AssignedCoordinates,
  type PositionXTestCase,
  positionXTestCasesFixture,
  toTestCaseName,
} from "../__fixtures__/positionX";
import { OrderedLayers } from "../algos/hierarchical/hierarchicalCommon";
import { defaultInitialHierarchicalLayoutOptions } from "../algos/hierarchical/hierarchicalLayout";
import {
  BiasX,
  BiasY,
  findType1Conflicts,
  getUpperLowerNeighbours,
  horizontalCompaction,
  verticalAlignment,
} from "../algos/hierarchical/positionX";

describe("Horizontal Compaction", () => {
  [BiasX.LEFT, BiasX.RIGHT].forEach((biasXPos) => {
    [BiasY.UP, BiasY.DOWN].forEach((biasYPos) => {
      testHorizontalCompaction(positionXTestCasesFixture.emptyGraph, biasXPos, biasYPos);
      testHorizontalCompaction(positionXTestCasesFixture.innerSegmentsDoNotCross!, biasXPos, biasYPos);
      testHorizontalCompaction(positionXTestCasesFixture.innerSegmentsCrossDirect!, biasXPos, biasYPos);
      testHorizontalCompaction(positionXTestCasesFixture.innerSegmentsCrossReversed!, biasXPos, biasYPos);
      testHorizontalCompaction(positionXTestCasesFixture.innerSegmentsCrossOption3!, biasXPos, biasYPos);
      testHorizontalCompaction(positionXTestCasesFixture.innerSegmentsCrossOption4!, biasXPos, biasYPos);
      testHorizontalCompaction(positionXTestCasesFixture.innerSegmentsDoubleConflict!, biasXPos, biasYPos);
      testHorizontalCompaction(positionXTestCasesFixture.sandwichedInnerSegmentsNoConflicts!, biasXPos, biasYPos);
      testHorizontalCompaction(
        positionXTestCasesFixture.sandwichedInnerSegmentsAndRightIntersectingSegments!,
        biasXPos,
        biasYPos,
      );
      testHorizontalCompaction(
        positionXTestCasesFixture.sandwichedInnerSegmentsAndLeftIntersectingSegments!,
        biasXPos,
        biasYPos,
      );
      testHorizontalCompaction(
        positionXTestCasesFixture.sandwichedInnerSegmentsAndRightLeftIntersectingSegments!,
        biasXPos,
        biasYPos,
      );
      testHorizontalCompaction(positionXTestCasesFixture.twoLayersIntersectingSegments!, biasXPos, biasYPos);
      testHorizontalCompaction(positionXTestCasesFixture.graphFromThePaper!, biasXPos, biasYPos);
    });
  });

  function testHorizontalCompaction(testCase: PositionXTestCase, biasX: BiasX, biasY: BiasY) {
    it(`${toTestCaseName(testCase, biasX, biasY)}`, () => {
      const expectedCoords = getExpectedCoords(testCase, biasX, biasY);
      expect(testGraphHorizontalCompaction(testCase.graph!, biasX, biasY)).toEqual(expectedCoords);
    });
  }

  function testGraphHorizontalCompaction(
    layeredTextGraph: LayeredTextGraph,
    biasX: BiasX,
    biasY: BiasY,
  ): AssignedCoordinates {
    const { dag, layers } = createLayeredDag(layeredTextGraph);
    const orderedLayers = new OrderedLayers(layers.layers.reverse());
    const conflicts = findType1Conflicts(dag, orderedLayers);
    const { upperNeighbours, lowerNeighbours } = getUpperLowerNeighbours(dag, orderedLayers);
    const neighbours = biasY === BiasY.UP ? upperNeighbours : lowerNeighbours;
    const alignment = verticalAlignment(dag, orderedLayers, conflicts, neighbours, biasX, biasY);
    const options = extend({ betweenDummyNodeWidth: 1 }, defaultInitialHierarchicalLayoutOptions());
    const assignment = horizontalCompaction(dag, orderedLayers, alignment, biasX, biasY, options);
    const width = assignment.maxX - assignment.minX;
    const emptyCell = " ";
    const coords: string[][] = Array(orderedLayers.size())
      .fill(null)
      .map(() => Array(width + 1).fill(emptyCell));

    assignment.coords.forEach((coord, vertexId) => {
      const vertexName = dag.graph.vertexById(vertexId).data().name;
      const { layerIdx } = orderedLayers.getVertexPositionInLayer(vertexId)!;
      coords[layerIdx][coord - assignment.minX] = vertexName;
    });
    return coords.reverse();
  }

  function getExpectedCoords(testCase: PositionXTestCase, biasX: BiasX, biasY: BiasY): AssignedCoordinates {
    if (biasX === BiasX.LEFT) {
      if (biasY === BiasY.UP) {
        return testCase.coordsLeftUp!;
      } else {
        return testCase.coordsLeftDown!;
      }
    } else {
      if (biasY === BiasY.UP) {
        return testCase.coordsRightUp!;
      } else {
        return testCase.coordsRightDown!;
      }
    }
  }
});
