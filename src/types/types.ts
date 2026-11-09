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
export type Coords = { x: number; y: number };

export interface IStandardProperties extends Coords {
  width: number;
  height: number;
}
export type SvgElementType = SVGSVGElement | null;
export type SvgContainerType = HTMLElement | null;

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
