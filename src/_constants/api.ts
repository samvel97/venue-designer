/** REST-style paths served by `store/localBackend.ts`; a real API can use the same ones. */
export const areasRoutes = {
  GET_VENUE: (id: string, floor: number) => `venues/${id}/floors/${floor}`,
  GET_ALL_VENUES: (id: string) => `venues/${id}/floors`,
  MUTATE_VENUE: (id: string) => `venues/${id}/floors`,
  DELETE_VENUE: (id: string) => `venues/${id}/floors/last`,
};
