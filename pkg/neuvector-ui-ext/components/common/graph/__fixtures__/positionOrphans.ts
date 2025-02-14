import type { GroupedLayeredTextGraph } from "./hierarchicalTestUtil";

export abstract class PositionOrphansTestCase {
  testCaseName?: string;
  graph?: GroupedLayeredTextGraph;
  positionOrphansRight?: PositionOrphansCoordinates;
  positionOrphansLeft?: PositionOrphansCoordinates;
}

export type PositionOrphansCoordinates = string[][];

export interface PositionOrphansTestCases {
  emptyGraph: PositionOrphansTestCase;

  horizontal2ComponentsOneOrphan: PositionOrphansTestCase;
  horizontal2ComponentsTwoOrphans: PositionOrphansTestCase;
  horizontal2ComponentsThreeOrphans: PositionOrphansTestCase;
  horizontal2ComponentsFourOrphans: PositionOrphansTestCase;

  vertical2ComponentsOneOrphan: PositionOrphansTestCase;
  vertical2ComponentsTwoOrphans: PositionOrphansTestCase;
  vertical2ComponentsThreeOrphans: PositionOrphansTestCase;
  vertical2ComponentsFourOrphans: PositionOrphansTestCase;
}

export const positionOrphansTestCasesFixture: PositionOrphansTestCases = {
  emptyGraph: {
    testCaseName: "empty graph",
    graph: [[], []],

    positionOrphansRight: [],
    positionOrphansLeft: [],
  },

  /**
   * A -> B C
   */
  horizontal2ComponentsOneOrphan: {
    testCaseName: "1 group 1 layer 2 components 1 orphan",
    graph: [["A->B", "C"], [[["A", "B", "C"]]]],
    positionOrphansRight: [["A", "B", "C"]],
    positionOrphansLeft: [["C", "A", "B"]],
  },

  /**
   * A -> B C D
   */
  horizontal2ComponentsTwoOrphans: {
    testCaseName: "single cell two components graph 2 orphans",
    graph: [["A->B", "C", "D"], [[["A", "B", "C", "D"]]]],
    positionOrphansRight: [["A", "B", "C", "D"]],
    positionOrphansLeft: [["D", "C", "A", "B"]],
  },

  /**
   * A -> B C D E
   */
  horizontal2ComponentsThreeOrphans: {
    testCaseName: "single cell two components graph 3 orphans",
    graph: [["A->B", "C", "D", "E"], [[["A", "B", "C", "D", "E"]]]],
    positionOrphansRight: [
      [" ", " ", "D", " "],
      ["A", "B", "C", "E"],
    ],
    positionOrphansLeft: [
      [" ", "D", " ", " "],
      ["E", "C", "A", "B"],
    ],
  },

  /**
   * A -> B C D E F
   */
  horizontal2ComponentsFourOrphans: {
    testCaseName: "single cell two components graph 4 orphans",
    graph: [["A->B", "C", "D", "E", "F"], [[["A", "B", "C", "D", "E", "F"]]]],
    positionOrphansRight: [
      [" ", " ", "D", "F"],
      ["A", "B", "C", "E"],
    ],
    positionOrphansLeft: [
      ["F", "D", " ", " "],
      ["E", "C", "A", "B"],
    ],
  },

  /**
   * A
   * |
   * B C
   */
  vertical2ComponentsOneOrphan: {
    testCaseName: "2 cells two components graph 1 orphan",
    graph: [["A->B", "C"], [[["A"], ["B", "C"]]]],
    positionOrphansRight: [
      ["B", " "],
      ["A", "C"],
    ],
    positionOrphansLeft: [
      [" ", "B"],
      ["C", "A"],
    ],
  },

  /**
   * A
   * |
   * B C D
   */
  vertical2ComponentsTwoOrphans: {
    testCaseName: "2 cells two components graph 2 orphans",
    graph: [["A->B", "C", "D"], [[["A"], ["B", "C", "D"]]]],
    positionOrphansRight: [
      ["B", " ", " "],
      ["A", "C", "D"],
    ],
    positionOrphansLeft: [
      [" ", " ", "B"],
      ["D", "C", "A"],
    ],
  },

  /**
   * A
   * |
   * B C D E
   */
  vertical2ComponentsThreeOrphans: {
    testCaseName: "2 cells two components graph 3 orphans",
    graph: [["A->B", "C", "D", "E"], [[["A"], ["B", "C", "D", "E"]]]],
    positionOrphansRight: [
      ["B", "D", " "],
      ["A", "C", "E"],
    ],
    positionOrphansLeft: [
      [" ", "D", "B"],
      ["E", "C", "A"],
    ],
  },

  /**
   * A
   * |
   * B C D E F
   */
  vertical2ComponentsFourOrphans: {
    testCaseName: "2 cells four components graph 4 orphans",
    graph: [["A->B", "C", "D", "E", "F"], [[["A"], ["B", "C", "D", "E", "F"]]]],
    positionOrphansRight: [
      ["B", "D", "F"],
      ["A", "C", "E"],
    ],
    positionOrphansLeft: [
      ["F", "D", "B"],
      ["E", "C", "A"],
    ],
  },
};
