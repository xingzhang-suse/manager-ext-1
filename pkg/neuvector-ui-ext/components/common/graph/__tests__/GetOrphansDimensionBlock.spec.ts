import range from "lodash/range";

import { getOrphansDimensionBlock } from "../algos/hierarchical/orphans";

describe("Get orphans dimensions block", () => {
  it("the dimensions must always be greater than 1 and less than Number.POSITIVE_INFINITY", () => {
    for (let xRatio = 1; xRatio <= 10; xRatio++) {
      for (let yRatio = 1; yRatio <= 10; yRatio++) {
        for (let orphansInGroup = 1; orphansInGroup <= 10; orphansInGroup++) {
          for (let layersInGroup = 1; layersInGroup <= 10; layersInGroup++) {
            const { orphanWidth, orphanHeight } = getOrphansDimensionBlock(
              xRatio,
              yRatio,
              orphansInGroup,
              layersInGroup,
            );

            expect(orphanWidth).toBeLessThan(Number.POSITIVE_INFINITY);
            expect(orphanHeight).toBeLessThan(Number.POSITIVE_INFINITY);

            expect(orphanWidth).toBeGreaterThanOrEqual(1);
            expect(orphanHeight).toBeGreaterThanOrEqual(1);
          }
        }
      }
    }
  });

  describe.each(range(1, 11))("when orphansInGroup is %s", (orphansInGroup) => {
    const xRatio = 1;
    const yRatio = 1;

    it.each(range(0, 11))(
      "the ratio should be maintained while giving the proper dimensions for layersInGroup equal to %s",
      (layersInGroup) => {
        const { orphanWidth, orphanHeight } = getOrphansDimensionBlock(xRatio, yRatio, orphansInGroup, layersInGroup);
        expect(orphanWidth * orphanHeight).toBeGreaterThanOrEqual(orphansInGroup);
      },
    );

    it.each(range(0, orphansInGroup))(
      "scaled width is less or equal to orphan width for layersInGroup equal to %s",
      (layersInGroup) => {
        const { orphanWidth, orphanHeight } = getOrphansDimensionBlock(xRatio, yRatio, orphansInGroup, layersInGroup);

        const scaledResultWidth = (xRatio * orphanHeight) / yRatio;
        expect(scaledResultWidth).toBeLessThanOrEqual(orphanWidth);
      },
    );
  });
});
