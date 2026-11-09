import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "store/store";
import { createDispatchers } from "store/dispatcher";

type InitialStateType = {
  open: boolean;
  error: boolean;
  message: string[];
};

const initialState: InitialStateType = {
  open: false,
  error: false,
  message: [],
};

const snackBarSlice = createSlice({
  name: "snackBar",
  initialState,
  reducers: {
    openErrorSnackBar: (state, { payload }) => {
      state.error = true;
      state.message = state.message.concat(payload);
      state.open = true;
    },
    openSuccessSnackBar: (state, { payload }) => {
      state.error = false;
      state.message = state.message.concat(payload);
      state.open = true;
    },
    onClose: (state) => {
      state.open = false;
      state.message = [];
    },
  },
});

export const snackBarDispatcher = createDispatchers(snackBarSlice.actions);
export const { openErrorSnackBar, openSuccessSnackBar, onClose } =
  snackBarSlice.actions;
export const snackBarState = (state: RootState) => state.snackBar;

export default snackBarSlice.reducer;
