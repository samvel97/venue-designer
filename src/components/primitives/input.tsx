import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export const Input = ({ className, ...props }: ComponentProps<"input">) => (
  <input
    autoComplete="off"
    className={cn(
      "border-border bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/30 h-9 w-full min-w-0 [appearance:textfield] rounded-lg border px-3 text-sm shadow-xs transition-colors outline-none focus-visible:ring-2 disabled:opacity-50 [&::-webkit-inner-spin-button]:appearance-none",
      className,
    )}
    {...props}
  />
);
