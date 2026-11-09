import { memo, type MouseEvent, type Ref } from "react";
import Grid, { CANVAS_SIZE } from "@/components/canvas/Grid";
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
  zoom: number;
  floorProperties: FloorPropTypes;
  selectedFloor: FloorPropTypes;
  sectionConTentView: boolean;
  layoutView: ILayoutView;
  handleSetFocused: () => void;
  handleMouseDown: (e: MouseEvent) => void;
  handleMouseMove: (e: MouseEvent) => void;
  handleMouseUp: (e: MouseEvent) => void;
  handleSelectArea: (e: MouseEvent, area: IAreaData) => void;
  handleSelectFloor: (e: MouseEvent, floor: FloorPropTypes) => void;
}

const AreasSvg = ({
  ref,
  areas,
  selectedArea,
  tempShape,
  resizeCursor,
  zoom,
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
    width={CANVAS_SIZE * zoom}
    height={CANVAS_SIZE * zoom}
    viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
    onMouseDown={handleMouseDown}
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouseUp}
    onClick={handleSetFocused}
    onContextMenu={(e) => e.preventDefault()}
  >
    <Grid />
    {layoutView?.properties ? <LayoutView floorProperties={layoutView.properties} /> : null}
    <FloorsPlan floorProperties={floorProperties} selectedFloor={selectedFloor} handleSelectFloor={handleSelectFloor} />
    {areas.map((area) => (
      <Shapes
        key={area.localId}
        area={area}
        selectedArea={selectedArea}
        resizeCursor={resizeCursor}
        sectionConTentView={sectionConTentView}
        handleSelectArea={handleSelectArea}
      />
    ))}
    {tempShape.map((area) => (
      <Temp key={area.localId} area={area} />
    ))}
  </svg>
);

export default memo(AreasSvg);
