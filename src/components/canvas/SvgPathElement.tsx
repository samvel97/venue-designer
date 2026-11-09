import { memo, type ComponentProps, type MouseEvent } from "react";
import { ShapeType } from "@/Layout/Layout/Areas/constants/areasConstants";
import type { IAreaData, IAreasProperties } from "@/Layout/Layout/Areas/types/areasTypes";
import { toolType } from "@/types/types";
import { roundedRectPath } from "@/utils/roundedRectPath";
import { shapeCenter } from "@/utils/shapeCenter";

interface Props extends ComponentProps<"path"> {
  area?: IAreaData;
  properties?: IAreasProperties | null;
  title?: string;
  textSize?: number;
  handleSelectShape?: (e: MouseEvent, shapeProps: IAreaData) => void;
  handleSelectFloor?: (e: MouseEvent, shapeProps: IAreasProperties) => void;
}

const empty = { x: 0, y: 0, width: 0, height: 0, rotate: 0, type: toolType.rectangle } as IAreasProperties;

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
  const shape = properties ?? empty;
  const { x, y, width, height, rotate, type, d } = shape;
  const nonReserved = area?.areaType === ShapeType.NON_RESERVED;

  let centerX = x + width / 2;
  let centerY = y + height / 2;
  let titleY = nonReserved ? centerY : y;
  if (type === toolType.pen) {
    const center = shapeCenter(d as string);
    centerX = center.centerX;
    centerY = center.centerY;
    titleY = nonReserved ? center.centerY : center.minY;
  }
  const transform = `rotate(${rotate}, ${centerX}, ${centerY})`;

  return (
    <>
      <path
        {...props}
        onMouseDown={(event) => handleSelectFloor?.(event, properties!) ?? handleSelectShape?.(event, area!)}
        d={d ?? roundedRectPath(x, y, width, height, shape)}
        transform={transform}
        strokeWidth={strokeWidth}
        opacity={opacity}
        strokeLinejoin="round"
      />
      {title ? (
        <text
          x={centerX}
          y={titleY - 20}
          transform={transform}
          textAnchor="middle"
          alignmentBaseline="middle"
          fill="black"
          style={{ fontSize: textSize }}
        >
          {title}
        </text>
      ) : null}
    </>
  );
};

export default memo(SvgPathElement);
