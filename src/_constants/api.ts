export const SUCCESS_STATUS = "fulfilled";

/**
 * Endpoint paths understood by the local in-browser backend
 * (see `store/localBackend.ts`). They mirror a typical REST API so the
 * storage layer can be swapped for a real server without touching components.
 */
export const areasRoutes = {
  PUBLISH_VENUE: (id: string) => `venues/${id}/publish`,
  GET_VENUE: (id: string, floor: number) => `venues/${id}/floors/${floor}`,
  GET_ALL_VENUES: (id: string) => `venues/${id}/floors`,
  MUTATE_VENUE: (id: string) => `venues/${id}/floors`,
  DELETE_VENUE: (id: string) => `venues/${id}/floors/last`,
};
