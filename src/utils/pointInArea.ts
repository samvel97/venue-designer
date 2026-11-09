import type { IAreasProperties } from "@/Layout/Layout/Areas/types/areasTypes";
import { toolType } from "@/types/types";
import { shapeCenter } from "./shapeCenter";

let context: CanvasRenderingContext2D | null | undefined;
const polygons = new Map<string, { path: Path2D; centerX: number; centerY: number }>();

const getContext = () => (context ??= document.createElement("canvas").getContext("2d"));

const getPolygon = (d: string) => {
  let polygon = polygons.get(d);
  if (!polygon) {
    if (polygons.size > 200) polygons.clear();
    polygon = { path: new Path2D(d), ...shapeCenter(d) };
    polygons.set(d, polygon);
  }
  return polygon;
};

const unrotate = (x: number, y: number, cx: number, cy: number, degrees: number) => {
  if (!degrees) return { x, y };
  const r = (-degrees * Math.PI) / 180;
  const dx = x - cx;
  const dy = y - cy;
  return { x: cx + dx * Math.cos(r) - dy * Math.sin(r), y: cy + dx * Math.sin(r) + dy * Math.cos(r) };
};

const inRoundedRect = (px: number, py: number, shape: IAreasProperties) => {
  const { x, y, width, height } = shape;
  if (px < x || px > x + width || py < y || py > y + height) return false;
  const corners: [number, number, number][] = [
    [shape.cornerTopLeft ?? 0, x, y],
    [shape.cornerTopRight ?? 0, x + width, y],
    [shape.cornerBottomRight ?? 0, x + width, y + height],
    [shape.cornerBottomLeft ?? 0, x, y + height],
  ];
  return corners.every(([radius, cornerX, cornerY]) => {
    if (!radius) return true;
    const cx = cornerX === x ? x + radius : cornerX - radius;
    const cy = cornerY === y ? y + radius : cornerY - radius;
    const outsideCornerBox = (cornerX === x ? px > cx : px < cx) || (cornerY === y ? py > cy : py < cy);
    return outsideCornerBox || (px - cx) ** 2 + (py - cy) ** 2 <= radius ** 2;
  });
};

/** Whether a point (in canvas units) lies inside an area's shape, honoring rotation and rounded corners. */
export const isPointInArea = (shape: IAreasProperties, px: number, py: number) => {
  const { x, y, width, height, rotate, type, d } = shape;

  if (type === toolType.pen) {
    const ctx = getContext();
    if (!ctx || !d) return true;
    const { path, centerX, centerY } = getPolygon(d);
    const point = unrotate(px, py, centerX, centerY, rotate);
    return ctx.isPointInPath(path, point.x, point.y);
  }

  const point = unrotate(px, py, x + width / 2, y + height / 2, rotate);

  if (type === toolType.ellipse) {
    const rx = width / 2;
    const ry = height / 2;
    return (point.x - x - rx) ** 2 / rx ** 2 + (point.y - y - ry) ** 2 / ry ** 2 <= 1;
  }

  return inRoundedRect(point.x, point.y, shape);
};
