import { useId, type ComponentProps } from "react";
import { Input } from "@/components/primitives/input";
import { Label } from "@/components/primitives/label";

const TextField = ({ label, ...props }: ComponentProps<typeof Input> & { label: string }) => {
  const id = useId();
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  );
};

export default TextField;
