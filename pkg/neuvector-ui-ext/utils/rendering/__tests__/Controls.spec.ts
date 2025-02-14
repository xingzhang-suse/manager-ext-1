import { fireEvent } from "@testing-library/react";
import flatten from "lodash/flatten";
import { Subject } from "rxjs";

import {
  typeGroupBuilder,
  viewComponentBuilder,
  viewRelationBuilder,
} from "../../../../test/common/builders/viewElement";
import type { NodeId } from "../../../common/CoreApi";
import type { Camera } from "../Camera";
import { Controls } from "../Controls";
import { ClickEvent, type StackVizEvent } from "../Events";
import { ComponentModel } from "../model/ComponentModel";
import { GroupModel } from "../model/GroupModel";
import type { StackVizContext } from "../StackVizContext";
import type { AbstractRelation3D } from "../world/relation/AbstractRelation3D";
import type { World } from "../world/World";

vi.mock("../../../generic/domUtils", async () => {
  const actual = await vi.importActual<typeof import("../../../generic/domUtils")>("../../../generic/domUtils");
  return {
    ...actual,
    targetIn: () => true,
  };
});

const selectedElementIdSubject = new Subject<NodeId | undefined>();

function mockContext(
  dependencies?: Partial<StackVizContext>,
  mockScene?: World,
  domElement: HTMLElement = document.createElement("div"),
): StackVizContext {
  return {
    domElement,
    camera: {
      panBy: vi.fn(),
      zoomBy: vi.fn(),
      getLevelOfDetail: vi.fn().mockReturnValue("high"),
    } as unknown as Camera,
    eventSource: new Subject<StackVizEvent>(),
    eventStream: new Subject<StackVizEvent>(),
    world: mockScene,
    selectedElementIdStream: selectedElementIdSubject.asObservable(),
    ...dependencies,
  } as StackVizContext;
}

function mockControls(dependencies?: Partial<StackVizContext>, scene?: World) {
  const controls = new Controls(
    mockContext(dependencies, {
      findComponentsUnder: vi.fn().mockReturnValue([]),
      findGroupsUnder: vi.fn().mockReturnValue([]),
      findHoverable: vi.fn(),
      resetInteraction: vi.fn(),
      restoreSelection: vi.fn(),
      hoverInteraction: vi.fn(),
      ...scene,
    } as unknown as World),
  );
  controls.enabled = true;
  return controls;
}

interface SetupParams {
  findComponentExtra?: ComponentModel | undefined;
  findMouseTarget?: GroupModel | ComponentModel | AbstractRelation3D | undefined;
}

function setupForClick({ findComponentExtra = undefined, findMouseTarget = undefined }: SetupParams = {}) {
  const eventSource = new Subject<StackVizEvent>();

  const subscriber = vi.fn();
  eventSource.subscribe(subscriber);

  const scene = {
    findComponentExtra: vi.fn().mockReturnValue(findComponentExtra),
    findMouseTarget: vi.fn().mockReturnValue(findMouseTarget),
  } as unknown as World;

  const context = mockContext({ eventSource }, scene);
  const controls = mockControls(context, scene);

  return {
    controls,
    context,
    eventSource,
    subscriber,
  };
}

describe("Controls", () => {
  describe("has permissions", () => {
    it("should handle pan", async () => {
      const domElement = document.createElement("div");
      document.body.appendChild(domElement);

      const controls = new Controls(
        mockContext(
          {},
          {
            findComponentsUnder: vi.fn(),
            findHoverable: vi.fn(),
            hoverInteraction: vi.fn(),
          } as unknown as World,
          domElement,
        ),
      );
      controls.enabled = true;

      fireEvent.mouseDown(domElement);
      fireEvent.mouseMove(domElement);
      fireEvent.mouseMove(domElement);

      expect(domElement).toHaveStyle({ cursor: "grabbing" });
      expect((controls as any).stackVizContext.camera.panBy).toHaveBeenCalledTimes(2);

      fireEvent.mouseUp(domElement);

      expect(domElement).toHaveStyle({ cursor: "grab" });
      document.body.removeChild(domElement);
    });
  });

  describe("click handling", () => {
    it("should fire click event when clicking on plus icon", async () => {
      const component = viewComponentBuilder();

      const { controls, subscriber } = setupForClick({
        findComponentExtra: new ComponentModel(component, 0),
      });

      controls.handleClick(new MouseEvent("click"));

      expect(flatten(subscriber.mock.calls)).toHaveLength(1);
      expect(flatten(subscriber.mock.calls)).toEqual([new ClickEvent(component, { extra: true })]);
    });

    it("should fire click event when clicking on a component", async () => {
      const component = viewComponentBuilder();

      const { controls, subscriber } = setupForClick({
        findMouseTarget: new ComponentModel(component, 0),
      });

      controls.handleClick(new MouseEvent("click"));

      expect(flatten(subscriber.mock.calls)).toHaveLength(1);
      expect(flatten(subscriber.mock.calls)).toEqual([new ClickEvent(component)]);
    });

    it("should fire click event when clicking on a relation", async () => {
      const relation = viewRelationBuilder();
      const relation3DMock: AbstractRelation3D = {
        getNode: () => relation,
      } as any;

      const { subscriber, controls } = setupForClick({
        findMouseTarget: relation3DMock,
      });

      controls.handleClick(new MouseEvent("click"));

      expect(flatten(subscriber.mock.calls)).toHaveLength(1);
      expect(flatten(subscriber.mock.calls)).toEqual([new ClickEvent(relation)]);
    });

    it("should fire click event when clicking on a group", async () => {
      const group = typeGroupBuilder({ id: 1 as NodeId });

      const { controls, subscriber } = setupForClick({
        findMouseTarget: new GroupModel(group),
      });

      controls.handleClick(new MouseEvent("click"));

      expect(flatten(subscriber.mock.calls)).toHaveLength(1);
      expect(flatten(subscriber.mock.calls)).toEqual([new ClickEvent(group)]);
    });
  });
});
