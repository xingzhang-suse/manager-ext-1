import { Color } from "three";

import { ceil } from "~/tools/ceil";
import { max } from "~/tools/max";

import { breakText, textMeasureCanvas } from "./CanvasTextUtil";

/**
 * Builds a canvas with text, limited to given sizes.
 * Wraps text to new lines if necessary, with a possible maximum number of lines
 *
 * -------------------------- ******** ------------------------------
 * IMPORTANT_NOTE - atm the size(font size) of the displayed depends on the height/width ratio, passed as a parameters
 * in `fitInCanvas` function
 * and
 * ABSOLUTELY not related to the FONT_SIZE used in this class
 * -------------------------- ******** ------------------------------
 */
export class TextCanvasBuilder {
  static FONT_SIZE = 56; // determines the quality
  static SINGLE_LINE_MODIFIER = 1.5;
  static SINGLE_LINE_HEIGHT = TextCanvasBuilder.FONT_SIZE * TextCanvasBuilder.SINGLE_LINE_MODIFIER;

  private readonly canvas: HTMLCanvasElement = document.createElement("canvas");

  private readonly text: string;
  private readonly font: string;
  private readonly color: number;
  private readonly centered: boolean;

  constructor(text: string, font: string, color: number, centered: boolean = true) {
    this.text = text;
    this.font = font;
    this.color = color;
    this.centered = centered;
  }

  public fitInCanvas(
    height: number,
    width: number,
    maxTextLines: number,
  ): { canvas: HTMLCanvasElement; numberOfTextLines: number } {
    const context = this.canvas.getContext("2d");
    let lines: Array<string> = [];
    if (context) {
      // We need to set the context up here with the correct font sizes and all
      // to get the measurements right
      this.setupContext(context);

      lines = this.getLinesBasedOnContext(context, width, height, maxTextLines);
      this.setCanvasDimensions(context, lines);

      lines.forEach((line: string, index: number) => {
        const x = this.centered ? this.canvas.width / 2 : 0;
        const y = TextCanvasBuilder.SINGLE_LINE_HEIGHT / 2 + TextCanvasBuilder.SINGLE_LINE_HEIGHT * index;
        context.textBaseline = "middle";
        context.strokeText(line, x, y);
        context.fillText(line, x, y);
        context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
      });
    }

    return {
      canvas: this.canvas,
      numberOfTextLines: lines.length,
    };
  }

  private getLinesBasedOnContext(
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    maxTextLines: number,
  ): Array<string> {
    const maxWidth = determineMaxTextWidth(width, height);
    const textMeasure = textMeasureCanvas(context);

    return breakText(this.text, maxWidth, textMeasure, maxTextLines);
  }

  private setupContext(context: CanvasRenderingContext2D): void {
    context.font = `Normal ${TextCanvasBuilder.FONT_SIZE}pt ${this.font}`;
    context.textAlign = this.centered ? "center" : "left";
    context.fillStyle = new Color(this.color).getStyle();
    context.lineWidth = ceil(TextCanvasBuilder.FONT_SIZE / 8, 0);

    context.shadowColor = "transparent";
    context.strokeStyle = "transparent";
  }

  private setCanvasDimensions(context: CanvasRenderingContext2D, lines: Array<string>): void {
    const dimensions = {
      width: max(
        0,
        lines.map((line) => context.measureText(line).width),
      ),
      height: lines.length * TextCanvasBuilder.SINGLE_LINE_HEIGHT,
    };

    this.canvas.width = dimensions.width;
    this.canvas.height = dimensions.height;

    this.setupContext(context);
  }

  public getLines(width: number, height: number, maxTextLines: number): Array<string> {
    const context = this.canvas.getContext("2d");
    return context ? this.getLinesBasedOnContext(context, width, height, maxTextLines) : [this.text];
  }
}

const determineMaxTextWidth = (width: number, height: number): number =>
  (width * TextCanvasBuilder.SINGLE_LINE_HEIGHT) / height;
