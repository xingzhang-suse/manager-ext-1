import range from "lodash/range";
import uniq from "lodash/uniq";

import { floor } from "~/tools/floor";
import { max } from "~/tools/max";
import { min } from "~/tools/min";
import { times } from "~/tools/times";
import { toArray } from "~/tools/to-array";

import type { ViewRelation } from "../../../common/CoreApi";
import { extend } from "../../../common/functions";
import type { CrossDomainRelations, VizEdgeData, VizVertexData } from "../../../stackviz/rendering/RenderInput";
import { vertexByName, vertexName } from "../__fixtures__/graphTestUtil";
import {
  type GroupedLayeredTextGraph,
  type NamedLayers,
  type NamedVizGraph,
  groupedToOrderedLayers,
  toVizGraph,
} from "../__fixtures__/hierarchicalTestUtil";
import {
  coordsAsPositionsInLayer,
  toMultiColumnLayeredTextGraph,
  toTextGroupings,
} from "../__fixtures__/MultiColumnGraphTestUtil";
import {
  type PositionOrphansCoordinates,
  type PositionOrphansTestCase,
  positionOrphansTestCasesFixture,
} from "../__fixtures__/positionOrphans";
import {
  type HierarchicalLayout,
  defaultInitialHierarchicalLayoutOptions,
} from "../algos/hierarchical/hierarchicalLayout";
import {
  type ColumnOrphans,
  DEFAULT_GROUP_ID,
  OrphanAlignment,
  collectOrphansForColumn,
  positionOrphans,
} from "../algos/hierarchical/orphans";
import type { VertexId } from "../graphCommon";

describe("PositionOrphans graphs", () => {
  [OrphanAlignment.RIGHT, OrphanAlignment.LEFT].forEach((biasX) => {
    testPositionOrphans(positionOrphansTestCasesFixture.emptyGraph, biasX);
    testPositionOrphans(positionOrphansTestCasesFixture.horizontal2ComponentsOneOrphan, biasX);
    testPositionOrphans(positionOrphansTestCasesFixture.horizontal2ComponentsTwoOrphans, biasX);
    testPositionOrphans(positionOrphansTestCasesFixture.horizontal2ComponentsThreeOrphans, biasX);
    testPositionOrphans(positionOrphansTestCasesFixture.horizontal2ComponentsFourOrphans, biasX);

    testPositionOrphans(positionOrphansTestCasesFixture.vertical2ComponentsOneOrphan, biasX);
    testPositionOrphans(positionOrphansTestCasesFixture.vertical2ComponentsTwoOrphans, biasX);
    testPositionOrphans(positionOrphansTestCasesFixture.vertical2ComponentsThreeOrphans, biasX);
    testPositionOrphans(positionOrphansTestCasesFixture.vertical2ComponentsFourOrphans, biasX);
  });

  function testPositionOrphans(testCase: PositionOrphansTestCase, alignment: OrphanAlignment) {
    it(`Bias: ${alignment === OrphanAlignment.LEFT ? "Left" : "Right"} ${testCase.testCaseName}`, () => {
      const expected =
        alignment === OrphanAlignment.LEFT ? testCase.positionOrphansLeft : testCase.positionOrphansRight;
      expect(testGraphPositionOrphans(testCase.graph!, alignment)).toEqual(expected);
    });
  }

  function testGraphPositionOrphans(
    layeredTextGraph: GroupedLayeredTextGraph,
    alignment: OrphanAlignment,
  ): PositionOrphansCoordinates {
    const options = extend(
      { betweenDummyNodeWidth: 1, groupRatioX: 1, groupRatioY: 1 },
      defaultInitialHierarchicalLayoutOptions(),
    );
    const graph = toVizGraph(layeredTextGraph, 0);
    const groupings = toTextGroupings(graph, layeredTextGraph[1]);
    const crossDomainRelations: CrossDomainRelations = new Map<VertexId, Array<ViewRelation>>();
    const { orphanGroups, orphanIds } = collectOrphansForColumn(graph, crossDomainRelations, 0, groupings);
    const orphanNames = new Set<string>(orphanIds.map((vertexId) => vertexName(graph.vertexById(vertexId))));
    orphanIds.forEach((vertexId: VertexId) => graph.removeVertexById(vertexId));

    graph.vertices().forEach((vertex) => (vertex.data().hierarchical = {}));

    const layers = groupedToOrderedLayers(graph, layeredTextGraph[1], orphanNames);

    const coords = coordsAsPositionsInLayer(layers, orphanIds);

    const layout: HierarchicalLayout<any, any> = { layers, dummyPaths: new Map(), coords };

    positionOrphans(graph, layout, orphanGroups, alignment, options);

    const resultCoords = layout.coords;
    const outLayers = layout.layers;

    const minX = min(resultCoords.values(), coords.values())!;
    const maxX = max(resultCoords.values(), coords.values())!;
    const emptyCell = " ";
    const width = floor(maxX - minX, 0);
    const resultGrid = times(outLayers.size(), () => times(width + 1, () => emptyCell));

    outLayers.forEach((layer, layerIdx) => {
      layer.vertexIds.forEach((vertexId) => {
        const vertexName = graph.vertexById(vertexId).data().name;
        const coord = resultCoords.get(vertexId)!;
        resultGrid[layerIdx][coord - minX] = vertexName;
      });
    });

    return resultGrid.reverse();
  }
});

describe("PositionOrphans various checks", () => {
  it("position orphans in multilayered graph", () => {
    /**
     *       col 1  |    col2
     *              |
     *         A  --|-I
     * l1    / | \  | \
     *      B  C  D | dJ  o1 o2 o3 o4
     * -----|--|--|-|-|-------------------
     *      E  F  G | dK  o5 o6 o7 o8
     * l2    \ | /  | |
     *        H ----|-L
     */
    const options = {
      ...defaultInitialHierarchicalLayoutOptions(),
      ...{ betweenDummyNodeWidth: 1, groupRatioX: 1, groupRatioY: 1 },
    };

    const colTextGraph1: GroupedLayeredTextGraph = [
      ["A->B->E->H", "A->C->F->H", "A->D->G->H"],
      [
        [["A"], ["B", "C", "D"]],
        [["E", "F", "G"], ["H"]],
      ],
    ];

    const colTextGraph2: GroupedLayeredTextGraph = [
      ["I->dJ->dK->L", "o1", "o2", "o3", "o4", "o5", "o6", "o7", "o8"],
      [
        [["I"], ["dJ", "o1", "o2", "o3", "o4"]],
        [["dK", "o5", "o6", "o7", "o8"], ["L"]],
      ],
    ];

    const crossDomainRelationsString = ["A->I", "H->L"];

    const columnLayouts = toMultiColumnLayeredTextGraph([[colTextGraph1, colTextGraph2], crossDomainRelationsString]);

    columnLayouts.forEach((columnLayout) =>
      positionOrphans(
        columnLayout.graph,
        columnLayout.layout,
        columnLayout.orphanGroups,
        OrphanAlignment.RIGHT,
        options,
      ),
    );
    const [col1, col2] = columnLayouts;

    const { layout: layout1, orphanGroups: orphanGroups1, graph: graph1 } = col1;
    verifyLayering(graph1, layout1, [["A"], ["B", "C", "D"], ["E", "F", "G"], ["H"]]);

    const { layout: layout2, orphanGroups: orphanGroups2, graph: graph2 } = col2;
    verifyLayering(graph2, layout2, [
      ["I", "o1", "o3"],
      ["dJ", "o2", "o4"],
      ["dK", "o5", "o7"],
      ["L", "o6", "o8"],
    ]);

    verifyOrphanCoordsBlock(graph1, layout1, orphanGroups1, OrphanAlignment.RIGHT);
    verifyOrphanCoordsBlock(graph2, layout2, orphanGroups2, OrphanAlignment.RIGHT);
  });

  it("recreate groups of layers that are ignored because of orphans", () => {
    /**
     *       col 1
     *
     *         A--    o1  o2  o3  o4  o5  o6
     * l1    / |   \  o7  o8  o9  o10 o11 o12
     *      dB  dC dD o13 o12 o13 o14 o15 o16
     * -----|--|---|----------------------------
     * l2   |  |   |  o17
     * -----|--|---|----------------------------
     *      dE dF  G
     * l3    \ |  /
     *        -H-
     */
    const options = {
      ...defaultInitialHierarchicalLayoutOptions(),
      ...{ betweenDummyNodeWidth: 1, groupRatioX: 1, groupRatioY: 1 },
    };

    const colTextGraph1: GroupedLayeredTextGraph = [
      ["A->dB->dE->H", "A->dC->dF->H", "A->dD->G->H", ...range(1, 18).map((i) => `o${i}`)],
      [[["A"], ["dB", "dC", "dD", ...range(1, 17).map((i) => `o${i}`)]], [["o17"]], [["dE", "dF", "G"], ["H"]]],
    ];

    const columnLayouts = toMultiColumnLayeredTextGraph([[colTextGraph1], []]);

    columnLayouts.forEach((columnLayout) =>
      positionOrphans(
        columnLayout.graph,
        columnLayout.layout,
        columnLayout.orphanGroups,
        OrphanAlignment.RIGHT,
        options,
      ),
    );
    const [col1] = columnLayouts;

    const { layout: layout1, orphanGroups: orphanGroups1, graph: graph1 } = col1;
    verifyLayering(graph1, layout1, [
      ["A", "o1", "o5", "o9", "o13"],
      ["dB", "dC", "dD", "o2", "o6", "o10", "o14"],
      ["o3", "o7", "o11", "o15"],
      ["o4", "o8", "o12", "o16"],
      ["o17"],
      ["dE", "dF", "G"],
      ["H"],
    ]);

    verifyOrphanCoordsBlock(graph1, layout1, orphanGroups1, OrphanAlignment.RIGHT);
  });

  it("place orphans in the first column starting from entire column maxX", () => {
    /**
     *       col 1  |   col2
     *              |
     *            A-|--
     * l1       / | |  \
     *         B  C |  D
     * -------------|--|----------------------------
     * l2    o3  o1 |  |
     *           o2 |  |
     * -------------|--|----------------------------
     *         E  F |  G
     * l3      \  | |  /
     *          --H-|-
     */
    const options = {
      ...defaultInitialHierarchicalLayoutOptions(),
      ...{ betweenDummyNodeWidth: 1, groupRatioX: 1, groupRatioY: 1 },
    };

    const colTextGraph1: GroupedLayeredTextGraph = [
      ["A->B", "E->H", "A->C", "F->H", ...range(1, 4).map((i) => `o${i}`)],
      [[["A"], ["B", "C"]], [[...range(1, 4).map((i) => `o${i}`)]], [["E", "F"], ["H"]]],
    ];

    const colTextGraph2: GroupedLayeredTextGraph = [["D->G"], [[[], ["D"]], [[]], [["G"], []]]];

    const crossDomainRelationsString = ["A->D", "G->H"];

    const columnLayouts = toMultiColumnLayeredTextGraph([[colTextGraph1, colTextGraph2], crossDomainRelationsString]);

    columnLayouts.forEach((columnLayout, columnIdx) =>
      positionOrphans(
        columnLayout.graph,
        columnLayout.layout,
        columnLayout.orphanGroups,
        columnIdx === 0 ? OrphanAlignment.LEFT : OrphanAlignment.RIGHT,
        options,
      ),
    );
    const [col1, col2] = columnLayouts;

    const { layout: layout1, orphanGroups: orphanGroups1, graph: graph1 } = col1;
    verifyLayering(graph1, layout1, [["A"], ["B", "C"], ["o3", "o1"], ["o2"], ["E", "F"], ["H"]]);

    const { layout: layout2, orphanGroups: orphanGroups2, graph: graph2 } = col2;
    verifyLayering(graph2, layout2, [[], ["D"], [], ["G"], []]);

    verifyOrphanCoordsBlock(graph1, layout1, orphanGroups1, OrphanAlignment.LEFT);
    verifyOrphanCoordsBlock(graph2, layout2, orphanGroups2, OrphanAlignment.RIGHT);
  });

  it("fix order and layerIdx for existing coordinates", () => {
    /**
     *     col 1
     *
     *      A
     *      |
     *      dB  o1  o2  o3
     * l1   |   o4  o5  o6
     *      dC  o7  o8  o9
     * -----|--------------
     *      dD
     * l2   |
     *      F
     */
    const options = {
      ...defaultInitialHierarchicalLayoutOptions(),
      ...{ betweenDummyNodeWidth: 1, groupRatioX: 1, groupRatioY: 1 },
    };

    const colTextGraph1: GroupedLayeredTextGraph = [
      ["A->dB->dD->F", ...range(1, 9).map((i) => `o${i}`)],
      [
        [["A"], ["dB", ...range(1, 9).map((i) => `o${i}`)]],
        [["dD"], ["F"]],
      ],
    ];

    const columnLayouts = toMultiColumnLayeredTextGraph([[colTextGraph1], []]);

    const [col1] = columnLayouts;

    col1.layout.coords.get(vertexByName(col1.graph, "A")[0].id);
    columnLayouts.forEach((columnLayout) =>
      positionOrphans(
        columnLayout.graph,
        columnLayout.layout,
        columnLayout.orphanGroups,
        OrphanAlignment.RIGHT,
        options,
      ),
    );

    const { layout: layout1, orphanGroups: orphanGroups1, graph: graph1 } = col1;
    verifyLayering(graph1, layout1, [["A", "o1", "o4", "o7"], ["dB", "o2", "o5", "o8"], ["o3", "o6"], ["dD"], ["F"]]);

    verifyOrphanCoordsBlock(graph1, layout1, orphanGroups1, OrphanAlignment.RIGHT);
  });

  function verifyLayering(graph: NamedVizGraph, layout: HierarchicalLayout<any, any>, expectedLayers: NamedLayers) {
    layout.layers.forEach((layer, layerIdx) => {
      const vertexesInLayer = layer.vertexIds.map((vertexId) => graph.vertexById(vertexId));

      const vertexNames = vertexesInLayer.map((vertex) => vertexName(vertex));
      expect(vertexNames).toEqual(expectedLayers[layerIdx]);

      const orderOfVertexesInLayer = vertexesInLayer.map((vertex) => vertex.data().hierarchical!.order);
      expect(range(0, vertexesInLayer.length)).toEqual(orderOfVertexesInLayer);

      if (vertexesInLayer.length > 0) {
        const layerIdxOfVertexesInLayer = uniq(vertexesInLayer.map((vertex) => vertex.data().hierarchical!.layer));
        expect([layerIdx]).toEqual(layerIdxOfVertexesInLayer);
      }
    });
  }

  function verifyOrphanCoordsBlock(
    graph: NamedVizGraph,
    layout: HierarchicalLayout<any, any>,
    orphanGroups: ColumnOrphans<VizVertexData, VizEdgeData>,
    alignment: OrphanAlignment,
  ) {
    const groupedLayers = layout.layers.getGroupedLayers(DEFAULT_GROUP_ID);

    const orphans: Array<VertexId> = toArray(orphanGroups.values())
      .flat()
      .map((_) => _.id);

    const notOrphans: Array<VertexId> = layout.layers.layers.flatMap((layer) => {
      return layer.vertexIds.filter((vertexId) => orphans.indexOf(vertexId) < 0);
    });

    const minNotOrphanForColumn = min(
      Number.MAX_VALUE,
      notOrphans.map((vertexId) => layout.coords.get(vertexId)),
    );
    const maxNotOrphanForColumn = max(
      0,
      notOrphans.map((vertexId) => layout.coords.get(vertexId)),
    );

    orphanGroups.forEach((orphansInGroup, groupIdx) => {
      if (orphansInGroup.length === 0) {
        return;
      }
      const orphansInGroupIds: Array<VertexId> = orphansInGroup.map((_) => _.id);
      const layerGroup = groupedLayers.get(groupIdx)!;

      const notOrphansInGroup: Array<VertexId> = layerGroup.getLayers().flatMap((layer) => {
        return layer.vertexIds.filter((vertexId) => orphansInGroupIds.indexOf(vertexId) < 0);
      });

      if (alignment === OrphanAlignment.RIGHT) {
        const minOrphan = min(
          Number.MAX_VALUE,
          orphansInGroup.map((vertex) => layout.coords.get(vertex.id)),
        );
        if (notOrphansInGroup.length > 0) {
          const maxNotOrphan = min(
            0,
            notOrphansInGroup.map((vertexId) => layout.coords.get(vertexId)),
          );
          expect(minOrphan).toBeGreaterThan(maxNotOrphan);
        } else {
          expect(minOrphan).toBe(minNotOrphanForColumn);
        }
      } else {
        const maxOrphan = max(
          0,
          orphansInGroupIds.map((vertexId) => layout.coords.get(vertexId)),
        );

        if (notOrphansInGroup.length > 0) {
          const minNotOrphan = min(
            Number.MAX_VALUE,
            notOrphansInGroup.map((vertexId) => layout.coords.get(vertexId)),
          );
          expect(maxOrphan).toBeLessThan(minNotOrphan);
        } else {
          expect(maxOrphan).toBe(maxNotOrphanForColumn);
        }
      }
    });
  }
});

describe("collectOrphansForColumn", () => {
  it("collect orphans when no domains enabled", () => {
    /**
     *     col 1
     *
     *      A
     *      |
     *      dB  o1  o2  o3
     *      |
     *      dD  o4  o5  o6
     *      |
     *      F
     */

    const colTextGraph1: GroupedLayeredTextGraph = [
      ["A->dB->dD->F", ...range(1, 7).map((i) => `o${i}`)],
      [
        [["A"], ["dB", ...range(1, 7).map((i) => `o${i}`)]],
        [["dD"], ["F"]],
      ],
    ];

    const graph = toVizGraph(colTextGraph1);
    const crossDomainRelations = new Map<VertexId, Array<ViewRelation>>();
    const { orphanGroups } = collectOrphansForColumn(graph, crossDomainRelations, 0);

    expect(toArray(orphanGroups.keys())).toEqual([-1]);

    const orphanNames = toArray(orphanGroups.get(-1)!, (vertex) => vertexName(vertex));
    expect(orphanNames).toEqual([...range(1, 7).map((i) => `o${i}`)]);
  });

  it("collect orphan groups when layers enabled", () => {
    /**
     *     col 1
     *
     *      A
     * l1   |
     *      dB  o1  o2  o3
     * -----|---------------
     * l2   dD  o4  o5  o6
     *      |
     *      F
     */
    const colTextGraph1: GroupedLayeredTextGraph = [
      ["A->dB->dD->F", ...range(1, 7).map((i) => `o${i}`)],
      [
        [["A"], ["dB", ...range(1, 4).map((i) => `o${i}`)]],
        [["dD", ...range(4, 7).map((i) => `o${i}`)], ["F"]],
      ],
    ];

    const [, layerGroups] = colTextGraph1;
    const graph = toVizGraph(colTextGraph1);
    const groupings = toTextGroupings(graph, layerGroups);
    const crossDomainRelations = new Map<VertexId, Array<ViewRelation>>();
    const { orphanGroups } = collectOrphansForColumn(graph, crossDomainRelations, 0, groupings);

    expect(toArray(orphanGroups.keys())).toEqual([0, 1]);

    const orphanNames0 = toArray(orphanGroups.get(0)!).map((vertex) => vertexName(vertex));
    expect(orphanNames0).toEqual([...range(1, 4).map((i) => `o${i}`)]);

    const orphanNames1 = toArray(orphanGroups.get(1)!).map((vertex) => vertexName(vertex));
    expect(orphanNames1).toEqual([...range(4, 7).map((i) => `o${i}`)]);
  });
});
