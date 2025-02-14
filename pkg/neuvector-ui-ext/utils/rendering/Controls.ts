import isEqual from "lodash/isEqual";
import { type Observable, fromEvent, of } from "rxjs";
import { distinctUntilChanged, filter, map, switchMap, takeUntil, tap } from "rxjs/operators";
import { Vector2 } from "three";

import { abs } from "~/tools/abs";

import { DisposableCollection } from "../../common/DisposableCollection";
import { DoubleClick } from "../../common/double-click/DoubleClick";
import { targetIn } from "../../generic/domUtils";

import { ClickEvent } from "./Events";
import type { StackVizContext } from "./StackVizContext";
import type { VisualizerSelection } from "./utils/VisualizerSelectionStorage";
import type { MaskedLayer } from "./world/Grid3D";
import type { InteractionObject } from "./world/InteractionMesh";

const MOUSE_WHEEL_ZOOM_SPEED = 0.0035;

export const OUT_OF_CANVAS_MOUSE_POSITION = new Vector2(-1, -1);

export class Controls {
  private _doubleClick: DoubleClick | undefined;
  // Delta is the distance in pixels that you must move horizontally or vertically between the mouseUp and mouseDown events
  // to classify it is a drag event or a click event.
  private readonly deltaForDrag = 6;
  private readonly mouseButtonPressStartPosition = new Vector2();
  private preventNextClick = false;
  private mouseButtonPressed = false;

  private mouseDown: Observable<MouseEvent>;
  private mouseMove: Observable<MouseEvent>;
  private mouseUp: Observable<MouseEvent>;

  // pixel mouse position on the screen
  private readonly lastMousePos: Vector2 = new Vector2(-1, -1);
  private readonly mousePosDelta = new Vector2(0, 0);
  private readonly stackVizContext: StackVizContext;

  private readonly streams: DisposableCollection = new DisposableCollection();
  /**
   * When set to false, the controls will not respond to user input. Default is false.
   */
  public enabled = false;

  //initialization should happen after the renderer creation when the DOM element become available
  constructor(stackVizContext: StackVizContext) {
    this.stackVizContext = stackVizContext;
    this.init();
  }

  private init(): void {
    this.mouseDown = fromEvent<MouseEvent>(this.stackVizContext.domElement, "mousedown");
    this.mouseMove = fromEvent<MouseEvent>(this.stackVizContext.domElement, "mousemove");
    this.mouseUp = fromEvent<MouseEvent>(document, "mouseup");

    this.streams.add(this.handlePan().subscribe());

    this.streams.add(
      this.mouseDown.subscribe(() => {
        this.mouseButtonPressed = true;
      }),
    );

    this.streams.add(
      this.mouseUp.subscribe(() => {
        this.mouseButtonPressed = false;
      }),
    );

    this.streams.add(
      this.stackVizContext.selectedElementIdStream
        // do not use global state when using stackViz in preview mode
        .pipe(filter(() => this.stackVizContext.isInteractionMode()))
        .subscribe((selection: VisualizerSelection) => this.stackVizContext.world.applySelection(selection)),
    );

    this.streams.add(
      fromEvent(this.stackVizContext.domElement, "mousemove")
        .pipe(
          filter(() => this.enabled),
          // This one checks that this event happens exactly over on canvas
          // for context menu/other elements it doesn't trigger any execution
          filter((event) => targetInCanvas(event)),
          map((event: MouseEvent) => this.updateMousePosition(event)),
          filter(() => !this.mouseButtonPressed),
          map((position) => this.stackVizContext.world.findHoverable(position)),
          distinctUntilChanged(isEqual),
        )
        .subscribe((data: { element: InteractionObject | MaskedLayer; isExtra: boolean } | undefined) => {
          this.stackVizContext.world.hoverInteraction(data);
        }),
    );

    this.streams.add(
      fromEvent(this.stackVizContext.domElement, "mouseleave").subscribe(() => {
        this.lastMousePos.set(-1, -1);
        this.stackVizContext.world.resetHover();
      }),
    );

    this.streams.add(
      fromEvent(this.stackVizContext.domElement, "mouseenter")
        .pipe(filter(() => this.enabled))
        .subscribe((event: MouseEvent) => {
          const position = this.updateMousePosition(event);
          const hoverableData = this.stackVizContext.world.findHoverable(position);
          this.stackVizContext.world.hoverInteraction(hoverableData);
        }),
    );

    this.streams.add(
      fromEvent(this.stackVizContext.domElement, "wheel")
        .pipe(
          filter(() => this.enabled),
          filter((event) => targetInCanvas(event)),
        )
        .subscribe((event: WheelEvent) => {
          this.handleWheel(event, this.stackVizContext.onDisabledZoom);
        }),
    );

    // BIND
    this._doubleClick = new DoubleClick(this.stackVizContext.domElement);
    this._doubleClick.setEventListeners({ click: this.handleClick, dblclick: this.handleDoubleClick }, false);
  }

  public getMouseLastPosition(): Vector2 {
    return this.lastMousePos;
  }

  // used to get mouse position from the event
  // used in cases when user for example clicks on something and moved fast the cursor out
  private getMousePosition(event: MouseEvent): Vector2 {
    const clientRect = this.stackVizContext.domElement.getBoundingClientRect();
    const offsetX = event.clientX - clientRect.left;
    const offsetY = event.clientY - clientRect.top;
    return new Vector2(offsetX, offsetY);
  }

  // update the mouse position on every mouse move event
  private updateMousePosition(event: MouseEvent): Vector2 {
    const position = this.getMousePosition(event);
    this.mousePosDelta.set(this.lastMousePos.x - position.x, this.lastMousePos.y - position.y);
    this.lastMousePos.copy(position);

    return this.lastMousePos;
  }

  private readonly handleWheel = (event: WheelEvent, onDisabledZoom: VoidFunction) => {
    if (this.stackVizContext.zoomOnScrollDisabled) {
      onDisabledZoom();
      return;
    }

    event.preventDefault();
    const { deltaY } = event;
    if (!deltaY) return;

    const { x, y } = !this.lastMousePos.equals(OUT_OF_CANVAS_MOUSE_POSITION)
      ? this.lastMousePos
      : {
          x: this.stackVizContext.domElement.offsetWidth / 2,
          y: this.stackVizContext.domElement.offsetHeight / 2,
        };

    this.stackVizContext.camera.zoomBy(-deltaY * MOUSE_WHEEL_ZOOM_SPEED, x, y);
  };

  private readonly elementStream = (): Observable<void> => {
    return this.mouseDown.pipe(
      filter(() => this.enabled),
      // Prevent mistaking clicks for long presses
      switchMap((event) => of(event).pipe(takeUntil(this.mouseUp))),
      filter((event) => targetInCanvas(event)),
      map((event) => {
        const position = this.getMousePosition(event);
        this.mouseButtonPressStartPosition.copy(position);
      }),
    );
  };

  private readonly isDragEvent = (): boolean => {
    const diff = abs(this.lastMousePos.length() - this.mouseButtonPressStartPosition.length());
    return diff > this.deltaForDrag;
  };

  private readonly handlePan = () => {
    return this.elementStream().pipe(
      switchMap(() => {
        return this.mouseMove.pipe(
          tap((event) => {
            event.preventDefault();
            this.stackVizContext.domElement.style.cursor = "grabbing";
            this.stackVizContext.camera.panBy(this.mousePosDelta.x, this.mousePosDelta.y);
          }),
          takeUntil(
            this.mouseUp.pipe(
              tap(() => {
                if (this.isDragEvent()) {
                  // that means that drag happened, that's not accurate, cuz user can drag element too long and then return it to it's original place
                  // but we don't consider this one right now as an issue
                  this.preventNextClick = true;
                }
                this.stackVizContext.domElement.style.cursor = "grab";
              }),
            ),
          ),
        );
      }),
    );
  };

  public handleClick = (e: MouseEvent): void => {
    // this one here is to prevent the click event right after the drag event (mouse down + mouse move + mouse up events)
    // instead of subscribing/unsubscribing or capturing events this one is the most simplest
    if (this.preventNextClick) {
      this.preventNextClick = false;
      return;
    }
    const position = this.getMousePosition(e);
    const componentsExtra = this.stackVizContext.world.findComponentExtra(position);
    // TODOs revisit intersection
    if (componentsExtra) {
      this.stackVizContext.eventSource.next(new ClickEvent(componentsExtra.getNode(), { extra: true }));
    } else {
      const selectable = this.stackVizContext.world.findMouseTarget(position);
      if (selectable) {
        this.stackVizContext.eventSource.next(new ClickEvent(selectable.getNode()));
      } else {
        this.stackVizContext.eventSource.next(new ClickEvent(undefined));
      }
    }
  };

  private readonly handleDoubleClick = (): void => {
    // handleMouseDown already updates the mouse position
    const position = this.getMouseLastPosition();
    const selectable = this.stackVizContext.world.findMouseTarget(position);
    if (selectable) {
      this.stackVizContext.eventSource.next(new ClickEvent(selectable.getNode(), { double: true }));
    }
  };

  public destroy(): void {
    // unsubscribe on everything subscribed before
    this.streams.dispose();
    this._doubleClick?.removeEventListeners();
    this._doubleClick = undefined;
  }
}

const targetInCanvas = (event: Event): boolean => targetIn(event, "canvas");
