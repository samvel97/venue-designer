import { IRowData, ISeatsData } from "Layout/Layout/Seats/types/seatsTypes";

export function highestOrderSeat(rows: IRowData[]): ISeatsData | null {
    let highestOrderSeat: ISeatsData | null = null;

    rows.forEach((row) => {
      row.seats.forEach((seat) => {
        if (
          highestOrderSeat === null ||
          seat.seatOrder > highestOrderSeat.seatOrder
        ) {
          highestOrderSeat = seat;
        }
      });
    });

    return highestOrderSeat;
  }