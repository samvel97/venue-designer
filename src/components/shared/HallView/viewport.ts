import { toSvgPoint } from "@/utils/svgPoint";

/** Visible region of the preview in SVG units; `detailed` once seat numbers are large enough to read. */
export interface Viewport {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  detailed: boolean;
}

const MIN_READABLE_PX_PER_UNIT = 0.6;

export const measureViewport = (svg: SVGSVGElement, frame: HTMLElement): Viewport | null => {
  const matrix = svg.getScreenCTM();
  if (!matrix) return null;
  const rect = frame.getBoundingClientRect();
  const topLeft = toSvgPoint(svg, { clientX: rect.left, clientY: rect.top });
  const bottomRight = toSvgPoint(svg, { clientX: rect.right, clientY: rect.bottom });
  return {
    minX: topLeft.x,
    minY: topLeft.y,
    maxX: bottomRight.x,
    maxY: bottomRight.y,
    detailed: Math.hypot(matrix.a, matrix.b) >= MIN_READABLE_PX_PER_UNIT,
  };
};
