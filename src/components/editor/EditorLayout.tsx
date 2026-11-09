import type { ReactNode, RefObject } from "react";
import { cn } from "@/lib/cn";
import { useCanvasZoom } from "./useCanvasZoom";
import ZoomControls from "./ZoomControls";

interface EditorLayoutProps {
  header: ReactNode;
  sidebar: ReactNode;
  aside?: ReactNode;
  canvasRef: RefObject<HTMLElement | null>;
  panning: boolean;
  children: (zoom: number) => ReactNode;
}

const EditorLayout = ({ header, sidebar, aside, canvasRef, panning, children }: EditorLayoutProps) => {
  const zoom = useCanvasZoom(canvasRef);
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {header}
      <div className="flex min-h-0 flex-1">
        <aside className="no-scrollbar border-border bg-background w-72 shrink-0 overflow-y-auto border-r">
          {sidebar}
        </aside>
        <div className="relative min-w-0 flex-1">
          <main
            ref={canvasRef}
            className={cn(
              "no-scrollbar bg-canvas size-full overflow-auto",
              panning && "cursor-grab active:cursor-grabbing",
            )}
          >
            {children(zoom.zoom)}
          </main>
          <ZoomControls {...zoom} />
          {aside ? (
            <aside className="border-border bg-background/95 absolute top-4 right-4 w-56 rounded-2xl border p-3 shadow-lg backdrop-blur">
              {aside}
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default EditorLayout;
