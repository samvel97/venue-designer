import { memo } from "react";
import { type IStandardProperties } from "../../../../../types/types";
import { type TActionType } from "../../types/seatsTypes";

const MultipleSelectedRowsArea = ({
  rotatingOutlinedArea,
  multipleSelectedRowsArea: { x, y, width, height },
  getCoordsforResizing,
}: {
  rotatingOutlinedArea: number;
  multipleSelectedRowsArea: IStandardProperties;
  getCoordsforResizing: (e: React.MouseEvent, actionName: TActionType) => void;
}) => {
  return (
    <>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        transform={`rotate(${rotatingOutlinedArea}, ${x + width / 2}, ${y + height / 2})`}
        stroke="#A0A5BC"
        strokeWidth={1}
        fill="rgba(0, 0, 0, 0)"
        style={{ cursor: "move" }}
      />
      <line
        x1={x + width / 2}
        y1={y}
        x2={x + width / 2}
        y2={y - 20}
        stroke="#A0A5BC"
        strokeWidth="2"
        transform={`rotate(${rotatingOutlinedArea}, ${x + width / 2}, ${y + height / 2})`}
      />
      <circle
        onMouseDown={(e) => getCoordsforResizing(e, "rotating")}
        cx={x + width / 2}
        cy={y - 20}
        r={4}
        stroke="#A0A5BC"
        strokeWidth="2"
        transform={`rotate(${rotatingOutlinedArea}, ${x + width / 2}, ${y + height / 2})`}
      />
    </>
  );
};

export default memo(MultipleSelectedRowsArea);
