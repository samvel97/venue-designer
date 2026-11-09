import { memo } from "react";
import { BackgroundType } from "./types/background";
import Rectangle from "./components/Rectangle/Rectangle";
import Ellipse from "./components/Ellipse/Ellipse";
import { getLSData } from "utils/getLsData";
import { toolType } from "types/types";
import { shapeCenter } from "utils/shapeCenter";

const Background = ({ selectedArea, centerX, centerY, d }: BackgroundType) => {
  const { x, y, width, height, type, rotate } = selectedArea.properties;
  const title = selectedArea.title;
  const lang = getLSData("locale");
  let myCenterX = centerX + width / 2;
  let myCenterY = centerY + height / 2;
  if (type === toolType.pen) {
    let { centerX: pathX, centerY: pathY, minY } = shapeCenter(d as string);
    myCenterX = pathX;
    myCenterY = pathY;
    centerY = minY;
  }
  return (
    <>
      {type === "rectangle" || type === "pen" ? (
        <Rectangle
          d={d}
          rotate={rotate}
          centerX={centerX}
          width={width}
          centerY={centerY}
          height={height}
        />
      ) : (
        <Ellipse
          rotate={rotate}
          centerX={centerX}
          width={width}
          centerY={centerY}
          height={height}
          x={x}
          y={y}
        />
      )}
      {title && (
        <text
          x={myCenterX}
          y={centerY - 40}
          transform={`rotate(${rotate}, ${myCenterX}, ${myCenterY})`}
          textAnchor="middle"
          alignmentBaseline="middle"
          fill="black"
          style={{ fontSize: 14 }}
        >
          {title[lang! as keyof typeof title]}
        </text>
      )}
    </>
  );
};

export default memo(Background);
