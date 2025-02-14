import first from "lodash/first";
import isUndefined from "lodash/isUndefined";
import last from "lodash/last";

import type { EdgeProvider } from "./EdgeProvider";
import type { EdgeType } from "./EdgeType";
import type { GraphElementSequence } from "./Graph";
import { type GraphId, PathElementNotFoundError } from "./graphCommon";
import type { Vertex } from "./Vertex";
import type { VertexProvider } from "./VertexProvider";

/**
 * A path:
 *  - describes a single traversable connected path of vertices and edges in the order of its traversal.
 *  - can start with a vertex or an edge
 *  - is saved as meta-information in the Graph and vertices and edges that are part of it.
 *  - is immutable although the elements in the Graph itself are mutable.
 *  - does not share the same id space as vertices and edges
 *  - is automatically deleted when any of the vertices or edges in the sequence are deleted
 *
 * Note: Currently it is not possible to describe a path that splits and comes back together.
 */
export class Path<V, E> {
  private _firstElementIsVertex: boolean;

  private _sequenceIds: GraphId[];

  private graphElementProvider: VertexProvider<V, E> & EdgeProvider<V, E>;

  constructor(
    _firstElementIsVertex: boolean,
    _sequenceIds: GraphId[],
    graphElementProvider: VertexProvider<V, E> & EdgeProvider<V, E>,
  ) {
    this.graphElementProvider = graphElementProvider;
    this._sequenceIds = _sequenceIds;
    this._firstElementIsVertex = _firstElementIsVertex;
  }

  get firstId() {
    return first(this._sequenceIds);
  }

  get lastId() {
    return last(this._sequenceIds);
  }

  first() {
    return this.elementByIndex(0);
  }

  last() {
    return this.elementByIndex(this._sequenceIds.length - 1);
  }

  sequence(): GraphElementSequence<V, E> {
    return this._sequenceIds.map((elementId, idx) =>
      (idx % 2 === 0) === this._firstElementIsVertex
        ? this.graphElementProvider.vertexById(elementId)
        : this.graphElementProvider.edgeById(elementId),
    );
  }

  get sequenceLength() {
    return this._sequenceIds.length;
  }

  vertices(): Vertex<V, E>[] {
    return this._sequenceIds
      .filter((elementId, idx) => this.isVertex(idx))
      .map((vertexId) => this.graphElementProvider.vertexById(vertexId));
  }

  edges(): EdgeType<V, E>[] {
    return this._sequenceIds
      .filter((elementId, idx) => !this.isVertex(idx))
      .map((edgeId) => this.graphElementProvider.edgeById(edgeId));
  }

  elementByIndex(idx: number): Vertex<V, E> | EdgeType<V, E> {
    const elementId = this._sequenceIds[idx];
    if (!isUndefined(elementId)) {
      return this.isVertex(idx)
        ? this.graphElementProvider.vertexById(elementId)
        : this.graphElementProvider.edgeById(elementId);
    } else {
      throw new PathElementNotFoundError(idx);
    }
  }

  isVertex(idx: number): boolean {
    return (idx % 2 === 0) === this._firstElementIsVertex;
  }

  reverse(): Path<V, E> {
    return new Path<V, E>(this._firstElementIsVertex, [...this._sequenceIds].reverse(), this.graphElementProvider);
  }
}
