import range from "lodash/range";

import { viewSnapshotBuilder, viewSnapshotMetadataBuilder } from "../../../../test/common/builders/viewSnapshot";
import { TopologySnapshot } from "../../../app/state/topology/TopologySnapshot";
import { HealthStateValue, type NodeId, type TypeGroup, Type } from "../../../common/CoreApi";
import {
  type StackViewGeneration,
  createComponent,
  createDomain,
  createGroup,
  createGroupRelation,
  createIndirectRelation,
  createLayer,
  createRelation,
  generateStackView,
} from "../../../stackviz/demo/RandomStackViewGeneration";
import type {
  VizEdgeData,
  VizGraph,
  VizHierarchicalLayout,
  VizRenderInput,
  VizVertexData,
} from "../../../stackviz/rendering/RenderInput";
import { toVizRenderInput } from "../../../stackviz/StackViewToStackVizRenderInput";
import { StackView } from "../../../store/StackView";
import { StackViewSnapshot } from "../../../store/StackViewSnapshot";
import { isDummy } from "../algos/hierarchical/hierarchicalCommon";
import { defaultInitialHierarchicalLayoutOptions } from "../algos/hierarchical/hierarchicalLayout";
import type { VertexId } from "../graphCommon";
import type { Vertex } from "../Vertex";

describe("ToVizRenderInput", () => {
  const defaultStackViewGeneration: StackViewGeneration = {
    colCount: 1,
    colNames: false,
    rowCount: 1,
    rowNames: false,
    componentCount: 10,
    relationCount: 10,
    relationHealth: false,
    isTree: false,
    groupCount: 2,
    randomIcons: true,
    componentNames: false,
    noOrphans: false,
    orphanCount: 3,
  };

  it("should render graph with 1 domain and 1 layer", () => {
    range(0, 100).forEach(() => {
      const options = { ...defaultInitialHierarchicalLayoutOptions() };

      const testOverrides = { componentCount: 30, relationCount: 20, groupRows: true, groupColumns: true };
      const stackView = generateStackView({ ...defaultStackViewGeneration, ...testOverrides });

      const view: VizRenderInput = toVizRenderInput(stackView, options);
      expectGraph(view, stackView.snapshot, 1, 1);
    });
  });

  it("should render graph with 2 domains and 2 layers", () => {
    range(0, 100).forEach(() => {
      const options = { ...defaultInitialHierarchicalLayoutOptions() };

      const testOverrides = {
        componentCount: 30,
        relationCount: 20,
        groupRows: true,
        groupColumns: true,
        colCount: 2,
        rowCount: 2,
        noOrphans: true,
        orphanCount: 0,
      };
      const stackView = generateStackView({ ...defaultStackViewGeneration, ...testOverrides });

      const view: VizRenderInput = toVizRenderInput(stackView, options);
      expectGraph(view, stackView.snapshot, 2, 2);
    });
  });

  it("should render group relations between domains", () => {
    const options = { ...defaultInitialHierarchicalLayoutOptions() };

    const columns = [createDomain(1, "domain_1"), createDomain(2, "domain_2")];
    const rows = [createLayer(3, "layer_3")];

    const components = [
      createComponent(10, "container_4", 1, 3),
      createComponent(11, "container_5", 2, 3),
      createComponent(12, "container_6", 2, 3),
    ];

    const relations = [
      createRelation(30, 10, 11, HealthStateValue.Clear),
      createRelation(31, 10, 12, HealthStateValue.Clear),
    ];

    const groupRelations = [createGroupRelation(10 as NodeId, 50 as NodeId)];

    const group: TypeGroup = createGroup(50, 2, 2, 3);
    group.components = [50 as NodeId, 11 as NodeId, 12 as NodeId];

    const snapshot = viewSnapshotBuilder({
      components: [...components],
      relations: [...relations],
      indirectRelations: [],
      groups: [group],
      groupRelations: [...groupRelations],
      metadata: viewSnapshotMetadataBuilder({
        layers: rows,
        domains: columns,
      }),
    });

    const stackView = new StackView(new StackViewSnapshot(TopologySnapshot.fromViewSnapshot(snapshot)));

    const view: VizRenderInput = toVizRenderInput(stackView, options);

    expect(view.graph.edgeCount()).toBe(1);
  });

  it("should render indirect relations between domains", () => {
    const options = { ...defaultInitialHierarchicalLayoutOptions() };

    const columns = [createDomain(1, "domain_1"), createDomain(2, "domain_2")];
    const rows = [createLayer(3, "layer_3")];

    const components = [createComponent(10, "container_4", 1, 3), createComponent(11, "container_5", 2, 3)];

    const indirectRelations = [createIndirectRelation(10, 11)];

    const snapshot = viewSnapshotBuilder({
      components: [...components],
      relations: [],
      indirectRelations: indirectRelations,
      groups: [],
      groupRelations: [],
      metadata: viewSnapshotMetadataBuilder({
        layers: rows,
        domains: columns,
      }),
    });

    const stackView = new StackView(new StackViewSnapshot(TopologySnapshot.fromViewSnapshot(snapshot)));

    const view: VizRenderInput = toVizRenderInput(stackView, options);

    expect(view.graph.edgeCount()).toBe(1);
  });

  function expectGraph(result: VizRenderInput, snapshot: StackViewSnapshot, colCount?: number, rowCount?: number) {
    if (colCount) {
      expect(result.cols!.length).toBe(colCount);
    }
    if (rowCount) {
      expect(result.rows!.length).toBe(rowCount);
    }

    expect(result.graph.vertices().filter((vertex) => !isDummy<VizVertexData, VizEdgeData>(vertex)).length).toBe(
      snapshot.visibleComponents.length,
    );
    expect(result.graph.vertices().filter((vertex) => isGroup(vertex)).length).toBe(snapshot.groups.length);

    expect(notDummiesFromLayout(result.graph, result.layoutData).length).toBeGreaterThanOrEqual(
      snapshot.visibleComponents.length,
    );
  }

  function isGroup(graphElement: Vertex<VizVertexData, VizEdgeData>): boolean {
    const data = graphElement.data();
    return data.domainObject && data.domainObject._type === Type.TypeGroup;
  }

  function notDummiesFromLayout(graph: VizGraph, layoutData: Array<VizHierarchicalLayout>): Array<VertexId> {
    return layoutData.flatMap((layout) =>
      layout.layers.layers.flatMap((layer) =>
        layer.vertexIds.filter((v) => !isDummy<VizVertexData, VizEdgeData>(graph.vertexById(v))),
      ),
    );
  }
});
