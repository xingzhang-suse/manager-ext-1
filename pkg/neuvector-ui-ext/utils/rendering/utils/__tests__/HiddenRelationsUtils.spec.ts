import { viewComponentBuilder } from "../../../../../test/common/builders/viewElement";
import type { NodeId } from "../../../../common/CoreApi";
import { ComponentModel } from "../../model/ComponentModel";
import type { Components3D } from "../../world/Components3D";
import { revealComponentsWithHiddenConnections } from "../HiddenRelationsUtils";

const mockComponents3D = (): Components3D => {
  return {
    renderHiddenConnection: vi.fn(),
    clearHiddenConnectionCounts: vi.fn(),
  } as any as Components3D;
};

const createMapFromComponentModel = (model: ComponentModel): Map<NodeId, ComponentModel> => {
  return new Map().set(1 as NodeId, model);
};

describe("HiddenRelationsUtils", () => {
  describe("revealComponentsWithHiddenConnections", () => {
    describe("should call renderHiddenConnection on a component that has hidden connections", () => {
      it("when the number of not included neighbors is at least one", () => {
        const components3D = mockComponents3D();
        const componentModel = new ComponentModel(
          viewComponentBuilder({
            id: 1 as NodeId,
            outgoingRelations: [333 as NodeId],
            incomingRelations: [111 as NodeId, 112 as NodeId, 113 as NodeId],
          }),
          1,
        );

        revealComponentsWithHiddenConnections(createMapFromComponentModel(componentModel), components3D);
        expect(components3D.renderHiddenConnection).toHaveBeenCalled();
      });
    });

    describe("should not call renderHiddenConnection on a component that don't have hidden connections", () => {
      it("when the number of rendered direct connections is 0", () => {
        const components3D = mockComponents3D();
        const componentModel = new ComponentModel(
          viewComponentBuilder({
            id: 1 as NodeId,
            outgoingRelations: [333 as NodeId],
            incomingRelations: [111 as NodeId],
          }),
          0,
        );

        revealComponentsWithHiddenConnections(createMapFromComponentModel(componentModel), components3D);
        expect(components3D.renderHiddenConnection).not.toHaveBeenCalled();
      });

      it("when the component is not in focus", () => {
        const components3D = mockComponents3D();
        const componentModel = new ComponentModel(
          viewComponentBuilder({
            id: 1 as NodeId,
            outgoingRelations: [333 as NodeId],
            incomingRelations: [111 as NodeId],
          }),
          0,
        );

        revealComponentsWithHiddenConnections(createMapFromComponentModel(componentModel), components3D);
        expect(components3D.renderHiddenConnection).not.toHaveBeenCalled();
      });
    });
  });
});
