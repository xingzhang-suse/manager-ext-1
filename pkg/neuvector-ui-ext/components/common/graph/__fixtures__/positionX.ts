import { BiasX, BiasY } from "../algos/hierarchical/positionX";

import { mergeIntoGraph } from "./graphTestUtil";
import type { LayeredTextGraph } from "./hierarchicalTestUtil";

export abstract class PositionXTestCase {
  testCaseName?: string;
  graph?: LayeredTextGraph;
  conflicts?: [string, string][];
  alignmentLeftDown?: BlockPointers;
  alignmentRightDown?: BlockPointers;
  alignmentLeftUp?: BlockPointers;
  alignmentRightUp?: BlockPointers;

  coordsLeftUp?: AssignedCoordinates;
  coordsLeftDown?: AssignedCoordinates;
  coordsRightUp?: AssignedCoordinates;
  coordsRightDown?: AssignedCoordinates;

  positionXResult?: PositionXCoordinates;
}

export type BlockPointers = string[];
export type AssignedCoordinates = string[][];
export type PositionXCoordinates = string[][];

export interface PositionXTestCases {
  emptyGraph: PositionXTestCase;

  innerSegmentsDoNotCross?: PositionXTestCase;

  innerSegmentsCrossDirect?: PositionXTestCase;
  innerSegmentsCrossReversed?: PositionXTestCase;
  innerSegmentsCrossOption3?: PositionXTestCase;
  innerSegmentsCrossOption4?: PositionXTestCase;

  innerSegmentsDoubleConflict?: PositionXTestCase;

  sandwichedInnerSegmentsNoConflicts?: PositionXTestCase;
  sandwichedInnerSegmentsAndRightIntersectingSegments?: PositionXTestCase;
  sandwichedInnerSegmentsAndLeftIntersectingSegments?: PositionXTestCase;
  sandwichedInnerSegmentsAndRightLeftIntersectingSegments?: PositionXTestCase;

  twoLayersIntersectingSegments?: PositionXTestCase;

  graphFromThePaper?: PositionXTestCase;
}

export function toTestCaseName(testCase: PositionXTestCase, biasX: BiasX, biasY: BiasY): string {
  const xPosBias = biasX === BiasX.LEFT ? "Left" : "Right";
  const yPosBias = biasY === BiasY.UP ? "Up" : "Down";
  return `x: ${xPosBias}, y: ${yPosBias}, ${testCase.testCaseName}`;
}

/**
 *            R
 *           / \
 *  AL  CL  dA  dC  AR  CR
 *    X |   |   |   |  X
 *  BL  DL  dB  dD  BR  DR
 *           \  /
 *            K
 */
function sandwichMainGraph(): LayeredTextGraph {
  return [
    ["AL->DL", "CL->BL", "CL->DL", "R->dA->dB->K", "R->dC->dD->K", "AR->DR", "CR->BR", "AR->BR"],
    [["R"], ["AL", "CL", "dA", "dC", "AR", "CR"], ["BL", "DL", "dB", "dD", "BR", "DR"], ["K"]],
  ];
}

export const positionXTestCasesFixture: PositionXTestCases = {
  emptyGraph: {
    testCaseName: "empty graph",
    graph: [[], []],
    conflicts: [],
    alignmentLeftDown: [],
    alignmentRightDown: [],
    alignmentLeftUp: [],
    alignmentRightUp: [],
    coordsLeftDown: [],
    coordsRightDown: [],
    coordsLeftUp: [],
    coordsRightUp: [],

    positionXResult: [],
  },

  /**
   * A
   * | \
   * B  d1
   * |  |
   * C  d2
   * | /
   * D
   */

  innerSegmentsDoNotCross: {
    testCaseName: "no conflicts when inner segments do not cross",
    graph: [
      ["A->B->C->D", "A->d1->d2->D"],
      [["A"], ["B", "d1"], ["C", "d2"], ["D"]],
    ],
    conflicts: [],
    alignmentLeftDown: ["A<-B", "A<-C", "d1<-d2", "A<-D"],
    alignmentRightDown: ["A<-d1", "A<-d2", "B<-C", "A<-D"],
    alignmentLeftUp: ["D<-C", "D<-B", "d2<-d1", "D<-A"],
    alignmentRightUp: ["D<-d2", "D<-d1", "C<-B", "D<-A"],
    coordsLeftDown: [
      ["A", " "],
      ["B", "d1"],
      ["C", "d2"],
      ["D", " "],
    ],
    coordsRightDown: [
      [" ", "A"],
      ["B", "d1"],
      ["C", "d2"],
      [" ", "D"],
    ],
    coordsLeftUp: [
      ["A", " "],
      ["B", "d1"],
      ["C", "d2"],
      ["D", " "],
    ],
    coordsRightUp: [
      [" ", "A"],
      ["B", "d1"],
      ["C", "d2"],
      [" ", "D"],
    ],
    positionXResult: [
      [" ", " ", "A", " ", " "],
      ["B", " ", " ", " ", "d1"],
      ["C", " ", " ", " ", "d2"],
      [" ", " ", "D", " ", " "],
    ],
  },

  /**
   * A
   * | \
   * d1 B
   *   X
   * C  d2
   * | /
   * D

   *     A
   *     | \
   *    d1 B
   *    X
   * C  d2
   * | /
   * D

   * Contains Type 2 conflict
   */

  innerSegmentsCrossDirect: {
    testCaseName: "conflicts when inner segments cross directly",
    graph: [
      ["A->B->C->D", "A->d1->d2->D"],
      [["A"], ["d1", "B"], ["C", "d2"], ["D"]],
    ],
    conflicts: [["B", "C"]],
    alignmentLeftDown: ["A<-d1", "A<-d2", "C<-D"],
    alignmentRightDown: ["A<-B", "d1<-d2", "d1<-D"],
    alignmentLeftUp: ["D<-C", "d2<-d1", "d2<-A"],
    alignmentRightUp: ["D<-d2", "D<-d1", "B<-A"],
    coordsLeftDown: [
      [" ", "A", " "],
      [" ", "d1", "B"],
      ["C", "d2", " "],
      ["D", " ", " "],
    ],
    coordsRightDown: [
      [" ", " ", "A"],
      [" ", "d1", "B"],
      ["C", "d2", " "],
      [" ", "D", " "],
    ],
    coordsLeftUp: [
      [" ", "A", " "],
      [" ", "d1", "B"],
      ["C", "d2", " "],
      ["D", " ", " "],
    ],
    coordsRightUp: [
      [" ", " ", "A"],
      [" ", "d1", "B"],
      ["C", "d2", " "],
      [" ", "D", " "],
    ],
    positionXResult: [
      [" ", " ", " ", " ", "A", " ", " "],
      [" ", " ", " ", "d1", " ", " ", "B"],
      ["C", " ", " ", " ", "d2", " ", " "],
      [" ", " ", "D", " ", " ", " ", " "],
    ],
  },

  /**
   * A
   * | \
   * B  d1
   *   X
   * d2 C
   * | /
   * D
   *
   * Contains Type 2 conflict
   */

  innerSegmentsCrossReversed: {
    testCaseName: "conflicts when inner segments cross reversed",
    graph: [
      ["A->B->C->D", "A->d1->d2->D"],
      [["A"], ["B", "d1"], ["d2", "C"], ["D"]],
    ],
    conflicts: [["B", "C"]],
    alignmentLeftDown: ["A<-B", "d1<-d2", "d1<-D"],
    alignmentRightDown: ["A<-d1", "A<-d2", "C<-D"],
    alignmentLeftUp: ["D<-d2", "D<-d1", "B<-A"],
    alignmentRightUp: ["D<-C", "d2<-d1", "d2<-A"],
    coordsLeftDown: [
      ["A", " ", " "],
      ["B", "d1", " "],
      [" ", "d2", "C"],
      [" ", "D", " "],
    ],
    coordsRightDown: [
      [" ", "A", " "],
      ["B", "d1", " "],
      [" ", "d2", "C"],
      [" ", " ", "D"],
    ],
    coordsLeftUp: [
      ["A", " ", " "],
      ["B", "d1", " "],
      [" ", "d2", "C"],
      [" ", "D", " "],
    ],
    coordsRightUp: [
      [" ", "A", " "],
      ["B", "d1", " "],
      [" ", "d2", "C"],
      [" ", " ", "D"],
    ],
    positionXResult: [
      [" ", " ", "A", " ", " ", " ", " "],
      ["B", " ", " ", " ", "d1", " ", " "],
      [" ", " ", " ", "d2", " ", " ", "C"],
      [" ", " ", " ", " ", "D", " ", " "],
    ],
  },

  /**
   *  A
   *  |  \
   * dB  d1
   *    X
   * d2  C
   *  | /
   *  D
   */
  innerSegmentsCrossOption3: {
    testCaseName: "conflicts when inner segments cross option 3",
    graph: [
      ["A->dB->C->D", "A->d1->d2->D"],
      [["A"], ["dB", "d1"], ["d2", "C"], ["D"]],
    ],
    conflicts: [["dB", "C"]],
    alignmentLeftDown: ["A<-dB", "d1<-d2", "d1<-D"],
    alignmentRightDown: ["A<-d1", "A<-d2", "C<-D"],
    alignmentLeftUp: ["D<-d2", "D<-d1", "dB<-A"],
    alignmentRightUp: ["D<-C", "d2<-d1", "d2<-A"],
    coordsLeftDown: [
      ["A", " ", " "],
      ["dB", "d1", " "],
      [" ", "d2", "C"],
      [" ", "D", " "],
    ],
    coordsRightDown: [
      [" ", "A", " "],
      ["dB", "d1", " "],
      [" ", "d2", "C"],
      [" ", " ", "D"],
    ],
    coordsLeftUp: [
      ["A", " ", " "],
      ["dB", "d1", " "],
      [" ", "d2", "C"],
      [" ", "D", " "],
    ],
    coordsRightUp: [
      [" ", "A", " "],
      ["dB", "d1", " "],
      [" ", "d2", "C"],
      [" ", " ", "D"],
    ],
    positionXResult: [
      [" ", "A", " ", " ", " ", " "],
      ["dB", " ", "d1", " ", " ", " "],
      [" ", " ", "d2", " ", " ", "C"],
      [" ", " ", " ", "D", " ", " "],
    ],
  },
  /**
   *  A
   *  |  \
   *  B  d1
   *    X
   * d2  dC
   *  | /
   *  D
   */
  innerSegmentsCrossOption4: {
    testCaseName: "conflicts when inner segments cross option 4",
    graph: [
      ["A->B->dC->D", "A->d1->d2->D"],
      [["A"], ["B", "d1"], ["d2", "dC"], ["D"]],
    ],
    conflicts: [["B", "dC"]],
    alignmentLeftDown: ["A<-B", "d1<-d2", "d1<-D"],
    alignmentRightDown: ["A<-d1", "A<-d2", "dC<-D"],
    alignmentLeftUp: ["D<-d2", "D<-d1", "B<-A"],
    alignmentRightUp: ["D<-dC", "d2<-d1", "d2<-A"],
    coordsLeftDown: [
      ["A", " ", " "],
      ["B", "d1", " "],
      [" ", "d2", "dC"],
      [" ", "D", " "],
    ],
    coordsRightDown: [
      [" ", "A", " "],
      ["B", "d1", " "],
      [" ", "d2", "dC"],
      [" ", " ", "D"],
    ],
    coordsLeftUp: [
      ["A", " ", " "],
      ["B", "d1", " "],
      [" ", "d2", "dC"],
      [" ", "D", " "],
    ],
    coordsRightUp: [
      [" ", "A", " "],
      ["B", "d1", " "],
      [" ", "d2", "dC"],
      [" ", " ", "D"],
    ],
    positionXResult: [
      [" ", " ", "A", " ", " ", " "],
      ["B", " ", " ", " ", "d1", " "],
      [" ", " ", " ", "d2", " ", "dC"],
      [" ", " ", " ", " ", "D", " "],
    ],
  },

  /**
   *     R
   *  /  |  \
   * A   dB  C
   *  \  |  /
   *
   *  /  |  \
   * D   dE  F
   *  \  |  /
   *     K
   */
  innerSegmentsDoubleConflict: {
    testCaseName: "conflicts when inner segments have double conflict",
    graph: [
      ["R->A->F->K", "R->dB->dE->K", "R->C->D->K"],
      [["R"], ["A", "dB", "C"], ["D", "dE", "F"], ["K"]],
    ],
    conflicts: [
      ["A", "F"],
      ["C", "D"],
    ],
    alignmentLeftDown: ["R<-A", "dB<-dE", "dB<-K"],
    alignmentRightDown: ["R<-C", "dB<-dE", "dB<-K"],
    alignmentLeftUp: ["K<-D", "dE<-dB", "dE<-R"],
    alignmentRightUp: ["K<-F", "dE<-dB", "dE<-R"],
    coordsLeftDown: [
      ["R", " ", " "],
      ["A", "dB", "C"],
      ["D", "dE", "F"],
      [" ", "K", " "],
    ],
    coordsRightDown: [
      [" ", " ", "R"],
      ["A", "dB", "C"],
      ["D", "dE", "F"],
      [" ", "K", " "],
    ],
    coordsLeftUp: [
      [" ", "R", " "],
      ["A", "dB", "C"],
      ["D", "dE", "F"],
      ["K", " ", " "],
    ],
    coordsRightUp: [
      [" ", "R", " "],
      ["A", "dB", "C"],
      ["D", "dE", "F"],
      [" ", " ", "K"],
    ],
    positionXResult: [
      [" ", " ", " ", "R", " ", " ", " "],
      ["A", " ", " ", " ", "dB", " ", "C"],
      ["D", " ", " ", " ", "dE", " ", "F"],
      [" ", " ", " ", "K", " ", " ", " "],
    ],
  },

  /**
   *            R
   *           / \
   *  AL  CL  dA  dC  AR  CR
   *    X |   |   |   |  X
   *  BL  DL  dB  dD  BR  DR
   *           \  /
   *            K
   */
  sandwichedInnerSegmentsNoConflicts: {
    testCaseName: "no conflicts in sandwiched graph with inner segments",
    graph: sandwichMainGraph(),
    conflicts: [],
    alignmentLeftDown: ["R<-dA", "CL<-BL", "R<-dB", "dC<-dD", "AR<-BR", "R<-K"],
    alignmentRightDown: ["R<-dC", "AR<-DR", "R<-dD", "dA<-dB", "CL<-DL", "R<-K"],
    alignmentLeftUp: ["K<-dB", "DL<-AL", "K<-dA", "dD<-dC", "BR<-AR", "K<-R"],
    alignmentRightUp: ["K<-dD", "BR<-CR", "K<-dC", "dB<-dA", "DL<-CL", "K<-R"],
    coordsLeftDown: [
      [" ", " ", " ", "R", " ", " ", " "],
      ["AL", "CL", " ", "dA", "dC", "AR", "CR"],
      [" ", "BL", "DL", "dB", "dD", "BR", "DR"],
      [" ", " ", " ", "K", " ", " ", " "],
    ],
    coordsRightDown: [
      [" ", " ", " ", "R", " ", " ", " "],
      ["AL", "CL", "dA", "dC", " ", "AR", "CR"],
      ["BL", "DL", "dB", "dD", "BR", "DR", " "],
      [" ", " ", " ", "K", " ", " ", " "],
    ],
    coordsLeftUp: [
      [" ", " ", " ", "R", " ", " ", " "],
      [" ", "AL", "CL", "dA", "dC", "AR", "CR"],
      ["BL", "DL", " ", "dB", "dD", "BR", "DR"],
      [" ", " ", " ", "K", " ", " ", " "],
    ],
    coordsRightUp: [
      [" ", " ", " ", "R", " ", " ", " "],
      ["AL", "CL", "dA", "dC", "AR", "CR", " "],
      ["BL", "DL", "dB", "dD", " ", "BR", "DR"],
      [" ", " ", " ", "K", " ", " ", " "],
    ],
    positionXResult: [
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "R", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
      ["AL", " ", " ", " ", "CL", " ", " ", " ", " ", "dA", " ", "dC", " ", " ", " ", " ", "AR", " ", " ", " ", "CR"],
      ["BL", " ", " ", " ", "DL", " ", " ", " ", " ", "dB", " ", "dD", " ", " ", " ", " ", "BR", " ", " ", " ", "DR"],
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "K", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
    ],
  },

  /**
   *            R
   *           / \
   *  AL  CL  dA  dC  AR  CR      AL  _
   *    X |   |   |   |  X     +    \   \
   *  BL  DL  dB  dD  BR  DR         BR  DR
   *           \  /
   *            K
   */

  sandwichedInnerSegmentsAndRightIntersectingSegments: {
    testCaseName: "conflicts with sandwiched inner segments and right intersecting segments",
    graph: mergeIntoGraph(sandwichMainGraph(), ["AL->BR", "AL->DR"]),
    conflicts: [
      ["AL", "BR"],
      ["AL", "DR"],
    ],
    alignmentLeftDown: ["R<-dA", "CL<-BL", "R<-dB", "dC<-dD", "AR<-BR", "R<-K"],
    alignmentRightDown: ["R<-dC", "AR<-DR", "R<-dD", "dA<-dB", "CL<-DL", "R<-K"],
    alignmentLeftUp: ["K<-dB", "BL<-CL", "K<-dA", "dD<-dC", "BR<-AR", "K<-R"],
    alignmentRightUp: ["K<-dD", "BR<-CR", "K<-dC", "dB<-dA", "DL<-CL", "K<-R"],
    coordsLeftDown: [
      [" ", " ", " ", "R", " ", " ", " "],
      ["AL", "CL", " ", "dA", "dC", "AR", "CR"],
      [" ", "BL", "DL", "dB", "dD", "BR", "DR"],
      [" ", " ", " ", "K", " ", " ", " "],
    ],
    coordsRightDown: [
      [" ", " ", " ", "R", " ", " ", " "],
      ["AL", "CL", "dA", "dC", " ", "AR", "CR"],
      ["BL", "DL", "dB", "dD", "BR", "DR", " "],
      [" ", " ", " ", "K", " ", " ", " "],
    ],
    coordsLeftUp: [
      [" ", " ", " ", "R", " ", " ", " "],
      ["AL", "CL", " ", "dA", "dC", "AR", "CR"],
      [" ", "BL", "DL", "dB", "dD", "BR", "DR"],
      [" ", " ", " ", "K", " ", " ", " "],
    ],
    coordsRightUp: [
      [" ", " ", " ", "R", " ", " ", " "],
      ["AL", "CL", "dA", "dC", "AR", "CR", " "],
      ["BL", "DL", "dB", "dD", " ", "BR", "DR"],
      [" ", " ", " ", "K", " ", " ", " "],
    ],
    positionXResult: [
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "R", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
      ["AL", " ", " ", " ", "CL", " ", " ", " ", " ", "dA", " ", "dC", " ", " ", " ", " ", "AR", " ", " ", " ", "CR"],
      [" ", " ", "BL", " ", " ", " ", "DL", " ", " ", " ", "dB", " ", "dD", " ", " ", " ", "BR", " ", " ", " ", "DR"],
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "K", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
    ],
  },

  /**
   *            R
   *           / \
   *  AL  CL  dA  dC  AR  CR          _   CR
   *    X |   |   |   |  X     +    /   /
   *  BL  DL  dB  dD  BR  DR      BL   DL
   *           \  /
   *            K
   */
  sandwichedInnerSegmentsAndLeftIntersectingSegments: {
    testCaseName: "conflicts with sandwiched inner segments and left intersecting segments",
    graph: mergeIntoGraph(sandwichMainGraph(), ["CR->DL", "CR->BL"]),
    conflicts: [
      ["DL", "CR"],
      ["BL", "CR"],
    ],
    alignmentLeftDown: ["R<-dA", "CL<-BL", "R<-dB", "dC<-dD", "AR<-BR", "R<-K"],
    alignmentRightDown: ["R<-dC", "AR<-DR", "R<-dD", "dA<-dB", "CL<-DL", "R<-K"],
    alignmentLeftUp: ["K<-dB", "DL<-AL", "K<-dA", "dD<-dC", "BR<-AR", "K<-R"],
    alignmentRightUp: ["K<-dD", "DR<-AR", "K<-dC", "dB<-dA", "DL<-CL", "K<-R"],
    coordsLeftDown: [
      [" ", " ", " ", "R", " ", " ", " "],
      ["AL", "CL", " ", "dA", "dC", "AR", "CR"],
      [" ", "BL", "DL", "dB", "dD", "BR", "DR"],
      [" ", " ", " ", "K", " ", " ", " "],
    ],
    coordsRightDown: [
      [" ", " ", " ", "R", " ", " ", " "],
      ["AL", "CL", "dA", "dC", " ", "AR", "CR"],
      ["BL", "DL", "dB", "dD", "BR", "DR", " "],
      [" ", " ", " ", "K", " ", " ", " "],
    ],
    coordsLeftUp: [
      [" ", " ", " ", "R", " ", " ", " "],
      [" ", "AL", "CL", "dA", "dC", "AR", "CR"],
      ["BL", "DL", " ", "dB", "dD", "BR", "DR"],
      [" ", " ", " ", "K", " ", " ", " "],
    ],
    coordsRightUp: [
      [" ", " ", " ", "R", " ", " ", " "],
      ["AL", "CL", "dA", "dC", " ", "AR", "CR"],
      ["BL", "DL", "dB", "dD", "BR", "DR", " "],
      [" ", " ", " ", "K", " ", " ", " "],
    ],
    positionXResult: [
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "R", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
      ["AL", " ", " ", " ", "CL", " ", " ", " ", " ", "dA", " ", "dC", " ", " ", " ", " ", "AR", " ", " ", " ", "CR"],
      ["BL", " ", " ", " ", "DL", " ", " ", " ", " ", "dB", " ", "dD", " ", " ", "BR", " ", " ", " ", "DR", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "K", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
    ],
  },

  /**
   *            R
   *           / \
   *  AL  CL  dA  dC  AR  CR      AL    CR
   *    X |   |   |   |  X     +     X
   *  BL  DL  dB  dD  BR  DR      DL    BR
   *           \  /
   *            K
   */
  sandwichedInnerSegmentsAndRightLeftIntersectingSegments: {
    testCaseName: "conflicts with sandwiched inner segments and right/left intersecting segments",
    graph: mergeIntoGraph(sandwichMainGraph(), ["CR->DL", "AL->BR"]),
    conflicts: [
      ["AL", "BR"],
      ["DL", "CR"],
    ],
    alignmentLeftDown: ["R<-dA", "CL<-BL", "R<-dB", "dC<-dD", "AR<-BR", "R<-K"],
    alignmentRightDown: ["R<-dC", "AR<-DR", "R<-dD", "dA<-dB", "CL<-DL", "R<-K"],
    alignmentLeftUp: ["K<-dB", "DL<-AL", "K<-dA", "dD<-dC", "BR<-AR", "K<-R"],
    alignmentRightUp: ["K<-dD", "BR<-CR", "K<-dC", "dB<-dA", "DL<-CL", "K<-R"],
    coordsLeftDown: [
      [" ", " ", " ", "R", " ", " ", " "],
      ["AL", "CL", " ", "dA", "dC", "AR", "CR"],
      [" ", "BL", "DL", "dB", "dD", "BR", "DR"],
      [" ", " ", " ", "K", " ", " ", " "],
    ],
    coordsRightDown: [
      [" ", " ", " ", "R", " ", " ", " "],
      ["AL", "CL", "dA", "dC", " ", "AR", "CR"],
      ["BL", "DL", "dB", "dD", "BR", "DR", " "],
      [" ", " ", " ", "K", " ", " ", " "],
    ],
    coordsLeftUp: [
      [" ", " ", " ", "R", " ", " ", " "],
      [" ", "AL", "CL", "dA", "dC", "AR", "CR"],
      ["BL", "DL", " ", "dB", "dD", "BR", "DR"],
      [" ", " ", " ", "K", " ", " ", " "],
    ],
    coordsRightUp: [
      [" ", " ", " ", "R", " ", " ", " "],
      ["AL", "CL", "dA", "dC", "AR", "CR", " "],
      ["BL", "DL", "dB", "dD", " ", "BR", "DR"],
      [" ", " ", " ", "K", " ", " ", " "],
    ],
    positionXResult: [
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "R", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
      ["AL", " ", " ", " ", "CL", " ", " ", " ", " ", "dA", " ", "dC", " ", " ", " ", " ", "AR", " ", " ", " ", "CR"],
      ["BL", " ", " ", " ", "DL", " ", " ", " ", " ", "dB", " ", "dD", " ", " ", " ", " ", "BR", " ", " ", " ", "DR"],
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "K", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
    ],
  },

  /**
   * Two layer conflicts.
   *
   *    A
   *    | \
   *    B  dA
   *    |/
   *   /|
   * dB C
   *   \|
   *    | \
   *    D  dC
   *    | /
   *    E
   *
   *  Contains Type 2 conflict
   */
  twoLayersIntersectingSegments: {
    testCaseName: "conflicts with two layers intersecting segments",
    graph: [
      ["A->B->C->D->E", "A->dA->dB->dC->E"],
      [["A"], ["B", "dA"], ["dB", "C"], ["D", "dC"], ["E"]],
    ],
    conflicts: [
      ["C", "D"],
      ["B", "C"],
    ],
    alignmentLeftDown: ["A<-B", "dA<-dB", "dA<-dC", "D<-E"],
    alignmentRightDown: ["A<-dA", "A<-dB", "A<-dC", "A<-E"],
    alignmentLeftUp: ["E<-D", "dC<-dB", "dC<-dA", "B<-A"],
    alignmentRightUp: ["E<-dC", "E<-dB", "E<-dA", "E<-A"],
    coordsLeftDown: [
      ["A", " ", " "],
      ["B", "dA", " "],
      [" ", "dB", "C"],
      ["D", "dC", " "],
      ["E", " ", " "],
    ],
    coordsRightDown: [
      [" ", "A", " "],
      ["B", "dA", " "],
      [" ", "dB", "C"],
      ["D", "dC", " "],
      [" ", "E", " "],
    ],
    coordsLeftUp: [
      ["A", " ", " "],
      ["B", "dA", " "],
      [" ", "dB", "C"],
      ["D", "dC", " "],
      ["E", " ", " "],
    ],
    coordsRightUp: [
      [" ", "A", " "],
      ["B", "dA", " "],
      [" ", "dB", "C"],
      ["D", "dC", " "],
      [" ", "E", " "],
    ],
    positionXResult: [
      [" ", " ", "A", " ", " ", " ", " "],
      ["B", " ", " ", " ", "dA", " ", " "],
      [" ", " ", " ", "dB", " ", " ", "C"],
      ["D", " ", " ", " ", "dC", " ", " "],
      [" ", " ", "E", " ", " ", " ", " "],
    ],
  },

  graphFromThePaper: {
    testCaseName: "graph from the paper - all cases",
    graph: [
      [
        "A->C",
        "A->dH",
        "A->J",
        "B->dE",
        "B->dG",
        "D->L",
        "dE->L",
        "F->L",
        "dG->dM",
        "dH->dN",
        "I->L",
        "I->P",
        "J->dO",
        "J->L",
        "K->Q",
        "K->R",
        "K->V",
        "dM->dT",
        "dN->dU",
        "dO->V",
        "P->dS",
        "P->dW",
        "Q->X",
        "Q->Y",
        "R->Y",
        "dS->X",
        "dT->Z",
        "dU->Z",
        "V->Z",
        "dW->Z",
      ],
      [
        ["A", "B"],
        ["C", "D", "dE", "F", "dG", "dH", "I", "J"],
        ["K", "L", "dM", "dN", "dO", "P"],
        ["Q", "R", "dS", "dT", "dU", "V", "dW"],
        ["X", "Y", "Z"],
      ],
    ],
    conflicts: [
      ["K", "V"],
      ["P", "dS"],
      ["L", "I"],
      ["J", "L"],
    ],
    alignmentLeftDown: [
      "A<-C",
      "B<-dE",
      "F<-L",
      "dG<-dM",
      "dH<-dN",
      "J<-dO",
      "K<-Q",
      "dG<-dT",
      "dH<-dU",
      "J<-V",
      "P<-dW",
      "K<-X",
      "R<-Y",
      "dH<-Z",
    ],
    alignmentRightDown: [
      "A<-J",
      "I<-P",
      "dH<-dN",
      "dG<-dM",
      "F<-L",
      "I<-dW",
      "dO<-V",
      "dH<-dU",
      "dG<-dT",
      "K<-R",
      "dO<-Z",
      "K<-Y",
      "Q<-X",
    ],
    alignmentLeftUp: [
      "X<-Q",
      "Y<-R",
      "Z<-dT",
      "Y<-K",
      "Z<-dM",
      "dU<-dN",
      "V<-dO",
      "dW<-P",
      "L<-D",
      "Z<-dG",
      "dU<-dH",
      "dW<-I",
      "dU<-A",
    ],
    alignmentRightUp: [
      "Z<-dW",
      "X<-dS",
      "Z<-P",
      "V<-dO",
      "dU<-dN",
      "dT<-dM",
      "R<-K",
      "V<-J",
      "dU<-dH",
      "dT<-dG",
      "L<-F",
      "dT<-B",
    ],
    coordsLeftDown: [
      ["A", " ", "B", " ", " ", " ", " ", " ", " "],
      ["C", "D", "dE", "F", "dG", "dH", "I", "J", " "],
      [" ", "K", " ", "L", "dM", "dN", " ", "dO", "P"],
      [" ", "Q", "R", "dS", "dT", "dU", " ", "V", "dW"],
      [" ", "X", "Y", " ", " ", "Z", " ", " ", " "],
    ],
    coordsRightDown: [
      [" ", " ", " ", " ", " ", " ", " ", " ", "A", "B"],
      ["C", "D", "dE", "F", "dG", "dH", " ", "I", "J", " "],
      [" ", " ", "K", "L", "dM", "dN", "dO", "P", " ", " "],
      [" ", "Q", "R", "dS", "dT", "dU", "V", "dW", " ", " "],
      [" ", "X", "Y", " ", " ", " ", "Z", " ", " ", " "],
    ],
    coordsLeftUp: [
      [" ", " ", " ", " ", " ", " ", "A", "B", " ", " "],
      [" ", "C", "D", "dE", "F", "dG", "dH", " ", "I", "J"],
      [" ", "K", "L", " ", " ", "dM", "dN", "dO", "P", " "],
      ["Q", "R", "dS", " ", " ", "dT", "dU", "V", "dW", " "],
      ["X", "Y", " ", " ", " ", "Z", " ", " ", " ", " "],
    ],
    coordsRightUp: [
      [" ", " ", " ", "A", "B", " ", " ", " ", " "],
      ["C", "D", "dE", "F", "dG", "dH", "I", "J", " "],
      [" ", " ", "K", "L", "dM", "dN", " ", "dO", "P"],
      [" ", "Q", "R", "dS", "dT", "dU", " ", "V", "dW"],
      [" ", " ", " ", "X", " ", " ", " ", "Y", "Z"],
    ],
    positionXResult: [
      [
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "A",
        " ",
        " ",
        " ",
        "B",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
      ],
      [
        "C",
        " ",
        " ",
        " ",
        "D",
        " ",
        " ",
        " ",
        "dE",
        " ",
        "F",
        " ",
        " ",
        " ",
        "dG",
        " ",
        "dH",
        " ",
        "I",
        " ",
        " ",
        " ",
        "J",
        " ",
        " ",
        " ",
        " ",
      ],
      [
        " ",
        " ",
        " ",
        " ",
        "K",
        " ",
        " ",
        " ",
        " ",
        "L",
        " ",
        " ",
        " ",
        "dM",
        " ",
        "dN",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "dO",
        " ",
        " ",
        " ",
        "P",
      ],
      [
        " ",
        "Q",
        " ",
        " ",
        " ",
        "R",
        " ",
        " ",
        " ",
        "dS",
        " ",
        " ",
        " ",
        "dT",
        " ",
        "dU",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "V",
        " ",
        " ",
        " ",
        "dW",
      ],
      [
        " ",
        " ",
        "X",
        " ",
        " ",
        " ",
        "Y",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        "Z",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
      ],
    ],
  },
};
