/** Converts a pointer position to SVG user-space coordinates, independent of zoom, scroll and layout. */
export const toSvgPoint = (svg: SVGSVGElement, { clientX, clientY }: { clientX: number; clientY: number }) => {
  const matrix = svg.getScreenCTM();
  if (!matrix) return { x: clientX, y: clientY };
  const { x, y } = new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse());
  return { x, y };
};
