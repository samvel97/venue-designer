import { useTranslation } from "react-i18next";
import { Button } from "@/components/primitives/button";
import { Tooltip } from "@/components/primitives/tooltip";
import type { IActions, toolType } from "@/types/types";

interface ToolGroupProps {
  actions: IActions[];
  active?: toolType;
  onSelect: (option: toolType) => void;
}

const ToolGroup = ({ actions, active, onSelect }: ToolGroupProps) => {
  const { t } = useTranslation();
  return (
    <div className="bg-muted flex flex-wrap gap-1 rounded-xl p-1">
      {actions.map(({ id, icon: Icon, title, option }) => (
        <Tooltip key={id} content={t(`toolbar.${title}`)}>
          <Button
            variant="tool"
            size="icon-sm"
            aria-label={t(`toolbar.${title}`)}
            aria-pressed={active === undefined ? undefined : active === option}
            onClick={() => onSelect(option)}
          >
            <Icon />
          </Button>
        </Tooltip>
      ))}
    </div>
  );
};

export default ToolGroup;
