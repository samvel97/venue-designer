import { memo, type ChangeEvent, type RefObject } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Armchair, ChevronRight } from "lucide-react";
import ContentSwitch from "@/components/editor/ContentSwitch";
import NumberFields from "@/components/editor/NumberFields";
import OptionSelect from "@/components/editor/OptionSelect";
import TextField from "@/components/editor/TextField";
import ToolGroup from "@/components/editor/ToolGroup";
import { Button } from "@/components/primitives/button";
import { Section } from "@/components/primitives/section";
import { useAppSelector } from "@/store/hooks";
import { type IActions, type languageTypes, toolType } from "@/types/types";
import { textToBinary } from "@/utils";
import { storageKeys } from "@/utils/storageKeys";
import { areasCreatingActions, areasManipulationActions, ShapeType, toolTypes } from "../constants/areasConstants";
import type { FloorPropTypes, IAreaData, IAreasProperties, IManipulationProperties } from "../types/areasTypes";

interface AreasSidebarProps {
  tool: toolType;
  shapeType: ShapeType;
  selectedArea: IAreaData[];
  selectedFloor: FloorPropTypes;
  inputValues: IManipulationProperties;
  inputRef: RefObject<HTMLInputElement | null>;
  ticketsCountRef: RefObject<HTMLInputElement | null>;
  refList: RefObject<(HTMLInputElement | null)[]>;
  venueId: string;
  floor: string;
  isEqual: boolean;
  sectionContentView: boolean;
  handleToolTypeChange: (type: toolType) => void;
  selectShapeType: (type: ShapeType) => void;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleDeleteArea: () => void;
  handleCopyArea: () => void;
  handlePasteArea: () => void;
  flipHorizontal: (selectedArea: IAreaData[]) => void;
  flipVertical: (selectedArea: IAreaData[]) => void;
  handleSectionContentView: () => void;
}

const without = (...titles: toolType[]) => areasManipulationActions.filter((action) => !titles.includes(action.title));

const geometry = ({
  type,
  width,
  height,
  rotate,
  cornerTopLeft,
  cornerTopRight,
  cornerBottomRight,
  cornerBottomLeft,
}: IAreasProperties) =>
  type === toolType.pen
    ? { rotate }
    : { width, height, rotate, cornerTopLeft, cornerTopRight, cornerBottomRight, cornerBottomLeft };

const ManageSeatsButton = ({
  area,
  venueId,
  floor,
  isEqual,
}: {
  area: IAreaData;
  venueId: string;
  floor: string;
  isEqual: boolean;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { areas, floorProps, floorsCount } = useAppSelector((state) => state.venue);

  const open = () => {
    if (!isEqual) {
      localStorage.setItem(
        storageKeys.areas(floor, venueId),
        textToBinary({ floorsCount, properties: floorProps, areas }),
      );
    }
    navigate(`seats/${area.localId}?id=${venueId}&floor=${floor}`);
  };

  return (
    <Button variant="outline" className="justify-between" onClick={open}>
      <span className="flex items-center gap-2">
        <Armchair />
        {t("toolbar.manage_seats")}
      </span>
      <ChevronRight />
    </Button>
  );
};

const AreasSidebar = ({ inputRef, ticketsCountRef, refList, ...props }: AreasSidebarProps) => {
  const { t } = useTranslation();
  const { tool, shapeType, selectedArea, selectedFloor, inputValues, handleChange, handleToolTypeChange } = props;
  const [area] = selectedArea;
  const single = selectedArea.length === 1 && !selectedFloor ? area : null;
  const editing = selectedArea.length > 0 || !!selectedFloor;

  const handlers: Partial<Record<toolType, () => void>> = {
    [toolType.flipHorizontal]: () => props.flipHorizontal(selectedArea),
    [toolType.flipVertical]: () => props.flipVertical(selectedArea),
    [toolType.copy]: props.handleCopyArea,
    [toolType.paste]: props.handlePasteArea,
    [toolType.delete]: props.handleDeleteArea,
  };

  const availableActions = (): IActions[] => {
    if (selectedArea.length > 1 || (selectedArea.length && selectedFloor)) {
      return areasManipulationActions.filter((action) => action.title === toolType.delete);
    }
    if (selectedFloor) {
      return selectedFloor.type === toolType.pen
        ? without(toolType.flipVertical, toolType.flipHorizontal, toolType.copy, toolType.paste)
        : without(toolType.copy, toolType.paste);
    }
    return area?.properties.type === toolType.pen
      ? without(toolType.flipVertical, toolType.flipHorizontal)
      : areasManipulationActions;
  };

  const shapeProps = single?.properties ?? (selectedArea.length ? null : selectedFloor);

  return (
    <>
      <Section title={t("toolbar.tools")}>
        <ToolGroup actions={areasCreatingActions} active={tool} onSelect={handleToolTypeChange} />
        <ContentSwitch checked={props.sectionContentView} onToggle={props.handleSectionContentView} />
      </Section>

      {toolTypes.includes(tool) ? (
        <Section title={t("toolbar.area_type")}>
          <OptionSelect options={Object.values(ShapeType)} value={shapeType} onChange={props.selectShapeType} />
        </Section>
      ) : null}

      {single ? (
        <Section title={t("toolbar.area")}>
          {single.areaType === ShapeType.WITH_SEATS ? (
            <ManageSeatsButton area={single} venueId={props.venueId} floor={props.floor} isEqual={props.isEqual} />
          ) : null}
          {Object.keys(inputValues.title).map((lang) => (
            <TextField
              key={lang}
              ref={inputRef}
              name={lang}
              label={`${t("toolbar.name")} · ${lang.toUpperCase()}`}
              value={single.title[lang as languageTypes]}
              onChange={handleChange}
            />
          ))}
        </Section>
      ) : null}

      {editing ? (
        <Section title={t("toolbar.actions")}>
          <ToolGroup actions={availableActions()} onSelect={(action) => handlers[action]?.()} />
        </Section>
      ) : null}

      {shapeProps ? (
        <Section title={t("toolbar.geometry")}>
          <NumberFields
            values={geometry(shapeProps)}
            refList={refList}
            withCorners={shapeProps.type !== toolType.ellipse}
            onChange={handleChange}
          />
          {single?.areaType === ShapeType.WITHOUT_SEATS ? (
            <TextField
              ref={ticketsCountRef}
              type="number"
              name="ticketsCount"
              label={t("toolbar.ticketsCount")}
              value={single.ticketsCount ?? ""}
              onChange={handleChange}
            />
          ) : null}
        </Section>
      ) : null}
    </>
  );
};

export default memo(AreasSidebar);
