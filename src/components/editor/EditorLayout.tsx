import type { ReactNode, Ref } from "react";
import type { SvgContainerType } from "@/types/types";

interface EditorLayoutProps {
  header: ReactNode;
  sidebar: ReactNode;
  aside?: ReactNode;
  canvasRef: Ref<SvgContainerType>;
  panning: boolean;
  children: ReactNode;
}

const EditorLayout = ({ header, sidebar, aside, canvasRef, panning, children }: EditorLayoutProps) => (
  <div className="flex h-full flex-col overflow-hidden">
    {header}
    <div className="relative flex min-h-0 flex-1">
      <aside className="no-scrollbar border-border bg-background w-72 shrink-0 overflow-y-auto border-r">
        {sidebar}
      </aside>
      <main
        ref={canvasRef}
        className={`no-scrollbar bg-canvas relative flex-1 overflow-auto ${panning ? "cursor-grab active:cursor-grabbing" : ""}`}
      >
        {children}
      </main>
      {aside ? (
        <aside className="border-border bg-background/95 absolute top-4 right-4 w-56 rounded-2xl border p-3 shadow-lg backdrop-blur">
          {aside}
        </aside>
      ) : null}
    </div>
  </div>
);

export default EditorLayout;
