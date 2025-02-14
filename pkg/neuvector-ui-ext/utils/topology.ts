
import { OrphanAlignment, collectOrphansForColumn, positionOrphans } from "../components/common/graph/algos/hierarchical/orphans"; 
import type { EdgeDef, EdgeId, GraphId, VertexDef, VertexId } from "../components/common/graph/graphCommon";
import { extend, Graph, createSequentialIdGenerator } from "../components/common/graph/Graph";
import { ColumnWeights, Groupings } from "../components/common/graph/algos/hierarchical/hierarchicalCommon";
import type { EdgeType } from "../components/common/graph/EdgeType";
import curry from "lodash/curry";
import {
  type GraphDependentHierarchicalLayoutOptions,
  type HierarchicalLayoutOptions,
  type InitialHierarchicalLayoutOptions,
  hierarchicalLayout,
} from "../components/common/graph/algos/hierarchical/hierarchicalLayout";
import {
    type AllRelationTypes,
    type CrossDomainRelations,
    DimensionType,
    type VizEdgeData,
    type VizGraph,
    type VizRenderInput,
    type VizVertexData,
    type VizVertexGroup,
  } from "./rendering/RenderInput";
import type { Object } from "ts-toolbelt";
import { ref, onMounted } from "vue";

export type Record<
  TKey extends PropertyKey = PropertyKey,
  TEntry = unknown,
  TAccess extends "=" | "+" = "=",
  TPresence extends "!" | "?" = "!",
> = Object.Record<TKey, TEntry, [TPresence, TAccess extends "+" ? "W" : "R"]>;
export const PREVIEW_MODE = "preview";
export const EXTENDED_PREVIEW_MODE = "extended-preview";
export const SPECTATOR_MODE = "spectator";
export const FULL_MODE = "full";
export type StackVizMode =
  | typeof PREVIEW_MODE
  | typeof EXTENDED_PREVIEW_MODE
  | typeof SPECTATOR_MODE
  | typeof FULL_MODE;


export function useStackVizRenderer(
    containerRef: any,
    stackViewSnapshot: any | undefined,
    // stackViewSnapshot: StackViewSnapshot | undefined,
    mode: StackVizMode,
    hovered: undefined | any,
    // hovered: Impulse<undefined | ContextMenuStackvizTarget>,
    loading?: boolean,
    selectedComponentId?: undefined | any,
    // selectedComponentId?: Impulse<undefined | NodeId>,
    spotlightedComponentIdentifier?: string,
    onDisabledZoom?: VoidFunction,
    zoomOnScrollDisabled?: boolean,
  ) {
    const layoutOptions = useSelector(selectHierarchicalLayoutOptions);
  
    const interactionsEnabled = isInteractionMode(mode);
    const isComponentSelectEnable = isComponentSelectMode(mode);
  
    const { context, createContext, updateContext } = useContext(containerRef);
    const { isCameraInDefaultPosition } = useEventSubscription(
      context,
      hovered,
      interactionsEnabled,
      isComponentSelectEnable,
      selectedComponentId,
    );
  
    const edition = useSelector(getConfig).edition;
  
    onMounted(() => {
      if (stackViewSnapshot) {
        // don't trigger to StackViz to re-render while app in the loading state
        if (loading) {
          return;
        }
        try {
          // if context is not initialized that means that scene is not initialized as well
          // in this way we are creating context, subscribing on event and load the scene
          if (!context) {
            createContext({
              mode,
              spotlightedComponentIdentifier,
              onDisabledZoom,
              zoomOnScrollDisabled,
              edition,
            });
            return;
          }
          updateContext({
            mode,
            spotlightedComponentIdentifier,
            onDisabledZoom,
            zoomOnScrollDisabled,
            edition,
          });
  
          const stackView = new StackView(stackViewSnapshot);
          const renderInput: VizRenderInput = toVizRenderInput(stackView, {
            ...layoutOptions,
            alignmentBias: layoutOptions.alignmentBias ?? defaultInitialHierarchicalLayoutOptions().alignmentBias,
          });
  
          const { graph, layoutData } = renderInput;
          const cols = renderInput.cols || [];
          const rows = renderInput.rows || [];
          logger.perf("Load StackViz", () => context.load(graph, rows, cols, layoutData, stackViewSnapshot));
        } catch (error) {
          // Just log the error and move on
          logger.error("Captured error:\n", error);
        }
      }
    }, [stackViewSnapshot, layoutOptions, context, mode]);
  
    return {
      context,
      isCameraInDefaultPosition,
      zoomIn: useEvent(() => context?.camera.zoomBy(0.5)),
      zoomOut: useEvent(() => context?.camera.zoomBy(-0.5)),
      zoomToFit: useEvent(() => context?.camera.reset()),
      findComponent: (component: ViewComponent) => context?.world.lightOn(component, true),
    };
  }


export function toVizRenderInput(
    stackView: StackView,
    initialLayoutOptions: InitialHierarchicalLayoutOptions,
) {
    const rows = axisSectionToVizVertexGroup(stackView.visibleLayers, DimensionType.LAYER);
    const cols = axisSectionToVizVertexGroup(stackView.visibleDomains, DimensionType.DOMAIN);
    const graph = toVizGraph(stackView, undefined);
    const { orphanGroups, orphanIds } = collectOrphansForColumn(
        graph,
        // new Map<VertexId, Array<ViewRelation>>(),
        new Map<VertexId, Array<any>>(),
        0,
        rows ? createGroupings(graph, rows) : undefined,
    );
    orphanIds.forEach((vertexId) => graph.removeVertexById(vertexId));

    const options = createLayoutOptions(initialLayoutOptions, graph, rows);
    const layoutData = hierarchicalLayout(graph, generateDummyVertex, generateDummyEdge, options)

    positionOrphans(graph, layoutData, orphanGroups, OrphanAlignment.LEFT, options);

    return {
        graph,
        rows,
        layoutData: [layoutData],
    };
}

export function toVizGraph(
    stackView: StackView,
    idGenerator: (idExists: (id: GraphId) => boolean) => GraphId = createSequentialIdGenerator(-1, -1),
): VizGraph {
    const snapshot = stackView.snapshot;
    const visibleComponentVertices = snapshot.visibleComponentsNotInGroups.map((component: any) => ({
        id: component.id,
        data: {
        domainObject: component,
        rowId: component.layer,
        colId: component.domain,
        },
    }));

    const groupVertices = snapshot.groups.map((group: any) => ({
        id: group.id,
        data: {
        domainObject: group,
        rowId: group.classifier.layer,
        colId: group.classifier.domain,
        },
    }));
    const directRelationEdges = snapshot.visibleRelationsNotInGroups.map(relationToEdgeDef);
    const indirectRelationEdges = snapshot.indirectRelationsNotInGroups.map(relationToEdgeDefWithoutId);
    const groupRelationEdges = snapshot.groupRelations.map(relationToEdgeDefWithoutId);
    const graphOptions = { idGenerator: idGenerator };

    return new Graph<VizVertexData, VizEdgeData>(
        {
        vertices: [...visibleComponentVertices, ...groupVertices],
        edges: [...directRelationEdges, ...indirectRelationEdges, ...groupRelationEdges],
        },
        graphOptions,
    );
}

export function createGroupings(graph: VizGraph, rows: Array<VizVertexGroup>): Groupings<VizVertexGroup> {
    const groupIdToVertexIds: Record<number, Array<VertexId>, "+", "?"> = {};

    graph.vertices().forEach((vertex: any) => {
        const vertexData = vertex.data();
        const arr = groupIdToVertexIds[vertexData.rowId];

        if (arr != null) {
        arr.push(vertex.id);
        } else {
        groupIdToVertexIds[vertexData.rowId] = [vertex.id];
        }
    });

    return new Groupings<VizVertexGroup>(rows.map((row) => [row, groupIdToVertexIds[row.id] || []]));
}

export function createLayoutOptions(
    initialLayoutOptions: InitialHierarchicalLayoutOptions,
    graph: VizGraph,
    rows?: Array<VizVertexGroup>,
  ): HierarchicalLayoutOptions<VizVertexGroup> {
    const graphDependentOptions: GraphDependentHierarchicalLayoutOptions<VizVertexGroup> = {
      groupings: rows ? createGroupings(graph, rows) : undefined,
    };
    return extend(initialLayoutOptions, graphDependentOptions);
}

  function generateDummyVertex(replaceEdge: EdgeType<VizVertexData, VizEdgeData>): VertexDef<VizVertexData> {
    const aData = replaceEdge.a().data();
    const bData = replaceEdge.b().data();
  
    return {
      data: {
        domainObject: replaceEdge.data().domainObject,
        colId: aData.colId === bData.colId ? aData.colId : undefined,
      },
    } as VertexDef<VizVertexData>;
  }
  

function generateDummyEdge(replaceEdge: EdgeType<VizVertexData, VizEdgeData>): { data: VizEdgeData } {
    return {
      data: {
        domainObject: replaceEdge.data().domainObject,
      },
    };
  }
  
  function axisSectionToVizVertexGroup<T extends Domain | Layer>(
    axis: Array<T>,
    type: DimensionType,
  ): Array<VizVertexGroup> {
    return axis.map((domainObject) => ({
      id: domainObject.id!,
      type: type,
      name: domainObject.name,
    }));
  }

  function relationToEdgeDef(relation: AllRelationTypes): EdgeDef<VizEdgeData> {
    switch (relation._type) {
      case Type.ViewRelation:
        return extend(relationToEdgeDefWithoutId(relation), {
          id: relation.id!,
        });
      case Type.IndirectRelation:
      case Type.GroupRelation:
        return relationToEdgeDefWithoutId(relation);
      default:
        throw new IllegalStateError(`Cannot convert relation of unknown type '${relation["_type"]}' to edge definition.`);
    }
  }

  function relationToEdgeDefWithoutId<T extends ViewRelation | IndirectRelation | GroupRelation>(
    relation: T,
  ): EdgeDef<VizEdgeData> {
    return {
      sourceId: relation.source,
      targetId: relation.target,
      // bi-directional relations are treated by the hierarchical layout algorithms as a cycle. We make a none relation a bi-edge, because undirected edges
      // are not supported by the graph.
      isBiDirectional:
        relation.dependencyDirection === DependencyDirection.Both ||
        relation.dependencyDirection === DependencyDirection.None,
      data: {
        domainObject: relation,
      },
    };
  }

  function toAxisSection<DomainObject extends Domain | Layer>(
    allSections: ReadonlyArray<DomainObject>,
    isSelected: (node: NodeId) => boolean,
    orderAscending: boolean,
  ): DomainObject[] {
    return allSections
      .filter((domainObject) => isSelected(domainObject.id!))
      .sort(orderAscending ? ascendingSortByOrderAndName : descendingSortByOrderAndName);
  }

  export function naturalStringOrderBy(left: string, right: string): number {
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: "base",
    });
    return collator.compare(left, right);
  }
  

export type NodeWithOrder<TNode extends Node = Node> = Extract<TNode, { order: number }>;
  const sortByOrderAndName = (ascending: boolean, a: NodeWithOrder, b: NodeWithOrder) => {
    if (a.order < b.order && ascending) return -1;
    if (a.order < b.order && !ascending) return 1;
    if (a.order > b.order && ascending) return 1;
    if (a.order > b.order && !ascending) return -1;
    if (ascending) return naturalStringOrderBy(a.name!, b.name!);
    return naturalStringOrderBy(a.name!, b.name!) * -1;
  };
  
export const ascendingSortByOrderAndName = curry(sortByOrderAndName)(true);
export const descendingSortByOrderAndName = curry(sortByOrderAndName)(false);
  

export class StackView {
    readonly visibleLayers: Layer[];
    readonly visibleDomains: Domain[];
  
    readonly snapshot: StackViewSnapshot;
  
    constructor(snapshot: StackViewSnapshot) {
      this.snapshot = snapshot;
  
      const isDomainSelected = (domain: NodeId) => {
        return snapshot.visibleComponents.some((c) => c.domain === domain);
      };
  
      const isLayerSelected = (layer: NodeId) => {
        return snapshot.visibleComponents.some((c) => c.layer === layer);
      };
  
      this.visibleLayers = toAxisSection(snapshot.layers, isLayerSelected, false);
      this.visibleDomains = toAxisSection(snapshot.domains, isDomainSelected, true);
    }
  }


  export abstract class StackStateError implements Error {
    stack: string;
  
    public name: string;
  
    public message: string;
  
    constructor(name: string, message: string) {
      this.message = message;
      this.name = name;
      this.stack = new Error()["stack"] ?? "";
    }
  }
  
  /**
   * An error that should not occur. It is a programmer mistake.
   */
  export class IllegalStateError extends StackStateError {
    public static NAME = "IllegalStateError";
  
    constructor(message: string) {
      super(IllegalStateError.NAME, message);
    }
  }
  