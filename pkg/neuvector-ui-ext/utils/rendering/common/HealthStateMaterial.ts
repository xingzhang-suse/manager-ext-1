import memoize from "lodash/memoize";
import { Color, DataTexture, FloatType, type Material, RGBAFormat, RawShaderMaterial } from "three";

import { StackVizConfig } from "../StackVizConfig";

import StackVizFragmentShader from "./shaders/StackVizFragmentShader.glsl?raw";
import StackVizVertexShader from "./shaders/StackVizVertexShader.glsl?raw";

export interface StackVizMaterialProps {
  healthStateColor: number;
  hasOpacity?: boolean;
}

/**
 * Don't use directly, use getHealthStateMaterial instead to cache the material
 */
class HealthStateMaterial extends RawShaderMaterial {
  constructor({ healthStateColor, hasOpacity = false }: StackVizMaterialProps) {
    const firstColor = new Color(healthStateColor);
    const middleColor = new Color(0xffffff);
    const secondColor = new Color(0xffffff);
    const texture = new DataTexture(
      new Float32Array([
        firstColor.r,
        firstColor.g,
        firstColor.b,
        1.0,
        middleColor.r,
        middleColor.g,
        middleColor.b,
        1.0,
        secondColor.r,
        secondColor.g,
        secondColor.b,
        1.0,
      ]),
      3,
      1,
      RGBAFormat,
      FloatType,
    );
    texture.needsUpdate = true;

    super({
      uniforms: {
        colors: {
          value: texture,
        },
        brightness: { value: hasOpacity ? StackVizConfig.COLOR_FADE : 1 },
      },
      vertexShader: StackVizVertexShader,
      fragmentShader: StackVizFragmentShader,
      vertexColors: true,
    });
  }
}

/**
 * There is no really need to clear this cache at all
 */
export const getHealthStateMaterial = memoize(
  (props: StackVizMaterialProps): Material => {
    return new HealthStateMaterial(props);
  },
  ({ healthStateColor, hasOpacity }: StackVizMaterialProps) => `${healthStateColor}-${hasOpacity}`,
);
