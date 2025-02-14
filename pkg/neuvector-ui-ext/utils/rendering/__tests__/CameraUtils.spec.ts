import { denormaliseCoordinates, normaliseCoordinates, rectangle, scale, spring, translate } from "../CameraUtils";

describe("CameraUtils", () => {
  const ZERO_RECTANGLE = rectangle();
  const UNIT_RECTANGLE = rectangle(1, 1);
  const UNIT_CENTERED_RECTANGLE = rectangle(1, 1, -0.5, -0.5);

  describe("rectangle", () => {
    describe("when called without any arguments", () => {
      it("should create a zero width & height rectangle", () => {
        expect(rectangle()).toEqual({
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        });
      });
    });

    describe("when called with width argument", () => {
      it("should create a rectangle with specified width", () => {
        expect(rectangle(16)).toEqual({
          x: 0,
          y: 0,
          width: 16,
          height: 0,
        });
      });
    });

    describe("when called with width and height arguments", () => {
      it("should create a rectangle with specified width and height", () => {
        expect(rectangle(16, 8.5)).toEqual({
          x: 0,
          y: 0,
          width: 16,
          height: 8.5,
        });
      });
    });

    describe("when called with width, height and x arguments", () => {
      it("should create a rectangle with specified width, height and x", () => {
        expect(rectangle(16, 8.5, 4.2)).toEqual({
          x: 4.2,
          y: 0,
          width: 16,
          height: 8.5,
        });
      });
    });

    describe("when called with width, height, x and y arguments", () => {
      it("should create a rectangle with specified width, height, x and y", () => {
        expect(rectangle(16, 8.5, 4.2, -1.7)).toEqual({
          x: 4.2,
          y: -1.7,
          width: 16,
          height: 8.5,
        });
      });
    });
  });

  describe("scale", () => {
    describe("when called without an origin", () => {
      it("should scale a rectangle with its center as origin", () => {
        expect(scale(ZERO_RECTANGLE, 2)).toEqual(ZERO_RECTANGLE);
        expect(scale(ZERO_RECTANGLE, 0.5)).toEqual(ZERO_RECTANGLE);

        expect(scale(UNIT_RECTANGLE, 2)).toEqual(rectangle(2, 2, -0.5, -0.5));
        expect(scale(UNIT_RECTANGLE, 0.5)).toEqual(rectangle(0.5, 0.5, 0.25, 0.25));

        expect(scale(UNIT_CENTERED_RECTANGLE, 2)).toEqual(rectangle(2, 2, -1, -1));
        expect(scale(UNIT_CENTERED_RECTANGLE, 0.5)).toEqual(rectangle(0.5, 0.5, -0.25, -0.25));
      });
    });

    describe("when called with an origin", () => {
      it("should scale a rectangle with origin", () => {
        expect(scale(ZERO_RECTANGLE, 2, { x: 0, y: 0 })).toEqual(ZERO_RECTANGLE);
        expect(scale(ZERO_RECTANGLE, 2, { x: 1, y: 1 })).toEqual(ZERO_RECTANGLE);

        expect(scale(UNIT_RECTANGLE, 2, { x: 0, y: 0 })).toEqual(rectangle(2, 2, 0, 0));
        expect(scale(UNIT_RECTANGLE, 2, { x: 0.5, y: 0.5 })).toEqual(rectangle(2, 2, -0.5, -0.5));
        expect(scale(UNIT_RECTANGLE, 2, { x: 1, y: 1 })).toEqual(rectangle(2, 2, -1, -1));

        expect(scale(UNIT_CENTERED_RECTANGLE, 2, { x: 0, y: 0 })).toEqual(rectangle(2, 2, -0.5, -0.5));
        expect(scale(UNIT_CENTERED_RECTANGLE, 2, { x: 0.5, y: 0.5 })).toEqual(rectangle(2, 2, -1, -1));
        expect(scale(UNIT_CENTERED_RECTANGLE, 2, { x: 1, y: 1 })).toEqual(rectangle(2, 2, -1.5, -1.5));
      });
    });
  });

  describe("translate", () => {
    it("should translate a rectangle", () => {
      expect(translate(UNIT_RECTANGLE, 2, -1)).toEqual(rectangle(1, 1, 2, -1));
      expect(translate(translate(UNIT_RECTANGLE, 2, -1), -2, 1)).toEqual(UNIT_RECTANGLE);
    });
  });

  describe("normaliseCoordinates", () => {
    const FRAME = rectangle(640, 480, 0, 0);

    it("should transform absolute coordinates into [-1, 1] relative coordinates", () => {
      expect(normaliseCoordinates(0, 0, FRAME)).toEqual({ x: -1, y: 1 });
      expect(normaliseCoordinates(320, 240, FRAME)).toEqual({ x: 0, y: 0 });
      expect(normaliseCoordinates(640, 480, FRAME)).toEqual({ x: 1, y: -1 });
      expect(normaliseCoordinates(640, 0, FRAME)).toEqual({ x: 1, y: 1 });
      expect(normaliseCoordinates(160, -240, FRAME)).toEqual({ x: -0.5, y: 2 });
    });
  });

  describe("denormaliseCoordinates", () => {
    const FRAME = rectangle(640, 480, 0, 0);

    it("should transform [-1, 1] relative coordinates into absolute coordinates", () => {
      expect(denormaliseCoordinates(-1, 1, FRAME)).toEqual({ x: 0, y: -0 });
      expect(denormaliseCoordinates(0, 0, FRAME)).toEqual({ x: 320, y: 240 });
      expect(denormaliseCoordinates(1, -1, FRAME)).toEqual({ x: 640, y: 480 });
      expect(denormaliseCoordinates(1, 1, FRAME)).toEqual({ x: 640, y: -0 });
      expect(denormaliseCoordinates(-0.5, 2, FRAME)).toEqual({ x: 160, y: -240 });
    });
  });

  describe("spring", () => {
    describe("with no damping", () => {
      // F = 100 * x
      const undampedSpring = spring(100, 0);

      it("should oscilate forever", () => {
        expect(undampedSpring(0, 1, 0, 100)).not.toEqual([1, 0]);
        expect(undampedSpring(0, 1, 0, 1000)).not.toEqual([1, 0]);
        expect(undampedSpring(0, 1, 0, 10000)).not.toEqual([1, 0]);
      });
    });

    describe("with damping", () => {
      // F = 100 * x
      const dampedSpring = spring(100, 50);

      it("should stop oscilating", () => {
        expect(dampedSpring(0, 1, 0, 100)).toEqual([1, 0]);
      });
    });
  });
});
