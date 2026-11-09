import { ShapeType } from "Layout/Layout/Areas/constants/areasConstants";
import {
  IAreaData,
  IAreasProperties,
} from "Layout/Layout/Areas/types/areasTypes";
import { memo, useMemo } from "react";
import { toolType } from "types/types";
import { shapeCenter } from "utils/shapeCenter";

interface Props extends React.ComponentProps<"path"> {
  area?: IAreaData;
  properties?: IAreasProperties | null;
  title?: string;
  textSize?: number;
  handleSelectShape?: (e: React.MouseEvent, shapeProps: IAreaData) => void;
  handleSelectFloor?: (
    e: React.MouseEvent,
    shapeProps: IAreasProperties
  ) => void;
}

const SvgPathElement = ({
  area,
  properties,
  title,
  opacity = 1,
  strokeWidth = 6,
  textSize = 16,
  handleSelectShape,
  handleSelectFloor,
  ...props
}: Props) => {
  const {
    height: areaH,
    width: areaW,
    rotate: areaR,
    x,
    y,
    cornerBottomLeft,
    cornerBottomRight,
    cornerTopLeft,
    cornerTopRight,
    type,
    d: dOption,
  } = properties || {
    height: 0,
    width: 0,
    rotate: 0,
    x: 0,
    y: 0,
    cornerBottomLeft: 0,
    cornerBottomRight: 0,
    cornerTopLeft: 0,
    cornerTopRight: 0,
    type: toolType.rectangle,
    d: undefined,
  };
  const topLeft = cornerTopLeft ?? 0;
  const topRight = cornerTopRight ?? 0;
  const bottomLeft = cornerBottomLeft ?? 0;
  const bottomRight = cornerBottomRight ?? 0;
  let myCenterX = x + areaW / 2;
  let myCenterY = y + areaH / 2;
  let minimumY = y;
  if (area?.areaType === ShapeType.NON_RESERVED) {
    minimumY = myCenterY;
  }
  if (type === toolType.pen) {
    let { centerX, centerY, minY } = shapeCenter(dOption as string);
    myCenterX = centerX;
    myCenterY = centerY;
    minimumY = minY;

    if (area?.areaType === ShapeType.NON_RESERVED) {
      minimumY = centerY;
    }
  }

  const d = useMemo(
    () => `
            M ${x + topLeft || 0} ${y}
            L ${x + areaW - (topRight || 0)} ${y}
            A ${topRight || 0} ${topRight || 0}, 0, 0, 1, ${x + areaW} ${
      y + (topRight || 0)
    }
            L ${x + areaW} ${y + areaH - (bottomRight || 0)}
            A ${bottomRight || 0} ${bottomRight || 0}, 0, 0, 1, ${
      x + areaW - (bottomRight || 0)
    } ${y + areaH}
            L ${x + (bottomLeft || 0)} ${y + areaH}
            A ${bottomLeft || 0} ${bottomLeft || 0}, 0, 0, 1, ${x} ${
      y + areaH - (bottomLeft || 0)
    }
            L ${x} ${y + (topLeft || 0)}
            A ${topLeft || 0} ${topLeft || 0}, 0, 0, 1, ${
      x + (topLeft || 0)
    } ${y}
            Z
        `,
    [
      myCenterX,
      myCenterY,
      areaW,
      areaH,
      areaR,
      cornerTopRight,
      cornerTopLeft,
      cornerBottomRight,
      cornerBottomLeft,
    ]
  );

  return (
    <>
      <path
        {...props}
        onMouseDown={(event: React.MouseEvent) =>
          handleSelectFloor?.(event, properties!) ??
          handleSelectShape?.(event, area!)
        }
        x={x}
        y={y}
        width={areaW}
        height={areaH}
        d={dOption ?? d}
        // style={{ transformOrigin: `${0},${0}` }}
        transform={`rotate(${areaR}, ${myCenterX}, ${myCenterY})`}
        strokeWidth={strokeWidth}
        opacity={opacity}
        strokeLinejoin={"round"}
      />
      {title && (
        <text
          x={myCenterX}
          y={(minimumY ?? y) - 20}
          transform={`rotate(${areaR}, ${myCenterX}, ${myCenterY})`}
          textAnchor="middle"
          alignmentBaseline="middle"
          fill="black"
          style={{ fontSize: textSize }}
        >
          {title}
        </text>
      )}
    </>
  );
};

export default memo(SvgPathElement);
