import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FloorPropTypes, IAreaData, ILayoutView } from "@/Layout/Layout/Areas/types/areasTypes";
import type { ValidationEnum } from "@/enums/validation.enum";
import { validateAreasAndNames, validateAreasInsideFloor } from "@/utils/validations";

interface IValidationFields {
  isValidate: boolean;
  name: ValidationEnum;
  message: string;
}

type IValidation = Record<number, IValidationFields[]>;

interface VenueState {
  areas: IAreaData[];
  floorProps: FloorPropTypes;
  layoutView: ILayoutView;
  floorsCount: number;
  validations: IValidation;
}

const initialState: VenueState = {
  areas: [],
  floorProps: null,
  layoutView: { properties: null, floor: "" },
  floorsCount: 1,
  validations: {},
};

const venueSlice = createSlice({
  name: "venue",
  initialState,
  reducers: {
    setAreas: (state, { payload }: PayloadAction<IAreaData[]>) => {
      state.areas = payload;
    },
    setFloorsCount: (state, { payload }: PayloadAction<number>) => {
      state.floorsCount = payload;
    },
    setFloorProps: (state, { payload }: PayloadAction<FloorPropTypes>) => {
      state.floorProps = payload;
    },
    setLayoutViewProps: (state, { payload }: PayloadAction<ILayoutView>) => {
      state.layoutView = payload;
    },
    setAllInOne: (state, { payload }: PayloadAction<Pick<VenueState, "areas" | "floorsCount" | "floorProps">>) => {
      Object.assign(state, payload);
    },
    setValidations: (state, { payload }: PayloadAction<{ floor: string | number | null; area?: IAreaData[] }>) => {
      const areas = payload.area ?? state.areas;
      const { area, name, outsideSeats } = validateAreasAndNames(areas);
      const { isValidateFloor, validateIsInsideFloor, validateAreasExisting } = validateAreasInsideFloor(
        areas,
        state.floorProps,
      );
      state.validations[Number(payload.floor)] = [
        name,
        area,
        isValidateFloor,
        validateIsInsideFloor,
        validateAreasExisting,
        outsideSeats,
      ];
    },
  },
});

export const { setAreas, setFloorProps, setLayoutViewProps, setFloorsCount, setAllInOne, setValidations } =
  venueSlice.actions;

export default venueSlice.reducer;
