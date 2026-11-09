import type { ReactNode } from "react";

export const Section = ({ title, children }: { title?: ReactNode; children: ReactNode }) => (
  <section className="border-border grid gap-3 border-b p-4 last:border-b-0">
    {title ? (
      <h2 className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">{title}</h2>
    ) : null}
    {children}
  </section>
);
