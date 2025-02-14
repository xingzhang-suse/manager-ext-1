import { type LayeredTextGraph, createLayeredDag } from "../__fixtures__/hierarchicalTestUtil";
import { type PositionXTestCase, positionXTestCasesFixture } from "../__fixtures__/positionX";
import { OrderedLayers } from "../algos/hierarchical/hierarchicalCommon";
import { findType1Conflicts } from "../algos/hierarchical/positionX";

describe("Find Type1 Conflict", () => {
  testFindType1Conflicts(positionXTestCasesFixture.emptyGraph);

  testFindType1Conflicts(positionXTestCasesFixture.innerSegmentsDoNotCross!);

  testFindType1Conflicts(positionXTestCasesFixture.innerSegmentsCrossDirect!);
  testFindType1Conflicts(positionXTestCasesFixture.innerSegmentsCrossReversed!);
  testFindType1Conflicts(positionXTestCasesFixture.innerSegmentsCrossOption3!);
  testFindType1Conflicts(positionXTestCasesFixture.innerSegmentsCrossOption4!);

  testFindType1Conflicts(positionXTestCasesFixture.innerSegmentsDoubleConflict!);

  testFindType1Conflicts(positionXTestCasesFixture.sandwichedInnerSegmentsNoConflicts!);
  testFindType1Conflicts(positionXTestCasesFixture.sandwichedInnerSegmentsAndRightIntersectingSegments!);
  testFindType1Conflicts(positionXTestCasesFixture.sandwichedInnerSegmentsAndLeftIntersectingSegments!);
  testFindType1Conflicts(positionXTestCasesFixture.sandwichedInnerSegmentsAndRightLeftIntersectingSegments!);

  testFindType1Conflicts(positionXTestCasesFixture.twoLayersIntersectingSegments!);

  testFindType1Conflicts(positionXTestCasesFixture.graphFromThePaper!);

  function testFindType1Conflicts(testCase: PositionXTestCase) {
    it(`${testCase.testCaseName}`, () => {
      expect(testGraphFindType1Conflicts(testCase.graph!)).toEqual(testCase.conflicts);
    });
  }

  function testGraphFindType1Conflicts(layeredTextGraph: LayeredTextGraph): [string, string][] {
    const { dag, layers } = createLayeredDag(layeredTextGraph);
    const orderedLayers = new OrderedLayers(layers.layers.reverse());

    return findType1Conflicts(dag, orderedLayers)
      .valuesMonotonic()
      .map(([left, right]): [string, string] => {
        const leftName = dag.graph.vertexById(left).data().name;
        const rightName = dag.graph.vertexById(right).data().name;
        return [leftName, rightName];
      });
  }
});
