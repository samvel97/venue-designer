import { memo } from "react";
import SvgPathElement from "components/ui/SvgPathElement/SvgPathElement";
import {
  ShapeType,
  presentationBackgroundColor,
  presentationStrokeColor,
} from "Layout/Layout/Areas/constants/areasConstants";
import { FloorPropTypes } from "Layout/Layout/Areas/types/areasTypes";
import SvgEllipseElement from "components/ui/SvgEllipseElement/SvgEllipseElement";
import { toolType } from "types/types";
type Props = {
  floorProperties: FloorPropTypes;
  fillColor?: string;
};
const Floor = ({ floorProperties, fillColor }: Props) => {
  const backgroundShape = {
    [toolType.rectangle]: (
      <SvgPathElement
        id="area_background"
        properties={floorProperties}
        fill={fillColor ?? presentationBackgroundColor[ShapeType.BACKGROUND]}
        stroke={presentationStrokeColor[ShapeType.BACKGROUND]}
      />
    ),
    [toolType.ellipse]: (
      <SvgEllipseElement
        id="area_background"
        properties={floorProperties}
        fill={fillColor ?? presentationBackgroundColor[ShapeType.BACKGROUND]}
        stroke={presentationStrokeColor[ShapeType.BACKGROUND]}
      />
    ),
    [toolType.pen]: (
      <SvgPathElement
        id="area_background"
        properties={floorProperties}
        fill={fillColor ?? presentationBackgroundColor[ShapeType.BACKGROUND]}
        stroke={presentationStrokeColor[ShapeType.BACKGROUND]}
      />
    ),
  };
  return (
    <>
      {backgroundShape[floorProperties?.type as keyof typeof backgroundShape]}
    </>
  );
};

export default memo(Floor);
