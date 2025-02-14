import { Box3, Vector2, Vector3 } from "three";

import type { ComponentModel } from "./ComponentModel";
import type { GroupModel } from "./GroupModel";

export interface GroupCellProps {
  rowId: number;
  colId: number;
  textLeft?: string;
  textTop?: string;
}

/**
 * Transitive model of Cell to handle and store some data before it is going to be actually rendered
 *
 * contains the information about cell position and sizes
 */
export class GroupCell {
  public readonly position = new Vector3(); // position of Cell in the World space
  private content: Array<ComponentModel | GroupModel> = [];
  // boundix box of the content in the cell
  private contentBBox: Box3 = new Box3(new Vector3(), new Vector3());

  public readonly rowId: number;
  public readonly colId: number;
  public readonly textLeft?: string;
  public readonly textTop?: string;
  // the actual sizes in the World
  private readonly sizes = new Vector2();

  constructor(props: GroupCellProps) {
    this.rowId = props.rowId;
    this.colId = props.colId;
    this.textLeft = props.textLeft;
    this.textTop = props.textTop;
  }

  public destroy(): void {
    this.content = [];
  }

  // the bounding box to determine the sizes of the content in the Cell
  public getBoundingBox(): Box3 {
    return this.contentBBox;
  }

  // set the actual sizes of the cell
  public setSizes(width: number, height: number): void {
    this.sizes.set(width, height);
  }

  // get the actual sizes of the cell
  public getSizes(): Vector2 {
    return this.sizes;
  }

  // Don't forget to update the ContentBBox after adding an item.
  public addContent(contentItem: ComponentModel | GroupModel): void {
    this.content.push(contentItem);
  }

  public updateContentBBox(): void {
    this.contentBBox = this.content.reduce(
      (acc, content) => {
        return acc.union(content.getBoundingBox().translate(content.position));
      },
      new Box3(new Vector3(), new Vector3()),
    );
  }

  public updateContent(): void {
    this.content.forEach((content) => {
      content.position.add(this.position);
    });
  }
}
