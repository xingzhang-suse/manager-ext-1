import { EdgeElement } from "./EdgeElement";
import type { EdgeDef, GraphId } from "./graphCommon";
import type { Vertex } from "./Vertex";
import type { VertexProvider } from "./VertexProvider";

/**
 * Connects two vertices, source and target, directionally: source->target.
 */
export class DiEdge<V, E> extends EdgeElement<V, E> {
  constructor(_id: GraphId, _data: E, _sourceId: GraphId, _targetId: GraphId, vertexProvider: VertexProvider<V, E>) {
    super(_id, _data, _sourceId, _targetId, vertexProvider);
  }

  get sourceId() {
    return this._aId;
  }

  get targetId() {
    return this._bId;
  }

  source(): Vertex<V, E> {
    return this.vertexProvider.vertexById(this._aId);
  }

  target(): Vertex<V, E> {
    return this.vertexProvider.vertexById(this._bId);
  }

  isBiEdge(): boolean {
    return false;
  }

  isDiEdge(): boolean {
    return true;
  }

  toString() {
    return `DiEdge { id: ${this._id}, source: ${this._aId}, target: ${this._bId} }`;
  }

  definition(): EdgeDef<E> {
    return {
      id: this._id,
      sourceId: this._aId,
      targetId: this._bId,
      isBiDirectional: false,
      data: this._data,
    };
  }
}
