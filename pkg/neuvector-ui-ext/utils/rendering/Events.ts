import type { Box3 } from "three";

import type { LockReason } from "../../components/react/context-menu/ContextMenuLockedContent";
import type {
  GroupRelation,
  IndirectRelation,
  TypeGroup,
  ViewComponent,
  ViewElement,
  ViewRelation,
} from "../../generated/CoreApiDtos";
import { BaseEvent } from "../../generic/eventing";

import type { LodLevel } from "./LodLevel";

/**
 * Events passed from the visualiser to react
 */
export enum EventType {
  OnClick = "OnClick",
  OnHoverComponentStart = "OnHoverComponentStart",
  OnHoverHiddenRelationsStart = "OnHoverHiddenRelationsStart",
  OnHoverLayerStart = "OnHoverLayerStart",
  OnCamera2DZoomChanged = "OnCamera2DZoomChanged",
  RequestToReRender = "RequestToReRender",
}

export type StackVizEvent =
  | Camera2DZoomChangedEvent
  | ClickEvent
  | HoverComponentStartEvent
  | HoverHiddenConnectionsStartEvent
  | HoverLayerStartEvent;

export class Camera2DZoomChangedEvent extends BaseEvent<EventType.OnCamera2DZoomChanged> {
  constructor(public readonly lod: LodLevel) {
    super(EventType.OnCamera2DZoomChanged);
  }
}

export interface ClickEventMetaData {
  double?: boolean;
  extra?: boolean;
}

export type DomainObject = ViewRelation | IndirectRelation | GroupRelation | TypeGroup | ViewElement;

export class ClickEvent extends BaseEvent<EventType.OnClick> {
  constructor(
    public readonly target: DomainObject | undefined,
    public readonly meta: ClickEventMetaData = {},
  ) {
    super(EventType.OnClick);
  }
}

export class HoverComponentStartEvent extends BaseEvent<EventType.OnHoverComponentStart> {
  constructor(
    public readonly boundingBox: Box3,
    public readonly target: ViewComponent,
  ) {
    super(EventType.OnHoverComponentStart);
  }
}

export class HoverHiddenConnectionsStartEvent extends BaseEvent<EventType.OnHoverHiddenRelationsStart> {
  constructor(
    public readonly boundingBox: Box3,
    public readonly count: number,
  ) {
    super(EventType.OnHoverHiddenRelationsStart);
  }
}

export class HoverLayerStartEvent extends BaseEvent<EventType.OnHoverLayerStart> {
  constructor(
    public readonly boundingBox: Box3,
    public readonly lockReason: LockReason,
  ) {
    super(EventType.OnHoverLayerStart);
  }
}
