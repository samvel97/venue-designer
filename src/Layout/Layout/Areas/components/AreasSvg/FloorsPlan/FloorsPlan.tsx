import { memo } from "react";
import { FloorPropTypes } from "../../../types/areasTypes";
import {
  backgroundColor,
  outlineColor,
  ShapeType,
  strokeColor,
} from "../../../constants/areasConstants";
import SvgPathElement from "components/ui/SvgPathElement/SvgPathElement";
import SvgEllipseElement from "components/ui/SvgEllipseElement/SvgEllipseElement";
import { toolType } from "types/types";
type Props = {
  floorProperties: FloorPropTypes;
  selectedFloor: FloorPropTypes;
  handleSelectFloor: (e: React.MouseEvent, floor: FloorPropTypes) => void;
};
const WrappedFloorPlan = ({
  floorProperties,
  selectedFloor,
  handleSelectFloor,
}: Props) => {
  const backgroundShape = {
    [toolType.rectangle]: (
      <SvgPathElement
        id="area_background"
        properties={floorProperties}
        handleSelectFloor={handleSelectFloor}
        fill={backgroundColor[ShapeType.BACKGROUND]}
        stroke={strokeColor[ShapeType.BACKGROUND]}
        style={{
          outline: selectedFloor ? outlineColor : "",
        }}
      />
    ),
    [toolType.ellipse]: (
      <SvgEllipseElement
        id="area_background"
        properties={floorProperties}
        handleSelectFloor={handleSelectFloor}
        fill={backgroundColor[ShapeType.BACKGROUND]}
        stroke={strokeColor[ShapeType.BACKGROUND]}
        style={{
          outline: selectedFloor ? "4px solid #2B5EE0" : "",
        }}
      />
    ),
    [toolType.pen]: (
      <SvgPathElement
        id="area_background"
        properties={floorProperties}
        handleSelectFloor={handleSelectFloor}
        fill={backgroundColor[ShapeType.BACKGROUND]}
        stroke={strokeColor[ShapeType.BACKGROUND]}
        style={{
          outline: selectedFloor ? outlineColor : "",
        }}
      />
    ),
  };
  return (
    <>
      {backgroundShape[floorProperties?.type as keyof typeof backgroundShape]}
    </>
  );
};
const FloorsPlan = memo(WrappedFloorPlan);
export default FloorsPlan;
