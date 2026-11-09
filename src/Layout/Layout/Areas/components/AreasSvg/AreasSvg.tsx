import { forwardRef, memo } from "react";
import { FloorPropTypes, IAreaData, ILayoutView } from "../../types/areasTypes";
import { IStandardProperties, SvgElementType } from "types/types";
import Shapes from "./Shapes/Shapes";
import Temp from "./Temps/Temp";
import LayoutView from "./LayoutView/LayoutView";
import FloorsPlan from "./FloorsPlan/FloorsPlan";
import Grid from "../../../../../components/ui/Grid/Grid";
import { useTransformContext } from "react-zoom-pan-pinch";

interface IAreasSvg {
  areas: IAreaData[];
  selectedArea: IAreaData[];
  tempShape: IAreaData[];
  resizeCursor: boolean;
  multipleSelectArea: any;
  selectionRect: IStandardProperties;
  width: number | string;
  height: number | string;
  floorProperties: FloorPropTypes;
  selectedFloor: FloorPropTypes;
  sectionConTentView: boolean;
  layoutView: ILayoutView;
  handleDeleteArea: () => void;
  handleCopyArea: () => void;
  handlePasteArea: () => void;
  handleSetFocused: () => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: (e: React.MouseEvent) => void;
  handleSelectArea: (
    e: React.MouseEvent,
    area: IAreaData,
    scale: number
  ) => void;
  handleSelectFloor: (
    e: React.MouseEvent,
    floor: FloorPropTypes,
    scale: number
  ) => void;
}
const AreasSvg = forwardRef<SvgElementType, IAreasSvg>(
  (
    {
      areas,
      selectedArea,
      tempShape,
      resizeCursor,
      multipleSelectArea,
      selectionRect,
      width,
      height,
      floorProperties,
      selectedFloor,
      sectionConTentView,
      layoutView,
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      handleSetFocused,
      handleSelectArea,
      handleSelectFloor,
    },
    ref
  ) => {
    // const { getContext } = useTransformContext();
    // const scale = getContext().state.scale;
    const scale = 1;
    const handleSelectScaledArea = (e: React.MouseEvent, area: IAreaData) => {
      handleSelectArea(e, area, scale);
    };
    const handleSelectScaledFloor = (
      e: React.MouseEvent,
      floor: FloorPropTypes
    ) => {
      handleSelectFloor(e, floor, scale);
    };
    return (
      <svg
        id="panel-svg"
        tabIndex={0}
        className="pannable-svg"
        ref={ref}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={(e) => handleMouseMove(e)}
        onMouseUp={handleMouseUp}
        viewBox={"0 0 20000 20000"}
        onClick={handleSetFocused}
        onContextMenu={(e) => e.preventDefault()}
        // transform={`scale(${1})`}
        style={{
          overflow: "hidden",
          backgroundColor: "white",
        }}
      >
        <Grid />
        {layoutView?.properties && (
          <LayoutView floorProperties={layoutView.properties} />
        )}
        <FloorsPlan
          floorProperties={floorProperties}
          selectedFloor={selectedFloor}
          handleSelectFloor={handleSelectScaledFloor}
        />

        {areas?.map((area: IAreaData) => (
          <Shapes
            key={area.localId}
            area={area}
            selectedArea={selectedArea}
            resizeCursor={resizeCursor}
            sectionConTentView={sectionConTentView}
            handleSelectArea={handleSelectScaledArea}
          />
        ))}
        {tempShape.length
          ? tempShape.map((area: IAreaData) => (
              <Temp key={area.localId} area={area} />
            ))
          : null}
      </svg>
    );
  }
);

export default memo(AreasSvg);
