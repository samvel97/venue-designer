import SvgEllipseElement from "components/ui/SvgEllipseElement/SvgEllipseElement";
import SvgPathElement from "components/ui/SvgPathElement/SvgPathElement";
import {
  strokeColor,
  tempFill,
} from "Layout/Layout/Areas/constants/areasConstants";
import { IAreaData } from "Layout/Layout/Areas/types/areasTypes";
import { Fragment, memo } from "react";
import { toolType } from "types/types";
import { getLSData } from "utils/getLsData";

interface ITemp {
  area: IAreaData;
}

const Temp = ({ area }: ITemp) => {
  const drawingShape = () => {
    const { type: shapeType, x, y } = area.properties;
    const lang = getLSData("locale");
    switch (shapeType) {
      case toolType.ellipse:
        return (
          <SvgEllipseElement
            id={"area-temp"}
            area={area}
            properties={area.properties}
            title={area.title[lang! as keyof typeof area.title]}
            fill={tempFill}
            strokeWidth={0}
          />
        );
      case toolType.rectangle:
        return (
          <SvgPathElement
            id={"area-temp"}
            area={area}
            properties={area.properties}
            title={area.title[lang! as keyof typeof area.title]}
            fill={tempFill}
            stroke={strokeColor[area.areaType]}
            strokeWidth={0}
          />
        );
      case toolType.pen:
        let firstLOccurrence = area.properties.d?.lastIndexOf("l") || 0;
        let result = area.properties.d?.substring(firstLOccurrence) || "";
        const coords = result.split(" ");
        const strokeGreen =
          +coords[1] === 0 || +coords[2] === 0
            ? "green"
            : strokeColor[area.areaType];
        const strokeWidth = +coords[1] === 0 || +coords[2] === 0 ? 3 : 1;
        return (
          <>
            <SvgPathElement
              id={"area-temp"}
              area={area}
              properties={area.properties}
              title={area.title[lang! as keyof typeof area.title]}
              fill={tempFill}
              stroke={strokeGreen}
              strokeWidth={strokeWidth}
            />
            <circle r={5} fill="#000" cx={x} cy={y} />
          </>
        );
    }
  };

  return <Fragment key={area.localId}>{drawingShape()}</Fragment>;
};

export default memo(Temp);
