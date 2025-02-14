import isUndefined from "lodash/isUndefined";
import range from "lodash/range";
import shuffle from "lodash/shuffle";
import uniq from "lodash/uniq";

import { floor } from "~/tools/floor";
import { randomInt } from "~/tools/random-int";
import type { Record } from "~/tools/record";

import { identity } from "../../Util";
import type { DiEdge } from "../DiEdge";
import type { EdgeType } from "../EdgeType";
import { Graph } from "../Graph";
import { IllegalStateGraphError } from "../graphCommon";
import type { Vertex } from "../Vertex";

import { type LayeredTextGraph, type RandomGraphOpts, defaultRandomGraphOpts } from "./hierarchicalTestUtil";

export interface Named {
  name: string;
}
export type NamedGraph = Graph<Named, Named>;
export type NamedVertex = Vertex<Named, Named>;
export type NamedEdge = EdgeType<Named, Named>;

export function getOrFail<T>(x: T | undefined, message?: string): T {
  if (isUndefined(x)) throw new IllegalStateGraphError(`Optional is empty, should not happen. + ${message}`);
  return x;
}

export function vertexByName(graph: NamedGraph, ...names: Array<string>): Array<NamedVertex> {
  return names.map((name) =>
    getOrFail(
      graph.findVertex((v) => v.data().name === name),
      "Could not find vertex with name " + name,
    ),
  );
}

export function edgeByName(graph: NamedGraph, ...names: Array<string>): Array<EdgeType<Named, Named>> {
  return names.map((name) =>
    getOrFail(
      graph.findEdge((v) => v.data().name === name),
      "Could not find edge with name " + name,
    ),
  );
}

export function diEdgeByName(graph: NamedGraph, ...names: Array<string>): Array<DiEdge<Named, Named>> {
  return names.map((name) =>
    getOrFail(
      graph.findDiEdge((v) => v.data().name === name),
      "Could not find di-edge with name " + name,
    ),
  );
}

export function vertexName(namedVertex: NamedVertex): string {
  return namedVertex.data().name;
}

export function edgeName(namedEdge: NamedEdge): string {
  return namedEdge.data().name;
}

export function elementName(namedElement: NamedVertex | NamedEdge): string {
  return namedElement.data().name;
}

interface TextGraphOpts {
  invert?: boolean;
  startId?: number;
}

const defaultTextGraphOpts = {
  invert: false,
  startId: 1,
};

export type TextGraph = Array<string>;

/**
 * Generates a random text graph by combining base case graphs.
 *
 * @param baseCaseCount How many base cases should be combined.
 * @param shuffleVertexCount How many vertices between the base case graphs should be shuffled. For example two graphs
 * A->B and C->D with a shuffle count of two might become A->C and B->D.
 * @param reductionFactor A division factor by which the number of vertices can be reduced, so that the independent
 * graphs even more connected.
 * @returns A randomly generated text graph.
 */
export function generateRandomTextGraph(opts?: RandomGraphOpts): [TextGraph, NamedGraph] {
  const baseTextGraphs = [
    ["A"],
    ["A->B"],
    ["A<-B"],
    ["A<->B"],
    ["A->B->A"],
    ["A<-B<-A"],
    ["A->B", "A->C"],
    ["A<-B", "A<-C"],
  ];

  function suffixGraphVertices(graph: TextGraph, suffix: string): TextGraph {
    const vertexNames = extractTextGraphVertices(graph);

    return graph.map((graphStr) => {
      let newGraphStr = graphStr;
      vertexNames.forEach((letter) => {
        newGraphStr = newGraphStr.replaceAll(letter, letter + suffix);
      });
      return newGraphStr;
    });
  }

  const { baseCaseCount, shuffleVertexCount, reductionFactor } = !!opts ? opts : defaultRandomGraphOpts();

  const randomTextGraphs = range(baseCaseCount).map((n) =>
    suffixGraphVertices(baseTextGraphs[randomInt(0, baseTextGraphs.length - 1)], n.toString()),
  );

  const allVertices: Array<string> = randomTextGraphs.flatMap(extractTextGraphVertices);

  const mergedVertices = shuffle(allVertices.map((vertex) => [vertex, vertex]));

  const shuffledVertices = shuffle(allVertices).slice(0, floor(allVertices.length / reductionFactor, 0));

  let j = 0;
  for (let i = 0; i < shuffleVertexCount; i++) {
    mergedVertices[i][1] = shuffledVertices[j];
    j++;
    if (j >= shuffledVertices.length) j = 0;
  }

  const mergedRandomTextGraphs = randomTextGraphs.map((randomTextGraph) => {
    return randomTextGraph.map((str) => {
      let newStr = str;
      mergedVertices.forEach((mv) => {
        newStr = newStr.replace(mv[0], mv[1]);
      });
      return newStr;
    });
  });

  const randomTextGraph = mergedRandomTextGraphs.flatMap(identity);
  return [randomTextGraph, toTextGraph(randomTextGraph)];
}

export function extractTextGraphVertices(graphStrings: TextGraph): Array<string> {
  return uniq(
    graphStrings
      .flatMap(textGraphElementsFromStr)
      .filter((elem) => elem.length > 0 && !elem.startsWith("-") && !elem.startsWith("<")),
  );
}

function textGraphElementsFromStr(graphString: string): Array<string> {
  return graphString.split(/\b/).filter((s) => s.length > 0);
}

export function extractTextGraphEdges(graphStrings: TextGraph): Array<string> {
  return extractTextGraphTriples(graphStrings).map((triple) => triple[0] + triple[1] + triple[2]);
}

export function extractTextGraphTriples(graphStrings: TextGraph): Array<[string, string, string]> {
  const triples: Array<[string, string, string]> = [];

  graphStrings.forEach((graphString) => {
    const els = textGraphElementsFromStr(graphString);

    if (els.length === 1) {
      return;
    }

    // create triple
    if (els.length < 3 || els.length % 2 === 0) {
      throw new Error(`Invalid graph string: ${graphString}. Elements: ${JSON.stringify(els)}.`);
    }

    for (let i = 0, j = 2; j < els.length; i = j, j += 2) {
      triples.push([els[i], els[i + 1], els[i + 2]]);
    }
  });

  return triples.filter((t) => t[0] !== t[2]); // we filter recursive edges here, because its harder to do so in the random generator
}

export function toTextGraph(graphStrings: TextGraph, opts?: TextGraphOpts): NamedGraph {
  const options = {
    ...defaultTextGraphOpts,
    ...opts,
  };

  const graph = new Graph<Named, Named>();
  let lastId = options.startId;
  const ids: Record<string, number, "+"> = {};

  function getOrCreateVertex(name: string): NamedVertex {
    let isNew = false;
    if (!ids[name]) {
      isNew = true;
      ids[name] = lastId++;
    }

    if (isNew) {
      return graph.addVertex({ id: ids[name], data: { name: name } });
    }

    return graph.vertexById(ids[name]);
  }

  extractTextGraphVertices(graphStrings).forEach((vertexName) => getOrCreateVertex(vertexName));

  extractTextGraphTriples(graphStrings).forEach((triple) => {
    const v1 = getOrCreateVertex(triple[0]);
    const v2 = getOrCreateVertex(triple[2]);

    const edgeName = triple.join("");

    const isLeftArrow = triple[1] === "->";
    const isDoubleArrow = triple[1] === "<->";
    const isRightArrow = triple[1] === "<-";

    if (isLeftArrow || isRightArrow) {
      const [sourceId, targetId] = isLeftArrow && !options.invert ? [v1.id, v2.id] : [v2.id, v1.id];

      graph.addEdge({
        id: lastId++,
        sourceId: sourceId,
        targetId: targetId,
        data: { name: edgeName },
      });
    } else if (isDoubleArrow) {
      graph.addEdge({
        id: lastId++,
        sourceId: v1.id,
        targetId: v2.id,
        isBiDirectional: true,
        data: { name: edgeName },
      });
    } else {
      throw new Error(`${triple[1]} is not a valid edge string.`);
    }
  });

  return graph;
}

/**
 * @param includingCycles whether or not this graph should include the cycles
 * @returns the graph: http://www.csd.uoc.gr/~hy583/papers/ch10.pdf page 22
 */
export function createChapter10Graph(includingCycles: boolean): TextGraph {
  const textGraph = [
    "A1->B1",
    "A2->B1",
    "A2->C3",
    "A3->C2",
    "A3->B2",
    "A3->B3",
    "A4->B3",
    "B1->C1",
    "B1->C2",
    "B2->C3",
    "B2->C4",
    "B3->C4",
    "B3->D4",
    "C1->D1",
    "C2->D1",
    "C2->D2",
    "C2->D3",
    "C3->D3",
    "C4->D3",
  ];
  if (includingCycles) textGraph.push("D3->B2", "C1->A1");
  return textGraph;
}

export function mergeIntoGraph(into: LayeredTextGraph, other: TextGraph): LayeredTextGraph {
  into[0].push(...other);
  return into;
}
