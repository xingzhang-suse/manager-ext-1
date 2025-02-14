import uniq from "lodash/uniq";

import type { BiEdge } from "./BiEdge";
import type { DiEdge } from "./DiEdge";
import type { EdgeProvider } from "./EdgeProvider";
import type { EdgeType } from "./EdgeType";
import { type GraphId, type GraphIds, IllegalStateGraphError, type VertexDef } from "./graphCommon";
import { GraphElementBase } from "./GraphElement";
import type { VertexProvider } from "./VertexProvider";

export interface NeighborReference {
  edgeId: GraphId;
  otherVertexId: GraphId;
}

export interface DegreeOpts {
  unique?: boolean;
  excludeVertices?: GraphIds;
  includeBiEdges?: boolean;
}

export class Vertex<V, E> extends GraphElementBase<V, VertexDef<V>> {
  private _diInRefs: NeighborReference[] = [];
  private _diOutRefs: NeighborReference[] = [];
  private _biRefs: NeighborReference[] = [];

  private edgeProvider: EdgeProvider<V, E>;

  private vertexProvider: VertexProvider<V, E>;

  constructor(_id: GraphId, _data: V, edgeProvider: EdgeProvider<V, E>, vertexProvider: VertexProvider<V, E>) {
    super(_id, _data);
    this.vertexProvider = vertexProvider;
    this.edgeProvider = edgeProvider;
  }

  private inRefs(): NeighborReference[] {
    return [...this._diInRefs, ...this._biRefs];
  }

  private outRefs(): NeighborReference[] {
    return [...this._diOutRefs, ...this._biRefs];
  }

  private allRefs(): NeighborReference[] {
    return [...this._diInRefs, ...this._diOutRefs, ...this._biRefs];
  }

  biEdges(): BiEdge<V, E>[] {
    return this._biRefs.map((ref) => this.edgeProvider.biEdgeById(ref.edgeId));
  }

  inDiEdges(): DiEdge<V, E>[] {
    return this._diInRefs.map((ref) => this.edgeProvider.diEdgeById(ref.edgeId));
  }

  inEdges(): EdgeType<V, E>[] {
    return [...(<EdgeType<V, E>[]>this.inDiEdges()), ...this.biEdges()];
  }

  outDiEdges(): DiEdge<V, E>[] {
    return this._diOutRefs.map((ref) => this.edgeProvider.diEdgeById(ref.edgeId));
  }

  outEdges(): EdgeType<V, E>[] {
    return [...(<EdgeType<V, E>[]>this.outDiEdges()), ...this.biEdges()];
  }

  edges(): EdgeType<V, E>[] {
    return [...this.inDiEdges(), ...this.outDiEdges(), ...this.biEdges()];
  }

  inDiEdgeIds(): GraphId[] {
    return this._diInRefs.map((ref) => ref.edgeId);
  }

  outDiEdgeIds(): GraphId[] {
    return this._diOutRefs.map((ref) => ref.edgeId);
  }

  diEdgeIds(): GraphId[] {
    return [...this.inDiEdgeIds(), ...this.outDiEdgeIds()];
  }

  biEdgeIds(): GraphId[] {
    return this._biRefs.map((ref) => ref.edgeId);
  }

  inDegree(opts?: DegreeOpts): number {
    return this.getDegree(this.inRefs(), opts);
  }

  inDiDegree(opts?: DegreeOpts): number {
    return this.getDegree(this._diInRefs, opts);
  }

  outDegree(opts?: DegreeOpts): number {
    return this.getDegree(this.outRefs(), opts);
  }

  outDiDegree(opts?: DegreeOpts): number {
    return this.getDegree(this._diOutRefs, opts);
  }

  private getDegree(refs: NeighborReference[], opts?: DegreeOpts): number {
    let neighbors = refs.map((ref) => ref.otherVertexId);

    if (opts && opts.unique) {
      neighbors = uniq(neighbors);
    }

    if (opts && opts.excludeVertices) {
      neighbors = neighbors.filter((neighbor) => !opts.excludeVertices?.has(neighbor));
    }

    const biEdgeDegree = opts && opts.includeBiEdges && refs !== this._biRefs ? this.getDegree(this._biRefs, opts) : 0;

    return neighbors.length + biEdgeDegree;
  }

  inDiVertexIds(): GraphId[] {
    return uniq(this._diInRefs.map((ref) => ref.otherVertexId));
  }

  inVertexIds(): GraphId[] {
    return uniq(this.inRefs().map((ref) => ref.otherVertexId));
  }

  inVertices(): Vertex<V, E>[] {
    return this.inVertexIds().map((vertexId) => this.vertexProvider.vertexById(vertexId));
  }

  outDiVertexIds(): GraphId[] {
    return uniq(this._diOutRefs.map((ref) => ref.otherVertexId));
  }

  outVertexIds(): GraphId[] {
    return uniq(this.outRefs().map((ref) => ref.otherVertexId));
  }

  outVertices(): Vertex<V, E>[] {
    return this.outVertexIds().map((vertexId) => this.vertexProvider.vertexById(vertexId));
  }

  neighborIds(): GraphId[] {
    return uniq(this.allRefs().map((ref) => ref.otherVertexId));
  }

  neighbors(): Vertex<V, E>[] {
    return this.neighborIds().map((vertexId) => this.vertexProvider.vertexById(vertexId));
  }

  toString(): string {
    return `Vertex { id: ${this._id} }`;
  }

  definition(): VertexDef<V> {
    return {
      id: this._id,
      data: this._data,
    };
  }

  // --------------------------------------------------------------------------
  // These methods are for internal use only and are used to speed up traversals
  // --------------------------------------------------------------------------

  __registerInDiReference(ref: NeighborReference): void {
    this._diInRefs.push(ref);
  }

  __registerOutDiReference(ref: NeighborReference): void {
    this._diOutRefs.push(ref);
  }

  __registerBiReference(ref: NeighborReference): void {
    this._biRefs.push(ref);
  }

  private deleteReference(refs: NeighborReference[], edgeId: GraphId): void {
    const refIdx = refs.findIndex((ref) => ref.edgeId === edgeId);
    if (refIdx < 0)
      throw new IllegalStateGraphError(`Could not find reference for edge ${edgeId} in vertex: ${this.toString()}.`);
    refs.splice(refIdx, 1);
  }

  __unregisterInDiReference(edgeId: GraphId): void {
    this.deleteReference(this._diInRefs, edgeId);
  }

  __unregisterOutDiReference(edgeId: GraphId): void {
    this.deleteReference(this._diOutRefs, edgeId);
  }

  __unregisterBiReference(edgeId: GraphId): void {
    this.deleteReference(this._biRefs, edgeId);
  }
}
