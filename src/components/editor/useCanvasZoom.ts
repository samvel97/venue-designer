import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { isTypingTarget } from "@/utils/isTypingTarget";

export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 4;
const STEP = 1.2;

const clamp = (zoom: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(zoom.toFixed(3))));

type Anchor = { x: number; y: number; contentX: number; contentY: number };

export const useCanvasZoom = (containerRef: RefObject<HTMLElement | null>) => {
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(zoom);
  const anchorRef = useRef<Anchor | null>(null);

  const zoomTo = useCallback(
    (next: number, point?: { clientX: number; clientY: number }) => {
      const container = containerRef.current;
      const target = clamp(next);
      if (!container || target === zoomRef.current) return;
      const rect = container.getBoundingClientRect();
      const x = point ? point.clientX - rect.left : rect.width / 2;
      const y = point ? point.clientY - rect.top : rect.height / 2;
      anchorRef.current = {
        x,
        y,
        contentX: (container.scrollLeft + x) / zoomRef.current,
        contentY: (container.scrollTop + y) / zoomRef.current,
      };
      zoomRef.current = target;
      setZoom(target);
    },
    [containerRef],
  );

  useLayoutEffect(() => {
    const container = containerRef.current;
    const anchor = anchorRef.current;
    if (!container || !anchor) return;
    container.scrollLeft = anchor.contentX * zoom - anchor.x;
    container.scrollTop = anchor.contentY * zoom - anchor.y;
    anchorRef.current = null;
  }, [zoom, containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      zoomTo(zoomRef.current * Math.exp(-event.deltaY * 0.002), event);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || isTypingTarget(event)) return;
      const actions: Record<string, () => void> = {
        "=": () => zoomTo(zoomRef.current * STEP),
        "+": () => zoomTo(zoomRef.current * STEP),
        "-": () => zoomTo(zoomRef.current / STEP),
        "0": () => zoomTo(1),
      };
      const action = actions[event.key];
      if (!action) return;
      event.preventDefault();
      action();
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      container.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [containerRef, zoomTo]);

  return {
    zoom,
    zoomIn: () => zoomTo(zoomRef.current * STEP),
    zoomOut: () => zoomTo(zoomRef.current / STEP),
    reset: () => zoomTo(1),
  };
};
