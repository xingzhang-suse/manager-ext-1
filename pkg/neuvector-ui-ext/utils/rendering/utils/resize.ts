/**
 * Since opening the LHS and RHS panes causes canvas to resize,
 * we are forced to check the resize on each frame in order to provide the smooth experience to the user
 * As soon as this requirement will be gone it's better to go back to use the resize event
 *
 *
 * Responsive smooth resize
 * Idea from here https://threejsfundamentals.org/threejs/lessons/threejs-responsive.html
 */
import type { WebGLRenderer } from "three";

import { min } from "~/tools/min";

import type { Camera } from "../Camera";

// the renderer might be undefined in certain environments (as tests)
// but in the browser we assume it is always defined in sake of simplicity
export const checkResizeRenderer = (renderer: undefined | WebGLRenderer, camera: Camera): void => {
  if (renderer == null) {
    return;
  }

  const canvas = renderer.domElement;
  const pixelRatio = min(2, window.devicePixelRatio);
  const width = (canvas.clientWidth * pixelRatio) | 0; // fastest way to convert to the integer
  const height = (canvas.clientHeight * pixelRatio) | 0;
  if (canvas.width !== width || canvas.height !== height) {
    renderer.setSize(width, height, false);
    camera.setViewportSize(canvas.clientWidth, canvas.clientHeight);
  }
};
