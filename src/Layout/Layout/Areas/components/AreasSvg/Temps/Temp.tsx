import SvgEllipseElement from "@/components/canvas/SvgEllipseElement";
import SvgPathElement from "@/components/canvas/SvgPathElement";
import { strokeColor, tempFill } from "@/Layout/Layout/Areas/constants/areasConstants";
import { type IAreaData } from "@/Layout/Layout/Areas/types/areasTypes";
import { memo } from "react";
import { toolType } from "@/types/types";
import { areaTitle } from "@/utils/areaTitle";

interface ITemp {
  area: IAreaData;
}

const Temp = ({ area }: ITemp) => {
  const drawingShape = () => {
    const { type: shapeType, x, y } = area.properties;
    switch (shapeType) {
      case toolType.ellipse:
        return (
          <SvgEllipseElement
            id={"area-temp"}
            area={area}
            properties={area.properties}
            title={areaTitle(area.title)}
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
            title={areaTitle(area.title)}
            fill={tempFill}
            stroke={strokeColor[area.areaType]}
            strokeWidth={0}
          />
        );
      case toolType.pen: {
        const d = area.properties.d ?? "";
        const [, dx, dy] = d.substring(d.lastIndexOf("l")).split(" ");
        const closing = +dx === 0 || +dy === 0;
        return (
          <>
            <SvgPathElement
              id={"area-temp"}
              area={area}
              properties={area.properties}
              title={areaTitle(area.title)}
              fill={tempFill}
              stroke={closing ? "green" : strokeColor[area.areaType]}
              strokeWidth={closing ? 3 : 1}
            />
            <circle r={5} fill="#000" cx={x} cy={y} />
          </>
        );
      }
    }
  };

  return drawingShape();
};

export default memo(Temp);
