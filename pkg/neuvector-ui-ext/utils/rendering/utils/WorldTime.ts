import { Subject } from "rxjs";
import { Clock } from "three";

/**
 * The purpose of this class is handling the requestAnimationFrame and keep track of time
 * provides the subject `tick` which triggers on each animation frame
 * clock - for more info see https://threejs.org/docs/index.html#api/en/core/Clock
 *
 */
export class WorldTime {
  public readonly clock: Clock; // for now we use the build in THREE.js' Clock class, but we might consider our own implementation
  public readonly tick: Subject<void>;
  private lastAnimationFrameId: number | undefined;

  constructor() {
    this.clock = new Clock();
    this.tick = new Subject();

    this.lastAnimationFrameId = window.requestAnimationFrame(() => {
      this.update();
    });
  }

  private update(): void {
    this.tick.next();
    this.lastAnimationFrameId = window.requestAnimationFrame(() => {
      this.update();
    });
  }

  public destroy(): void {
    if (this.lastAnimationFrameId) {
      cancelAnimationFrame(this.lastAnimationFrameId);
      this.lastAnimationFrameId = undefined;
    }
    this.clock.stop();
  }
}
