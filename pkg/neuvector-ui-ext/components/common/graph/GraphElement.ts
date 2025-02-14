import type { GraphId } from "./graphCommon";

/**
 * T = Data
 * D = Definition
 */
export abstract class GraphElementBase<T, D> {
  protected _id: GraphId;

  protected _data: T;

  constructor(_id: GraphId, _data: T) {
    this._data = _data;
    this._id = _id;
  }

  get id() {
    return this._id;
  }

  data(): T {
    return this._data;
  }

  abstract toString(): string;

  abstract definition(): D;
}

export function graphId<T, D>(graphElement: GraphElementBase<T, D>): GraphId {
  return graphElement.id;
}
