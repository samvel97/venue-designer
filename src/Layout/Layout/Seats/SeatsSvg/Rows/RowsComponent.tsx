import { Fragment, memo, type MouseEvent } from "react";
import { seatRadius } from "@/Layout/Layout/Seats/constants/seatsConstants";
import type { IRowData, TActionType } from "../../types/seatsTypes";
import ResizePoints from "./ResizePoints/ResizePoints";
import Rows from "./Rows/Rows";
import RowTitle from "./RowTitle/RowTitle";

interface RowsComponentProps {
  row: IRowData;
  isSelected: boolean;
  showResize: boolean;
  dimmed: boolean;
  pathMouseDown: (e: MouseEvent, row: IRowData) => void;
  getCoordsforResizing: (e: MouseEvent, actionName: TActionType) => void;
}

const RowsComponent = ({
  row,
  isSelected,
  showResize,
  dimmed,
  pathMouseDown,
  getCoordsforResizing,
}: RowsComponentProps) => {
  const onMouseDown = (e: MouseEvent) => pathMouseDown(e, row);
  const cursor = isSelected ? "move" : "default";
  const { rotate } = row.properties;

  return (
    <>
      <RowTitle rotate={rotate} row={row} order={row.rowOrder} />
      {isSelected ? <Rows row={row} /> : null}
      {isSelected && showResize ? <ResizePoints row={row} getCoordsforResizing={getCoordsforResizing} /> : null}
      {row.seats.map(({ localId, seatOrder, properties: { x, y, width, height } }) => (
        <Fragment key={localId}>
          <circle
            onMouseDown={onMouseDown}
            cx={x}
            cy={y}
            r={seatRadius}
            fill={dimmed ? "rgba(101, 106, 129, 0.3)" : "rgb(101, 106, 129)"}
            stroke="rgb(162, 162, 162)"
            strokeWidth={1}
            style={{ cursor }}
          />
          <text
            onMouseDown={onMouseDown}
            x={x + width / 2 - 12.5}
            y={y + height / 2 - 11.5}
            textAnchor="middle"
            alignmentBaseline="middle"
            fill="white"
            transform={`rotate(${rotate} ${x + width / 2 - 12} ${y + height / 2 - 12.5})`}
            style={{ cursor, fontFamily: "Segoe UI", fontSize: seatOrder > 99 ? 8 : 10 }}
          >
            {seatOrder}
          </text>
        </Fragment>
      ))}
    </>
  );
};

export default memo(RowsComponent);
