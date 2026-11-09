import { ShapeType } from "../constants/areasConstants";
import { Action, ActionType, IAreasState } from "../types/areasTypes";

export const initialState:IAreasState = {
    areas: [],
    selectedFloor:null,
    shapeType: ShapeType.WITH_SEATS,
    tempShape: [],
    selectedArea: [],
    dragging: false,
    resizing: false,
    resizeCorner: null,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
    mouseOffsetX: 0,
    rowsMouseOffset: { x: 0, y: 0 },
    mouseOffsetY: 0,
    multipleSelectArea: false,
    isSVGFocused: false,
    inputValues: {
      width: 0,
      height: 0,
      rotate: 0,
      cornerTopRight: 0,
      cornerTopLeft: 0,
      cornerBottomRight: 0,
      cornerBottomLeft: 0,
      title: { am: '', ru: '', en: '' },
    },
    selectionRect: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
    copiedAreaIndex: null,
    isCopying: false,
    isPasting: false,
    startPosition: { x: 0, y: 0 },
    resizeCursor: false,
    sectionConTentView: false,
  };


  export const reducer = (state: IAreasState, action: Action): IAreasState => {
    switch (action.type) {
      case ActionType.SET_AREAS:
        return { ...state, areas: action.payload };
      case ActionType.SET_SHAPE_TYPE:
        return { ...state, shapeType: action.payload };
      case ActionType.SET_TEMP_SHAPE:
        return { ...state, tempShape: action.payload };
      case ActionType.SET_SELECTED_AREAS:
        return { ...state, selectedArea: action.payload };
      case ActionType.SET_DRAGGING:
        return { ...state, dragging: action.payload };
      case ActionType.SET_RESIZING:
        return { ...state, resizing: action.payload };
      case ActionType.SET_RESIZE_CORNER:
        return { ...state, resizeCorner: action.payload };
      case ActionType.SET_START_X:
        return { ...state, startX: action.payload };
      case ActionType.SET_START_Y:
        return { ...state, startY: action.payload };
      case ActionType.SET_SCROLL_LEFT:
        return { ...state, scrollLeft: action.payload };
      case ActionType.SET_SCROLL_TOP:
        return { ...state, scrollTop: action.payload };
      case ActionType.SET_MOUSE_OFFSET_X:
        return { ...state, mouseOffsetX: action.payload };
      case ActionType.SET_ROWS_MOUSE_OFFSET:
        return { ...state, rowsMouseOffset: action.payload };
      case ActionType.SET_MOUSE_OFFSET_Y:
        return { ...state, mouseOffsetY: action.payload };
      case ActionType.SET_MULTIPLE_SELECT_AREA:
        return { ...state, multipleSelectArea: action.payload };
      case ActionType.SET_IS_SVG_FOCUSED:
        return { ...state, isSVGFocused: action.payload };
      case ActionType.SET_INPUT_VALUES:
        return { ...state, inputValues: action.payload };
      case ActionType.SET_SELECTION_RECT:
        return { ...state, selectionRect: action.payload };
      case ActionType.SET_COPIED_AREA_INDEX:
        return { ...state, copiedAreaIndex: action.payload };
      case ActionType.SET_IS_COPYING:
        return { ...state, isCopying: action.payload };
      case ActionType.SET_IS_PASTING:
        return { ...state, isPasting: action.payload };
      case ActionType.SET_START_POSITION:
        return { ...state, startPosition: action.payload };
      case ActionType.SET_RESIZE_CURSOR:
        return { ...state, resizeCursor: action.payload };
      case ActionType.SET_SELECTED_FLOOR:
        return { ...state, selectedFloor: action.payload };
        case ActionType.SET_SECTION_CONTENT_VIEW:
          return { ...state, sectionConTentView: action.payload };
      default:
        return state;
    }
  };
  