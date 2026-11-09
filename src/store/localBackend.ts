import { binaryToText, textToBinary } from "@/utils";

/**
 * A tiny in-browser backend that persists venues to localStorage.
 *
 * Each venue is stored as an ordered list of floor layouts:
 *   { floor: number, properties: FloorPropTypes, areas: IAreaData[] }
 *
 * Layouts travel between the UI and the backend gzip+base64 encoded
 * (`textToBinary` / `binaryToText`), the same wire format a remote API would use.
 */

export interface StoredLayout {
  floor: number;
  properties: unknown;
  areas: unknown[];
}

export interface LocalRequest {
  url: string;
  method?: string;
  body?: { compressedAreas?: string };
}

export type LocalResponse = { data: unknown } | { error: { status: number; data: { message: string } } };

const STORAGE_PREFIX = "venue-designer:venue:";

const readVenue = (venueId: string): StoredLayout[] => {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + venueId);
    return raw ? (JSON.parse(raw) as StoredLayout[]) : [];
  } catch {
    return [];
  }
};

const writeVenue = (venueId: string, layouts: StoredLayout[]) => {
  localStorage.setItem(STORAGE_PREFIX + venueId, JSON.stringify(layouts));
};

const floorsCountOf = (layouts: StoredLayout[]) => Math.max(layouts.length, 1);

const notFound = (message: string): LocalResponse => ({
  error: { status: 404, data: { message } },
});

export const handleLocalRequest = (request: LocalRequest): LocalResponse => {
  const method = (request.method ?? "GET").toUpperCase();
  const [, venueId, resource, floorParam] = request.url.split("/");

  if (!venueId) return notFound("venue_id_required");
  const layouts = readVenue(venueId);

  if (method === "GET" && resource === "floors" && floorParam) {
    const floor = Number(floorParam);
    const layout = layouts.find((item) => item.floor === floor);
    return {
      data: {
        venueId,
        floorsCount: floorsCountOf(layouts),
        layout: layout ? textToBinary(layout) : "",
      },
    };
  }

  if (method === "GET" && resource === "floors") {
    return {
      data: {
        venueId,
        floorsCount: floorsCountOf(layouts),
        layouts: textToBinary(layouts),
      },
    };
  }

  if (method === "PUT" && resource === "floors") {
    const compressed = request.body?.compressedAreas;
    if (!compressed) return notFound("layout_required");
    const layout: StoredLayout = binaryToText(compressed);
    const next = layouts.filter((item) => item.floor !== layout.floor);
    next.push(layout);
    next.sort((a, b) => a.floor - b.floor);
    writeVenue(venueId, next);
    return { data: { message: "Ok" } };
  }

  if (method === "DELETE" && resource === "floors") {
    writeVenue(venueId, layouts.slice(0, -1));
    return { data: { message: "Ok" } };
  }

  if (method === "POST" && resource === "publish") {
    return { data: null };
  }

  return notFound("unknown_endpoint");
};

/** Export a whole venue as a plain JSON document. */
export const exportVenue = (venueId: string): string =>
  JSON.stringify({ venueId, floors: readVenue(venueId) }, null, 2);

/** Import a venue previously produced by `exportVenue`. */
export const importVenue = (venueId: string, json: string) => {
  const parsed = JSON.parse(json);
  const floors: StoredLayout[] = Array.isArray(parsed) ? parsed : parsed.floors;
  if (!Array.isArray(floors)) throw new Error("invalid_venue_file");
  writeVenue(venueId, floors);
};
