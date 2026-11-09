import { type IRowData } from "@/Layout/Layout/Seats/types/seatsTypes";
import { memo } from "react";
interface IRowComponent {
  row: IRowData;
}
const Rows = ({ row }: IRowComponent) => {
  return (
    <line
      x1={row.seats[0].properties.x}
      y1={row.seats[0].properties.y}
      x2={row.seats[row.seats.length - 1].properties.x}
      y2={row.seats[row.seats.length - 1].properties.y}
      stroke="#A0A5BC"
      strokeWidth={2}
      fill="rgba(0, 0, 0, 0)"
    />
  );
};

export default memo(Rows);
