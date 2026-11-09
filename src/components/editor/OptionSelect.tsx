import { useTranslation } from "react-i18next";
import { RadioGroup, RadioOption } from "@/components/primitives/radio-group";

interface OptionSelectProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  labelKey?: (option: T) => string;
}

const OptionSelect = <T extends string>({ options, value, onChange, labelKey = (o) => o }: OptionSelectProps<T>) => {
  const { t } = useTranslation();
  return (
    <RadioGroup value={value} onValueChange={(next) => onChange(next as T)}>
      {options.map((option) => (
        <RadioOption key={option} value={option} label={t(`toolbar.${labelKey(option)}`)} />
      ))}
    </RadioGroup>
  );
};

export default OptionSelect;
