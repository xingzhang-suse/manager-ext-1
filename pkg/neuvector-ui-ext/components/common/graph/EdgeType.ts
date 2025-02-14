import type { BiEdge } from "./BiEdge";
import type { DiEdge } from "./DiEdge";

export type EdgeType<V, E> = DiEdge<V, E> | BiEdge<V, E>;
