import type { ComponentProps } from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";

export const RadioGroup = ({ className, ...props }: ComponentProps<typeof RadioGroupPrimitive.Root>) => (
  <RadioGroupPrimitive.Root className={cn("grid gap-2.5", className)} {...props} />
);

export const RadioOption = ({ value, label }: { value: string; label: string }) => (
  <label className="flex cursor-pointer items-center gap-2.5 text-sm leading-tight">
    <RadioGroupPrimitive.Item
      value={value}
      className="border-border focus-visible:ring-ring/50 data-[state=checked]:border-primary grid size-4 shrink-0 cursor-pointer place-items-center rounded-full border shadow-xs outline-none focus-visible:ring-2"
    >
      <RadioGroupPrimitive.Indicator className="bg-primary size-2 rounded-full" />
    </RadioGroupPrimitive.Item>
    {label}
  </label>
);
