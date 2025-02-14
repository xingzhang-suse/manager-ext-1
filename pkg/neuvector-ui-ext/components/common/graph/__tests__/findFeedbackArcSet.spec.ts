import {
  createChapter10Graph,
  generateRandomTextGraph,
  toTextGraph,
  vertexByName,
} from "../__fixtures__/graphTestUtil";
import { defaultRandomGraphOpts } from "../__fixtures__/hierarchicalTestUtil";
import { isCyclic } from "../__fixtures__/kahnToposort";
import {
  type VertexSequence,
  findFeedbackArcSet,
  findFeedbackVertexSequence,
  getFeedbackArcSetFromVertexSeq,
  inVerticesWithFeedbackSeqApplied,
  outVerticesWithFeedbackSeqApplied,
} from "../algos/findFeedbackArcSet";

function findFas(graphStrings: string[]) {
  return findFeedbackArcSet(toTextGraph(graphStrings));
}

describe("Finding Feedback Arc Set", () => {
  it("should find an empty arc set with graphs with no edges", () => {
    expect(findFas([]).length).toBe(0);
    expect(findFas(["A"]).length).toBe(0);
    expect(findFas(["A", "B"]).length).toBe(0);
  });

  it("should find one edge in the arc set when the graph is a cycle", () => {
    expect(findFas(["A->B->A"]).length).toBe(1);
    expect(findFas(["A->B->C->A"]).length).toBe(1);
  });

  it("should find all bi-edges", () => {
    expect(findFas(["A<->B"]).map((e) => e.data().name)).toEqual(["A<->B"]);
    expect(findFas(["A<->B<->C"]).length).toBe(2);
  });

  it("should find one edge in the arc set when the graph is a cycle and has sinks", () => {
    expect(findFas(["A->B->C->A", "B->D", "C->E", "A->F"]).length).toBe(1);
  });

  it("should work with more complex graphs (figure 9.14 chapter 10 of handbook of graph drawing)", () => {
    const complexGraph = toTextGraph(createChapter10Graph(true));
    expect(isCyclic(complexGraph)).toBe(true);

    findFeedbackArcSet(complexGraph).forEach((e) => complexGraph.removeEdgeById(e.id));
    expect(isCyclic(complexGraph)).toBe(false);
  });

  it("should return inverted out-vertices when feedback vertex sequence demands inverting a di-edge", () => {
    const graph = toTextGraph(["A->B", "A->B"]);
    const [vA, vB] = vertexByName(graph, "A", "B");
    const feedbackVertexSeq: VertexSequence = {};

    expect(outVerticesWithFeedbackSeqApplied(feedbackVertexSeq, vA)).toEqual([vB]);
    expect(outVerticesWithFeedbackSeqApplied(feedbackVertexSeq, vB)).toEqual([]);
    expect(inVerticesWithFeedbackSeqApplied(feedbackVertexSeq, vA)).toEqual([]);
    expect(inVerticesWithFeedbackSeqApplied(feedbackVertexSeq, vB)).toEqual([vA]);

    feedbackVertexSeq[vA.id] = 2;
    feedbackVertexSeq[vB.id] = 1;

    expect(outVerticesWithFeedbackSeqApplied(feedbackVertexSeq, vA)).toEqual([]);
    expect(outVerticesWithFeedbackSeqApplied(feedbackVertexSeq, vB)).toEqual([vA]);
    expect(inVerticesWithFeedbackSeqApplied(feedbackVertexSeq, vA)).toEqual([vB]);
    expect(inVerticesWithFeedbackSeqApplied(feedbackVertexSeq, vB)).toEqual([]);
  });

  it("should return directed out-vertices when feedback vertex sequence demands directing a bi-edge", () => {
    const graph = toTextGraph(["A<->B", "A<->B"]);
    const [vA, vB] = vertexByName(graph, "A", "B");
    const feedbackVertexSeq: VertexSequence = {};

    feedbackVertexSeq[vA.id] = 1;
    feedbackVertexSeq[vB.id] = 2;

    expect(outVerticesWithFeedbackSeqApplied(feedbackVertexSeq, vA)).toEqual([vB]);
    expect(outVerticesWithFeedbackSeqApplied(feedbackVertexSeq, vB)).toEqual([]);
    expect(inVerticesWithFeedbackSeqApplied(feedbackVertexSeq, vA)).toEqual([]);
    expect(inVerticesWithFeedbackSeqApplied(feedbackVertexSeq, vB)).toEqual([vA]);
  });

  // TODO: check number: |FAS| <= |E|/2 - |E|/6
  it("should work on random graphs", () => {
    for (let i = 0; i < 100; i++) {
      const [randomTextGraph, graph] = generateRandomTextGraph(defaultRandomGraphOpts());
      if (isCyclic(graph)) {
        const fasSeq = findFeedbackVertexSequence(graph);
        const fas = getFeedbackArcSetFromVertexSeq(graph, fasSeq);

        graph.vertices().forEach((vertex) => {
          outVerticesWithFeedbackSeqApplied(fasSeq, vertex).forEach((outVertex) => {
            expect(fasSeq[outVertex.id]).toBeGreaterThan(fasSeq[vertex.id]);
          });

          inVerticesWithFeedbackSeqApplied(fasSeq, vertex).forEach((inVertex) => {
            expect(fasSeq[inVertex.id]).toBeLessThan(fasSeq[vertex.id]);
          });
        });

        fas.forEach((e) => graph.removeEdgeById(e.id));
        if (isCyclic(graph)) {
          const fasEdgeNames = fas.map((e) => e.data().name).join(", ");
          throw new Error(
            `"Expected generated graph ${JSON.stringify(
              randomTextGraph,
            )} to be a-cyclic after removing edges: ${fasEdgeNames}.`,
          );
        }
      }
    }
  });
});
