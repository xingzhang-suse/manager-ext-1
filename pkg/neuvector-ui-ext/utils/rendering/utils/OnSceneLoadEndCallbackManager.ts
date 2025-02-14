import type { ViewComponent } from "../../../common/CoreApi";
import type { StackVizContext } from "../StackVizContext";

/**
 * Experimental, this place stores the callbacks which should be invoked after the topology loading is complete
 */

type OnLoadCallback = (context: StackVizContext) => void;

let callbacks: Array<OnLoadCallback> = [];

export const resetVisualiserCamera = (): void => {
  callbacks.push(resetVisualiserCameraCallback);
};

const resetVisualiserCameraCallback = (context: StackVizContext): void => {
  context.camera.reset();
};

export const lightOnComponent = (viewElement: ViewComponent): void => {
  callbacks.push((context: StackVizContext) => {
    context.world.lightOn(viewElement);
  });
};

/**
 * invokes all stored callbacks and cleans them
 */
export const triggerOnLoadCallbacks = (context: StackVizContext): void => {
  callbacks.forEach((callback) => callback(context));
  callbacks = [];
};
