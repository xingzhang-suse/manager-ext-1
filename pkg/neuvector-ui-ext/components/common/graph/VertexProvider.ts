import type { Vertex } from "./Vertex";

export interface VertexProvider<V, E> {
  vertexById(id: number): Vertex<V, E>;
  vertexByIdOpt(id: number): Vertex<V, E> | undefined;
  vertexExists(id: number): boolean;
  vertices(): Vertex<V, E>[];
  sources(): Vertex<V, E>[];
  sinks(): Vertex<V, E>[];
  vertexCount(): number;
}
