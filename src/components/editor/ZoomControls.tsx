import { useTranslation } from "react-i18next";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/primitives/button";
import { Tooltip } from "@/components/primitives/tooltip";
import { MAX_ZOOM, MIN_ZOOM } from "./useCanvasZoom";

interface ZoomControlsProps {
  zoom: number;
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
}

const ZoomControls = ({ zoom, zoomIn, zoomOut, reset }: ZoomControlsProps) => {
  const { t } = useTranslation();
  return (
    <div className="border-border bg-background/95 absolute bottom-4 left-4 flex items-center gap-0.5 rounded-xl border p-1 shadow-lg backdrop-blur">
      <Tooltip content={`${t("toolbar.zoom_out")} (Ctrl −)`}>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={t("toolbar.zoom_out")}
          disabled={zoom <= MIN_ZOOM}
          onClick={zoomOut}
        >
          <Minus />
        </Button>
      </Tooltip>
      <Tooltip content={`${t("toolbar.zoom_reset")} (Ctrl 0)`}>
        <Button
          variant="ghost"
          size="sm"
          className="w-14 tabular-nums"
          aria-label={t("toolbar.zoom_reset")}
          onClick={reset}
        >
          {Math.round(zoom * 100)}%
        </Button>
      </Tooltip>
      <Tooltip content={`${t("toolbar.zoom_in")} (Ctrl +)`}>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={t("toolbar.zoom_in")}
          disabled={zoom >= MAX_ZOOM}
          onClick={zoomIn}
        >
          <Plus />
        </Button>
      </Tooltip>
    </div>
  );
};

export default ZoomControls;
