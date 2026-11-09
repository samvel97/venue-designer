import { memo, type MouseEvent, type Ref } from "react";
import Grid from "@/components/canvas/Grid";
import type { SvgElementType } from "@/types/types";
import type { FloorPropTypes, IAreaData, ILayoutView } from "../../types/areasTypes";
import FloorsPlan from "./FloorsPlan/FloorsPlan";
import LayoutView from "./LayoutView/LayoutView";
import Shapes from "./Shapes/Shapes";
import Temp from "./Temps/Temp";

interface AreasSvgProps {
  ref: Ref<SvgElementType>;
  areas: IAreaData[];
  selectedArea: IAreaData[];
  tempShape: IAreaData[];
  resizeCursor: boolean;
  width: number;
  height: number;
  floorProperties: FloorPropTypes;
  selectedFloor: FloorPropTypes;
  sectionConTentView: boolean;
  layoutView: ILayoutView;
  handleSetFocused: () => void;
  handleMouseDown: (e: MouseEvent) => void;
  handleMouseMove: (e: MouseEvent) => void;
  handleMouseUp: (e: MouseEvent) => void;
  handleSelectArea: (e: MouseEvent, area: IAreaData, scale: number) => void;
  handleSelectFloor: (e: MouseEvent, floor: FloorPropTypes, scale: number) => void;
}

const AreasSvg = ({
  ref,
  areas,
  selectedArea,
  tempShape,
  resizeCursor,
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
}: AreasSvgProps) => (
  <svg
    id="panel-svg"
    tabIndex={0}
    ref={ref}
    className="block bg-white outline-none"
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    onMouseDown={handleMouseDown}
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouseUp}
    onClick={handleSetFocused}
    onContextMenu={(e) => e.preventDefault()}
  >
    <Grid />
    {layoutView?.properties ? <LayoutView floorProperties={layoutView.properties} /> : null}
    <FloorsPlan
      floorProperties={floorProperties}
      selectedFloor={selectedFloor}
      handleSelectFloor={(e, floor) => handleSelectFloor(e, floor, 1)}
    />
    {areas.map((area) => (
      <Shapes
        key={area.localId}
        area={area}
        selectedArea={selectedArea}
        resizeCursor={resizeCursor}
        sectionConTentView={sectionConTentView}
        handleSelectArea={(e, selected) => handleSelectArea(e, selected, 1)}
      />
    ))}
    {tempShape.map((area) => (
      <Temp key={area.localId} area={area} />
    ))}
  </svg>
);

export default memo(AreasSvg);
