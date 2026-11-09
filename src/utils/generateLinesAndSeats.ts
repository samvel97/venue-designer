import { RowTypeEnums } from "Layout/Layout/Seats/constants/seatsConstants";
import { IRowData, ISeatsData } from "Layout/Layout/Seats/types/seatsTypes";
import { isContinuousNumbering } from "./seatNumbering";

/** Seat-editor coordinate of the selected area's top-left corner. */
export const AREA_ORIGIN = 10000;

/** Largest seat center Y among existing rows, or null when there are none. */
const existingRowsBottom = (rows: IRowData[]): number | null => {
  let bottom: number | null = null;
  for (const row of rows) {
    for (const seat of row.seats ?? []) {
      if (bottom === null || seat.properties.y > bottom) bottom = seat.properties.y;
    }
  }
  return bottom;
};

export function generateLinesAndSeats({
  multipleSeatsAndRows,
  seatsRows,
  rowByOrder,
  seatWidth,
  seatRadius,
  nextIdRef,
  selectedAreaId,
}: {
  multipleSeatsAndRows: {
    linesCount: number;
    seatSpacing: number;
    lineSpacing: number;
    seatsCountPerLine: number;
  };
  seatsRows: IRowData[];
  rowByOrder: RowTypeEnums;
  seatWidth: number;
  seatRadius: number;
  nextIdRef: { current: number };
  selectedAreaId: string | undefined;
}): IRowData[] {
  // Seat coordinates are relative to the selected area, whose top-left
  // corner sits at (AREA_ORIGIN, AREA_ORIGIN) in the seat editor.
  const originX = AREA_ORIGIN;
  // Place a new block below the existing rows (leaving one empty row) so it
  // does not cover them; the first block starts at the area's top-left.
  const lowestSeatY = existingRowsBottom(seatsRows);
  const originY =
    lowestSeatY === null
      ? AREA_ORIGIN
      : lowestSeatY - seatRadius + 2 * Math.abs(multipleSeatsAndRows.lineSpacing);

  const getPosition = (
    origin: number,
    index: number,
    count: number,
    spacing: number
  ): number => {
    return spacing < 0
      ? origin + (count - index - 1) * Math.abs(spacing)
      : origin + index * spacing;
  };

  const continuous = isContinuousNumbering(rowByOrder);
  let currentSeatOrder = continuous
    ? seatsRows?.at(-1)?.seats?.at(-1)?.seatOrder ?? 0
    : 0;

  return Array.from(
    { length: multipleSeatsAndRows.linesCount },
    (_, lineIndex) => {
      const y = getPosition(
        originY,
        lineIndex,
        multipleSeatsAndRows.linesCount,
        multipleSeatsAndRows.lineSpacing
      );

      const seats: ISeatsData[] = Array.from(
        { length: multipleSeatsAndRows.seatsCountPerLine },
        (_, seatIndex) => {
          const x = getPosition(
            originX,
            seatIndex,
            multipleSeatsAndRows.seatsCountPerLine,
            multipleSeatsAndRows.seatSpacing
          );
          const seatOrder = continuous ? ++currentSeatOrder : seatIndex + 1;

          return {
            localId: seatIndex,
            seatOrder,
            properties: {
              x,
              y: y + seatRadius,
              width: seatWidth,
              height: seatWidth,
            },
          };
        }
      );

      const rowWidth =
        multipleSeatsAndRows.seatsCountPerLine *
          Math.abs(multipleSeatsAndRows.seatSpacing) -
        Math.abs(multipleSeatsAndRows.seatSpacing);

      return {
        localId: `${nextIdRef.current + lineIndex}_${selectedAreaId}`,
        rowOrder: String(seatsRows.length + 1 + lineIndex),
        properties: {
          width: rowWidth,
          height: seatWidth,
          rotate: 0,
          curve: 0,
        },
        seats,
      };
    }
  );
}
