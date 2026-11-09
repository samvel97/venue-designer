import type { IAllAreasResponse, IAreasResponse } from "@/Layout/Layout/Areas/types/areasTypes";
import { areasRoutes } from "@/_constants/api";
import { baseApi } from "@/store/baseQuery";
import type { ICreateAreasRequestData } from "@/types/types";

type Message = { message: string };
type FloorArgs = { id: string; floor: number };

const venueApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAreas: builder.query<IAreasResponse, FloorArgs>({
      query: ({ id, floor }) => areasRoutes.GET_VENUE(id, floor),
      providesTags: ["Venues"],
    }),
    getLayoutView: builder.query<IAreasResponse, FloorArgs>({
      query: ({ id, floor }) => areasRoutes.GET_VENUE(id, floor),
    }),
    getAllAreas: builder.query<IAllAreasResponse, string>({
      query: areasRoutes.GET_ALL_VENUES,
      providesTags: ["Venues"],
    }),
    createEditArea: builder.mutation<Message, ICreateAreasRequestData>({
      query: ({ venue, venueId }) => ({
        url: areasRoutes.MUTATE_VENUE(venueId),
        method: "PUT",
        body: { compressedAreas: venue },
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Venues"]),
    }),
    deleteFloor: builder.mutation<Message, string>({
      query: (venueId) => ({ url: areasRoutes.DELETE_VENUE(venueId), method: "DELETE" }),
      invalidatesTags: (_, error) => (error ? [] : ["Venues"]),
    }),
  }),
});

export const {
  useGetAreasQuery,
  useGetAllAreasQuery,
  useCreateEditAreaMutation,
  useDeleteFloorMutation,
  useLazyGetLayoutViewQuery,
} = venueApi;
