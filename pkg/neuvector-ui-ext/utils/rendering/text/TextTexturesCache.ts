import { LinearFilter, SRGBColorSpace, Texture } from "three";

import { StackVizConfig } from "../StackVizConfig";

import { TextCanvasBuilder } from "./TextCanvasBuilder";

export interface TextMetaData {
  numberOfTextLines: number; // number of resulted lines
  width: number;
  height: number;
}

export interface TextTextureData {
  texture: Texture;
  meta: TextMetaData;
}

export interface TextOptions {
  font?: string;
  color?: number;
  givenHeight: number;
  maxWidthScale: number;
  maxTextLines: number;
  centered?: boolean;
  hasOpacity?: boolean;
}

const buildKey = (
  text: string,
  font: string,
  color: number,
  givenHeight: number,
  maxTextLines: number,
  maxWidthScale: number,
  centered: boolean,
): string => {
  return `${text}F${font}C${color}gH${givenHeight}mTl${maxTextLines}mWS${maxWidthScale}C${centered}`;
};

/**
 * Stores texture and text's metadata based on text options
 */
const cache = new Map<string, TextTextureData>();

export const getTextTextureData = (
  text: string,
  {
    font = StackVizConfig.FONT,
    color = StackVizConfig.FONT_COLOR,
    givenHeight,
    maxTextLines,
    maxWidthScale,
    centered = true,
  }: TextOptions,
): TextTextureData => {
  const key = buildKey(text, font, color, givenHeight, maxTextLines, maxWidthScale, centered);
  let result = cache.get(key);
  if (!result) {
    const { canvas, numberOfTextLines } = new TextCanvasBuilder(text, font, color, centered).fitInCanvas(
      givenHeight,
      maxWidthScale,
      maxTextLines,
    );
    const texture = new Texture(canvas);
    texture.generateMipmaps = false;
    texture.minFilter = LinearFilter;
    texture.needsUpdate = true;
    texture.colorSpace = SRGBColorSpace;

    result = {
      texture,
      meta: {
        numberOfTextLines,
        height: canvas.height,
        width: canvas.width,
      },
    };

    cache.set(key, result);
  }
  return result;
};

export const clearTextTexturesCache = (): void => {
  cache.forEach(({ texture }) => {
    texture.dispose();
  });
  cache.clear();
};
