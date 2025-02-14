import { BiEdge } from "../BiEdge";
import { DiEdge } from "../DiEdge";
import type { EdgeProvider } from "../EdgeProvider";
import type { GraphElementSequence } from "../Graph";
import { IncorrectPathSequenceError } from "../graphCommon";
import { Path } from "../Path";
import { Vertex } from "../Vertex";
import type { VertexProvider } from "../VertexProvider";

export const createAndValidatePath = <V, E>(
  elementSeq: GraphElementSequence<V, E>,
  graphElementProvider: VertexProvider<V, E> & EdgeProvider<V, E>,
): Path<V, E> => {
  const fromSequenceToPath = (sequence: Vertex<V, E>[]) => {
    const firstElementIsVertex = sequence[0] instanceof Vertex;
    const sequenceIds = sequence.map((element) => element.id);

    return new Path<V, E>(firstElementIsVertex, sequenceIds, graphElementProvider);
  };
  if (isCorrectPathSequence(elementSeq)) {
    return fromSequenceToPath(elementSeq as Vertex<V, E>[]);
  }

  throw new IncorrectPathSequenceError("Unable to construct path.");
};

export function isCorrectPathSequence<V, E>(elementSeq: GraphElementSequence<V, E>): boolean {
  if (elementSeq.length < 2) {
    throw new IncorrectPathSequenceError(
      `Path element sequence has to consist at least out of one vertex and one edge, however the length of the sequence was: ${elementSeq.length}.`,
    );
  }

  let prevElement = elementSeq[0];

  for (let i = 1; i < elementSeq.length; i++) {
    const curElement = elementSeq[i];

    if (curElement instanceof Vertex) {
      if (prevElement instanceof DiEdge) {
        if (prevElement.targetId !== curElement.id) {
          throw new IncorrectPathSequenceError(
            `Incorrect di-edge found in path sequence. ` +
              `Expected di-edge target to be '${curElement.id}', but was '${prevElement.targetId}'.`,
          );
        }
      } else if (prevElement instanceof BiEdge) {
        if (!prevElement.otherIdOpt(curElement.id)) {
          throw new IncorrectPathSequenceError(
            `Incorrect di-edge found in path sequence. ` +
              `Expected bi-edge to connect '${curElement.id}', but connects only '${prevElement.aId}' and '${prevElement.bId}'.`,
          );
        }
      } else {
        throw new IncorrectPathSequenceError(
          `Incorrect element type found path in sequence. Expected edge, but got: ${JSON.stringify(curElement)}.`,
        );
      }
    } else {
      if (!(prevElement instanceof Vertex)) {
        throw new IncorrectPathSequenceError(
          `Incorrect element type found in path sequence. Expected vertex, but got: ${JSON.stringify(curElement)}.`,
        );
      }

      if (curElement instanceof DiEdge) {
        if (curElement.sourceId !== prevElement.id) {
          throw new IncorrectPathSequenceError(
            `Incorrect di-edge found in path sequence. ` +
              `Expected di-edge source to be '${prevElement.id}', but was '${curElement.sourceId}'.`,
          );
        }
      } else if (curElement instanceof BiEdge) {
        if (!curElement.otherIdOpt(prevElement.id)) {
          throw new IncorrectPathSequenceError(
            `Incorrect di-edge found in path sequence. ` +
              `Expected bi-edge to connect '${prevElement.id}', but connects only '${curElement.aId}' and '${curElement.bId}'.`,
          );
        }
      } // no else if necessary, because all possible types have been exhausted!
    }

    prevElement = curElement;
  }

  return true;
}
