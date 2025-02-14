/**
 * @author mrdoob / http://mrdoob.com/
 * @author jetienne / http://jetienne.com/
 */
import type { WebGLRenderer } from "three";
/**
 * provide info on THREE.WebGLRenderer
 *
 * @param {Object} renderer the renderer to update
 * @param {Object} Camera the camera to update
 */
export class RendererStats {
  private lastTime = Date.now();
  private readonly container = document.createElement("div");
  private readonly msDiv = document.createElement("div");
  private readonly msText = document.createElement("div");
  private readonly msTexts: Array<HTMLDivElement> = [];
  private readonly nLines = 9;

  constructor() {
    this.container.style.cssText = "width:80px;opacity:0.9;cursor:pointer";

    this.msDiv.style.cssText = "padding:0 0 3px 3px;text-align:left;background-color:#200;";
    this.container.appendChild(this.msDiv);

    this.msText.style.cssText =
      "color:#f00;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";
    this.msText.innerHTML = "WebGLRenderer";
    this.msDiv.appendChild(this.msText);

    for (let i = 0; i < this.nLines; i++) {
      this.msTexts[i] = document.createElement("div");
      this.msTexts[i].style.cssText =
        "color:#f00;background-color:#311;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";
      this.msDiv.appendChild(this.msTexts[i]);
      this.msTexts[i].innerHTML = "-";
    }
  }

  get domElement(): HTMLElement {
    return this.container;
  }

  update(webGLRenderer: WebGLRenderer): void {
    // refresh only 30time per second
    if (Date.now() - this.lastTime < 1000 / 30) return;
    this.lastTime = Date.now();

    let i = 0;
    this.msTexts[i++].textContent = "== Memory =====";
    this.msTexts[i++].textContent = `Geometries: ${webGLRenderer.info.memory.geometries}`;
    this.msTexts[i++].textContent = `Textures: ${webGLRenderer.info.memory.textures}`;

    this.msTexts[i++].textContent = "== Render =====";
    this.msTexts[i++].textContent = `Calls: ${webGLRenderer.info.render.calls}`;
    this.msTexts[i++].textContent = `Points: ${webGLRenderer.info.render.points}`;
    this.msTexts[i++].textContent = `Lines: ${webGLRenderer.info.render.lines}`;

    this.msTexts[i++].textContent = "== Programs =====";
    this.msTexts[i++].textContent = `Number of programs: ${webGLRenderer.info.programs?.length}`;
  }
}
