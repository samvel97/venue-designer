export enum toolType {
  select = "select",
  select_rows = "select_rows",
  select_seats = "select_seats",
  selectFloor = "selectFloor",
  scrollSvg = "scrollSvg",
  pen = "pen",
  rectangle = "rectangle",
  ellipse = "ellipse",

  flipHorizontal = "flipHorizontal",
  flipVertical = "flipVertical",
  alignCenter = "alignCenter",
  alignLeft = "alignLeft",
  alignRight = "alignRight",
  multipleX = "multipleX",
  multipleXY = "multipleXY",
  delete = "delete",
  copy = "copy",
  paste = "paste",
}
export enum actionTypes {
  flipHorizontal = "flipHorizontal",
  flipVertical = "flipVertical",
  alignCenter = "alignCenter",
  alignLeft = "alignLeft",
  alignRight = "alignRight",
  multipleX = "multipleX",
  multipleXY = "multipleXY",
  delete = "delete",
}
export type Coords = { x: number; y: number };

export interface IStandardProperties extends Coords {
  width: number;
  height: number;
}
export interface IProperties {
  title: string;
  width: number;
  height: number;
  rotate: number;
  cornerTopRight: number;
  cornerTopLeft: number;
  cornerBottomRight: number;
  cornerBottomLeft: number;
}

export type SvgElementType = SVGSVGElement | null;
export type SvgContainerType = HTMLDivElement | null;

export interface IMInMax {
  smallestX: number;
  smallestY: number;
  biggestX: number;
  biggestY: number;
}

export interface IActions {
  id: number;
  icon: React.ElementType;
  title: toolType;
  option: toolType;
}

export interface ManipulationActions {
  [key: string]: () => void;
}

export interface Ititle {
  am: string;
  ru: string;
  en: string;
}

export type languageTypes = "en" | "am" | "ru";

export interface ICreateAreasRequestData {
  venueId: string;
  venue: string;
}

export enum LANGUAGES {
  en = "en-US",
  ru = "ru-RU",
  hy = "hy-AM",
}

export enum RequestTypeEnum {
  SAVE = "SAVE",
  ADD_FLOOR = "ADD_FLOOR",
  REMOVE_FLOOR = "REMOVE_FLOOR",
  GET_FLOOR = "GET_FLOOR",
  GET_FLOORS = "GET_FLOORS",
}

export type IFetching = {
  [key in RequestTypeEnum]: boolean;
};
