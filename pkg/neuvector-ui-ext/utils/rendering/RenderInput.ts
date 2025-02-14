import type {
  Dto,
  GroupRelation,
  IndirectRelation,
  TypeGroup,
  ViewComponent,
  ViewRelation,
} from "../../common/CoreApi";
import type {
  HierarchicalEdgeData,
  HierarchicalVertexData,
} from "../../generic/graph/algos/hierarchical/hierarchicalCommon";
import type { HierarchicalLayout } from "../../generic/graph/algos/hierarchical/hierarchicalLayout";
import type { Graph } from "../../generic/graph/Graph";
import type { VertexId } from "../../generic/graph/graphCommon";
import type { Vertex } from "../../generic/graph/Vertex";

export interface VizRenderInput {
  /**
   * The graph that will be visualized by the renderer.
   */
  graph: VizGraph;

  /**
   * Rows, if any, that contain a number of vertices to be visualized. The order of the rows in this array
   * determines the order of the rendering. The first row is rendered at the bottom of the screen.
   */
  rows?: Array<VizVertexGroup>;

  /**
   * Columns, if any, that contain a number of vertices to be visualized. The order of the columns in this array
   * determines the order of the rendering. The first column is rendered at the left of the screen.
   */
  cols?: Array<VizVertexGroup>;

  /**
   * One hierarchical layout for each column or when no columns are present, one for the entire graph.
   */
  layoutData: Array<VizHierarchicalLayout>;
}

export enum DimensionType {
  LAYER,
  DOMAIN,
}

export interface VizVertexGroup {
  id: number;
  type: DimensionType; // Later on this can just become a string. The visualizer should be agnostic to the type.
  name: string;
}

export type VizHierarchicalLayout = HierarchicalLayout<VizVertexData, VizEdgeData>;
export type VizGraph = Graph<VizVertexData, VizEdgeData>;
export type VizVertex = Vertex<VizVertexData, VizEdgeData>;
/**
 * The map of cross domain relations.
 * The key is the vertex in the current column.
 */
export type CrossDomainRelations = Map<VertexId, Array<AllRelationTypes>>;

interface VizElementData<T extends Dto> {
  domainObject: T;
}

type NodeCanBeDummy = ViewRelation | IndirectRelation;

export interface VizVertexData
  extends VizElementData<ViewComponent | NodeCanBeDummy | TypeGroup>,
    HierarchicalVertexData {
  rowId: number;
  colId: number;
}
export type NonGroupRelationTypes = ViewRelation | IndirectRelation;
export type AllRelationTypes = NonGroupRelationTypes | GroupRelation;

export type VizEdgeData = VizElementData<AllRelationTypes> & HierarchicalEdgeData;
