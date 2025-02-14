import type { Dto, NodeId } from "../../common/CoreApi";

export interface HasNode<N extends Dto> {
  nodeId: NodeId | undefined;
  getNode(): N;
}
