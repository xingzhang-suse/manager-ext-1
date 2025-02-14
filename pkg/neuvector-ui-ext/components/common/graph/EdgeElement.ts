import isUndefined from "lodash/isUndefined";

import { type EdgeDef, type GraphId, IllegalStateGraphError } from "./graphCommon";
import { GraphElementBase } from "./GraphElement";
import type { Vertex } from "./Vertex";
import type { VertexProvider } from "./VertexProvider";

export abstract class EdgeElement<V, E> extends GraphElementBase<E, EdgeDef<E>> {
  protected _aId: GraphId;

  protected _bId: GraphId;

  protected vertexProvider: VertexProvider<V, E>;

  constructor(_id: GraphId, _data: E, _aId: GraphId, _bId: GraphId, vertexProvider: VertexProvider<V, E>) {
    super(_id, _data);
    this.vertexProvider = vertexProvider;
    this._bId = _bId;
    this._aId = _aId;
  }

  get aId() {
    return this._aId;
  }

  get bId() {
    return this._bId;
  }

  a(): Vertex<V, E> {
    return this.vertexProvider.vertexById(this._aId);
  }

  b(): Vertex<V, E> {
    return this.vertexProvider.vertexById(this._bId);
  }

  otherIdOpt(aOrBId: GraphId): GraphId | undefined {
    if (this._aId === aOrBId) {
      return this.bId;
    } else if (this._bId === aOrBId) {
      return this.aId;
    }
  }

  otherOpt(one: Vertex<V, E>): Vertex<V, E> | undefined {
    const graphId = this.otherIdOpt(one.id);
    return isUndefined(graphId) ? undefined : this.vertexProvider.vertexByIdOpt(graphId);
  }

  other(one: Vertex<V, E>): Vertex<V, E> {
    const vertex = this.otherOpt(one);
    if (!vertex) {
      throw new IllegalStateGraphError(
        `Found edge (${this.toString()}) that does not connect this vertex (${one.toString()}) to anything.`,
      );
    }
    return vertex;
  }

  abstract isBiEdge(): boolean;

  abstract isDiEdge(): boolean;
}
