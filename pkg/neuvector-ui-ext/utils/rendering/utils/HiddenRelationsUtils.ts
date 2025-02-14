import { type NodeId, ViewElementRetrievalSource } from "../../../generated/CoreApiDtos";
import type { ComponentModel } from "../model/ComponentModel";
import type { Components3D } from "../world/Components3D";

export const revealComponentsWithHiddenConnections = (
  componentModels: Map<NodeId, ComponentModel>,
  components3D: Components3D,
): void => {
  components3D.clearHiddenConnectionCounts();

  componentModels.forEach((componentModel) => {
    const component = componentModel.component;

    if (componentModel.neighboursNotInQuery > 0 && component.retrievalSource === ViewElementRetrievalSource.Query) {
      components3D.renderHiddenConnection(componentModel.neighboursNotInQuery, componentModel);
    }
  });
};
