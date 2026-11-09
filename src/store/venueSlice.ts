import { createSelector } from "reselect";
import { RootState } from "store/store";
import { createSlice } from "@reduxjs/toolkit";
import { createDispatchers } from "store/dispatcher";
import {
  FloorPropTypes,
  IAreaData,
  ILayoutView,
} from "Layout/Layout/Areas/types/areasTypes";
import { ValidationEnum } from "enums/validation.enum";
import {
  validateAreasAndNames,
  validateAreasInsideFloor,
} from "utils/validations";
import { IFetching, RequestTypeEnum } from "types/types";

interface IValidationFields {
  isValidate: boolean;
  name: ValidationEnum;
  message: string;
}
export interface IValidation {
  [key: number]: IValidationFields[];
}

interface IVenueSlice {
  areas: IAreaData[];
  floorProps: FloorPropTypes;
  layoutView: ILayoutView;
  floorsCount: number;
  isFetchingRefreshToken: boolean;
  validations: IValidation;
  isLoading: IFetching;
}
export const initialState: IVenueSlice = {
  areas: [],
  floorProps: null,
  layoutView: { properties: null, floor: "" },
  floorsCount: 1,
  isFetchingRefreshToken: false,
  validations: {},
  isLoading: {
    [RequestTypeEnum.ADD_FLOOR]: false,
    [RequestTypeEnum.GET_FLOOR]: false,
    [RequestTypeEnum.GET_FLOORS]: false,
    [RequestTypeEnum.REMOVE_FLOOR]: false,
    [RequestTypeEnum.SAVE]: false,
  },
};

export const venueSlice = createSlice({
  name: "venue",
  initialState,
  reducers: {
    setAreas: (state, action) => {
      state.areas = action.payload;
    },
    setFloorsCount: (state, action) => {
      state.floorsCount = action.payload;
    },
    setFloorProps: (state, action) => {
      state.floorProps = action.payload;
    },
    setLayoutViewProps: (state, action) => {
      state.layoutView = action.payload;
    },
    setFetchingRefreshToken: (state, { payload }) => {
      state.isFetchingRefreshToken = payload;
    },
    setAllInOne: (state, action) => {
      state.areas = action.payload.areas;
      state.floorsCount = action.payload.floorsCount;
      state.floorProps = action.payload.floorProps;
    },
    setIsLoading: (state, { payload }) => {
      state.isLoading[payload.key as RequestTypeEnum] = payload.value;
    },
    setValidations: (state, { payload }) => {
      const areas = payload.area ?? (state.areas || []);
      const { area, name, outsideSeats } = validateAreasAndNames(areas);
      const { isValidateFloor, validateIsInsideFloor, validateAreasExisting } =
        validateAreasInsideFloor(areas, state.floorProps);

      state.validations = {
        ...state.validations,
        [payload.floor as string]: [
          name,
          area,
          isValidateFloor,
          validateIsInsideFloor,
          validateAreasExisting,
          outsideSeats,
        ],
      };
    },
  },
});

export const buildingDispatcher = createDispatchers(venueSlice.actions);
export const {
  setAreas,
  setFloorProps,
  setLayoutViewProps,
  setFloorsCount,
  setAllInOne,
  setFetchingRefreshToken,
  setValidations,
  setIsLoading,
} = venueSlice.actions;
export const buildingSelector = createSelector(
  [(state: RootState) => state.venue],
  (venue) => venue
);

export default venueSlice.reducer;
