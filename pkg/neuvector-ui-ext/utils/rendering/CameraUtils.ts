import { Vector2 } from "three";

import { abs } from "~/tools/abs";
import { ceil } from "~/tools/ceil";

// [s] Spring equation integration time step in seconds
const TIME_STEP: number = 1e-2;

// A helper function that rounds the value to zero if smaller than epsilon
const floorWithEpsilon = (value: number, epsilon = 1e-5): number => (abs(value) <= epsilon ? 0 : value);

export const spring =
  (K: number, b: number) =>
  (x: number, x0: number, v: number, dt: number): [number, number] => {
    // The initial position and velocity values for the integration
    let x1 = x;
    let v1 = v;

    // This is a very naive fixed time step numeric integration
    // but since the spring is a quite nice smooth function it's more than enough
    const numSteps = ceil(dt / TIME_STEP, 0);

    // Since dt is not necessarily a multiple of TIME_STEP we need to get the real time step
    // by dividing dt by the number of steps
    const dtStep = dt / numSteps;

    // Now integrate!
    for (let i = 0; i < numSteps; i++) {
      // Spring dynamic equation for m = 1
      const a = -K * (x1 - x0) - b * v1;

      // Numeric integration of the equation
      const dv = a * dtStep;
      const dx = (v1 + dv) * dtStep;

      // Update position and velocity
      x1 += dx;
      v1 += dv;

      // If the motion is almost still (the spring is in equlibrium and it has no kinetic energy)
      // then we can just force stop it
      if (floorWithEpsilon(v1) === 0 && floorWithEpsilon(x1 - x0) === 0) {
        return [x0, 0];
      }
    }

    return [x1, v1];
  };

export interface Point2D {
  x: number;
  y: number;
}

export interface Rectangle2D {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const rectangle = (width: number = 0, height: number = 0, x: number = 0, y: number = 0): Rectangle2D => ({
  x,
  y,
  width,
  height,
});

const CENTER: Point2D = { x: 0.5, y: 0.5 };
export const scale = (rectangle: Rectangle2D, amount: number, origin: Point2D = CENTER): Rectangle2D => {
  const { x, y, width, height } = rectangle;

  const newWidth: number = width * amount;
  const newHeight: number = height * amount;

  const dWidth: number = newWidth - width;
  const dHeight: number = newHeight - height;

  const dx: number = -dWidth * origin.x;
  const dy: number = -dHeight * origin.y;

  return {
    x: x + dx,
    y: y + dy,
    width: newWidth,
    height: newHeight,
  };
};

export const translate = (rectangle: Rectangle2D, dx: number, dy: number): Rectangle2D => ({
  ...rectangle,
  x: rectangle.x + dx,
  y: rectangle.y + dy,
});

export const normaliseCoordinates = (x: number, y: number, rectangle: Rectangle2D): Vector2 =>
  new Vector2(((x - rectangle.x) / rectangle.width) * 2 - 1, (-(y - rectangle.y) / rectangle.height) * 2 + 1);

export const denormaliseCoordinates = (nx: number, ny: number, rectangle: Rectangle2D): Point2D => ({
  x: ((nx + 1) / 2) * rectangle.width,
  y: (-(ny - 1) / 2) * rectangle.height,
});
