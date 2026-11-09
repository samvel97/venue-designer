import { binaryToText, textToBinary } from "utils";
import { exportVenue, handleLocalRequest, importVenue } from "./localBackend";

const layout = (floor: number) => ({ floor, properties: {}, areas: [] });

const put = (venueId: string, floor: number) =>
  handleLocalRequest({
    url: `venues/${venueId}/floors`,
    method: "PUT",
    body: { compressedAreas: textToBinary(layout(floor)) },
  });

const getFloor = (venueId: string, floor: number) =>
  handleLocalRequest({ url: `venues/${venueId}/floors/${floor}` }) as {
    data: { floorsCount: number; layout: string };
  };

beforeEach(() => localStorage.clear());

describe("local backend", () => {
  it("returns an empty layout for a new venue", () => {
    const { data } = getFloor("v1", 1);
    expect(data.floorsCount).toBe(1);
    expect(data.layout).toBe("");
  });

  it("saves and reads back a floor", () => {
    expect(put("v1", 1)).toEqual({ data: { message: "Ok" } });
    expect(binaryToText(getFloor("v1", 1).data.layout)).toEqual(layout(1));
  });

  it("replaces an existing floor instead of duplicating it", () => {
    put("v1", 1);
    put("v1", 1);
    put("v1", 2);
    expect(getFloor("v1", 1).data.floorsCount).toBe(2);
  });

  it("deletes the top floor", () => {
    put("v1", 1);
    put("v1", 2);
    handleLocalRequest({ url: "venues/v1/floors/last", method: "DELETE" });
    expect(getFloor("v1", 2).data.layout).toBe("");
    expect(getFloor("v1", 1).data.layout).not.toBe("");
  });

  it("keeps venues isolated from each other", () => {
    put("v1", 1);
    expect(getFloor("v2", 1).data.layout).toBe("");
  });

  it("round-trips a venue through export and import", () => {
    put("v1", 1);
    put("v1", 2);
    const json = exportVenue("v1");
    importVenue("copy", json);
    expect(getFloor("copy", 2).data.floorsCount).toBe(2);
  });

  it("returns a 404 error for unknown endpoints", () => {
    const result = handleLocalRequest({ url: "venues/v1/unknown" });
    expect("error" in result && result.error.status).toBe(404);
  });
});
