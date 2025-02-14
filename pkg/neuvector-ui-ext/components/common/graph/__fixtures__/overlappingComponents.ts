import type { LayeredTextGraph } from "./hierarchicalTestUtil";

/**
 *                           B  C  D  E
 *                            \__\_|_/
 *                                 F
 *                                 |
 *            G  H  I  J  K  L  M  N  O  P  Q  R   S   T   U   V   X   Y
 *            |  |    \_\_|_/    \__\_|_/__/   |   |   |   |   |   |   |
 *            Z  B1       C1          D1       E1  F1  G1  H1  I1  J1  K1
 *            \__\_________\___________\________\__|__/___/___/___/___/
 *                                                 A
 */
export function componentOverlappedBigGraph(): LayeredTextGraph {
  return [
    [
      "A->I1",
      "A->C1",
      "A->J1",
      "A->H1",
      "A->D1",
      "A->G1",
      "A->B1",
      "A->F1",
      "A->K1",
      "A->Z",
      "A->E1",
      "Z->G",
      "C1->J",
      "C1->K",
      "C1->I",
      "C1->L",
      "K1->Y",
      "H1->U",
      "G1->T",
      "I1->V",
      "E1->R",
      "B1->H",
      "J1->X",
      "D1->M",
      "D1->P",
      "D1->O",
      "D1->Q",
      "D1->N",
      "F1->S",
      "N->F",
      "K->F",
      "F->E",
      "F->D",
      "F->C",
      "F->B",
    ],
    [
      ["B", "C", "D", "E"],
      ["F"],
      ["G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "X", "Y"],
      ["Z", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1", "J1", "K1"],
      ["A"],
    ],
  ];
}

/**
 *            C  D  E
 *             \ | /
 *               F
 *               |
 *            K  N  O  Q  R  S
 *            |   \ | /   |  |
 *            C1    D1   E1  F1
 *             \     \    | /
 *              -------   A
 */
export function componentOverlappedSmallGraph(): LayeredTextGraph {
  return [
    [
      "A->C1",
      "A->D1",
      "A->F1",
      "A->E1",
      "C1->K",
      "E1->R",
      "D1->O",
      "D1->Q",
      "D1->N",
      "F1->S",
      "N->F",
      "K->F",
      "F->E",
      "F->D",
      "F->C",
    ],
    [["C", "D", "E"], ["F"], ["K", "N", "O", "Q", "R", "S"], ["C1", "D1", "E1", "F1"], ["A"]],
  ];
}
