import { type IRowData, type TActionType } from "@/Layout/Layout/Seats/types/seatsTypes";
import { memo } from "react";

interface IResizePoints {
  row: IRowData;
  getCoordsforResizing: (e: React.MouseEvent, actionName: TActionType) => void;
}
const ResizePoints = ({ row, getCoordsforResizing }: IResizePoints) => {
  const leftToRight = row?.seats.length > 1 && row?.seats[0]?.properties?.x < row?.seats[1]?.properties?.x;

  return (
    <rect
      onMouseDown={(event: React.MouseEvent) => getCoordsforResizing(event, "resizeX")}
      x={row?.seats[row?.seats.length - 1]?.properties?.x + (leftToRight ? 10 : -15)}
      y={row?.seats[row?.seats.length - 1]?.properties?.y + 18 / 2 - 11.5}
      transform={`rotate(${row.properties?.rotate} ${
        row?.seats[row?.seats.length - 1]?.properties?.x + 25 / 2 - 12
      } ${row?.seats[row.seats.length - 1]?.properties?.y + 25 / 2 - 12.5})`}
      width={5}
      height={5}
      stroke="#A0A5BC"
      strokeWidth={0.5}
      fill="#A0A5BC"
      style={{ cursor: "e-resize" }}
    />
  );
};

export default memo(ResizePoints);
