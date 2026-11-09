import { Coords, IStandardProperties, Ititle, toolType } from "types/types";
import { IRowData } from "../../Seats/types/seatsTypes";
import { ShapeType } from "../constants/areasConstants";

export type FloorPropTypes = null | IAreasProperties;

export interface IAreasState {
  areas: IAreaData[];
  selectedFloor: FloorPropTypes;
  shapeType: ShapeType;
  tempShape: IAreaData[];
  selectedArea: IAreaData[];
  dragging: boolean;
  resizing: boolean;
  resizeCorner: string | null;
  startX: number;
  startY: number;
  scrollLeft: number;
  scrollTop: number;
  mouseOffsetX: number;
  rowsMouseOffset: Coords;
  mouseOffsetY: number;
  multipleSelectArea: boolean;
  isSVGFocused: boolean;
  inputValues: IManipulationProperties;
  selectionRect: IStandardProperties;
  copiedAreaIndex: number | null;
  isCopying: boolean;
  isPasting: boolean;
  startPosition: Coords;
  resizeCursor: boolean;
  sectionConTentView: boolean;
}

export interface IComparingData {
  areas: IAreaData[];
  floorProps: FloorPropTypes;
}
export interface IAreaData {
  localId: number;
  title: Ititle;
  properties: IAreasProperties;
  ticketsCount: number;
  areaType: ShapeType;
  rows: IRowData[];
}
export interface IAreasProperties extends IStandardProperties {
  rotate: number;
  type: toolType;
  cornerTopRight?: number;
  cornerTopLeft?: number;
  cornerBottomRight?: number;
  cornerBottomLeft?: number;
  d?: string;
}

export interface ICornerRadiuses {
  cornerTopRight?: number;
  cornerTopLeft?: number;
  cornerBottomRight?: number;
  cornerBottomLeft?: number;
}
export interface IManipulationProperties extends ICornerRadiuses {
  width: number;
  height: number;
  title: Ititle;
  rotate: number;
}

// Enums
export enum ActionType {
  SET_AREAS = "SET_AREAS",
  SET_SHAPE_TYPE = "SET_SHAPE_TYPE",
  SET_TEMP_SHAPE = "SET_TEMP_SHAPE",
  SET_SELECTED_AREAS = "SET_SELECTED_AREAS",
  SET_DRAGGING = "SET_DRAGGING",
  SET_RESIZING = "SET_RESIZING",
  SET_RESIZE_CORNER = "SET_RESIZE_CORNER",
  SET_START_X = "SET_START_X",
  SET_START_Y = "SET_START_Y",
  SET_SCROLL_LEFT = "SET_SCROLL_LEFT",
  SET_SCROLL_TOP = "SET_SCROLL_TOP",
  SET_MOUSE_OFFSET_X = "SET_MOUSE_OFFSET_X",
  SET_ROWS_MOUSE_OFFSET = "SET_ROWS_MOUSE_OFFSET",
  SET_MOUSE_OFFSET_Y = "SET_MOUSE_OFFSET_Y",
  SET_MULTIPLE_SELECT_AREA = "SET_MULTIPLE_SELECT_AREA",
  SET_IS_SVG_FOCUSED = "SET_IS_SVG_FOCUSED",
  SET_INPUT_VALUES = "SET_INPUT_VALUES",
  SET_SELECTION_RECT = "SET_SELECTION_RECT",
  SET_COPIED_AREA_INDEX = "SET_COPIED_AREA_INDEX",
  SET_IS_COPYING = "SET_IS_COPYING",
  SET_IS_PASTING = "SET_IS_PASTING",
  SET_START_POSITION = "SET_START_POSITION",
  SET_RESIZE_CURSOR = "SET_RESIZE_CURSOR",
  SET_SELECTED_FLOOR = "SET_SELECTED_FLOOR",
  SET_SECTION_CONTENT_VIEW = "SET_SECTION_CONTENT_VIEW",
}

// Action types
type SetAreasAction = { type: ActionType.SET_AREAS; payload: IAreaData[] };
type SetShapeTypeAction = {
  type: ActionType.SET_SHAPE_TYPE;
  payload: ShapeType;
};
type SetTempShapeAction = {
  type: ActionType.SET_TEMP_SHAPE;
  payload: IAreaData[];
};
type SetSelectedAreasAction = {
  type: ActionType.SET_SELECTED_AREAS;
  payload: IAreaData[];
};
type SetDraggingAction = { type: ActionType.SET_DRAGGING; payload: boolean };
type SetResizingAction = { type: ActionType.SET_RESIZING; payload: boolean };
type SetResizeCornerAction = {
  type: ActionType.SET_RESIZE_CORNER;
  payload: string | null;
};
type SetStartXAction = { type: ActionType.SET_START_X; payload: number };
type SetStartYAction = { type: ActionType.SET_START_Y; payload: number };
type SetScrollLeftAction = {
  type: ActionType.SET_SCROLL_LEFT;
  payload: number;
};
type SetScrollTopAction = { type: ActionType.SET_SCROLL_TOP; payload: number };
type SetMouseOffsetXAction = {
  type: ActionType.SET_MOUSE_OFFSET_X;
  payload: number;
};
type SetRowsMouseOffsetAction = {
  type: ActionType.SET_ROWS_MOUSE_OFFSET;
  payload: { x: number; y: number };
};
type SetMouseOffsetYAction = {
  type: ActionType.SET_MOUSE_OFFSET_Y;
  payload: number;
};
type SetMultipleSelectAreaAction = {
  type: ActionType.SET_MULTIPLE_SELECT_AREA;
  payload: boolean;
};
type SetIsSVGFocusedAction = {
  type: ActionType.SET_IS_SVG_FOCUSED;
  payload: boolean;
};
type SetInputValuesAction = {
  type: ActionType.SET_INPUT_VALUES;
  payload: IManipulationProperties;
};
type SetSelectionRectAction = {
  type: ActionType.SET_SELECTION_RECT;
  payload: IStandardProperties;
};
type SetCopiedAreaIndexAction = {
  type: ActionType.SET_COPIED_AREA_INDEX;
  payload: number | null;
};
type SetIsCopyingAction = { type: ActionType.SET_IS_COPYING; payload: boolean };
type SetIsPastingAction = { type: ActionType.SET_IS_PASTING; payload: boolean };
type SetStartPositionAction = {
  type: ActionType.SET_START_POSITION;
  payload: { x: number; y: number };
};
type SetResizeCursorAction = {
  type: ActionType.SET_RESIZE_CURSOR;
  payload: boolean;
};
type SetSelectedFloor = {
  type: ActionType.SET_SELECTED_FLOOR;
  payload: FloorPropTypes;
};
type SetSectionContentView = {
  type: ActionType.SET_SECTION_CONTENT_VIEW;
  payload: boolean;
};

export type Action =
  | SetAreasAction
  | SetShapeTypeAction
  | SetTempShapeAction
  | SetSelectedAreasAction
  | SetDraggingAction
  | SetResizingAction
  | SetResizeCornerAction
  | SetStartXAction
  | SetStartYAction
  | SetScrollLeftAction
  | SetScrollTopAction
  | SetMouseOffsetXAction
  | SetRowsMouseOffsetAction
  | SetMouseOffsetYAction
  | SetMultipleSelectAreaAction
  | SetIsSVGFocusedAction
  | SetInputValuesAction
  | SetSelectionRectAction
  | SetCopiedAreaIndexAction
  | SetIsCopyingAction
  | SetIsPastingAction
  | SetStartPositionAction
  | SetResizeCursorAction
  | SetSelectedFloor
  | SetSectionContentView;

export interface IAreasResponse {
  venueId: number;
  floorsCount: number;
  layout: string;
}

export interface IAllAreasResponse {
  venueId: number;
  floorsCount: number;
  layouts: string;
}

export interface IDecodedLayout {
  floor: number;
  properties: FloorPropTypes;
  areas: IAreaData[];
}

export type TShapeFillColor =
  | "rgb(200, 220, 240)"
  | "rgb(220, 220, 220)"
  | "rgb(230, 230, 230)"
  | "#FFFFFF";

export type TShapeStrokeColor =
  | "rgb(160, 165, 188)"
  | "rgb(204, 204, 204)"
  | "#ECECEC";

export type BackgroundColorType = {
  [key in ShapeType]: string;
};

export interface ILayoutView {
  floor: string;
  properties: FloorPropTypes;
}
