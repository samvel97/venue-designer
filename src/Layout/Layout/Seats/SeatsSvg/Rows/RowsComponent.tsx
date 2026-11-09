import { Fragment, memo } from "react";
import RowTitle from "./RowTitle/RowTitle";
import Seats from "./Seats/Seats";
import ResizePoints from "./ResizePoints/ResizePoints";
import { type IRowData, type ISeatsData, type TActionType } from "../../types/seatsTypes";
import { hasRotatedItem } from "@/utils/hasRotatedRow";
import Rows from "./Rows/Rows";
interface IRowComponent {
  row: IRowData;
  selectedRows: IRowData[];
  resize: string | null;
  pathMouseDown: (e: React.MouseEvent, row: IRowData) => void;
  getCoordsforResizing: (e: React.MouseEvent, actionName: TActionType) => void;
  chooseSeats: (seats: ISeatsData) => void;
}
const RowsComponent = ({
  row,
  selectedRows,
  resize,
  pathMouseDown,
  getCoordsforResizing,
  chooseSeats,
}: IRowComponent) => {
  const { rotate } = row.properties;

  return (
    <>
      <RowTitle rotate={rotate} row={row} order={row.rowOrder} />
      {selectedRows.some((selectedRow) => selectedRow.localId === row.localId) ? (
        <>
          <Rows row={row} />
          {!hasRotatedItem(selectedRows) && (
            <>
              <ResizePoints row={row} getCoordsforResizing={getCoordsforResizing} />
            </>
          )}
        </>
      ) : null}

      {row.seats.map((seat: ISeatsData) => (
        <Fragment key={seat.localId}>
          <Seats
            seat={seat}
            selectedRows={selectedRows}
            row={row}
            resize={resize}
            seatMouseDown={pathMouseDown}
            chooseSeats={chooseSeats}
          />
        </Fragment>
      ))}
    </>
  );
};

export default memo(RowsComponent);
