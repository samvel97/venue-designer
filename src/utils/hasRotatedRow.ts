import { type IRowData } from "@/Layout/Layout/Seats/types/seatsTypes";

export const hasRotatedItem = (rows: IRowData[]): boolean => {
  return rows.some((row) => row.properties.rotate !== 0);
};
