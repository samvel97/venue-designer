import { createApi, type BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { notify } from "@/lib/notify";
import { handleLocalRequest, type LocalRequest } from "./localBackend";

/**
 * RTK Query base query backed by the local in-browser backend.
 * To connect a real server, replace it with `fetchBaseQuery({ baseUrl })`.
 */
const localBaseQuery: BaseQueryFn<LocalRequest | string> = async (args) => {
  const request = typeof args === "string" ? { url: args } : args;
  try {
    const result = handleLocalRequest(request);
    if ("error" in result) notify.error(result.error.data.message);
    return result;
  } catch (error) {
    notify.error("something_went_wrong");
    return { error: { status: 500, data: { message: String(error) } } };
  }
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: localBaseQuery,
  tagTypes: ["Venues"],
  endpoints: () => ({}),
});
