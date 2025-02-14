import Stats from "stats.js";

import { DisposableCollection } from "../../../common/DisposableCollection";
import type { StackVizContext } from "../StackVizContext";

import { RendererStats } from "./RendererStats";

/**
 * display stats in debug mode
 * Performance Monitor in top left corner
 * Renderer stats in bottom left corner
 */
export class DebugStats {
  private readonly streams = new DisposableCollection();
  private readonly stackVizContext: StackVizContext;
  private readonly stats: Stats;
  private readonly rendererStats: RendererStats;

  constructor(stackVizContext: StackVizContext) {
    this.stackVizContext = stackVizContext;

    if (this.stackVizContext.debug.isActive()) {
      this.stats = new Stats();

      // Align top-left
      this.stats.dom.style.position = "absolute";
      this.stats.dom.style.left = "0px";
      this.stats.dom.style.top = "0px";
      this.stackVizContext.domElement.appendChild(this.stats.dom);

      this.rendererStats = new RendererStats();
      this.rendererStats.domElement.style.position = "absolute";
      this.rendererStats.domElement.style.left = "0px";
      this.rendererStats.domElement.style.bottom = "0px";
      this.rendererStats.domElement.style.width = "120px";
      this.stackVizContext.domElement.appendChild(this.rendererStats.domElement);

      this.streams.add(
        this.stackVizContext.worldTime.tick.subscribe(() => {
          this.update();
        }),
      );
    }
  }

  private update() {
    this.stats.update();
    const renderer = this.stackVizContext.renderer.webGLRenderer;

    if (renderer != null) {
      this.rendererStats.update(renderer);
    }
  }
}
