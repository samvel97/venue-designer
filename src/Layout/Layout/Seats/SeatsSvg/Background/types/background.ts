import { type IAreaData } from "@/Layout/Layout/Areas/types/areasTypes";

export interface IBackground {
  d: string;
  rotate: number;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
}

export interface ICoordinates extends Omit<IBackground, "d"> {
  x: number;
  y: number;
}

export type BackgroundType = {
  d: string;
  selectedArea: IAreaData;
  centerX: number;
  centerY: number;
};
