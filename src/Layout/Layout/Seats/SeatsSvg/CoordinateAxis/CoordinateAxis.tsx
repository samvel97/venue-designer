import { memo } from "react";
import { type IRowData } from "../../types/seatsTypes";
import { type IStandardProperties } from "@/types/types";
import { handleSameCoordinates } from "@/utils/dragging";

interface ICoordinateAxis {
  rotatingOutlinedArea: number;
  seatsRows: IRowData[];
  selectedRows: IRowData[];
  multipleSelectedRowsArea: IStandardProperties;
}
const CoordinateAxis = ({
  rotatingOutlinedArea,
  seatsRows,
  selectedRows,
  multipleSelectedRowsArea,
}: ICoordinateAxis) => {
  const { x, y, width, height } = multipleSelectedRowsArea;
  const { left, top, bottom, right } = handleSameCoordinates(seatsRows, selectedRows, multipleSelectedRowsArea);
  return (
    <>
      <line
        stroke={top ? "green" : "silver"}
        x1={0}
        y1={y}
        x2={20000}
        y2={y}
        strokeWidth="2"
        transform={`rotate(${rotatingOutlinedArea}, ${x + width / 2}, ${y + height / 2})`}
      />
      <line
        stroke={left ? "green" : "silver"}
        x1={x}
        y1={0}
        x2={x}
        y2={20000}
        strokeWidth="2"
        transform={`rotate(${rotatingOutlinedArea}, ${x + width / 2}, ${y + height / 2})`}
      />
      <line
        stroke={bottom ? "green" : "silver"}
        x1={0}
        y1={y + height}
        x2={20000}
        y2={y + height}
        strokeWidth="2"
        transform={`rotate(${rotatingOutlinedArea}, ${x + width / 2}, ${y + height / 2})`}
      />
      <line
        stroke={right ? "green" : "silver"}
        x1={x + width}
        y1={0}
        x2={x + width}
        y2={20000}
        strokeWidth="2"
        transform={`rotate(${rotatingOutlinedArea}, ${x + width / 2}, ${y + height / 2})`}
      />
    </>
  );
};

export default memo(CoordinateAxis);
