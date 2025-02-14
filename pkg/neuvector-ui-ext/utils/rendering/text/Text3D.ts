import { Sprite, SpriteMaterial } from "three";

import { StackVizConfig } from "../StackVizConfig";

import { type TextMetaData, type TextOptions, getTextTextureData } from "./TextTexturesCache";

export class Text3D extends Sprite {
  private readonly textMetaData: TextMetaData;

  constructor(text: string, textOptions: TextOptions, rotation = 0) {
    super();

    const { texture, meta } = getTextTextureData(text, textOptions);
    this.textMetaData = meta;
    this.material = new SpriteMaterial({
      map: texture,
      rotation: rotation, // Rotation the sprites in threejs works only if we rotate a sprite's material
      transparent: true,
      opacity: textOptions.hasOpacity ? StackVizConfig.COLOR_FADE : 1,
    });

    const wrappedLineAdjustedHeight = textOptions.givenHeight * meta.numberOfTextLines;
    this.scale.set((meta.width * wrappedLineAdjustedHeight) / meta.height, wrappedLineAdjustedHeight, 1);
    this.addEventListener("removed", this.destroy);
  }

  public numberOfTextLines(): number {
    return this.textMetaData.numberOfTextLines;
  }

  public destroy(): void {
    // texture is handled by TextTexturesCaches
    this.material.dispose();
    this.removeEventListener("removed", this.destroy);
  }
}
