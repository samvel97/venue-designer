import ActionsGroup from "components/ui/ActionsGroup/ActionsGroup";
import LabelInput from "components/ui/LabelInput/LabelInput";
import Options from "components/ui/Options/Options";
import PageSwitcher from "components/ui/PageSwitcher/PageSwitcher";
import PutTicketsCount from "components/ui/PutTicketsCount/PutTicketsCount";
import { ButtonTypeEnum } from "enums/button-type.enum";
import {
  cornerRadiuses,
  optionsSvgs,
  ShapeType,
} from "Layout/Layout/Areas/constants/areasConstants";
import {
  IAreaData,
  FloorPropTypes,
} from "Layout/Layout/Areas/types/areasTypes";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import {
  IActions,
  languageTypes,
  ManipulationActions,
  toolType,
} from "types/types";

interface IProps {
  selectedArea: IAreaData[];
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  titles: string[];
  refList: React.MutableRefObject<HTMLImageElement[]>;
  selectedFloor: FloorPropTypes;
  venueId: string | null;
  areas: IAreaData[];
  floor: string | null;
  ticketsCountRef: React.MutableRefObject<HTMLInputElement | null>;
  floorProperties: FloorPropTypes;
  manipulationActions: ManipulationActions;
  isEqual: boolean;
  handleToolTypeChange: (type: toolType) => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checkSelectedCount: () => IActions[];
}
const SelectedAreasProps = ({
  selectedArea,
  inputRef,
  titles,
  refList,
  selectedFloor,
  venueId,
  areas,
  floor,
  ticketsCountRef,
  floorProperties,
  manipulationActions,
  isEqual,
  handleToolTypeChange,
  handleChange,
  checkSelectedCount,
}: IProps) => {
  const {
    areaType,
    properties,
    title: selectedAreaTitle,
    ticketsCount,
  } = selectedArea[0];
  const { type: selectedAreaType, d: _, x: __, y: ___, ...rest } = properties;
  const props =
    selectedAreaType === toolType.pen
      ? { rotate: rest.rotate }
      : {
          width: rest.width,
          height: rest.height,
          rotate: rest.rotate,
          cornerTopRight: rest.cornerTopRight,
          cornerTopLeft: rest.cornerTopLeft,
          cornerBottomRight: rest.cornerBottomRight,
          cornerBottomLeft: rest.cornerBottomLeft,
        };
  return (
    <>
      {selectedArea.length === 1 && !selectedFloor && (
        <>
          {areaType === ShapeType.WITH_SEATS && (
            <PageSwitcher
              page="areas"
              selectedArea={selectedArea}
              venueId={venueId!}
              areas={areas}
              floor={floor!}
              isEqual={isEqual}
              floorProperties={floorProperties}
            />
          )}
          {titles.map((item: string, index) => {
            return (
              <LabelInput
                ref={inputRef}
                key={index}
                name={item}
                value={selectedAreaTitle[item as languageTypes]}
                handleChange={handleChange}
              />
            );
          })}
        </>
      )}
      {selectedArea.length && (
        <>
          <div style={{ border: "1px solid #ECECEC", width: "100%" }}></div>
          <ActionsGroup
            type={ButtonTypeEnum.secondary}
            manipulationActions={manipulationActions}
            padding
            actionsOptions={checkSelectedCount()}
            handleToolTypeChange={handleToolTypeChange}
          />
        </>
      )}
      {selectedArea.length === 1 && !selectedFloor && (
        <>
          <div style={{ border: "1px solid #ECECEC", width: "100%" }} />

          <Options
            refList={refList}
            optionsSvgs={optionsSvgs}
            inputValues={props}
            cornerRadiuses={cornerRadiuses}
            tool={selectedAreaType}
            handleChange={handleChange}
          />

          {areaType === ShapeType.WITHOUT_SEATS && (
            <PutTicketsCount
              ref={ticketsCountRef}
              name={"ticketsCount"}
              value={ticketsCount}
              handleChange={handleChange}
            />
          )}
        </>
      )}
    </>
  );
};

export default memo(SelectedAreasProps);
