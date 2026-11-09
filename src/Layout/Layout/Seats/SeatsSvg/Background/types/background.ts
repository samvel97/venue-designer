import { IAreaData } from "Layout/Layout/Areas/types/areasTypes";

export interface IBackground {
    d: any;
    rotate: any;
    centerX: any;
    centerY: any;
    width: any;
    height: any;
  }

  export interface ICoordinates extends Omit<IBackground, 'd'> {
   x: number;
   y: number;
  }

  export interface ITypes {
    type: string;
  }
export type BackgroundType = {
  d:string
  selectedArea:IAreaData
  centerX: any;
  centerY: any;
}