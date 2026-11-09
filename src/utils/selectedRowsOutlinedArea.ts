import { IRowData, ISeatsData } from "Layout/Layout/Seats/types/seatsTypes";

export const selectedItemsOutlinedArea = (selectedRows: IRowData[]) => {
    let coords = { x: 0, y: 0, width: 0, height: 0 };
    if (selectedRows.length) {
      const x = Math.min(
        ...selectedRows.flatMap((row: IRowData) =>
          row.seats.map(
            (seat: ISeatsData) =>
              ( seat.properties.x) - 10
          )
        )
      );
      const y = Math.min(
        ...selectedRows.flatMap((row: IRowData) =>
          row.seats.map(
            (seat: ISeatsData) =>
              ( seat.properties.y) - 8.5
          )
        )
      );
      const width =
        Math.max(
          ...selectedRows.flatMap((row: IRowData) =>
            row.seats.map(
              (seat: ISeatsData) =>
                ( seat.properties.x) +
                seat.properties.width -
                5
            )
          )
        ) -
        Math.min(
          ...selectedRows.flatMap((row: IRowData) =>
            row.seats.map(
              (seat: ISeatsData) =>
                 seat.properties.x
            )
          )
        );

      const height =
        Math.max(
          ...selectedRows.flatMap((row: IRowData) =>
            row.seats.map(
              (seat: ISeatsData) =>
                ( seat.properties.y) +
                seat.properties.height -
                8.5
            )
          )
        ) -
        Math.min(
          ...selectedRows.flatMap((row: IRowData) =>
            row.seats.map(
              (seat: ISeatsData) =>
                 seat.properties.y
            )
          )
        );
      coords = { x, y, width, height };
    }
    return coords;
  };