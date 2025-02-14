/**
 * Id of a vertex or edge.
 */
export type GraphId = number;
export type VertexId = GraphId;
export type EdgeId = GraphId;

export type GraphIds = Set<number>;

export interface VertexDef<T> {
  id?: GraphId;
  data?: T;
}

export interface EdgeDef<T> {
  id?: GraphId;
  sourceId: GraphId;
  targetId: GraphId;
  isBiDirectional?: boolean;
  data?: T;
}

export abstract class GraphError implements Error {
  stack: string | undefined;

  public name: string;

  public message: string;

  constructor(name: string, message: string) {
    this.message = message;
    this.name = name;
    this.stack = new Error()["stack"];
  }
}

/**
 * An error that should not occur. It is a programmer mistake when this happens.
 */
export class IllegalStateGraphError extends GraphError {
  public static NAME = "IllegalStateError";
  constructor(message: string) {
    super(IllegalStateGraphError.NAME, message);
  }
}

export class VertexNotFoundError extends GraphError {
  public static NAME = "VertexNotFoundError";
  public vId: GraphId;

  constructor(vId: GraphId) {
    super(VertexNotFoundError.NAME, `Vertex: ${vId} not found!`);
    this.vId = vId;
  }
}

export class EdgeNotFoundError extends GraphError {
  public static NAME = "EdgeNotFoundError";
  public eId: GraphId;

  constructor(eId: GraphId) {
    super(EdgeNotFoundError.NAME, `Edge: ${eId} not found!`);
    this.eId = eId;
  }
}

export class PathElementNotFoundError extends GraphError {
  public static NAME = "PathElementNotFoundError";
  public idx: number;

  constructor(idx: number) {
    super(PathElementNotFoundError.NAME, `Path element with index '${idx}' not found!`);
    this.idx = idx;
  }
}

/**
 * Cannot create a edge that has the same 'source' and 'target': A<->A.
 */
export class EdgeCannotBeRecursiveError extends GraphError {
  public static NAME = "EdgeCannotBeRecursiveError";
  constructor(message: string) {
    super(EdgeCannotBeRecursiveError.NAME, message);
  }
}

/**
 * Not a correct sequence of connected traversable components.
 */
export class IncorrectPathSequenceError extends GraphError {
  public static NAME = "IncorrectPathSequenceError";
  constructor(message: string) {
    super(IncorrectPathSequenceError.NAME, message);
  }
}

/**
 * Cannot create an element with an id that already exists.
 */
export class ElementIdAlreadyExistsError extends GraphError {
  public static NAME = "ElementIdAlreadyExistsError";
  constructor(message: string) {
    super(ElementIdAlreadyExistsError.NAME, message);
  }
}
