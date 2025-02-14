import isEqual from "lodash/isEqual";

import { CAMERA_DEFAULT_PARAMETERS, type CameraParameters } from "../Camera";

// just a place to store Camera parameters
// used to store it from going out of visualiser (visualiser is destroyed) and back
let storage: CameraParameters = CAMERA_DEFAULT_PARAMETERS;

export const restoreCameraParameters = (): CameraParameters => {
  const parameters = storage || CAMERA_DEFAULT_PARAMETERS;
  storage = CAMERA_DEFAULT_PARAMETERS;
  return parameters;
};

/**
 * Don't store parameters if the are equal to the default one
 * that's done to avoid the first time render of newly created topology
 */
export const storeCameraParameters = (parameters: CameraParameters): void => {
  if (!isEqual(parameters, CAMERA_DEFAULT_PARAMETERS)) {
    storage = parameters;
  }
};
