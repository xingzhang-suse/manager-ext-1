import range from "lodash/range";

import { viewComponentBuilder } from "../../../../test/common/builders/viewElement";
import { ComponentModel } from "../model/ComponentModel";
import { GroupGrid } from "../model/GroupGrid";
import { DimensionType } from "../RenderInput";
import { StackVizConfig } from "../StackVizConfig";

describe("GroupGrid", () => {
  it("should return correct row and col count", () => {
    const grid = createGrid(4, 3);

    expect(grid.rowCount()).toBe(4);
    expect(grid.colCount()).toBe(3);
  });

  it("should update cell's contentBBox content is added and fits the existing size", () => {
    const grid = createGrid(1, 1);
    const cell = grid.getCells()[0][0];

    cell.addContent(new ComponentModel(viewComponentBuilder(), 0));

    grid.setup();
    expect(cell.getSizes()).toEqual({
      x: 4,
      y: 4,
    });
    expect(grid.width()).toEqual(4);
    expect(grid.height()).toEqual(4);
  });

  it("should grow the grid based on the contents of a cell", () => {
    const grid = createGrid(3, 3);
    const middleCell = grid.row(1)[1].cell;

    middleCell.addContent(new ComponentModel(viewComponentBuilder(), 0));
    grid.setup();

    expect(middleCell.getSizes()).toEqual({
      x: 4,
      y: 4,
    });

    grid.getCells().forEach((row, rowIdx) => {
      row.forEach((cell, colIdx) => {
        const expectedColWidth = colIdx === 1 ? 4 : 1;
        const expectedRowHeight = rowIdx === 1 ? 4 : 1;
        expect(cell.getSizes()).toEqual({
          x: expectedColWidth,
          y: expectedRowHeight,
        });
      });
    });
  });
});

StackVizConfig.MIN_CELL_WIDTH = 1;
StackVizConfig.MIN_CELL_HEIGHT = 1;
StackVizConfig.CELL_VMARGIN = 0;
StackVizConfig.CELL_HMARGIN = 0;

function createGrid(rowCount: number, colCount: number): GroupGrid {
  const rows = range(rowCount).map((rowIdx) => ({
    id: rowIdx,
    type: DimensionType.LAYER,
    name: `Row${rowIdx}`,
  }));
  const cols = range(colCount).map((colIdx) => ({
    id: colIdx,
    type: DimensionType.DOMAIN,
    name: `Col${colIdx}`,
  }));
  return new GroupGrid(rows, cols);
}
