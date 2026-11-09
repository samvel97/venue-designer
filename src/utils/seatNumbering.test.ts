import {
  localStorageRowsKey,
  RowTypeEnums,
} from "Layout/Layout/Seats/constants/seatsConstants";
import { IRowData } from "Layout/Layout/Seats/types/seatsTypes";
import { createSeats } from "./dragging";
import { generateLinesAndSeats } from "./generateLinesAndSeats";
import { getStoredNumberingMode, isContinuousNumbering } from "./seatNumbering";

const seatOrders = (rows: IRowData[]) =>
  rows.map((row) => row.seats.map((seat) => seat.seatOrder));

const generate = (rowByOrder: RowTypeEnums, seatsRows: IRowData[] = []) =>
  generateLinesAndSeats({
    multipleSeatsAndRows: {
      linesCount: 3,
      seatsCountPerLine: 4,
      seatSpacing: 18,
      lineSpacing: 18,
    },
    seatsRows,
    rowByOrder,
    seatWidth: 25,
    seatRadius: 8,
    nextIdRef: { current: 1 },
    selectedAreaId: "1",
  });

beforeEach(() => localStorage.clear());

describe("isContinuousNumbering", () => {
  it("treats the string 'false' as per-row numbering", () => {
    expect(isContinuousNumbering(RowTypeEnums.START_AT_ONE)).toBe(false);
    expect(isContinuousNumbering(RowTypeEnums.ROW_TO_ROW)).toBe(true);
    expect(isContinuousNumbering(undefined)).toBe(false);
  });
});

describe("getStoredNumberingMode", () => {
  it("defaults to per-row numbering when nothing is stored", () => {
    expect(getStoredNumberingMode()).toBe(RowTypeEnums.START_AT_ONE);
  });

  it("ignores unexpected stored values", () => {
    localStorage.setItem(localStorageRowsKey, "garbage");
    expect(getStoredNumberingMode()).toBe(RowTypeEnums.START_AT_ONE);
  });
});

describe("generateLinesAndSeats", () => {
  it("restarts numbering at 1 on every row in START_AT_ONE mode", () => {
    expect(seatOrders(generate(RowTypeEnums.START_AT_ONE))).toEqual([
      [1, 2, 3, 4],
      [1, 2, 3, 4],
      [1, 2, 3, 4],
    ]);
  });

  it("numbers seats continuously across rows in ROW_TO_ROW mode", () => {
    expect(seatOrders(generate(RowTypeEnums.ROW_TO_ROW))).toEqual([
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
    ]);
  });

  it("continues from existing rows in ROW_TO_ROW mode", () => {
    const existing = generate(RowTypeEnums.ROW_TO_ROW);
    const next = generate(RowTypeEnums.ROW_TO_ROW, existing);
    expect(seatOrders(next)[0]).toEqual([13, 14, 15, 16]);
    expect(next[0].rowOrder).toBe("4");
  });
});

describe("createSeats", () => {
  it("does not throw when the numbering mode was never stored", () => {
    expect(() => createSeats(0, 100, 0, 8, 25, 18, 1, "1", [])).not.toThrow();
    const rows = createSeats(0, 100, 0, 8, 25, 18, 1, "1", []);
    expect(seatOrders(rows as IRowData[])).toEqual([[1, 2, 3, 4, 5]]);
  });
});
