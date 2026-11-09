import { ShapeType } from "Layout/Layout/Areas/constants/areasConstants";
import {
  IAreaData,
  IAreasProperties,
} from "Layout/Layout/Areas/types/areasTypes";

interface Props extends React.ComponentProps<"ellipse"> {
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
const SvgEllipseElement = ({
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
  } = properties || { height: 0, width: 0, rotate: 0, x: 0, y: 0 };
  return (
    <>
      <ellipse
        {...props}
        onMouseDown={(event: React.MouseEvent) =>
          handleSelectFloor?.(event, properties!) ??
          handleSelectShape?.(event, area!)
        }
        id={`area_background`}
        x={x}
        y={y}
        width={areaW}
        height={areaH}
        cx={x + areaW / 2}
        cy={y + areaH / 2}
        rx={areaW / 2}
        ry={areaH / 2}
        transform={`rotate(${areaR}, ${x + areaW / 2}, ${y + areaH / 2})`}
        strokeWidth={strokeWidth}
        opacity={opacity}
        strokeLinejoin={"round"}
      />
      {title && (
        <text
          x={x + areaW / 2}
          y={area?.areaType === ShapeType.NON_RESERVED ? y + areaH / 2 : y - 20}
          transform={`rotate(${areaR}, ${x + areaW / 2}, ${y + areaH / 2})`}
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

export default SvgEllipseElement;
