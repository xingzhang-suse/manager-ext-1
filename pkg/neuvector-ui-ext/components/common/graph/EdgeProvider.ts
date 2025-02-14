import type { BiEdge } from "./BiEdge";
import type { DiEdge } from "./DiEdge";
import type { EdgeType } from "./EdgeType";
import type { GraphId } from "./graphCommon";

export interface EdgeProvider<V, E> {
  diEdges(): DiEdge<V, E>[];
  biEdges(): BiEdge<V, E>[];
  edges(): EdgeType<V, E>[];

  diEdgeCount(): number;
  biEdgeCount(): number;
  edgeCount(): number;

  diEdgeById(id: GraphId): DiEdge<V, E>;
  biEdgeById(id: GraphId): BiEdge<V, E>;
  edgeById(id: GraphId): EdgeType<V, E>;
  diEdgeByIdOpt(id: GraphId): DiEdge<V, E> | undefined;
  biEdgeByIdOpt(id: GraphId): BiEdge<V, E> | undefined;
  edgeByIdOpt(id: GraphId): EdgeType<V, E> | undefined;

  findBiEdge(f: (e: BiEdge<V, E>) => boolean): BiEdge<V, E> | undefined;
  findDiEdge(f: (e: DiEdge<V, E>) => boolean): DiEdge<V, E> | undefined;
  findEdge(f: (e: EdgeType<V, E>) => boolean): EdgeType<V, E> | undefined;
}
