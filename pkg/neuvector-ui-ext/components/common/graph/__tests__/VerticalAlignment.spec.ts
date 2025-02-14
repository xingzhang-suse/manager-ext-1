import { type LayeredTextGraph, createLayeredDag } from "../__fixtures__/hierarchicalTestUtil";
import {
  type BlockPointers,
  type PositionXTestCase,
  positionXTestCasesFixture,
  toTestCaseName,
} from "../__fixtures__/positionX";
import { OrderedLayers } from "../algos/hierarchical/hierarchicalCommon";
import {
  BiasX,
  BiasY,
  findType1Conflicts,
  getUpperLowerNeighbours,
  verticalAlignment,
} from "../algos/hierarchical/positionX";

describe("Vertical Alignment", () => {
  [BiasX.LEFT, BiasX.RIGHT].forEach((biasXPos) => {
    [BiasY.UP, BiasY.DOWN].forEach((biasYPos) => {
      testVerticalAlignment(positionXTestCasesFixture.emptyGraph!, biasXPos, biasYPos);
      testVerticalAlignment(positionXTestCasesFixture.innerSegmentsDoNotCross!, biasXPos, biasYPos);
      testVerticalAlignment(positionXTestCasesFixture.innerSegmentsCrossDirect!, biasXPos, biasYPos);
      testVerticalAlignment(positionXTestCasesFixture.innerSegmentsCrossReversed!, biasXPos, biasYPos);
      testVerticalAlignment(positionXTestCasesFixture.innerSegmentsCrossOption3!, biasXPos, biasYPos);
      testVerticalAlignment(positionXTestCasesFixture.innerSegmentsCrossOption4!, biasXPos, biasYPos);
      testVerticalAlignment(positionXTestCasesFixture.innerSegmentsDoubleConflict!, biasXPos, biasYPos);
      testVerticalAlignment(positionXTestCasesFixture.sandwichedInnerSegmentsNoConflicts!, biasXPos, biasYPos);
      testVerticalAlignment(
        positionXTestCasesFixture.sandwichedInnerSegmentsAndRightIntersectingSegments!,
        biasXPos,
        biasYPos,
      );
      testVerticalAlignment(
        positionXTestCasesFixture.sandwichedInnerSegmentsAndLeftIntersectingSegments!,
        biasXPos,
        biasYPos,
      );
      testVerticalAlignment(
        positionXTestCasesFixture.sandwichedInnerSegmentsAndRightLeftIntersectingSegments!,
        biasXPos,
        biasYPos,
      );
      testVerticalAlignment(positionXTestCasesFixture.twoLayersIntersectingSegments!, biasXPos, biasYPos);
      testVerticalAlignment(positionXTestCasesFixture.graphFromThePaper!, biasXPos, biasYPos);
    });
  });

  function testVerticalAlignment(testCase: PositionXTestCase, biasX: BiasX, biasY: BiasY) {
    it(`${toTestCaseName(testCase, biasX, biasY)}`, () => {
      const expectedAlignment = getExpectedAlignment(testCase, biasX, biasY);
      expect(testGraphVerticalAlignment(testCase.graph!, biasX, biasY)).toEqual(expectedAlignment);
    });
  }

  function testGraphVerticalAlignment(layeredTextGraph: LayeredTextGraph, biasX: BiasX, biasY: BiasY): BlockPointers {
    const { dag, layers } = createLayeredDag(layeredTextGraph);
    const orderedLayers = new OrderedLayers(layers.layers.reverse());
    const conflicts = findType1Conflicts(dag, orderedLayers);
    const { upperNeighbours, lowerNeighbours } = getUpperLowerNeighbours(dag, orderedLayers);
    const neighbours = biasY === BiasY.UP ? upperNeighbours : lowerNeighbours;
    const alignment = verticalAlignment(dag, orderedLayers, conflicts, neighbours, biasX, biasY);
    const blockPointers: BlockPointers = [];

    alignment.root.forEach((rootVertexId, childVertexId) => {
      const childName = dag.graph.vertexById(childVertexId).data().name;
      const rootName = dag.graph.vertexById(rootVertexId).data().name;
      blockPointers.push(`${rootName}<-${childName}`);
    });
    return blockPointers;
  }

  function getExpectedAlignment(testCase: PositionXTestCase, biasX: BiasX, biasY: BiasY): BlockPointers {
    if (biasX === BiasX.LEFT) {
      if (biasY === BiasY.UP) {
        return testCase.alignmentLeftUp!;
      } else {
        return testCase.alignmentLeftDown!;
      }
    } else {
      if (biasY === BiasY.UP) {
        return testCase.alignmentRightUp!;
      } else {
        return testCase.alignmentRightDown!;
      }
    }
  }
});
