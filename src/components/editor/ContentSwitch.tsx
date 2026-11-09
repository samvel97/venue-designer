import { useId } from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "@/components/primitives/switch";

const ContentSwitch = ({ checked, onToggle }: { checked: boolean; onToggle: () => void }) => {
  const { t } = useTranslation();
  const id = useId();
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center justify-between text-sm">
      {t("toolbar.show_content")}
      <Switch id={id} checked={checked} onCheckedChange={onToggle} />
    </label>
  );
};

export default ContentSwitch;
