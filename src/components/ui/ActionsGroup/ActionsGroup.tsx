import ButtonLoader from "components/shared/button-loader";
import { ButtonTypeEnum } from "enums/button-type.enum";
import "./ActionsGroup.scss";
import { IActions, ManipulationActions, toolType } from "types/types";
import { memo } from "react";
import { useTranslation } from "react-i18next";

interface IActionsGroup {
  actionsOptions: IActions[];
  type: ButtonTypeEnum;
  manipulationActions?: ManipulationActions;
  padding?: boolean;
  tool?: toolType;
  handleToolTypeChange: (option: toolType) => void;
}

const ActionsGroup = ({
  actionsOptions,
  type,
  manipulationActions,
  padding = false,
  tool,
  handleToolTypeChange,
}: IActionsGroup) => {
  const { t } = useTranslation();
  return (
    <div
      className={`G-flex P-groups-component ${
        padding ? "P-group-padding" : ""
      }`}
    >
      {actionsOptions.map((action) => {
        const option = action.option;
        return (
          <div
            key={action.id}
            className="P-Item-wrapper"
            title={t(`toolbar.${action.title}`)}
          >
            {manipulationActions ? (
              <ButtonLoader
                onClick={manipulationActions[action.title]}
                SvgIcon={action.icon}
                buttonTypes={type}
              />
            ) : (
              <ButtonLoader
                onClick={() => handleToolTypeChange(option)}
                SvgIcon={action.icon}
                customClass={tool && action.option === tool ? "P-selected" : ""}
                buttonTypes={type}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default memo(ActionsGroup);
