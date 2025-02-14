import { Vector2, WebGLRenderer } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader";

import { Logger } from "~/tools/logger";

import { BlurPass } from "./BlurPass";
import { StackVizConfig } from "./StackVizConfig";
import type { StackVizContext } from "./StackVizContext";

export class Renderer {
  private readonly logger = Logger.namespace("Renderer");
  public readonly webGLRenderer: undefined | WebGLRenderer;

  private readonly stackVizContext: StackVizContext;

  constructor(stackVizContext: StackVizContext) {
    this.stackVizContext = stackVizContext;

    // 10 attempts to instantiate the WebGLRenderer
    let attempts = 10;
    while (!this.webGLRenderer && 0 < attempts) {
      try {
        this.webGLRenderer = new WebGLRenderer({
          canvas: this.stackVizContext.domElement.firstElementChild as HTMLCanvasElement,
          antialias: true,
          stencil: false,
          alpha: true,
        });
        if (this.stackVizContext.isInteractionMode()) {
          this.webGLRenderer.setClearColor(StackVizConfig.DEFAULT_BG_COLOR);
        } else {
          this.webGLRenderer.setClearColor(StackVizConfig.PREVIEW_BG_COLOR);
        }
      } catch (exception) {
        this.logger.warn("Error while instantiating WebGLRenderer.", exception);
      } finally {
        attempts -= 1;
      }
    }
    if (!this.webGLRenderer) {
      this.logger.error("Unable to instantiate WebGLRenderer after several attempts.");
      return;
    }
  }

  /**
   * update renderer on each tick
   */
  public update(): void {
    const renderer = this.webGLRenderer;
    if (renderer) {
      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(this.stackVizContext.world.getThreeScene(), this.stackVizContext.camera.camera));
      const horizontalPass = new BlurPass(
        this.stackVizContext.world.getMask(),
        this.stackVizContext.camera.camera,
        new Vector2(1.0, 0.0),
      );
      const verticalPass = new BlurPass(
        this.stackVizContext.world.getMask(),
        this.stackVizContext.camera.camera,
        new Vector2(0.0, 1.0),
      );
      composer.addPass(horizontalPass);
      composer.addPass(verticalPass);
      composer.addPass(new ShaderPass(GammaCorrectionShader));
      composer.render();
      composer.dispose();
      horizontalPass.dispose();
      verticalPass.dispose();
    }
  }

  public destroy(): void {
    this.webGLRenderer?.dispose();
  }
}
