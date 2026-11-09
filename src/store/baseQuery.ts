import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import { openErrorSnackBar } from "./SnackBarSlice";
import { handleLocalRequest, LocalRequest } from "./localBackend";

/**
 * RTK Query base query backed by the local in-browser backend.
 * To connect a real server, replace this with `fetchBaseQuery({ baseUrl })`:
 * endpoint definitions and components stay the same.
 */
export const localBaseQuery: BaseQueryFn<LocalRequest | string> = async (
  args,
  api
) => {
  const request = typeof args === "string" ? { url: args } : args;
  try {
    const result = handleLocalRequest(request);
    if ("error" in result) {
      api.dispatch(openErrorSnackBar([result.error.data.message]));
    }
    return result;
  } catch (error) {
    api.dispatch(openErrorSnackBar(["something_went_wrong"]));
    return { error: { status: 500, data: { message: String(error) } } };
  }
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: localBaseQuery,
  endpoints: () => ({}),
});
