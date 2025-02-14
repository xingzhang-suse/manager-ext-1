import {
  type OrthographicCamera,
  type Scene,
  Vector2,
  WebGLRenderTarget,
  type WebGLRenderer,
  ShaderMaterial,
} from "three";
import { FullScreenQuad, Pass } from "three/examples/jsm/postprocessing/Pass";

import BlurFragmentShader from "./common/shaders/BlurFragmentShader.glsl?raw";
import BlurVertexShader from "./common/shaders/BlurVertexShader.glsl?raw";

export class BlurPass extends Pass {
  private readonly blurTarget = new WebGLRenderTarget(1, 1);

  constructor(
    private readonly scene: Scene,
    private readonly camera: OrthographicCamera,
    private readonly direction: Vector2,
  ) {
    super();
  }

  render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget) {
    const size = renderer.getSize(new Vector2());
    this.blurTarget.setSize(size.width, size.height);
    renderer.setRenderTarget(this.blurTarget);
    renderer.clear();
    renderer.render(this.scene, this.camera);

    const scale = (2 * this.camera.zoom) / size.width;
    const direction = this.direction.clone().multiplyScalar(scale);
    const material = new ShaderMaterial({
      uniforms: {
        tBlur: {
          value: this.blurTarget.texture,
        },
        tDiffuse: {
          value: readBuffer.texture,
        },
        dir: {
          value: direction,
        },
      },
      vertexShader: BlurVertexShader,
      fragmentShader: BlurFragmentShader,
    });

    const fsQuad = new FullScreenQuad(material);
    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
    } else {
      renderer.setRenderTarget(writeBuffer);
    }
    fsQuad.render(renderer);
  }

  dispose(): void {
    this.blurTarget.dispose();
  }
}
