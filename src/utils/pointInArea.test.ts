import { describe, expect, it } from "vitest";
import type { IAreasProperties } from "@/Layout/Layout/Areas/types/areasTypes";
import { toolType } from "@/types/types";
import { isPointInArea } from "./pointInArea";

const rect = (extra: Partial<IAreasProperties> = {}): IAreasProperties => ({
  type: toolType.rectangle,
  x: 0,
  y: 0,
  width: 200,
  height: 100,
  rotate: 0,
  ...extra,
});

describe("isPointInArea", () => {
  it("detects points inside and outside a rectangle", () => {
    expect(isPointInArea(rect(), 100, 50)).toBe(true);
    expect(isPointInArea(rect(), 201, 50)).toBe(false);
  });

  it("excludes the cut-off part of a rounded corner", () => {
    const shape = rect({ cornerTopLeft: 40 });
    expect(isPointInArea(shape, 2, 2)).toBe(false);
    expect(isPointInArea(shape, 40, 2)).toBe(true);
    expect(isPointInArea(rect(), 2, 2)).toBe(true);
  });

  it("honors rotation around the shape center", () => {
    const shape = rect({ rotate: 90 });
    expect(isPointInArea(shape, 100, 140)).toBe(true);
    expect(isPointInArea(shape, 190, 50)).toBe(false);
  });

  it("detects points inside a rotated ellipse", () => {
    const shape = rect({ type: toolType.ellipse, rotate: 90 });
    expect(isPointInArea(shape, 100, 50)).toBe(true);
    expect(isPointInArea(shape, 100, 140)).toBe(true);
    expect(isPointInArea(shape, 190, 50)).toBe(false);
  });
});
