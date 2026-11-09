import { IRowData } from "Layout/Layout/Seats/types/seatsTypes";
import { memo } from "react";

interface IRowTitle {
  row: IRowData;
  rotate: number;
  order: number | string;
}
const RowTitle = ({ row, rotate, order }: IRowTitle) => {
  const leftToRight =
    row?.seats.length > 1 &&
    row?.seats[0]?.properties?.x < row.seats[1]?.properties?.x;

  return (
    <text
      x={row?.seats?.[0]?.properties?.x - (leftToRight ? 25 : -30)}
      y={row?.seats?.[0]?.properties?.y + 25 / 2 - 11.5}
      transform={`rotate(${rotate} ${
        row?.seats?.[0]?.properties?.x + 25 / 2 - 12
      } ${row?.seats?.[0]?.properties?.y + 25 / 2 - 12.5})`}
      textAnchor="middle"
      alignmentBaseline="middle"
      fill="black"
    >
      {order || "?"}
    </text>
  );
};

export default memo(RowTitle);
