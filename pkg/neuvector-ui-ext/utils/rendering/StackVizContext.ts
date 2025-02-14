import isEqual from "lodash/isEqual";
import noop from "lodash/noop";
import type { Store } from "redux";
import { type Observable, Subject } from "rxjs";
import { distinctUntilChanged, filter, map, startWith } from "rxjs/operators";

import { selectCurrentSelection } from "../../app/state/right-pane/RightPaneSelectors";
import type { RootState } from "../../app/state/RootState";
import { DisposableCollection } from "../../common/DisposableCollection";
import { Edition } from "../../generated/CoreApiDtos";
import { getStateObservable } from "../../generic/redux/StoreObservable";
import type { StackViewSnapshot } from "../../store/StackViewSnapshot";
import { isComponentSelectMode, isInteractionMode } from "../StackVizModes";
import { FULL_MODE, type StackVizMode } from "../StackVizModes";

import { Camera } from "./Camera";
import { clearBasicMaterialCaches } from "./common/BasicMaterials";
import { Controls, OUT_OF_CANVAS_MOUSE_POSITION } from "./Controls";
import { Debug } from "./debug/Debug";
import type { DebugStats } from "./debug/DebugStats";
import { type Camera2DZoomChangedEvent, EventType, type StackVizEvent } from "./Events";
import type { LodLevel } from "./LodLevel";
import { Renderer } from "./Renderer";
import type { VizGraph, VizHierarchicalLayout, VizVertexGroup } from "./RenderInput";
import { clearTextTexturesCache } from "./text/TextTexturesCache";
import { triggerOnLoadCallbacks } from "./utils/OnSceneLoadEndCallbackManager";
import { checkResizeRenderer } from "./utils/resize";
import { TextureCache } from "./utils/TextureCache";
import type { VisualizerSelection } from "./utils/VisualizerSelectionStorage";
import { WorldTime } from "./utils/WorldTime";
import { World } from "./world/World";

export interface StackVizUpdateOptions {
  mode?: StackVizMode;
  spotlightedComponentIdentifier?: string;
  onDisabledZoom?: VoidFunction;
  zoomOnScrollDisabled?: boolean;
  edition?: Edition;
}

export class StackVizContext {
  public renderer: Renderer;
  public world: World;
  public camera: Camera;
  public controls: Controls;

  public worldTime: WorldTime;

  public readonly eventSource = new Subject<StackVizEvent>();
  public readonly eventStream = this.eventSource.asObservable();

  private readonly streams: DisposableCollection = new DisposableCollection();
  public debug: Debug;
  private readonly debugStats: DebugStats;

  public iconTextureCache = new TextureCache();
  public stackViewSnapshot?: StackViewSnapshot;

  private _domElement: HTMLElement;
  private readonly _store: Store<RootState>;
  private readonly _selectedElementIdStream: Observable<VisualizerSelection>;
  private _mode: StackVizMode;
  private _spotlightedComponentIdentifier: string | undefined;

  public onDisabledZoom: VoidFunction;
  public zoomOnScrollDisabled: boolean;
  public edition: Edition;

  constructor(_domElement: HTMLElement, store: Store<RootState>, options: StackVizUpdateOptions = {}) {
    this._domElement = _domElement;
    this._domElement.style.cursor = "grab";
    this._store = store;
    this._selectedElementIdStream = getStateObservable(store).pipe(
      map(selectCurrentSelection),
      startWith(selectCurrentSelection(store.getState())),
      distinctUntilChanged(isEqual),
    ) as Observable<VisualizerSelection>;

    this.update(options);

    /**
     * The order of initialization is very important
     */
    this.debug = new Debug(this);
    this.camera = new Camera(this);
    this.world = new World(this);
    this.renderer = new Renderer(this);
    this.controls = new Controls(this);
    this.worldTime = new WorldTime();

    this.streams.add(
      this.worldTime.tick.subscribe(() => {
        // first change the camera, then the renderer, and after that make world manipulations,
        // in that case everything will be smooth for human eye
        checkResizeRenderer(this.renderer.webGLRenderer, this.camera);
        this.camera.update(this.worldTime.clock.getDelta());
        this.renderer.update();
        // update the world over time
        this.world.update();
      }),
    );

    // this one looks super weird for now, because we subscribe at ourself here, going to be changed soon
    // it's better to have a separate stream of events for a camera
    this.streams.add(
      this.eventStream
        .pipe(
          filter((event): event is Camera2DZoomChangedEvent => event.type === EventType.OnCamera2DZoomChanged),
          map(({ lod }) => lod),
          distinctUntilChanged(),
        )
        .subscribe((lod: LodLevel) => {
          this.world.lodUpdate(lod);
        }),
    );
  }

  /**
   * Reinitialize the whole StackVizContext sometimes is too expensive
   *
   * this is a helper function to update some of Context's properties
   * updating which does not require re-creation of StackViz
   */
  public update({
    mode,
    spotlightedComponentIdentifier,
    onDisabledZoom,
    zoomOnScrollDisabled,
    edition,
  }: StackVizUpdateOptions = {}): void {
    this._mode = mode || FULL_MODE;
    this._spotlightedComponentIdentifier = spotlightedComponentIdentifier;
    this.onDisabledZoom = onDisabledZoom || noop;
    this.zoomOnScrollDisabled = zoomOnScrollDisabled ?? false;
    this.edition = edition ?? Edition.Community;
  }

  public isInteractionMode(): boolean {
    return isInteractionMode(this._mode);
  }

  public isComponentSelectMode(): boolean {
    return isComponentSelectMode(this._mode);
  }

  get spotlightedComponentIdentifier() {
    return this._spotlightedComponentIdentifier;
  }

  get store() {
    return this._store;
  }

  get domElement() {
    return this._domElement;
  }

  get selectedElementIdStream() {
    return this._selectedElementIdStream;
  }

  public load(
    graph: VizGraph,
    rows: Array<VizVertexGroup>,
    cols: Array<VizVertexGroup>,
    layoutData: Array<VizHierarchicalLayout>,
    stackViewSnapshot: StackViewSnapshot,
  ): void {
    this.stackViewSnapshot = stackViewSnapshot;
    this.controls.enabled = false;
    this.camera.stopAnimations();
    // after the scene is loaded, we can manipulate with it before renderer actually renders anything on the screen
    this.world.loadHierarchicalGraph(graph, rows, cols, layoutData, stackViewSnapshot.neighborsNotInQueryResult);

    // (re)position camera
    this.camera.setSceneSize(this.world.getWidth(), this.world.getHeight());

    // Restore previously interacted elements
    const position = this.controls.getMouseLastPosition();
    if (!position.equals(OUT_OF_CANVAS_MOUSE_POSITION)) {
      const hoverableData = this.world.findHoverable(position);
      this.world.hoverInteraction(hoverableData);
    }
    this.world.restoreSelection();

    // Callbacks
    triggerOnLoadCallbacks(this);

    // apply LOD level
    this.world.lodUpdate(this.camera.getLevelOfDetail());
    this.controls.enabled = true;
  }

  public destroy(): void {
    this.eventSource.unsubscribe();
    this.streams.dispose();
    this.camera.destroy();
    this.worldTime.destroy();
    this.controls.destroy();
    this.renderer.destroy();
    this.world.destroy();
    this.iconTextureCache.destroy();
    clearBasicMaterialCaches();
    clearTextTexturesCache();

    this.debug.destroy();
    // hammer time
    /**
     * something keeps a reference to the StackVizContext instance in the memory,
     * preventing this one to be collected by GC;
     * at least what I can do here is remove references from StackVizContext to its properties by simple setting undefined to them,
     * so at least those properties would be collected by GC.
     */
    this.renderer = undefined!;
    this.world = undefined!;
    this.camera = undefined!;
    this.controls = undefined!;
    this.worldTime = undefined!;
    this._domElement = undefined!;
  }
}
