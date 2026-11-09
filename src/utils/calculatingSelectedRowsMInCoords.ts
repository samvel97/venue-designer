import { type IRowData, type ISeatsData } from "@/Layout/Layout/Seats/types/seatsTypes";

export const calculatingSelectedRowsMInCoords = (selectedRows: IRowData[], moving: boolean = false) => {
  const coords = { x: 0, y: 0, width: 0, height: 0 };
  if (selectedRows.length) {
    coords.x = Math.min(
      ...selectedRows.flatMap((row: IRowData) => row.seats.map((seat: ISeatsData) => seat.properties.x)),
    );
    coords.y = Math.min(
      ...selectedRows.flatMap((row: IRowData) => row.seats.map((seat: ISeatsData) => seat.properties.y)),
    );
    if (!moving) {
      coords.width =
        Math.max(
          ...selectedRows.flatMap((row: IRowData) =>
            row.seats.map((seat: ISeatsData) => seat.properties.x + seat.properties.width),
          ),
        ) -
        Math.min(...selectedRows.flatMap((row: IRowData) => row.seats.map((seat: ISeatsData) => seat.properties.x)));

      coords.height =
        Math.max(
          ...selectedRows.flatMap((row: IRowData) =>
            row.seats.map((seat: ISeatsData) => seat.properties.y + seat.properties.height),
          ),
        ) -
        Math.min(...selectedRows.flatMap((row: IRowData) => row.seats.map((seat: ISeatsData) => seat.properties.y)));
    }
  }
  return coords;
};

export const calculateRowSeatsMaxCoords = (selectedRows: IRowData[]) => {
  const coords = { x: 0, y: 0 };
  if (selectedRows.length) {
    coords.x = Math.max(
      ...selectedRows.flatMap((row: IRowData) => row.seats.map((seat: ISeatsData) => seat.properties.x)),
    );
    coords.y = Math.max(
      ...selectedRows.flatMap((row: IRowData) => row.seats.map((seat: ISeatsData) => seat.properties.y)),
    );
  }
  return coords;
};
