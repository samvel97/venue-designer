import ActionsGroup from "components/ui/ActionsGroup/ActionsGroup";
import Options from "components/ui/Options/Options";
import { ButtonTypeEnum } from "enums/button-type.enum";
import {
  optionsSvgs,
  cornerRadiuses,
} from "Layout/Layout/Areas/constants/areasConstants";
import {
  IAreaData,
  IAreasProperties,
} from "Layout/Layout/Areas/types/areasTypes";
import { IActions, ManipulationActions, toolType } from "types/types";
interface IProps {
  refList: React.MutableRefObject<HTMLImageElement[]>;
  selectedFloor: IAreasProperties;
  manipulationActions: ManipulationActions;
  handleToolTypeChange: (type: toolType) => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checkSelectedCount: () => IActions[];
}
const SelectedFloorProps = ({
  refList,
  selectedFloor,
  manipulationActions,
  handleToolTypeChange,
  handleChange,
  checkSelectedCount,
}: IProps) => {
  const { type: floorType, d: _, x: __, y: ___, ...rest } = selectedFloor;
  const props = floorType === toolType.pen ? { rotate: rest.rotate } : rest;
  return (
    <>
      <div style={{ border: "1px solid #ECECEC", width: "100%" }}></div>
      <ActionsGroup
        type={ButtonTypeEnum.secondary}
        manipulationActions={manipulationActions}
        padding
        actionsOptions={checkSelectedCount()}
        handleToolTypeChange={handleToolTypeChange}
      />
      <div style={{ border: "1px solid #ECECEC", width: "100%" }}></div>
      <Options
        refList={refList}
        optionsSvgs={optionsSvgs}
        inputValues={props}
        cornerRadiuses={cornerRadiuses}
        tool={floorType}
        handleChange={handleChange}
      />
    </>
  );
};

export default SelectedFloorProps;
