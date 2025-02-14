import range from "lodash/range";

import { abs } from "~/tools/abs";
import { max } from "~/tools/max";
import { sum } from "~/tools/sum";

import type { VizVertexGroup } from "../RenderInput";
import { StackVizConfig } from "../StackVizConfig";

import { GroupCell } from "./GroupCell";

interface GroupGridCell {
  cell: GroupCell;
  rowIdx: number;
  colIdx: number;
}

/**
 * Transitive model of Grid to handle and store some data before it is going to be actually rendered
 *
 * contains the information about cells and the sizes of the whole Grid
 */
export class GroupGrid {
  private _cells: Array<Array<GroupCell>> = [];
  private readonly lookupMap = new Map<string, GroupCell>(); // string based on `${rowId}-${colId}`
  private _width: number;
  private _height: number;

  constructor(rowGroups: Array<VizVertexGroup> = [], colGroups: Array<VizVertexGroup> = []) {
    if (rowGroups.length === 0 || colGroups.length === 0) {
      this._cells = [[]];
    } else {
      this._cells = rowGroups.map((row, rowIdx) =>
        colGroups.map(
          (col, colIdx) =>
            new GroupCell({
              rowId: row.id,
              colId: col.id,
              textLeft: colIdx === 0 ? row.name : "",
              textTop: rowIdx === rowGroups.length - 1 ? col.name : "",
            }),
        ),
      );
    }

    for (const row of this._cells) {
      for (const cell of row) {
        this.lookupMap.set(buildLookUpKey(cell.rowId, cell.colId), cell);
      }
    }
  }

  public destroy(): void {
    this.lookupMap.forEach((cell) => {
      cell.destroy();
    });
    this._cells = [];
    this.lookupMap.clear();
  }

  private updateCellPositions(): void {
    const rowHeights = this.rows().map(({ cells }) => {
      return max(
        StackVizConfig.MIN_CELL_HEIGHT,
        cells
          .flatMap(({ cell }) => {
            const box = cell.getBoundingBox();

            return [box.min.y, box.max.y];
          })
          .map((y) => abs(y * 2) + StackVizConfig.CELL_VMARGIN),
      );
    });

    const colWidths = this.cols().map(({ cells }) => {
      return max(
        StackVizConfig.MIN_CELL_WIDTH,
        cells
          .flatMap(({ cell }) => {
            const box = cell.getBoundingBox();

            return [box.min.x, box.max.x];
          })
          .map((x) => abs(x * 2) + StackVizConfig.CELL_HMARGIN),
      );
    });

    this._width = sum(colWidths);
    this._height = sum(rowHeights);
    // position cells from bottom left to top right
    let curTop = -this._height / 2;
    for (let rowIdx = 0; rowIdx < this._cells.length; rowIdx++) {
      let curLeft = -this._width / 2;
      const cellHeight = rowHeights[rowIdx];

      for (let colIdx = 0; colIdx < this._cells[rowIdx].length; colIdx++) {
        const cell = this._cells[rowIdx][colIdx];
        const cellWidth = colWidths[colIdx];

        cell.position.set(curLeft + cellWidth / 2, curTop + cellHeight / 2, 0);
        cell.setSizes(cellWidth, cellHeight);

        curLeft += cellWidth;
      }

      curTop += cellHeight;
    }
  }

  public width(): number {
    return this._width;
  }

  public height(): number {
    return this._height;
  }

  rows(): Array<{ rowIdx: number; cells: Array<GroupGridCell> }> {
    return range(this.rowCount()).map((rowIdx) => ({
      rowIdx: rowIdx,
      cells: this.row(rowIdx),
    }));
  }

  rowCount(): number {
    return this._cells.length;
  }

  cols(): Array<{ colIdx: number; cells: Array<GroupGridCell> }> {
    return range(0, this.colCount()).map((colIdx) => ({
      colIdx: colIdx,
      cells: this.col(colIdx),
    }));
  }

  colCount(): number {
    return this._cells.length > 0 ? this._cells[0].length : 0;
  }

  row(rowIdx: number): Array<GroupGridCell> {
    return this._cells[rowIdx].map((cell, colIdx) => ({
      cell: cell,
      rowIdx: rowIdx,
      colIdx: colIdx,
    }));
  }

  col(colIdx: number): Array<GroupGridCell> {
    return this._cells.map((rowCells, rowIdx) => ({
      cell: rowCells[colIdx],
      rowIdx: rowIdx,
      colIdx: colIdx,
    }));
  }

  public cellByIdx(rowIdx: number, colIdx: number): GroupCell | undefined {
    return this._cells[rowIdx]?.[colIdx];
  }

  public cellById(rowId: number, colId: number): GroupCell | undefined {
    return this.lookupMap.get(buildLookUpKey(rowId, colId));
  }

  public getLookupMap(): Map<string, GroupCell> {
    return this.lookupMap;
  }

  public getCells(): Array<Array<GroupCell>> {
    return this._cells;
  }

  /**
   * Update the information about the contained cells
   * update their boundedBox,
   * set the world position for each cell,
   * update content in the each cell
   */
  public setup(): void {
    this.lookupMap.forEach((cell) => cell.updateContentBBox());
    this.updateCellPositions();

    this.lookupMap.forEach((cell) => {
      cell.updateContent();
    });
  }
}

const buildLookUpKey = (rowId: number, colId: number): string => {
  return `${rowId}-${colId}`;
};
