import type { ViewRelation } from "../../../common/CoreApi";
import type { CrossDomainRelations, VizEdgeData, VizVertexData } from "../../../stackviz/rendering/RenderInput";
import { T2 } from "../../Util";
import { Groupings, type OrderedLayers } from "../algos/hierarchical/hierarchicalCommon";
import type { HierarchicalLayout } from "../algos/hierarchical/hierarchicalLayout";
import { type ColumnId, type ColumnOrphans, collectOrphansForColumn } from "../algos/hierarchical/orphans";
import type { VertexXCoords } from "../algos/hierarchical/positionX";
import type { Graph } from "../Graph";
import type { VertexId } from "../graphCommon";
import type { Vertex } from "../Vertex";

import { type TextGraph, extractTextGraphTriples, vertexByName, vertexName } from "./graphTestUtil";
import {
  type GroupedLayeredTextGraph,
  type GroupedLayeredTextGraphs,
  type LayerGroups,
  type NamedLayers,
  type NamedVizGraph,
  groupedToOrderedLayers,
  toVizGraph,
} from "./hierarchicalTestUtil";

export type CrossDomainRelationStrings = Array<string>;
export type MultiColumnLayeredTextGraph = [GroupedLayeredTextGraphs, CrossDomainRelationStrings];

export interface NamedVizGraphLayout {
  layout: HierarchicalLayout<any, any>;
  orphanGroups: ColumnOrphans<VizVertexData, VizEdgeData>;
  graph: NamedVizGraph;
}

export function toMultiColumnLayeredTextGraph(textGraph: MultiColumnLayeredTextGraph): Array<NamedVizGraphLayout> {
  const [columnTextGraphs, crossDomainRelationsStrings] = textGraph;
  return columnTextGraphs.map((columnTextGraph, colId) => {
    return createColumnGraph(columnTextGraph, colId, crossDomainRelationsStrings);
  });
}

function toMockedCrossDomainRelations(
  graph: Graph<any, any>,
  crossDomainRelationsStrings: TextGraph,
): CrossDomainRelations {
  const crossDomainRelations: CrossDomainRelations = new Map<VertexId, Array<ViewRelation>>();
  extractTextGraphTriples(crossDomainRelationsStrings).forEach((triple) => {
    function findOneVertex(name: string): Vertex<any, any> | undefined {
      return graph.findVertex((v) => v.data().name === name);
    }

    const vertex = findOneVertex(triple[0]) ?? findOneVertex(triple[2]);

    if (vertex) {
      crossDomainRelations.set(vertex.id, []);
    }
  });
  return crossDomainRelations;
}

export function createColumnGraph(
  columnGraph: GroupedLayeredTextGraph,
  colId: ColumnId,
  crossDomainRelationsStrings: TextGraph,
): NamedVizGraphLayout {
  const [, layerGroups] = columnGraph;
  const graph = toVizGraph(columnGraph, colId);
  const groupings = toTextGroupings(graph, layerGroups);
  const crossDomainRelations = toMockedCrossDomainRelations(graph, crossDomainRelationsStrings);
  const { orphanGroups, orphanIds } = collectOrphansForColumn(graph, crossDomainRelations, colId, groupings);
  const orphanNames = new Set<string>(orphanIds.map((vertexId) => vertexName(graph.vertexById(vertexId))));

  orphanIds.forEach((vertexId: VertexId) => graph.removeVertexById(vertexId));

  graph.vertices().forEach((vertex) => (vertex.data().hierarchical = {}));

  const layers = groupedToOrderedLayers(graph, layerGroups, orphanNames);
  layers.forEach((layer, layerIdx) => {
    layer.vertexIds.forEach((vertexId, position) => {
      graph.vertexById(vertexId).data().hierarchical!.order = position;
      graph.vertexById(vertexId).data().hierarchical!.layer = layerIdx;
    });
  });

  const coords = coordsAsPositionsInLayer(layers, orphanIds);

  return { layout: { layers, dummyPaths: new Map(), coords }, orphanGroups, graph };
}

export function coordsAsPositionsInLayer(layers: OrderedLayers, excludes: Array<VertexId>): VertexXCoords {
  const coords = new Map<VertexId, number>();
  layers.forEach((layer) => {
    layer.vertexIds.filter((v) => !excludes.includes(v)).forEach((vertexId, idx) => coords.set(vertexId, idx));
  });
  return coords;
}

export function toTextGroupings(graph: NamedVizGraph, rows: LayerGroups) {
  const groupingInput = rows.map((row: NamedLayers, idx) => {
    const vertexFromGroup = row.flatMap((layer) => {
      return layer.map((vertexName) => vertexByName(graph, vertexName)[0].id);
    });
    return T2([idx, vertexFromGroup]);
  });
  return new Groupings<VertexId>(groupingInput);
}
