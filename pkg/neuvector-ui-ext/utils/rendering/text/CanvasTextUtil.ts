import { ceil } from "~/tools/ceil";
import { floor } from "~/tools/floor";

/**
 * Collection of method to wrap text in/using a CanvasRenderingContext2D
 */
/**
 * Used to mark parts of a string that have been omitted due to shortening.
 *
 * i.e. "this is a long string" is shortened to "this is ...string"
 */
export const ELLIPSE: string = "...";

/**
 * Some way of measuring text
 */
export type TextMeasure = (text: string) => number;

/**
 * Measure text by measuring its size on a given canvas
 */
export const textMeasureCanvas = (canvas: CanvasRenderingContext2D) => (text: string) => canvas.measureText(text).width;

/**
 * Shorten text to fit the given width, based on canvas measurements
 *
 * @param measureText
 * @param text
 * @param maxWidth
 * @param textWidth the text width, if measured before. Optimisation so we don't measureText twice
 * @param centerCut whether to cut in the center of the string (true) or at the end (false)
 */
export function shorten(
  measureText: TextMeasure,
  text: string,
  maxWidth: number,
  textWidth: number = measureText(text),
  centerCut: boolean = true,
): string {
  if (textWidth <= maxWidth) {
    return text;
  }
  // determine how many characters we can keep
  const allowedLengthFraction = maxWidth / textWidth;
  const allowedLength = floor(text.length * allowedLengthFraction, 0) - 2;

  if (allowedLength < 1) {
    return "";
  }

  if (centerCut) {
    // determine size before and after
    const beforeEllipseLength = floor(allowedLength / 2, 0);
    const afterEllipseLength = ceil(allowedLength / 2, 0);

    // create result by getting the first and last parts and combining them with an ellipse inbetween
    return (
      text.substr(0, beforeEllipseLength) + ELLIPSE + text.substr(text.length - afterEllipseLength, afterEllipseLength)
    );
  }

  // cut off the string and add ellipse at the end
  return text.substr(0, allowedLength) + ELLIPSE;
}

const addEllipseAtTheEnd = (text: string): string => text.substr(0, text.length - 3) + ELLIPSE;

/**
 * changes multiple whitespace to the single one,
 * also removes whitespace from both ends of a string
 * @param text
 */
const normalizeText = (text: string): string => {
  return text.replace(/\s+/, " ").trim();
};

interface BrokenText {
  text: string; // what fits the line
  rest: string; // what doesn't fit the line
  at: number; // the position where text was split
}

const fitTheLine = (text: string, maxWidth: number, measureText: TextMeasure, reverse = false): BrokenText => {
  const textLengthIndexes = text.length - 1;
  const startPosition = reverse ? textLengthIndexes : 0;
  let breakPosition = 0;
  let index = 0; // increment
  let chunk = ""; // result text which we are going to fit
  let length = 0; // length in pixels of the text we are trying to fit

  do {
    index++;
    breakPosition = reverse ? startPosition - index : startPosition + index;
    chunk = reverse ? text.substring(breakPosition) : text.substring(0, breakPosition);
    length = measureText(chunk);
  } while (length < maxWidth && index <= text.length);

  // at last measure the last symbol might not fit the line, in this case we reduce the line on one symbol
  if (length > maxWidth) {
    breakPosition = reverse ? startPosition - index + 1 : startPosition + index - 1;
  }

  return {
    text: reverse ? text.substring(breakPosition) : text.substring(0, breakPosition),
    rest: reverse ? text.substring(0, breakPosition) : text.substring(breakPosition),
    at: breakPosition,
  };
};

// Right now only for groups
const UNBREAKABLE_TEXT_REGEXP = /group \(\d+\+?\)$/i;
/**
 * Break the text into lines based on maxWidth of the line
 * @param text - text to break
 * @param maxWidth - max width of the line (pixels)
 * @param measureText - curry function to reuse the canvas' measureText function
 * @param maxLines - on how many lines break the text, atm it breaks max on 2 lines, if maxLines === 1 it
 * returns one line with the ELLIPSE in the middle, in all other cases if the text doesn't fit the 2 lines,
 * it returns the first line with the ELLIPSE at the end and the last part of the text on the second line
 * If text ends with the words `group (n)` - this part of the text is considered as unbreakable; That means that this part of the text will always be on the same line
 *
 * NOTE: here is also a room for improvement, measureText is quite expensive operation,
 * the less time it is invoked - the better
 */
export const breakText = (
  text: string,
  maxWidth: number,
  measureText: TextMeasure,
  maxLines: number,
): Array<string> => {
  const fullText = normalizeText(text);

  if (maxLines === 1) {
    return [shorten(measureText, fullText, maxWidth)];
  }

  // fit the first line
  const { text: firstLine, rest } = fitTheLine(fullText, maxWidth, measureText, false);
  // if it's only a single line - return as single line
  if (rest === "") {
    return [firstLine];
  }

  // if it doesn't fit the single line - check if there is an unbreakable text
  const unbreakableTextMatch = fullText.match(UNBREAKABLE_TEXT_REGEXP);
  const unbreakableText = unbreakableTextMatch?.[0];

  const textToFitFirstLine = unbreakableText ? fullText.substring(0, unbreakableTextMatch!.index) : fullText;
  // fit the first line
  const {
    text: firstLineResult,
    rest: restForSecondLine,
    at,
  } = fitTheLine(textToFitFirstLine, maxWidth, measureText, false);
  const textToFitSecondLine = unbreakableText ? `${restForSecondLine}${unbreakableText}` : restForSecondLine;

  // in case if the second line is really short, took a part from first line and attach it to the second line
  // measureText is not involved here
  if (textToFitSecondLine.length < firstLineResult.length * 0.25) {
    const position = at * 0.75;
    return [fullText.substring(0, position), fullText.substring(position)];
  }

  // fit the last line, cut off the text from the beginning
  const { text: lastLineResult, rest: leftOver } = fitTheLine(textToFitSecondLine, maxWidth, measureText, true);

  // if something left, add an Ellipse at the end of first line
  if (leftOver) {
    return [addEllipseAtTheEnd(firstLineResult), lastLineResult];
  }

  return [firstLineResult, lastLineResult];
};
