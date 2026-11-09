import { IStandardProperties } from "../../../../types/types";

//Seats
export interface ISeatsData {
  localId: number;
  seatOrder: number;
  properties: IStandardProperties;
}

//Rows
export interface IRowData {
  localId: string;
  rowOrder: string;
  properties: IRowsProperties;
  seats: ISeatsData[];
}
export type IRowsProperties = Pick<IStandardProperties, "width" | "height"> & {
  rotate: number;
  curve: number;
};

export interface ISameRowsData {
  top: IRowData | null;
  bottom: IRowData | null;
  left: IRowData | null;
  right: IRowData | null;
}

export interface ISelectedRowProps {
  order: string;
  rotate: number;
  rowSpacing: number;
  seatSpacing: number;
  curve: number;
}

export interface ICreatingProps {
  linesCount: number;
  seatsCountPerLine: number;
  seatSpacing: number;
  lineSpacing: number;
}
export type TActionType = "resizeX" | "moving" | "rotating" | "";
