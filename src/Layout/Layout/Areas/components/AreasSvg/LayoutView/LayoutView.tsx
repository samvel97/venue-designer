import { memo } from "react";
import { type FloorPropTypes } from "../../../types/areasTypes";

import SvgPathElement from "@/components/canvas/SvgPathElement";
import SvgEllipseElement from "@/components/canvas/SvgEllipseElement";
import { toolType } from "@/types/types";
type Props = {
  floorProperties: FloorPropTypes;
};
const LayoutView = ({ floorProperties }: Props) => {
  const backgroundShape = {
    [toolType.rectangle]: (
      <SvgPathElement
        id="layout_view"
        properties={floorProperties}
        fill={"white"}
        stroke={"black"}
        strokeDasharray="35,10"
        strokeWidth={1}
      />
    ),
    [toolType.ellipse]: (
      <SvgEllipseElement
        id="layout_view"
        properties={floorProperties}
        fill={"white"}
        stroke={"black"}
        strokeDasharray="35,10"
        strokeWidth={1}
      />
    ),
    [toolType.pen]: (
      <SvgPathElement
        id="layout_view"
        properties={floorProperties}
        fill={"white"}
        stroke={"black"}
        strokeDasharray="35,10"
        strokeWidth={1}
      />
    ),
  };
  return <>{backgroundShape[floorProperties?.type as keyof typeof backgroundShape]}</>;
};

export default memo(LayoutView);
