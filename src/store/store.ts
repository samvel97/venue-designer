import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { baseApi } from "./baseQuery";
import venueSlice from "./venueSlice";
import snackBarReducer from "./SnackBarSlice";

export const store = configureStore({
  reducer: {
    venue: venueSlice,
    snackBar: snackBarReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    [...getDefaultMiddleware(), baseApi.middleware] as ReturnType<
      typeof getDefaultMiddleware
    >,
  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
