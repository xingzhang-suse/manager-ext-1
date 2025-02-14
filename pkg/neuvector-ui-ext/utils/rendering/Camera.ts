import anime, { type AnimeTimelineInstance } from "animejs";
import clamp from "lodash/clamp";
import { Frustum, type Object3D, OrthographicCamera, Raycaster, Vector3 } from "three";

import { abs } from "~/tools/abs";
import { max } from "~/tools/max";
import { min } from "~/tools/min";

import {
  type Rectangle2D,
  denormaliseCoordinates,
  normaliseCoordinates,
  rectangle,
  scale,
  spring,
  translate,
} from "./CameraUtils";
import { Camera2DZoomChangedEvent } from "./Events";
import { LOD_LEVEL_HIGH, LOD_LEVEL_LOW, LOD_LEVEL_MEDIUM, type LodLevel } from "./LodLevel";
import { StackVizConfig } from "./StackVizConfig";
import type { StackVizContext } from "./StackVizContext";

const DEFAULT_ZOOM: number = 1;

const OVERSCROLL_PERCENTAGE: number = 0.1;

export interface CameraParameters {
  zoom: number;
  zoomTarget: number;
  offset: Vector3;
  zoomTargetVelocity: number;
}

export const CAMERA_DEFAULT_PARAMETERS: CameraParameters = {
  zoom: 1,
  zoomTarget: 1,
  offset: new Vector3(0, 0, 0),
  zoomTargetVelocity: 0,
};

export class Camera {
  public readonly camera: OrthographicCamera = new OrthographicCamera(0, 0, 0, 0, -10000, 10000);

  private readonly raycaster: Raycaster = new Raycaster(undefined, undefined, this.camera.near, this.camera.far);

  // [m] Bounding box of whatever is being rendered
  private scene: Rectangle2D = rectangle();

  // [px] size of the canvas width on the user's screen
  private viewport: Rectangle2D = rectangle();

  // [m] Size of the camera frustum, has the same aspect ratio as the viewport
  // but dimesions large enough to fit the scene
  private frustum: Rectangle2D = rectangle();

  // [m] Camera target
  private readonly offset: Vector3 = new Vector3(0, 0);

  // [m] The point towards th user is scrolling
  private readonly zoomAnchor: Vector3 = new Vector3(0, 0);

  // [m] A temporary vector for zoom anchor offset calculation
  // see onRenderTick method
  private readonly zoomAnchorOffset: Vector3 = new Vector3();

  // [unitless] Current camera zoom
  private zoom: number = DEFAULT_ZOOM;

  // Camera does not zoom directly but attaches zoom to zoomTarget
  // by a spring with high damping factor so that zoom will ease towards the zoomTarget
  // as time progresses.
  //
  // [s-1] The current rate at which zoom is moving towards zoomTarget
  private zoomVelocity: number = 0;

  // The zoom spring dynamic function
  private readonly zoomSpring = spring(170, 26);

  // [unitless] zoomTarget is the value that current zoom is converging towards
  //
  // It itself is constrained to the zoom range using a spring which gives
  // zooming the bouncy effect at zoom range boundaries.
  //
  // Whenever the camera zooms out of the allowed zoom range the spring takes
  // effect and brings zoom back within the range
  private zoomTarget: number = this.zoom;

  // [s-1] The current rate at which zoomTarget is moving towards a zoom value
  // within zoom range
  private zoomTargetVelocity: number = 0;

  // The zoom target spring dynamic function
  private readonly zoomTargetSpring = spring(500, 20);

  private readonly stackVizContext: StackVizContext;

  // stores reference for lookAt animation, so it can be stopped later on
  private lookAtAnimation: AnimeTimelineInstance | undefined;

  constructor(stackVizContext: StackVizContext) {
    this.stackVizContext = stackVizContext;
    // Camera needs to be set to an arbitrary "safe" positive z value
    // since some objects are rendered above the z = 0 plane
    this.camera.position.setZ(100);
  }

  public destroy(): void {
    this.stopAnimations();
  }

  // stops all going animations
  // use this to release resources or reset the current camera
  public stopAnimations(): void {
    this.lookAtAnimation?.pause();
    this.lookAtAnimation = undefined;
  }

  public setViewportSize(width: number, height: number): void {
    this.viewport = rectangle(width, height);

    this.recalculateFrustum();
  }

  public setSceneSize(width: number, height: number): void {
    // Since the layer/domain labels are now not included in the
    // scene size the default zooming level would make them invisible
    //
    // Because of this we need to add padding to the scene and since changing
    // the way the scene reports its width and height is not a trivial thing to do
    // the padding is added here
    const padding: number = 10;

    this.scene = {
      x: -width / 2 - padding,
      y: -height / 2 - padding,
      width: width + 2 * padding,
      height: height + 2 * padding,
    };

    this.recalculateFrustum();
  }

  get zoomLevel(): number {
    return this.zoom;
  }

  set zoomLevel(value: number) {
    this.zoom = value;
    this.zoomTarget = value;

    this.recalculateFrustum();
  }

  // Recalculates the camera viewport taking into account the scene size
  // and the viewport size.
  //
  // The resulting viewport at zoom = 1 is large enough to show the whole scene
  private recalculateFrustum(): void {
    const { viewport, scene } = this;

    // [px.m-1] (0, +Infinity) Scaling factor between the viewport pixel dimensions
    // and the scene meter dimensions.
    //
    // Since we want the scene to be contained within the frame and not to fill the frame
    // we must take the bigger of these two values
    const frustumScale = max(scene.width / viewport.width, scene.height / viewport.height);
    const centeredViewport = translate(viewport, -viewport.width / 2, -viewport.height / 2);

    if (isFinite(frustumScale)) {
      // If the divisions were okay and the sizes are all non zero then we take the viewport rectangle
      // (since we want to preserve its aspect ratio) and scale it so that it will fit the whole scene
      this.frustum = scale(centeredViewport, frustumScale);
    } else {
      // In case there were some zeroes in denominators it means the viewport is not ready
      // and the camera can be set to arbitrary values. Viewport rectangle is a good default in this case
      this.frustum = centeredViewport;
    }
  }

  private fireZoomChangeEvent(): void {
    this.stackVizContext.eventSource.next(new Camera2DZoomChangedEvent(this.getLevelOfDetail()));
  }

  // Find intersecting objects based on pixel coordinates
  findIntersections<T extends Object3D = Object3D>(px: number, py: number, objects: Array<T>): Array<T> {
    if (objects.length === 0) return [];

    // First convert pixels into normalised [-1, 1] coordinates
    const point = normaliseCoordinates(px, py, this.viewport);
    this.raycaster.setFromCamera(point, this.camera);

    // And check objects one by one for an intersection
    // (this is faster than remapping an output of raycaster.intersectObjects since the information
    // about the parent is lost)
    return objects.filter((object) => this.raycaster.intersectObject(object, true).length !== 0);
  }

  // Faster version of `findIntersections`, doesn't take into account children of the passed objects
  public findIntersection<T extends Object3D>(px: number, py: number, objects: Array<T>): T | undefined {
    if (objects.length === 0) return undefined;
    // First convert pixels into normalised [-1, 1] coordinates
    const point = normaliseCoordinates(px, py, this.viewport);
    this.raycaster.setFromCamera(point, this.camera);
    return objects.find((object) => this.raycaster.intersectObject(object, false).length !== 0);
  }

  // [px -> m] Converts pixel coordinates to meter coordinates in the scene space
  getCameraCoordinates(px: number, py: number): Vector3 {
    const { x, y } = normaliseCoordinates(px, py, this.viewport);

    return new Vector3(x, y).unproject(this.camera);
  }

  // [m -> px] Converts meter coordinates into pixel coordinates in the scene space
  getWorldCoordinates(x: number, y: number): Vector3 {
    const { x: nx, y: ny } = new Vector3(x, y).project(this.camera);
    const { x: wx, y: wy } = denormaliseCoordinates(nx, ny, this.viewport);

    return new Vector3(wx, wy, 0);
  }

  public getWorldBoundaries<TPoint extends { x: number; y: number }>(coords: {
    min: TPoint;
    max: TPoint;
  }): undefined | Rectangle2D {
    const topLeftCorner = this.getWorldCoordinates(coords.min.x, coords.min.y);
    const bottomRightCorner = this.getWorldCoordinates(coords.max.x, coords.max.y);

    if (isNaN(topLeftCorner.x) || isNaN(topLeftCorner.y)) {
      // here is chance that projecting a vector on the camera returns NaN
      // reasons are not clear
      // from the experience it might happen when the user moves mouse, while everything is already initiated
      // and the camera is ready to use, but camera's matrix world is still full of NaN
      return;
    }

    return {
      x: min(topLeftCorner.x, bottomRightCorner.x),
      y: min(topLeftCorner.y, bottomRightCorner.y),
      width: abs(bottomRightCorner.x - topLeftCorner.x),
      height: abs(bottomRightCorner.y - topLeftCorner.y),
    };
  }

  getLevelOfDetail(): LodLevel {
    // [px.m-1] Scale of the viewport adjusted by zoom
    // How many pixels will one meter occupy when the zoom is applied
    const scale: number = (this.viewport.width / this.frustum.width) * this.zoomTarget;

    if (!isFinite(scale) || scale < StackVizConfig.CAMERA_SCALE_LOD_LOW) {
      return LOD_LEVEL_LOW;
    }

    if (scale < StackVizConfig.CAMERA_SCALE_LOD_MEDIUM) {
      return LOD_LEVEL_MEDIUM;
    }

    return LOD_LEVEL_HIGH;
  }

  private getMaxZoom(): number {
    // [px.m-1] [0, +Infinity]
    const scale: number = this.viewport.width / this.frustum.width;

    // [unitless] [0, +Infinity]
    const maxZoom: number = StackVizConfig.CAMERA_SCALE_MAX / scale;

    // [unitless] [minZoom, +Infinity]
    return max(1, maxZoom);
  }

  private getZoomOnTarget(): number {
    return max(1, StackVizConfig.CAMERA_SCALE_LOOK_AT / (this.viewport.width / this.frustum.width));
  }

  /**
   * Determines the zoom level for the camera when the provided `distance` could be fully displayed on the screen
   * @param distance - in [m] units
   * @private
   */
  private getZoomLevelBasedOnDistance(distance: number): number {
    const newScale = min(this.viewport.width / (distance || 1), StackVizConfig.CAMERA_SCALE_MAX);
    const minScale = this.viewport.width / this.frustum.width;
    return max(1, newScale / minScale);
  }

  /**
   * Change the position and zoom of this Camera in the way that vector3 will be inside of the Camera's viewing frustum
   * @param vector3 - A vector representing a position in world space.
   * @param animate
   */
  public lookAt(vector3: Vector3, animate = false): void {
    // zoom level for an element when Text is readable for an user
    const zoomOnTarget = this.getZoomOnTarget();
    if (animate) {
      // determine the start and end points, set Z to 0 to make calculations more accurate for 2D space
      const startPoint = this.offset.clone().setZ(0);
      const endPoint = vector3.clone().setZ(0);
      const currentZoomLevel = this.zoomLevel;
      // determine the ZoomLevel at the end point, it should be no less than zoomOnTarget
      const endZoomLevel = max(currentZoomLevel, zoomOnTarget);

      // check is the end point inside the current frustum
      const frustum = new Frustum().setFromProjectionMatrix(this.camera.projectionMatrix);
      const inCurrentFrustum = frustum.containsPoint(endPoint);

      this.lookAtAnimation = anime.timeline({
        // animation placeholder
        autoplay: false,
        begin: () => {
          // disable controls
          this.stackVizContext.controls.enabled = false;
        },
        complete: () => {
          // enable controls
          this.stackVizContext.controls.enabled = true;
        },
      });

      // if the end point inside the current frustum - we can skip few steps
      if (!inCurrentFrustum) {
        // the middle point between start and end points
        const middlePoint = new Vector3().lerpVectors(startPoint, endPoint, 0.5);
        // distance between two points multiplied on magic coefficient
        // this one is used to determine the min ZoomLevel when two points are present in the frustum
        // this coefficient is used to display more additional areas around those points
        const distance = startPoint.distanceTo(endPoint) * 2;
        // zoom level in the middle point so user could see start and end points
        const middleZoomLevel = min(this.getZoomLevelBasedOnDistance(distance), endZoomLevel);
        // step 1 - move camera towards the middle point
        this.lookAtAnimation.add(
          {
            targets: this.offset,
            x: middlePoint.x,
            y: middlePoint.y,
            duration: StackVizConfig.ANIMATION_OFFSET_TO_CENTER_DURATION * 1000,
            easing: StackVizConfig.ANIMATION_OFFSET_TO_CENTER_EASE,
          },
          0,
        );

        // step 2 - zoom out camera, starts at the same time as step 1
        this.lookAtAnimation.add(
          {
            targets: this,
            zoomLevel: middleZoomLevel,
            duration: StackVizConfig.ANIMATION_ZOOM_TO_CENTER_DURATION * 1000,
            easing: StackVizConfig.ANIMATION_ZOOM_TO_CENTER_EASE,
          },
          0,
        );

        // step 3 - move camera towards the end point, starts after 1 and 2 steps if any, otherwise starts immediately
        this.lookAtAnimation.add(
          {
            targets: this.offset,
            x: endPoint.x,
            y: endPoint.y,
            duration: StackVizConfig.ANIMATION_OFFSET_TO_ELEMENT_DURATION * 1000,
            easing: StackVizConfig.ANIMATION_OFFSET_TO_ELEMENT_EASE,
          },
          StackVizConfig.ANIMATION_ZOOM_TO_CENTER_DURATION * 1000,
        );

        // step 4 - zoom in camera to endZoomLevel value, starts at the same time as step 3
        if (!inCurrentFrustum || currentZoomLevel !== endZoomLevel) {
          this.lookAtAnimation.add(
            {
              targets: this,
              zoomLevel: endZoomLevel,
              duration: StackVizConfig.ANIMATION_ZOOM_TO_ELEMENT_DURATION * 1000,
              easing: StackVizConfig.ANIMATION_ZOOM_TO_ELEMENT_EASE,
            },
            StackVizConfig.ANIMATION_ZOOM_TO_CENTER_DURATION * 1000,
          );
        }
      }
      // run the animation
      this.lookAtAnimation.play();
    } else {
      this.zoomLevel = zoomOnTarget;
      this.offset.x = vector3.x;
      this.offset.y = vector3.y;
      this.fireZoomChangeEvent();
    }
  }

  // Pans the camera by specified amount of pixels
  panBy(px: number, py: number): void {
    if (!this.isCameraReadyToManipulate()) {
      return;
    }
    const offset = this.getCameraCoordinates(px, py).sub(this.getCameraCoordinates(0, 0));

    this.offset.add(offset);
  }

  // Zooms the camera by a specified amount (additive)
  zoomBy(delta: number, px: number = this.viewport.width / 2, py: number = this.viewport.height / 2): void {
    if (!this.isCameraReadyToManipulate()) {
      return;
    }
    // Zoom target movement is constrained to a slightly larger range than the zoom
    // in order to allow for overscroll
    const minZoom: number = DEFAULT_ZOOM;
    const maxZoom: number = this.getMaxZoom();
    this.zoomTarget = clamp(
      this.zoomTarget + delta,
      minZoom * (1 - OVERSCROLL_PERCENTAGE),
      maxZoom * (1 + OVERSCROLL_PERCENTAGE),
    );

    // [m] The position at which the user was zooming is remembered
    this.zoomAnchor.copy(this.getCameraCoordinates(px, py));
  }

  // Resets the camera to its default position
  reset(): void {
    this.offset.copy(CAMERA_DEFAULT_PARAMETERS.offset);

    this.zoom = CAMERA_DEFAULT_PARAMETERS.zoom;
    this.zoomTarget = CAMERA_DEFAULT_PARAMETERS.zoomTarget;
    this.zoomTargetVelocity = CAMERA_DEFAULT_PARAMETERS.zoomTargetVelocity;
  }

  public applyParams(parameters: CameraParameters): void {
    this.zoom = parameters.zoom;
    this.zoomTarget = parameters.zoomTarget;
    this.zoomTargetVelocity = parameters.zoomTargetVelocity;
    this.offset.copy(parameters.offset);
  }

  public getParameters(): CameraParameters {
    return {
      zoom: this.zoom,
      zoomTarget: this.zoomTarget,
      zoomTargetVelocity: this.zoomTargetVelocity,
      offset: this.offset.clone(),
    };
  }

  isInDefaultPos(): boolean {
    return this.offset.x === 0 && this.offset.y === 0 && this.zoomTarget === DEFAULT_ZOOM;
  }

  /**
   * It might be not the best solution, but it works
   * Check when camera is ready to manipulate to not catch the NaN
   */
  public isCameraReadyToManipulate(): boolean {
    const { camera } = this;
    return !!camera.top && !!camera.left && !!camera.bottom && !!camera.right;
  }

  /**
   * update camera on each tick
   * @param timeSinceLastRender in seconds
   */
  public update(timeSinceLastRender: number): void {
    // TODO STAC-16450
    // Recalculate camera zoom
    //
    // First make sure the zoom target is within the zoom range
    const minZoom: number = DEFAULT_ZOOM;
    const maxZoom: number = this.getMaxZoom();
    const clampedZoomTarget: number = clamp(this.zoomTarget, minZoom, maxZoom);

    // And interpolate the spring motion of the zoom target to achieve
    // smooth zoom transition and enable the overzoom effect
    //
    // In case the zoom target falls within the allowed zoom range its clamped value
    // is the same as its value and new caluclated values will be identical.
    //
    // However if the user zoomed out of the allowed range the clamped value will differ and will
    // pull the zoom target back.
    const [newZoomTarget, newZoomTargetVelocity] = this.zoomTargetSpring(
      this.zoomTarget,
      clampedZoomTarget,
      this.zoomTargetVelocity,
      timeSinceLastRender,
    );

    // Update the zoom target and its velocity with the new values
    this.zoomTarget = newZoomTarget;
    this.zoomTargetVelocity = newZoomTargetVelocity;

    // Zoom itself also follows the same motion pattern but instead of following
    // its clamped value it follows the zoom target
    const [newZoom, newZoomVelocity] = this.zoomSpring(
      this.zoom,
      this.zoomTarget,
      this.zoomVelocity,
      timeSinceLastRender,
    );

    // Now to keep the zoom anchor in place we need to see how much it drifted
    // when the zoom was applied
    //
    // First the distance between current screen center point and the zoom anchor is calculated
    // Zooming the camera preserves the center point so the zooming action drives
    // all the other point away from / towards to the center point
    //
    // The point movement vector can be find by:
    this.zoomAnchorOffset
      .copy(this.zoomAnchor)
      // Finding the relative position of the zoom anchor relative to the center
      .sub(this.offset)
      // And scaling it by the zoom change factor
      //
      // If the zoom did not change this should produce a zero vector
      .multiplyScalar(newZoom / this.zoom - 1);

    // And move the scene to preserve the zoom anchor position
    this.offset.add(this.zoomAnchorOffset);

    this.zoom = newZoom;
    this.zoomVelocity = newZoomVelocity;

    // And constrain the x and y positions so that the offset cannot move closer to the edge
    // of the scaled scene than half of the screen
    const maxX = this.scene.width / 2;
    const maxY = this.scene.height / 2;

    this.offset.x = clamp(this.offset.x, -maxX, maxX);
    this.offset.y = clamp(this.offset.y, -maxY, maxY);

    const projectionMatrix = this.camera.projectionMatrix.clone();
    // And finally update the camera
    const { frustum, offset } = this;
    this.camera.left = frustum.x + offset.x;
    this.camera.right = frustum.x + frustum.width + offset.x;
    this.camera.top = frustum.y + frustum.height + offset.y;
    this.camera.bottom = frustum.y + offset.y;
    this.camera.zoom = this.zoom;
    this.camera.updateProjectionMatrix();

    if (!projectionMatrix.equals(this.camera.projectionMatrix)) {
      this.fireZoomChangeEvent();
    }
  }
}
