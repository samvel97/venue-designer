import { memo } from "react";
import { type IRowData, type ISeatsData } from "../../../types/seatsTypes";
import { seatRadius } from "@/Layout/Layout/Seats/constants/seatsConstants";

interface ISeatsComponent {
  seat: ISeatsData;
  selectedRows: IRowData[];
  row: IRowData;
  resize: string | null;
  seatMouseDown: (e: React.MouseEvent, row: IRowData) => void;
  chooseSeats: (seats: ISeatsData) => void;
}
const Seats = ({ seat, selectedRows, row, resize, seatMouseDown }: ISeatsComponent) => {
  const { x, y, width, height } = seat.properties;

  return (
    <>
      <circle
        onMouseDown={(e) => seatMouseDown(e, row)}
        cx={x}
        cy={y}
        r={seatRadius}
        fill={
          selectedRows.some((selectedRow) => selectedRow.localId === row.localId) && resize
            ? "rgba(101, 106, 129,0.3)"
            : "rgba(101, 106, 129,1)"
        }
        stroke="rgb(162, 162, 162)"
        strokeWidth={1}
        strokeLinejoin={"round"}
        opacity={1}
        style={{
          cursor: selectedRows.some((selectedRow) => selectedRow.localId === row.localId) ? "move" : "default",
        }}
      />
      <text
        onMouseDown={(e) => seatMouseDown(e, row)}
        x={x + width / 2 - 12.5}
        y={y + height / 2 - 11.5}
        textAnchor="middle"
        alignmentBaseline="middle"
        fill="white"
        transform={`rotate(${row.properties.rotate} ${x + width / 2 - 12} ${y + height / 2 - 12.5})`}
        style={{
          color: "black",
          fontFamily: "Segoe UI",
          fontSize: seat.seatOrder > 99 ? 8 : 10,
          fontStyle: "normal",
          fontWeight: 400,
          cursor: selectedRows.some((selectedRow) => selectedRow.localId === row.localId) ? "move" : "default",
        }}
      >
        {seat.seatOrder}
      </text>
    </>
  );
};

export default memo(Seats);
