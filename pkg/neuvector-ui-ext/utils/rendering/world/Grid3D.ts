import {
  Box3,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Quaternion,
  SRGBColorSpace,
  Sprite,
  SpriteMaterial,
  TextureLoader,
  Vector3,
} from "three";

import { PI } from "~/tools/trigonometry";

import type { LockReason } from "../../../components/react/context-menu/ContextMenuLockedContent";
import { Edition } from "../../../generated/CoreApiDtos";
import { getMeshBasicMaterial } from "../common/BasicMaterials";
import { LOD_LEVEL_HIGH, type LodLevel } from "../LodLevel";
import type { GroupGrid } from "../model/GroupGrid";
import { StackVizConfig } from "../StackVizConfig";
import type { StackVizContext } from "../StackVizContext";
import { Text3D } from "../text/Text3D";
import { TextCanvasBuilder } from "../text/TextCanvasBuilder";
import { cleanupResources } from "../utils/Util3d";

import lockIcon from "./lock.svg";

const textureLoader = new TextureLoader();
const lockIconTexture = textureLoader.load(lockIcon);
lockIconTexture.colorSpace = SRGBColorSpace;
const lockIconMaterial = new SpriteMaterial({ map: lockIconTexture, transparent: true });
const lockIconSprite = new Sprite(lockIconMaterial);
lockIconSprite.scale.set(1.2 * StackVizConfig.COMPONENT_ICON_SIZE, StackVizConfig.COMPONENT_ICON_SIZE, 1);

const PLANE_GEOMETRY = new PlaneGeometry(1, 1);

export interface MaskedLayer {
  _type: "MaskedLayer";
  lockReason: LockReason;
  boundingBox: Box3;
}

export function isMaskedLayer(a: any): a is MaskedLayer {
  return a && a._type === "MaskedLayer";
}

/**
 * This class is responsible to render the Grid with cells
 */
export class Grid3D {
  private readonly grid: GroupGrid;
  private readonly stackVizContext: StackVizContext;
  private readonly mesh: Group = new Group();
  private readonly labels: Group = new Group();
  private readonly mask: Group = new Group();

  constructor(stackVizContext: StackVizContext, grid: GroupGrid) {
    // setup
    this.grid = grid;
    this.stackVizContext = stackVizContext;

    // render/add to scene
    this.render();
  }

  public destroy(): void {
    cleanupResources(this.mesh);
    cleanupResources(this.mask);
  }

  /**
   * the Grid consists of the simple 2d plane and the lattice(or grid lines) over it
   * also it renders the labels of cells
   */
  private render(): void {
    this.renderPlane();
    this.renderExtendedPlanes();
    this.renderGridLines();
    this.renderLabels();
    this.stackVizContext.world.getThreeScene().add(this.mesh);

    if (this.stackVizContext.edition === Edition.Community) {
      this.blurExtendedPlanes();
      this.stackVizContext.world.getMask().add(this.mask);
    }
  }

  private renderPlane(): void {
    const planeMaterial = getMeshBasicMaterial(StackVizConfig.GRID_COLOR_PRIMARY);
    const plane = new Mesh(PLANE_GEOMETRY, planeMaterial);
    plane.scale.set(this.grid.width(), this.grid.height(), 1);
    this.mesh.add(plane);
  }

  private renderExtendedPlanes(): void {
    const planeMaterial = getMeshBasicMaterial(StackVizConfig.GRID_COLOR_EXTENDED);
    const startingPoint = new Vector3(0, -this.grid.height() / 2, 0);

    for (const [firstCell] of this.grid.getCells()) {
      const { height } = firstCell.getSizes();

      if (firstCell.rowId < 0) {
        const plane = new Mesh(PLANE_GEOMETRY, planeMaterial);

        plane.scale.set(this.grid.width(), height, 1);
        plane.position.set(0, startingPoint.y + height / 2, 0.000001);

        this.mesh.add(plane);
      }

      startingPoint.setY(startingPoint.y + height);
    }
  }

  public blurExtendedPlanes(): void {
    const material = new MeshBasicMaterial({
      color: 0x000000,
    });
    const startingPoint = new Vector3(0, -this.grid.height() / 2, 0);

    for (const [firstCell] of this.grid.getCells()) {
      const { height } = firstCell.getSizes();

      if (firstCell.rowId < 0) {
        const plane = new Mesh(PLANE_GEOMETRY, material);
        plane.userData.layer = {
          _type: "MaskedLayer",
          lockReason: firstCell.rowId === -1 ? "incoming" : "outgoing",
          boundingBox: new Box3(
            new Vector3(0, startingPoint.y, 5),
            new Vector3(this.grid.width(), startingPoint.y + height, 5),
          ),
        } satisfies MaskedLayer;

        plane.scale.set(this.grid.width(), height, 1);
        plane.position.set(0, startingPoint.y + height / 2, 5);
        this.mask.add(plane);
      }

      startingPoint.setY(startingPoint.y + height);
    }
  }

  /**
   * To render grid lines we use here an InstancedMesh which consists of
   * horizontally and vertically scaled planes to mimic the lines of the grid
   */
  private renderGridLines(): void {
    const gridLinesMaterial = new MeshBasicMaterial({
      color: StackVizConfig.GRID_CELL_BORDER_COLOR,
    });
    const horizontalScale = new Vector3(this.grid.width(), 0.1, 1);
    const verticalScale = new Vector3(0.1, this.grid.height(), 1);

    const cells = this.grid.getCells();
    const rowLength = cells.length - 1; // 1 less, because we render lines only in between
    const colLength = cells[0].length - 1; // 1 less, because we render lines only in between
    const gridLines = new InstancedMesh(PLANE_GEOMETRY, gridLinesMaterial, rowLength + colLength);
    const startingPoint = new Vector3(0, -this.grid.height() / 2, 0);
    // render lines from left to right
    for (let rowIndex = 0; rowIndex < rowLength; rowIndex++) {
      const { height } = cells[rowIndex][0].getSizes();
      startingPoint.setY(startingPoint.y + height);
      gridLines.setMatrixAt(rowIndex, prepareMatrix(startingPoint, horizontalScale));
    }
    // render lines from bottom to top
    startingPoint.set(-this.grid.width() / 2, 0, 0);
    for (let colIndex = 0; colIndex < colLength; colIndex++) {
      const { width } = cells[0][colIndex].getSizes();
      startingPoint.setX(startingPoint.x + width);
      gridLines.setMatrixAt(rowLength + colIndex, prepareMatrix(startingPoint, verticalScale));
    }

    gridLines.translateZ(0.0001); // to be sure it renders over the plane
    this.mesh.add(gridLines);
  }

  private renderLabels(): void {
    this.grid.getLookupMap().forEach((cell) => {
      const { x: width, y: height } = cell.getSizes();
      if (cell.textLeft) {
        const leftText3D = new Text3D(
          cell.textLeft,
          {
            givenHeight: StackVizConfig.COMPONENT_HEIGHT / 2.5,
            maxWidthScale: height * StackVizConfig.GROUP_CELL_TEXT_ROOM,
            maxTextLines: 1,
          },
          PI / 2,
        );
        const x =
          0 -
          width / 2 -
          1 / TextCanvasBuilder.SINGLE_LINE_MODIFIER -
          StackVizConfig.GROUP_CELL_TEXT_DISTANCE_FROM_LINE;
        leftText3D.position.set(x, 0, 0).add(cell.position);
        this.labels.add(leftText3D);

        if (cell.rowId < 0 && this.stackVizContext.edition === Edition.Community) {
          const icon = lockIconSprite.clone();
          icon.position
            .set(x, -leftText3D.scale.getComponent(1) - StackVizConfig.COMPONENT_ICON_SIZE, 0)
            .add(cell.position);
          leftText3D.position.add(new Vector3(0, StackVizConfig.COMPONENT_ICON_SIZE, 0));
          this.labels.add(icon);
        }
      }

      if (cell.textTop) {
        const topText3D = new Text3D(cell.textTop, {
          givenHeight: StackVizConfig.COMPONENT_HEIGHT / 2.5,
          maxWidthScale: width * StackVizConfig.GROUP_CELL_TEXT_ROOM,
          maxTextLines: 1,
        });
        const y =
          height / 2 + 1 / TextCanvasBuilder.SINGLE_LINE_MODIFIER + StackVizConfig.GROUP_CELL_TEXT_DISTANCE_FROM_LINE;

        topText3D.position.set(0, y, 0).add(cell.position);
        this.labels.add(topText3D);
      }
    });

    this.mesh.add(this.labels);
  }

  public lodUpdate(lod: LodLevel): void {
    this.labels.visible = lod === LOD_LEVEL_HIGH;
  }
}

const dummyQuaternion = new Quaternion();
const prepareMatrix = (position: Vector3, scale: Vector3): Matrix4 => {
  const matrix = new Matrix4();
  matrix.compose(position, dummyQuaternion, scale);
  return matrix;
};
