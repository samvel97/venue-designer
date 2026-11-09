import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LoaderCircle, Maximize, Minus, Plus } from "lucide-react";
import { TransformComponent, TransformWrapper, useControls } from "react-zoom-pan-pinch";
import { useGetAllAreasQuery, useGetAreasQuery } from "@/api/api";
import { Button } from "@/components/primitives/button";
import { opacityFillColor } from "@/Layout/Layout/Areas/constants/areasConstants";
import type { FloorPropTypes, IAreaData, IDecodedLayout } from "@/Layout/Layout/Areas/types/areasTypes";
import { cn } from "@/lib/cn";
import { toolType, type IMInMax } from "@/types/types";
import { binaryToText } from "@/utils";
import { findMinMaxCoordinates } from "@/utils/areasMinMaxCoords";
import { shapeCenter } from "@/utils/shapeCenter";
import Areas from "./Areas/Areas";
import { measureViewport, type Viewport } from "./viewport";

const PADDING = 100;

const computeViewBox = (floorProps: FloorPropTypes, areas: IAreaData[]) => {
  let box = { x: 0, y: 0, width: 0, height: 0 };
  if (areas.length > 1) {
    const { biggestX, biggestY, smallestX, smallestY } = findMinMaxCoordinates(areas, floorProps) as IMInMax;
    box = { x: smallestX, y: smallestY, width: biggestX - smallestX, height: biggestY - smallestY };
  } else if (floorProps || areas.length === 1) {
    const { x, y, width, height, type, d } = floorProps ?? areas[0].properties;
    if (type === toolType.pen) {
      const { minX, minY, maxX, maxY } = shapeCenter(d!);
      box = { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
    } else {
      box = { x, y, width, height };
    }
  }
  return `${box.x - PADDING} ${box.y - PADDING} ${box.width + PADDING * 2} ${box.height + PADDING * 2}`;
};

const ZoomControls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <div className="border-border bg-background absolute bottom-4 left-4 z-10 flex gap-1 rounded-xl border p-1 shadow-md">
      <Button variant="ghost" size="icon-sm" aria-label="Zoom out" onClick={() => zoomOut()}>
        <Minus />
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label="Zoom in" onClick={() => zoomIn()}>
        <Plus />
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label="Fit to window" onClick={() => resetTransform()}>
        <Maximize />
      </Button>
    </div>
  );
};

const HallView = ({ venueId }: { venueId: string }) => {
  const { t } = useTranslation();
  const [selectedFloor, setSelectedFloor] = useState(0);
  const all = useGetAllAreasQuery(venueId, { skip: selectedFloor !== 0 });
  const single = useGetAreasQuery({ id: venueId, floor: selectedFloor }, { skip: selectedFloor === 0 });
  const floorsCount = single.data?.floorsCount || all.data?.floorsCount || 0;

  const { layouts, viewBox } = useMemo(() => {
    const decoded: IDecodedLayout[] =
      selectedFloor && single.data
        ? single.data.layout
          ? [binaryToText(single.data.layout)]
          : []
        : !selectedFloor && all.data
          ? binaryToText(all.data.layouts)
          : [];
    const sorted = decoded.filter(Boolean).sort((a, b) => a.floor - b.floor);
    return {
      layouts: sorted,
      viewBox: computeViewBox(
        sorted[0]?.properties ?? null,
        sorted.flatMap((layout) => layout.areas),
      ),
    };
  }, [selectedFloor, single.data, all.data]);

  const frameRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const timerRef = useRef<number>(undefined);
  const [viewport, setViewport] = useState<Viewport | null>(null);

  const scheduleMeasure = useCallback(() => {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      if (svgRef.current && frameRef.current) setViewport(measureViewport(svgRef.current, frameRef.current));
    }, 120);
  }, []);

  useEffect(() => {
    scheduleMeasure();
    return () => window.clearTimeout(timerRef.current);
  }, [layouts, scheduleMeasure]);

  const floorOptions = [
    { value: 0, label: floorsCount > 1 ? t("rightSide.view") : `${t("rightSide.floor")} 1` },
    ...(floorsCount > 1
      ? Array.from({ length: floorsCount }, (_, i) => ({ value: i + 1, label: `${t("rightSide.floor")} ${i + 1}` }))
      : []),
  ];

  return (
    <div className="flex min-h-0 gap-4 px-6 pb-6">
      <div ref={frameRef} className="border-border bg-canvas relative flex-1 overflow-hidden rounded-xl border">
        <TransformWrapper centerOnInit centerZoomedOut minScale={0.5} maxScale={40} onTransform={scheduleMeasure}>
          <ZoomControls />
          <TransformComponent wrapperClass="!size-full" contentClass="!size-full">
            <svg ref={svgRef} className="size-full" viewBox={viewBox}>
              {layouts.map((layout) => (
                <Areas
                  key={layout.floor}
                  areas={layout.areas}
                  floor={layout.properties}
                  fillColor={layout.floor !== 1 ? opacityFillColor : undefined}
                  viewport={viewport}
                />
              ))}
            </svg>
          </TransformComponent>
        </TransformWrapper>
        {all.isFetching || single.isFetching ? (
          <div className="bg-background/60 absolute inset-0 grid place-items-center">
            <LoaderCircle className="text-primary size-6 animate-spin" />
          </div>
        ) : null}
      </div>

      <nav className="grid w-44 content-start gap-1">
        {floorOptions.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setSelectedFloor(value)}
            className={cn(
              "cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
              selectedFloor === value ? "bg-primary/10 text-primary" : "hover:bg-muted",
            )}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default HallView;
