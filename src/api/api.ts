import {
  IAllAreasResponse,
  IAreasResponse,
} from "Layout/Layout/Areas/types/areasTypes";
import { areasRoutes } from "_constants";
import { baseApi } from "store/baseQuery";
import { ICreateAreasRequestData } from "types/types";

type data = { message: string };
const venuesTags = baseApi.enhanceEndpoints({
  addTagTypes: ["Venues", "VenueById"],
});
const seatsApi = venuesTags.injectEndpoints({
  endpoints: (builder) => ({
    getAreas: builder.query<IAreasResponse, { id: string; floor: number }>({
      query: ({ id, floor }) => {
        return {
          url: areasRoutes.GET_VENUE(id, floor),
        };
      },
      providesTags: ["Venues"],
    }),
    getLayoutView: builder.query<IAreasResponse, { id: string; floor: number }>(
      {
        query: ({ id, floor }) => {
          return {
            url: areasRoutes.GET_VENUE(id, floor),
          };
        },
      }
    ),
    getAllAreas: builder.query<IAllAreasResponse, string>({
      query: (id) => {
        return {
          url: areasRoutes.GET_ALL_VENUES(id),
        };
      },

      providesTags: ["Venues"],
    }),
    createEditArea: builder.mutation<data, ICreateAreasRequestData>({
      query: ({ venue, venueId }) => ({
        url: areasRoutes.MUTATE_VENUE(venueId),
        method: "PUT",
        body: { compressedAreas: venue },
      }),

      invalidatesTags: (_, error) => (error ? [] : ["Venues"]),
    }),
    deleteFloor: builder.mutation<data, string>({
      query: (venueId) => ({
        url: areasRoutes.DELETE_VENUE(venueId),
        method: "DELETE",
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Venues"]),
    }),
    publishAreas: builder.mutation<void, string>({
      query: (venueId: string) => {
        return {
          method: "POST",
          url: areasRoutes.PUBLISH_VENUE(venueId),
        };
      },
    }),
  }),
});

export const {
  useGetAreasQuery,
  useLazyGetAllAreasQuery,
  useLazyGetAreasQuery,
  useGetAllAreasQuery,
  useCreateEditAreaMutation,
  usePublishAreasMutation,
  useDeleteFloorMutation,
  useLazyGetLayoutViewQuery,
} = seatsApi;
