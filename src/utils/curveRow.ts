import { IRowData, ISeatsData } from "Layout/Layout/Seats/types/seatsTypes";

export const curveRow = (selectedRows: IRowData[], curve?: number) => {
  return selectedRows.map((row: IRowData) => {
    const { curve: rowCurve } = row.properties;
    const seats = row.seats;
    const middleItemIndex = Math.floor(seats.length / 2);
    let curveAmount = rowCurve;

    if (curve !== undefined) {
      curveAmount = curve === 0 ? -rowCurve : curve - rowCurve;
    }

    const curveAmountForEachSeat = curveAmount / middleItemIndex;
    const seatSpacing = seats[1]?.properties.x - seats[0]?.properties.x;
    let bla: number;

    if (seats.length % 2 === 0) {
      bla =
        Math.pow(middleItemIndex, 2) * curveAmountForEachSeat -
        Math.pow(middleItemIndex - 1, 2) * curveAmountForEachSeat;
    } else {
      bla = 0;
    }
    seats.forEach((seat: ISeatsData, i: number) => {
      const { x, y } = seat.properties;
      let curvedY;
      let curvedX = x;
      if (i < middleItemIndex) {
        curvedY =
          y +
          Math.pow(middleItemIndex - (seats.length % 2 === 0 ? i + 1 : i), 2) *
            curveAmountForEachSeat -
          Math.pow(middleItemIndex, 2) * curveAmountForEachSeat +
          bla;
        curvedX =
          seats[seats.length - 1].properties.x -
          (middleItemIndex - (seats.length % 2 === 0 ? i + 1 : i)) *
            seatSpacing -
          middleItemIndex * seatSpacing;
      } else if (i > middleItemIndex) {
        curvedY =
          y +
          Math.pow(i - middleItemIndex, 2) * curveAmountForEachSeat -
          Math.pow(middleItemIndex, 2) * curveAmountForEachSeat +
          bla;
        curvedX = seats[0].properties.x + i * seatSpacing;
      } else {
        curvedY = y - i * curveAmount + bla;
      }
      seat.properties.x = curvedX;
      seat.properties.y = curvedY;
    });
    return {
      ...row,
      properties: {
        ...row.properties,
        curve: curve ?? row.properties.curve,
      },
      seats: seats,
    };
  });
};
