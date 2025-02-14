import range from "lodash/range";

import { ceil } from "~/tools/ceil";
import { floor } from "~/tools/floor";
import { max } from "~/tools/max";
import { mergeAll } from "~/tools/merge-all";
import { sqrt } from "~/tools/sqrt";
import { toArray } from "~/tools/to-array";

import { IllegalArgumentError } from "../../../../common/errors";
import type { CrossDomainRelations, VizEdgeData, VizVertexData } from "../../../../stackviz/rendering/RenderInput";
import type { Graph } from "../../Graph";
import type { VertexId } from "../../graphCommon";
import type { DegreeOpts, Vertex } from "../../Vertex";

import { type GroupIdx, GroupedLayers, type Groupings, OrderedLayer, OrderedLayers } from "./hierarchicalCommon";
import type { HierarchicalLayout, InitialHierarchicalLayoutOptions } from "./hierarchicalLayout";
import type { VertexXCoords, XCoord } from "./positionX";

export type GroupId = number;
export type ColumnId = number;
export type ColumnOrphans<V, E> = Map<GroupId, Array<Vertex<V, E>>>;

export enum OrphanAlignment {
  LEFT,
  RIGHT,
}

/**
 * Default group id if no grouping by layers is turned on
 */
export const DEFAULT_GROUP_ID = -1;

export function collectOrphansForColumn<V extends VizVertexData, E extends VizEdgeData>(
  inGraph: Graph<V, E>,
  columnVertexToRelations: CrossDomainRelations,
  colId: ColumnId,
  groupings?: Groupings<any>,
): { orphanGroups: ColumnOrphans<V, E>; orphanIds: Array<VertexId> } {
  const degreeOpts: DegreeOpts = { includeBiEdges: true };

  const orphanVertices = inGraph.vertices().filter((vertex) => {
    const isOrphan =
      vertex.outDegree(degreeOpts) === 0 &&
      vertex.inDegree(degreeOpts) === 0 &&
      !columnVertexToRelations.has(vertex.id);

    const vertexColumn = vertex.data().colId || 0;
    const inColumn = vertexColumn === colId;

    return isOrphan && inColumn;
  });

  const orphanIds = orphanVertices.map((vertex) => vertex.id);

  const orphanGroups: ColumnOrphans<V, E> = new Map<GroupId, Array<Vertex<V, E>>>();
  orphanVertices.forEach((vertex) => {
    const groupIdx = !!groupings ? groupings.groupIdxByVertexId(vertex.id) : DEFAULT_GROUP_ID;
    const groups = orphanGroups.get(groupIdx) || [];
    orphanGroups.set(groupIdx, groups);
    groups.push(vertex);
  });
  return { orphanGroups, orphanIds };
}

/**
 * Solves the system of equations:
 *
 * xRatio/yRatio = orphanWidth / orphanHeight
 * orphanWidth * orphanHeight = orphans_count
 *
 * to find orphanWidth and orphanHeight that is the orphan block on either the left or the right part
 */
export function getOrphansDimensionBlock(
  xRatio: number,
  yRatio: number,
  orphansInGroup: number,
  layersInGroup: number,
): { orphanWidth: number; orphanHeight: number } {
  if (orphansInGroup < layersInGroup) {
    return { orphanWidth: 1, orphanHeight: orphansInGroup };
  }

  const solution = ceil(sqrt((xRatio * orphansInGroup) / yRatio), 0);
  const orphanWidth = max(1, solution);
  const orphanHeight = max(1, ceil(orphansInGroup / orphanWidth, 0));

  return { orphanWidth, orphanHeight };
}

/**
 * Position Orphans in a separate block next to the connected graphs.
 * The function modifies the inOutGraph by adding inserting orphans.
 * The inOutLayoutData:
 * - "layers" are updated with orphans, in some cases even additional layers added to place orphans in order to comply with aspect ratio
 * - "coords" get the orphans coordinates
 * - for each vertex in hierarchical data "order" and "layer" fields are updated to accomodate new layers
 *   and existing layers for the cases when orphans are added the the left from graph
 *
 */
export function positionOrphans(
  inOutGraph: Graph<VizVertexData, VizEdgeData>,
  inOutLayoutData: HierarchicalLayout<any, any>,
  orphans: ColumnOrphans<VizVertexData, VizEdgeData>,
  alignment: OrphanAlignment,
  options: InitialHierarchicalLayoutOptions,
) {
  const inLayers: OrderedLayers = inOutLayoutData.layers;
  const inCoords: VertexXCoords = inOutLayoutData.coords;

  const ratioX = options.groupRatioX;
  const ratioY = options.groupRatioY;
  const coordsOrphans = new Map<VertexId, XCoord>();
  const allOrphans = new Set<VertexId>();

  const groupedLayers = inLayers.getGroupedLayers(DEFAULT_GROUP_ID);

  // Min/Max below does not take into account orphans because they were removed previously
  const { minXGroups, maxXGroups } = inLayers.getMinMaxForAllGroups(inCoords);
  const vertexCount = inOutGraph.vertexCount();

  function insertOrphans(
    groupIdx: GroupIdx,
    group: GroupedLayers,
    layerCount: number,
    orphansForGroup: Array<Vertex<VizVertexData, VizEdgeData>>,
  ) {
    const { orphanHeight } = getOrphansDimensionBlock(ratioX, ratioY, orphansForGroup.length, layerCount);

    const extraLayerCount = max(0, orphanHeight - layerCount);

    const extraLayers = range(extraLayerCount).map(
      () => new OrderedLayer([], groupIdx === DEFAULT_GROUP_ID ? undefined : groupIdx),
    );

    extraLayers.forEach((layer) => group.addLayer(layer));

    const separation = vertexCount > 0 ? 1 : 0;
    const startX =
      group.vertexCount() > 0
        ? alignment === OrphanAlignment.RIGHT
          ? maxXGroups + separation
          : minXGroups - separation
        : alignment === OrphanAlignment.RIGHT
          ? minXGroups
          : maxXGroups;

    orphansForGroup.forEach((vertex, idx) => {
      const x = startX + (alignment === OrphanAlignment.RIGHT ? 1 : -1) * floor(idx / orphanHeight, 0);
      const y = idx % orphanHeight;

      throwIfNaN(x, "X coordinate is NaN");
      throwIfNaN(y, "Y coordinate is NaN");

      if (alignment === OrphanAlignment.LEFT) {
        group.addFirstVertexToLayer(y, vertex.id);
      } else {
        group.addLastVertexToLayer(y, vertex.id);
      }

      inOutGraph.addVertex(vertex.definition());
      coordsOrphans.set(vertex.id, x);
      allOrphans.add(vertex.id);
    });
  }

  if (orphans.size > 0) {
    // Since layers are created after orphans are removed
    // it can happen that orphans can occupy entire layers or groups and therefore because orphans are removed
    // layers will not be created, to tackle this issue below missing empty groups are created
    toArray(orphans.keys()).forEach((groupIdx) => {
      if (!groupedLayers.has(groupIdx)) {
        groupedLayers.set(groupIdx, new GroupedLayers(groupIdx));
      }
    });

    const groupIds = toArray(groupedLayers.keys()).sort((x, y) => x - y);
    const outLayers = groupIds.flatMap((groupIdx) => {
      const group = groupedLayers.get(groupIdx)!;
      const layerCount = group.layerCount();

      const orphansForGroup = orphans.get(groupIdx) || [];

      if (orphansForGroup.length > 0) {
        insertOrphans(groupIdx, group, layerCount, orphansForGroup);
      }
      return group.getLayers();
    });

    outLayers.forEach((layer, layerIdx) => {
      layer.vertexIds.forEach((vertexId, orderIdx) => {
        const vertex = inOutGraph.vertexById(vertexId);
        const vertexData = vertex.data();

        vertexData.hierarchical = mergeAll([
          vertexData.hierarchical,
          {
            layer: layerIdx,
            order: orderIdx,
          },
          allOrphans.has(vertexId)
            ? {
                groupIdx: layer.groupIdx,
                xCoord: coordsOrphans.get(vertexId),
              }
            : {},
        ]);
      });
    });

    coordsOrphans.forEach((coordX, vertexId) => inOutLayoutData.coords.set(vertexId, coordX));
    inOutLayoutData.layers = new OrderedLayers(outLayers);
  }
}

function throwIfNaN(coord: number, message: string) {
  if (Number.isNaN(coord)) {
    throw new IllegalArgumentError(message);
  }
}
