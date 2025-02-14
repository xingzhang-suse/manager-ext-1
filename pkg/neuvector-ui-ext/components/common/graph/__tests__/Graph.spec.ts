import { expectException } from "../../../../test/testUtils/testUtils";
import {
  type NamedVertex,
  edgeByName,
  edgeName,
  elementName,
  extractTextGraphEdges,
  extractTextGraphVertices,
  generateRandomTextGraph,
  getOrFail,
  toTextGraph,
  vertexByName,
  vertexName,
} from "../__fixtures__/graphTestUtil";
import { defaultRandomGraphOpts } from "../__fixtures__/hierarchicalTestUtil";
import { isCyclic } from "../__fixtures__/kahnToposort";
import { createAndValidatePath } from "../__fixtures__/pathUtils";
import type { DiEdge } from "../DiEdge";
import {
  EdgeCannotBeRecursiveError,
  ElementIdAlreadyExistsError,
  type GraphId,
  type GraphIds,
  IncorrectPathSequenceError,
} from "../graphCommon";
import type { Vertex } from "../Vertex";

const emptyGraph = toTextGraph([]);

function expectDiEdge<V, E>(edge: DiEdge<V, E>, expectedData: E, sourceId: number, targetId: number) {
  expect(edge.data()).toEqual(expectedData);
  expect(edge.sourceId).toEqual(sourceId);
  expect(edge.targetId).toEqual(targetId);
}

function expectVertex<V, E>(
  vertex: Vertex<V, E>,
  expectedData: V,
  expectedDataIn: Array<E>,
  expectedDataOut: Array<E>,
) {
  expect(vertex.data()).toEqual(expectedData);
  expect(vertex.inEdges().map((edge) => edge.data())).toEqual(expectedDataIn);
  expect(vertex.outEdges().map((edge) => edge.data())).toEqual(expectedDataOut);
}

describe("Graph", () => {
  it("should be able create an empty graph.", () => {
    expect(emptyGraph.edgeCount()).toBe(0);
    expect(emptyGraph.vertexCount()).toBe(0);
    expect(emptyGraph.vertices()).toEqual([]);
    expect(emptyGraph.edges()).toEqual([]);
  });

  it("should give the right counts", () => {
    const g = toTextGraph(["A->B->C->D", "E<->F<->G"]);

    expect(g.vertexCount()).toBe(7);
    expect(g.vertices().length).toBe(7);

    expect(g.edgeCount()).toBe(5);
    expect(g.edges().length).toBe(5);

    expect(g.diEdgeCount()).toBe(3);
    expect(g.diEdges().length).toBe(3);

    expect(g.biEdgeCount()).toBe(2);
    expect(g.biEdges().length).toBe(2);
  });

  it("should be able to recognize sinks and sources.", () => {
    expect(toTextGraph(["A->B", "A->B", "C->D<-E"]).sources().map(vertexName)).toEqual(["A", "C", "E"]);
    expect(toTextGraph(["A->B", "A->B", "C->D<-E"]).sinks().map(vertexName)).toEqual(["B", "D"]);
  });

  it("should be able to remove di and bi edges", () => {
    const g = toTextGraph(["A->B<->C"]);
    const [eAtoB] = edgeByName(g, "A->B");
    const [eBtoC] = edgeByName(g, "B<->C");

    expect(g.edgeCount()).toBe(2);
    g.removeDiEdgeById(eAtoB.id);
    expect(g.edgeCount()).toBe(1);
    g.removeBiEdgeById(eBtoC.id);
    expect(g.edgeCount()).toBe(0);
  });

  it("should be able to remove di and bi edges with the removeEdge function", () => {
    const g = toTextGraph(["A->B<->C"]);
    const [eAtoB] = edgeByName(g, "A->B");
    const [eBtoC] = edgeByName(g, "B<->C");

    expect(g.edgeCount()).toBe(2);
    g.removeEdgeById(eAtoB.id);
    expect(g.edgeCount()).toBe(1);
    g.removeEdgeById(eBtoC.id);
    expect(g.edgeCount()).toBe(0);
  });

  it("should generate proper random graphs", () => {
    for (let i = 0; i < 100; i++) {
      const [randomTextGraph, graph] = generateRandomTextGraph(defaultRandomGraphOpts());
      const vertexNames = extractTextGraphVertices(randomTextGraph);
      const edgeNames = extractTextGraphEdges(randomTextGraph);

      expect(graph.vertices().map(vertexName).sort()).toEqual(vertexNames.sort());
      expect(graph.edges().map(edgeName).sort()).toEqual(edgeNames.sort());
    }
  });

  it("should be able to traverse from one vertex to the other via its edges on random graphs", () => {
    for (let i = 0; i < 100; i++) {
      const [, graph] = generateRandomTextGraph(defaultRandomGraphOpts());
      const vertices = graph.vertices();

      vertices.forEach((vertex) => {
        const vertexEdges = vertex.edges();
        expect(vertexEdges.length >= vertex.inEdges().length).toBe(true);
        expect(vertexEdges.length >= vertex.outEdges().length).toBe(true);
        expect(vertexEdges.length >= vertex.biEdges().length).toBe(true);

        vertexEdges.forEach((edge) => {
          expect(graph.edgeByIdOpt(edge.id)).toBeDefined();
          expect(edge.other(vertex).id).not.toBe(vertex.id);
        });

        vertex.outVertices().forEach((outNeighbor) => {
          expect(outNeighbor.inVertices().find((inVertex) => inVertex.id === vertex.id)).toBeTruthy();
        });
      });
    }
  });

  it("should generate properly remove edges from random graphs", () => {
    for (let i = 0; i < 100; i++) {
      const [randomTextGraph, graph] = generateRandomTextGraph(defaultRandomGraphOpts());
      const edgeNames = extractTextGraphEdges(randomTextGraph);
      let removeEdgeName;
      while ((removeEdgeName = edgeNames.pop())) {
        graph.removeEdgeById(edgeByName(graph, removeEdgeName)[0].id);
        expect(graph.edges().map(edgeName).sort()).toEqual(edgeNames.sort());
        expect(graph.edgeCount()).toBe(edgeNames.length);
      }
      expect(graph.vertexCount()).toBe(extractTextGraphVertices(randomTextGraph).length);
    }
  });

  it("should properly remove vertices from random graphs", () => {
    for (let i = 0; i < 100; i++) {
      const [randomTextGraph, graph] = generateRandomTextGraph(defaultRandomGraphOpts());
      const vertexNames = extractTextGraphVertices(randomTextGraph);

      let removeVertexName;
      while ((removeVertexName = vertexNames.pop())) {
        const vertex = vertexByName(graph, removeVertexName)[0];
        graph.removeVertexById(vertex.id);
        graph.edges().forEach((edge) => expect(edge.otherOpt(vertex)).toBeUndefined());
        expect(graph.vertices().map(vertexName).sort()).toEqual(vertexNames.sort());
        expect(graph.vertexCount()).toBe(vertexNames.length);
      }
    }
  });

  it("can add empty graph to an empty graph and still be empty.", () => {
    expect(toTextGraph([]).addGraph(toTextGraph([])).vertexCount()).toBe(0);
  });

  it("can add several graphs together.", () => {
    const gA = toTextGraph(["A->B->C"], { startId: 1 }),
      gD = toTextGraph(["D<-E<-F"], { startId: 6 }),
      gG = toTextGraph(["G<->H<->I"], { startId: 11 });

    const mergedGraph = toTextGraph([]).addGraph(gA).addGraph(gD).addGraph(gG);

    expect(mergedGraph.vertices().map(vertexName).sort()).toEqual(["A", "B", "C", "D", "E", "F", "G", "H", "I"]);
    expect(mergedGraph.edges().map(edgeName).sort()).toEqual(["A->B", "B->C", "D<-E", "E<-F", "G<->H", "H<->I"]);
  });

  it("cannot add vertices to a graph with the same id.", () => {
    expectException(() => toTextGraph(["A"]).addGraph(toTextGraph(["A"])), ElementIdAlreadyExistsError.NAME);
  });

  it("cannot add vertex to a graph with the same id as an edge.", () => {
    const graph = toTextGraph(["A->B"]),
      [eAtoB] = edgeByName(graph, "A->B");
    expectException(
      () =>
        graph.addVertex({
          id: eAtoB.id,
          data: { name: "fail" },
        }),
      ElementIdAlreadyExistsError.NAME,
    );
  });

  it("cannot add edge to a graph with the same id as another vertex.", () => {
    expectException(
      () =>
        toTextGraph(["A", "B"]).addEdge({
          id: 1,
          sourceId: 1,
          targetId: 2,
          data: { name: "fail" },
        }),
      ElementIdAlreadyExistsError.NAME,
    );
  });

  it("cannot add edges to a graph with the same id.", () => {
    const graph = toTextGraph(["A->B"]),
      [eAtoB] = edgeByName(graph, "A->B");
    expectException(
      () =>
        graph.addEdge({
          id: eAtoB.id,
          sourceId: 1,
          targetId: 3,
          data: { name: "fail" },
        }),
      ElementIdAlreadyExistsError.NAME,
    );
  });

  const graph = toTextGraph(["A->B->C<->D"]),
    [vA, vB, vC, vD] = vertexByName(graph, "A", "B", "C", "D"),
    [eAtoB, eBtoC, eCbiD] = edgeByName(graph, "A->B", "B->C", "C<->D");

  it("should not allow sequences of length < 2.", () => {
    expectException(() => createAndValidatePath([], graph), IncorrectPathSequenceError.NAME);
    expectException(() => createAndValidatePath([vA], graph), IncorrectPathSequenceError.NAME);
    expectException(() => createAndValidatePath([vB], graph), IncorrectPathSequenceError.NAME);
    expectException(() => createAndValidatePath([eAtoB], graph), IncorrectPathSequenceError.NAME);
  });

  it("should not allow a path in wrong direction.", () => {
    expectException(() => createAndValidatePath([eAtoB, vA], graph), IncorrectPathSequenceError.NAME);
  });

  it("should allow to create path of two elements where one is a di-edge.", () => {
    expect(createAndValidatePath([vA, eAtoB], graph).sequence().map(elementName)).toEqual(["A", "A->B"]);
    expect(createAndValidatePath([eAtoB, vB], graph).sequence().map(elementName)).toEqual(["A->B", "B"]);
  });

  it("should be able to create path of two elements where one is a bi-edge.", () => {
    expect(createAndValidatePath([vD, eCbiD], graph).sequence().map(elementName)).toEqual(["D", "C<->D"]);
    expect(createAndValidatePath([vC, eCbiD], graph).sequence().map(elementName)).toEqual(["C", "C<->D"]);
    expect(createAndValidatePath([eCbiD, vD], graph).sequence().map(elementName)).toEqual(["C<->D", "D"]);
  });

  it("should be able to create a long path containing di and bi edges.", () => {
    expect(createAndValidatePath([vA, eAtoB, vB, eBtoC, vC, eCbiD, vD], graph).sequence().map(elementName)).toEqual([
      "A",
      "A->B",
      "B",
      "B->C",
      "C",
      "C<->D",
      "D",
    ]);
  });
});

describe("Vertex", () => {
  it("should return in- and out-degree based on unique vertices when opt.unique == true", () => {
    function checkDegree(degree: (excludeVertices?: GraphIds) => number, neighbors: Array<NamedVertex>) {
      expect(degree()).toBe(neighbors.length);

      // test exclude filtering of vertices, by adding vertex ids
      neighbors.reduce<Array<GraphId>>((excludeVertices, v) => {
        excludeVertices.push(v.id);
        expect(degree(new Set(excludeVertices))).toBe(neighbors.length - excludeVertices.length);
        return excludeVertices;
      }, []);
    }

    const degreeTestGraph = ["A->B", "A->B", "A<->B", "A->C", "A->C", "D->A", "E->A", "A<->F"];
    const [vA, vB, vC, vD, vE, vF] = vertexByName(toTextGraph(degreeTestGraph), "A", "B", "C", "D", "E", "F");

    checkDegree((e) => vA.outDiDegree({ unique: true, excludeVertices: e }), [vB, vC]);
    expect(vA.outDegree({ unique: true })).toBe([vB, vC, vF].length);
    expect(vA.inDiDegree({ unique: true })).toBe([vD, vE].length);
    expect(vA.inDegree({ unique: true })).toBe([vB, vD, vE, vF].length);

    const [vAi] = vertexByName(toTextGraph(degreeTestGraph, { invert: true }), "A", "B", "C", "D", "E", "F");
    expect(vAi.inDiDegree({ unique: true })).toBe(2);
    expect(vAi.inDegree({ unique: true })).toBe(3);
    expect(vAi.outDiDegree({ unique: true })).toBe(2);
    expect(vAi.outDegree({ unique: true })).toBe(4);
  });

  (() => {
    const [vA, vB] = vertexByName(toTextGraph(["A->B->A", "A->B->A", "A<->B<->A", "A<->B<->A"]), "A", "B");

    it("should return unique neighbors", () => {
      expect(vA.neighbors().map(vertexName)).toEqual(["B"]);
      expect(vB.neighbors().map(vertexName)).toEqual(["A"]);
    });

    it("should return unique in-vertices", () => {
      expect(vA.inVertices().map(vertexName)).toEqual(["B"]);
      expect(vB.inVertices().map(vertexName)).toEqual(["A"]);
    });

    it("should return unique out-vertices", () => {
      expect(vA.outVertices().map(vertexName)).toEqual(["B"]);
      expect(vB.outVertices().map(vertexName)).toEqual(["A"]);
    });
  })();

  (() => {
    const [vA] = vertexByName(toTextGraph(["A<->B", "A->B->A"]), "A", "B");

    it("should return unique edges", () => {
      expect(vA.edges().map(edgeName)).toEqual(["B->A", "A->B", "A<->B"]);
    });

    it("should return both incoming edges and bi-edges", () => {
      expect(vA.inEdges().map(edgeName)).toEqual(["B->A", "A<->B"]);
    });

    it("should return both outgoing edges and bi-edges", () => {
      expect(vA.outEdges().map(edgeName)).toEqual(["A->B", "A<->B"]);
    });
  })();
});

describe("isCyclic", () => {
  it("should be able to detect cycles", () => {
    expect(isCyclic(toTextGraph([]))).toBeFalsy();
    expect(isCyclic(toTextGraph(["A->B"]))).toBeFalsy();
    expect(isCyclic(toTextGraph(["A->B->C"]))).toBeFalsy();
    expect(isCyclic(toTextGraph(["A->B->C", "B->D->C"]))).toBeFalsy();
    expect(isCyclic(toTextGraph(["A->B->C", "B->D"]))).toBeFalsy();
    expect(isCyclic(toTextGraph(["A->B", "B->A"]))).toBeTruthy();
    expect(isCyclic(toTextGraph(["A->B->A"]))).toBeTruthy();
    expect(isCyclic(toTextGraph(["A->B->C", "B->D->A"]))).toBeTruthy();
    expect(isCyclic(toTextGraph(["A<->B"]))).toBeTruthy();
    expect(isCyclic(toTextGraph(["A->B<->C"]))).toBeTruthy();
  });
});

describe("DiEdge", () => {
  it("can navigate from one vertex to another via a DiEdge.", () => {
    const graph = toTextGraph(["A->B"]);
    const [vA, vB] = vertexByName(graph, "A", "B");
    const aToB = getOrFail(graph.findDiEdge((e) => e.data().name === "A->B"));

    expectVertex(vA, { name: "A" }, [], [{ name: "A->B" }]);
    expectVertex(vB, { name: "B" }, [{ name: "A->B" }], []);
    expectDiEdge(aToB, { name: "A->B" }, 1, 2);

    expect(vA.outEdges().map((e) => e.other(vA).data())).toEqual([{ name: "B" }]);
    expect(vA.outVertices().map((v) => v.data())).toEqual([{ name: "B" }]);
    expect(vB.inEdges().map((e) => e.other(vB).data())).toEqual([{ name: "A" }]);
    expect(vB.inVertices().map((v) => v.data())).toEqual([{ name: "A" }]);
  });

  it("should not be possible to create a bi-edge from a vertex to itself.", () => {
    const graph = toTextGraph(["A"]);
    const [vA] = vertexByName(graph, "A");
    expectException(
      () =>
        graph.addEdge({
          sourceId: vA.id,
          targetId: vA.id,
          data: { name: "fail" },
        }),
      EdgeCannotBeRecursiveError.NAME,
    );
  });
});

describe("BiEdge", () => {
  it("should find neighbours from both sides.", () => {
    const [vA, vB] = vertexByName(toTextGraph(["A<->B"]), "A", "B");
    expect(vA.neighbors().map((v) => v.data().name)).toEqual(["B"]);
    expect(vB.neighbors().map((v) => v.data().name)).toEqual(["A"]);
  });

  it("should be present in both the in- and out- edges from both vertices.", () => {
    const [vA, vB] = vertexByName(toTextGraph(["A<->B"]), "A", "B");
    expect(vA.inEdges().map((e) => e.isBiEdge())).toEqual([true]);
    expect(vA.outEdges().map((e) => e.isBiEdge())).toEqual([true]);
    expect(vB.inEdges().map((e) => e.isBiEdge())).toEqual([true]);
    expect(vB.outEdges().map((e) => e.isBiEdge())).toEqual([true]);
  });

  it("should be able to give the other vertex.", () => {
    const [vA, vB] = vertexByName(toTextGraph(["A<->B"]), "A", "B");
    expect(vA.inVertices().map((v) => v.data().name)).toEqual(["B"]);
    expect(vA.outVertices().map((v) => v.data().name)).toEqual(["B"]);
    expect(vB.inVertices().map((v) => v.data().name)).toEqual(["A"]);
    expect(vB.outVertices().map((v) => v.data().name)).toEqual(["A"]);
  });

  it("should not be possible to create a biEdge from a vertex to itself.", () => {
    const graph = toTextGraph(["A"]),
      [vA] = vertexByName(graph, "A");

    expectException(
      () =>
        graph.addEdge({
          sourceId: vA.id,
          targetId: vA.id,
          isBiDirectional: true,
          data: { name: "fail" },
        }),
      EdgeCannotBeRecursiveError.NAME,
    );
  });

  it("should count biEdges as a single edge.", () => {
    const g = toTextGraph(["A->B<-C->D<->B<->A"]);
    expect(g.edgeCount()).toBe(5);
    expect(g.biEdgeCount()).toBe(2);
    expect(g.diEdgeCount()).toBe(3);
  });

  it("should not find sinks and sources in a graph of all biEdges.", () => {
    const allBiEdges = toTextGraph(["A<->B<->C<->D"]);
    expect(allBiEdges.sources().length).toBe(0);
    expect(allBiEdges.sinks().length).toBe(0);
  });
});
