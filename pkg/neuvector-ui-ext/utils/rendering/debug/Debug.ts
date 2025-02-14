import { GUI } from "lil-gui";

import type { StackVizContext } from "../StackVizContext";

export class Debug {
  private readonly active = window.location.hash.endsWith("#debug");
  private readonly stackVizContext: StackVizContext;
  public gui: GUI | undefined;

  constructor(stackVizContext: StackVizContext) {
    this.stackVizContext = stackVizContext;
    if (this.isActive()) {
      this.gui = new GUI({
        width: 600,
        title: "Topology Visualiser",
      });
    }
  }

  public isActive(): boolean {
    return this.active;
  }

  public destroy(): void {
    this.gui?.destroy();
  }
}
