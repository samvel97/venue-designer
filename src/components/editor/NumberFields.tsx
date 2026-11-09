import { useId, type ChangeEvent, type RefObject } from "react";
import { useTranslation } from "react-i18next";
import { RotateCw, Spline, SquareRoundCorner } from "lucide-react";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import { Label } from "@/components/primitives/label";

const fieldIcons = { rotate: RotateCw, curve: Spline } as const;
const skippedFields = ["title", "order", "ticketsCount"];

const cornerRotation = {
  cornerTopLeft: -90,
  cornerTopRight: 0,
  cornerBottomRight: 90,
  cornerBottomLeft: 180,
} as const;

type Corner = keyof typeof cornerRotation;
type Values = Record<string, unknown>;

interface NumberFieldsProps {
  values: Values;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  refList?: RefObject<(HTMLInputElement | null)[]>;
  withCorners?: boolean;
  onSubmit?: () => void;
}

const display = (value: unknown) => (value === "" || value === undefined ? "" : Math.ceil(Number(value) || 0));

const Field = ({
  name,
  value,
  onChange,
  inputRef,
}: {
  name: string;
  value: unknown;
  onChange: NumberFieldsProps["onChange"];
  inputRef?: (input: HTMLInputElement | null) => void;
}) => {
  const { t } = useTranslation();
  const id = useId();
  const Icon = fieldIcons[name as keyof typeof fieldIcons];
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="flex items-center gap-1 capitalize">
        {Icon ? <Icon className="size-3" /> : null}
        {t(`toolbar.${name}`)}
      </Label>
      <Input
        ref={inputRef}
        id={id}
        type="number"
        name={name}
        placeholder="0"
        value={display(value)}
        onChange={onChange}
      />
    </div>
  );
};

const NumberFields = ({ values, onChange, refList, withCorners, onSubmit }: NumberFieldsProps) => {
  const { t } = useTranslation();
  const keys = Object.keys(values).filter((key) => !skippedFields.includes(key) && !(key in cornerRotation));
  const register = (index: number) => (input: HTMLInputElement | null) => {
    if (refList) refList.current[index] = input;
  };

  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-3">
        {keys.map((key, index) => (
          <Field key={key} name={key} value={values[key]} onChange={onChange} inputRef={register(index)} />
        ))}
      </div>

      {withCorners && values.cornerBottomLeft !== undefined ? (
        <div className="grid gap-1.5">
          <Label>{t("toolbar.corners")}</Label>
          <div className="grid grid-cols-4 gap-1.5">
            {(Object.keys(cornerRotation) as Corner[]).map((corner, index) => (
              <div key={corner} className="relative">
                <SquareRoundCorner
                  className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 size-3 -translate-y-1/2"
                  style={{ rotate: `${cornerRotation[corner]}deg` }}
                />
                <Input
                  ref={register(keys.length + index)}
                  type="number"
                  name={corner}
                  aria-label={corner}
                  className="h-8 pr-1 pl-6 text-xs"
                  value={display(values[corner])}
                  onChange={onChange}
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {onSubmit ? <Button onClick={onSubmit}>{t("toolbar.confirm")}</Button> : null}
    </div>
  );
};

export default NumberFields;
