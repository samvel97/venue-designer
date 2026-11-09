import { type IStandardProperties } from "../../../../types/types";

export interface ISeatsData {
  localId: number;
  seatOrder: number;
  properties: IStandardProperties;
}

export interface IRowData {
  localId: string;
  rowOrder: string;
  properties: IRowsProperties;
  seats: ISeatsData[];
}
type IRowsProperties = Pick<IStandardProperties, "width" | "height"> & {
  rotate: number;
  curve: number;
};

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
