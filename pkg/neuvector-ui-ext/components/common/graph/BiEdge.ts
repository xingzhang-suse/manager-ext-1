import { EdgeElement } from "./EdgeElement";
import type { EdgeDef } from "./graphCommon";
import type { VertexProvider } from "./VertexProvider";

/**
 * Connects two vertices, a and b, bidirectionally: a<->b.
 */
export class BiEdge<V, E> extends EdgeElement<V, E> {
  constructor(_id: number, _data: E, _aId: number, _bId: number, vertexProvider: VertexProvider<V, E>) {
    super(_id, _data, _aId, _bId, vertexProvider);
  }

  isBiEdge(): boolean {
    return true;
  }

  isDiEdge(): boolean {
    return false;
  }

  toString() {
    return `BiEdge { id: ${this._id}, a: ${this._aId}, b: ${this._bId} }`;
  }

  definition(): EdgeDef<E> {
    return {
      id: this._id,
      sourceId: this._aId,
      targetId: this._bId,
      isBiDirectional: true,
      data: this._data,
    };
  }
}
