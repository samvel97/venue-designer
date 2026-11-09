import ActionsGroup from "components/ui/ActionsGroup/ActionsGroup";
import ShapeTypesSelect from "components/ui/ShapeTypesSelect/ShapeTypesSelect";
import { ButtonTypeEnum } from "enums/button-type.enum";
import {
  areasCreatingActions,
  ShapeType,
  areasManipulationActions,
  toolTypes,
} from "../../constants/areasConstants";
import {
  FloorPropTypes,
  IAreaData,
  IAreasProperties,
  IManipulationProperties,
} from "../../types/areasTypes";
import { IActions, ManipulationActions, toolType } from "types/types";
import { memo } from "react";
import SelectedAreasProps from "./selectedAreasProps/SelectedAreasProps";
import SelectedFloorProps from "./selectedFloorProps/SelectedFloorProps";
import Switcher from "components/ui/Switcher/Switcher";

interface IProps {
  tool: toolType;
  shapeType: ShapeType;
  selectedArea: IAreaData[];
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  inputValues: IManipulationProperties;
  refList: React.MutableRefObject<HTMLImageElement[]>;
  selectedFloor: FloorPropTypes;
  venueId: string | null;
  areas: IAreaData[];
  floor: string | null;
  ticketsCountRef: React.MutableRefObject<HTMLInputElement | null>;
  floorProperties: FloorPropTypes;
  isEqual: boolean;
  handleToolTypeChange: (type: toolType) => void;
  selectShapeType: (prop: ShapeType) => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteArea: () => void;
  handleCopyArea: () => void;
  handlePasteArea: () => void;
  flipHorizontal: (selectedArea: IAreaData[]) => void;
  flipVertical: (selectedArea: IAreaData[]) => void;
  handleSectionContentView?: () => void;
}

const ActionsBar = ({
  tool,
  shapeType,
  selectedArea,
  inputRef,
  inputValues,
  refList,
  selectedFloor,
  venueId,
  areas,
  floor,
  ticketsCountRef,
  floorProperties,
  isEqual,
  handleToolTypeChange,
  selectShapeType,
  handleChange,
  handleDeleteArea,
  handleCopyArea,
  handlePasteArea,
  flipHorizontal,
  flipVertical,
  handleSectionContentView,
}: IProps) => {
  const manipulationActions: ManipulationActions = {
    flipHorizontal: () => flipHorizontal(selectedArea),
    flipVertical: () => flipVertical(selectedArea),
    copy: handleCopyArea,
    paste: handlePasteArea,
    delete: handleDeleteArea,
  };
  const polygonActions = (actions: toolType[]) => {
    return areasManipulationActions.filter(
      (item: IActions) => !actions.includes(item.title)
    );
  };
  const checkSelectedCount = () => {
    if (selectedArea.length > 1 || (selectedArea.length && selectedFloor)) {
      return [areasManipulationActions[areasManipulationActions.length - 1]];
    }
    if (selectedFloor) {
      const actions = [
        toolType.flipVertical,
        toolType.flipHorizontal,
        toolType.copy,
        toolType.paste,
      ];
      if (selectedFloor.type === toolType.pen) return polygonActions(actions);
      const copyPasteAction = [toolType.copy, toolType.paste];
      return areasManipulationActions.filter(
        (item: IActions) => !copyPasteAction.includes(item.title)
      );
    }
    if (selectedArea[0].properties.type === toolType.pen) {
      const actions = [toolType.flipVertical, toolType.flipHorizontal];
      return polygonActions(actions);
    }
    return areasManipulationActions;
  };

  return (
    <>
      <ActionsGroup
        actionsOptions={areasCreatingActions}
        type={ButtonTypeEnum.primary}
        tool={tool}
        handleToolTypeChange={handleToolTypeChange}
      />
      <Switcher
        handleClick={handleSectionContentView}
        title={"toolbar.show_content"}
      />
      {toolTypes.includes(tool) ? (
        <ShapeTypesSelect
          shapeType={shapeType}
          selectShapeType={selectShapeType}
        />
      ) : null}
      {selectedArea?.length ? (
        <SelectedAreasProps
          selectedArea={selectedArea}
          inputRef={inputRef}
          titles={Object.keys(inputValues.title)}
          refList={refList}
          selectedFloor={selectedFloor}
          venueId={venueId}
          areas={areas}
          floor={floor}
          ticketsCountRef={ticketsCountRef}
          floorProperties={floorProperties}
          isEqual={isEqual}
          manipulationActions={manipulationActions}
          handleToolTypeChange={handleToolTypeChange}
          handleChange={handleChange}
          checkSelectedCount={checkSelectedCount}
        />
      ) : null}
      {selectedFloor && !selectedArea.length && (
        <SelectedFloorProps
          refList={refList}
          selectedFloor={selectedFloor}
          manipulationActions={manipulationActions}
          handleToolTypeChange={handleToolTypeChange}
          handleChange={handleChange}
          checkSelectedCount={checkSelectedCount}
        />
      )}
    </>
  );
};

export default memo(ActionsBar);
