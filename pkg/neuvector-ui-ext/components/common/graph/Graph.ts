// import { extend } from "../../common/functions";
import lodashExtend from "lodash/extend";

import { BiEdge } from "./BiEdge";
import { DiEdge } from "./DiEdge";
import type { EdgeProvider } from "./EdgeProvider";
import type { EdgeType } from "./EdgeType";
import {
  EdgeCannotBeRecursiveError,
  type EdgeDef,
  EdgeNotFoundError,
  ElementIdAlreadyExistsError,
  type GraphId,
  IllegalStateGraphError,
  type VertexDef,
  VertexNotFoundError,
} from "./graphCommon";
import { Vertex } from "./Vertex";
import type { VertexProvider } from "./VertexProvider";

type IdGenerator = (idExists?: (id: GraphId) => boolean) => GraphId;

export type GraphElement<V, E> = Vertex<V, E> | EdgeType<V, E>;

export type GraphElementSequence<V, E> = GraphElement<V, E>[];

export interface GraphOptions {
  idGenerator?: IdGenerator;
}

export interface GraphDefinition<V, E> {
  vertices: VertexDef<V>[];
  edges?: EdgeDef<E>[];
}

// merge via intersection types
export function extend<T, U>(first: T, second: U): T & U {
  return lodashExtend({}, second, first); // definitions in first object must override the same keys in second
}

export function createSequentialIdGenerator(startId: GraphId, stepSize: number): IdGenerator {
  let lastGeneratedId = startId;
  return (idExists: (id: number) => boolean) => {
    let generatedId = lastGeneratedId;

    let i = 0;
    do {
      generatedId += stepSize;
      i++;
      if (i > 100000) {
        throw new IllegalStateGraphError(
          `Infinite loop (${i} cycles) while generating id? startId: ${startId}, stepSize: ${stepSize}.`,
        );
      }
    } while (idExists(generatedId));

    lastGeneratedId = generatedId;

    return generatedId;
  };
}

/**
 * Mutable Directed Multi-Graph that supports biEdges.
 */
export class Graph<V, E> implements VertexProvider<V, E>, EdgeProvider<V, E> {
  private _vertices = new Map<GraphId, Vertex<V, E>>();

  private _diEdges = new Map<GraphId, DiEdge<V, E>>();
  private _biEdges = new Map<GraphId, BiEdge<V, E>>();

  private idGenerator: IdGenerator;

  constructor(graphDefinition?: GraphDefinition<V, E>, options?: GraphOptions) {
    const defaultOptions = {
      idGenerator: createSequentialIdGenerator(1, 1),
    };

    const mergedOptions = extend(options || {}, defaultOptions);
    this.idGenerator = mergedOptions.idGenerator;

    if (graphDefinition) {
      this.addGraphDefinition(graphDefinition);
    }
  }

  generateId(): GraphId {
    return this.idGenerator((id: GraphId) => this.idExists(id));
  }

  idExists(id: GraphId): boolean {
    return this._vertices.has(id) || !!this.edgeByIdOpt(id);
  }

  addVertex({ id, data }: VertexDef<V>): Vertex<V, E> {
    if (id !== undefined && this.idExists(id)) {
      throw new ElementIdAlreadyExistsError(
        `Vertex with id: ${id} cannot be created. An element with that id already exists.`,
      );
    }

    const vertexId = id === undefined ? this.generateId() : id;
    const vertex = new Vertex<V, E>(vertexId, data!, this, this);
    this._vertices.set(vertexId, vertex);
    return vertex;
  }

  addEdge({ id, sourceId, targetId, isBiDirectional, data }: EdgeDef<E>): EdgeType<V, E> {
    if (id !== undefined && this.idExists(id)) {
      throw new ElementIdAlreadyExistsError(
        `Edge with id: ${id} cannot be created. An element with that id already exists.`,
      );
    }

    const edgeId = id === undefined ? this.generateId() : id;
    const sourceVertex = this.vertexById(sourceId); // Throws error when vertex does not exist.
    const targetVertex = this.vertexById(targetId);

    if (sourceId === targetId) {
      throw new EdgeCannotBeRecursiveError(`Cannot create recursive edge to vertex with id: ${sourceId}.`);
    }

    let addedEdge: EdgeType<V, E>;
    if (isBiDirectional) {
      addedEdge = new BiEdge<V, E>(edgeId, data!, sourceId, targetId, this);
      this._biEdges.set(edgeId, addedEdge);

      sourceVertex.__registerBiReference({
        edgeId: edgeId,
        otherVertexId: targetId,
      });
      targetVertex.__registerBiReference({
        edgeId: edgeId,
        otherVertexId: sourceId,
      });
    } else {
      addedEdge = new DiEdge<V, E>(edgeId, data!, sourceId, targetId, this);
      this._diEdges.set(edgeId, addedEdge as DiEdge<V, E>);

      sourceVertex.__registerOutDiReference({
        edgeId: edgeId,
        otherVertexId: targetId,
      });
      targetVertex.__registerInDiReference({
        edgeId: edgeId,
        otherVertexId: sourceId,
      });
    }

    return addedEdge;
  }

  removeDiEdgeById(id: GraphId): boolean {
    const diEdge = this._diEdges.get(id);
    if (diEdge) {
      diEdge.source().__unregisterOutDiReference(id);
      diEdge.target().__unregisterInDiReference(id);
      return this._diEdges.delete(id);
    }
    return false;
  }

  removeBiEdgeById(id: GraphId): boolean {
    const biEdge = this._biEdges.get(id);
    if (biEdge) {
      biEdge.a().__unregisterBiReference(id);
      biEdge.b().__unregisterBiReference(id);
      return this._biEdges.delete(id);
    }
    return false;
  }

  removeEdgeById(id: GraphId): boolean {
    return this.removeBiEdgeById(id) || this.removeDiEdgeById(id);
  }

  removeVertexById(id: GraphId): boolean {
    const vertex = this._vertices.get(id);
    if (vertex) {
      vertex.diEdgeIds().forEach((edgeId) => this.removeDiEdgeById(edgeId));
      vertex.biEdgeIds().forEach((edgeId) => this.removeBiEdgeById(edgeId));
      return this._vertices.delete(id);
    }
    return false;
  }

  addGraph(otherGraph: Graph<V, E>): this {
    return this.addGraphDefinition(otherGraph.definition());
  }

  addGraphDefinition({ vertices, edges }: GraphDefinition<V, E>): this {
    vertices.forEach((vertexDef) => this.addVertex(vertexDef));
    edges?.forEach((edgeDef) => this.addEdge(edgeDef));
    return this;
  }

  definition(): GraphDefinition<V, E> {
    return {
      vertices: this.vertices().map((v) => v.definition()),
      edges: this.edges().map((e) => e.definition()),
    };
  }

  // <editor-fold desc="VertexProvider">

  vertexExists(id: number): boolean {
    return this._vertices.has(id);
  }

  vertexById(id: number): Vertex<V, E> {
    const vertex = this.vertexByIdOpt(id);
    if (!vertex) throw new VertexNotFoundError(id);
    return vertex;
  }

  vertexByIdOpt(id: number): Vertex<V, E> | undefined {
    return this._vertices.get(id);
  }

  verticesMap(): Map<GraphId, Vertex<V, E>> {
    return this._vertices;
  }

  vertices(): Vertex<V, E>[] {
    return [...this._vertices.values()];
  }

  vertexIds(): Set<number> {
    return new Set(this._vertices.keys());
  }

  sources(): Vertex<V, E>[] {
    return this.vertices().filter((v) => v.inDegree() === 0);
  }

  sinks(): Vertex<V, E>[] {
    return this.vertices().filter((v) => v.outDegree() === 0);
  }

  vertexCount(): number {
    return this._vertices.size;
  }

  findVertex(f: (v: Vertex<V, E>) => boolean): Vertex<V, E> | undefined {
    return this.vertices().find(f);
  }

  // </editor-fold desc="VertexProvider">

  // <editor-fold desc="EdgeProvider">

  diEdges(): DiEdge<V, E>[] {
    return [...this._diEdges.values()];
  }

  biEdges(): BiEdge<V, E>[] {
    return [...this._biEdges.values()];
  }

  edges(): EdgeType<V, E>[] {
    return [...this.biEdges(), ...this.diEdges()];
  }

  diEdgeByIdOpt(id: GraphId): DiEdge<V, E> | undefined {
    return this._diEdges.get(id);
  }

  biEdgeByIdOpt(id: GraphId): BiEdge<V, E> | undefined {
    return this._biEdges.get(id);
  }

  edgeByIdOpt(id: GraphId): EdgeType<V, E> | undefined {
    return this.diEdgeByIdOpt(id) ?? this.biEdgeByIdOpt(id);
  }

  diEdgeById(id: GraphId): DiEdge<V, E> {
    const diEdge = this._diEdges.get(id);
    if (!diEdge) throw new EdgeNotFoundError(id);
    return diEdge;
  }

  biEdgeById(id: GraphId): BiEdge<V, E> {
    const biEdge = this._biEdges.get(id);
    if (!biEdge) throw new EdgeNotFoundError(id);
    return biEdge;
  }

  edgeById(id: GraphId): EdgeType<V, E> {
    const edge = this.edgeByIdOpt(id);
    if (!edge) throw new EdgeNotFoundError(id);
    return edge;
  }

  edgeCount(): number {
    return this.biEdgeCount() + this.diEdgeCount();
  }

  biEdgeCount(): number {
    return this._biEdges.size;
  }

  diEdgeCount(): number {
    return this._diEdges.size;
  }

  findBiEdge(f: (e: BiEdge<V, E>) => boolean): BiEdge<V, E> | undefined {
    return [...this._biEdges.values()].find(f);
  }

  findDiEdge(f: (e: DiEdge<V, E>) => boolean): DiEdge<V, E> | undefined {
    return [...this._diEdges.values()].find(f);
  }

  findEdge(f: (e: EdgeType<V, E>) => boolean): EdgeType<V, E> | undefined {
    return this.findDiEdge(f) ?? this.findBiEdge(f);
  }

  // </editor-fold desc="EdgeProvider">
}
