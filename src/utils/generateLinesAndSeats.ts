import { RowTypeEnums } from "Layout/Layout/Seats/constants/seatsConstants";
import { IRowData, ISeatsData } from "Layout/Layout/Seats/types/seatsTypes";

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
  const origin = 10000;

  const getPosition = (
    index: number,
    count: number,
    spacing: number
  ): number => {
    return spacing < 0
      ? origin + (count - index - 1) * Math.abs(spacing)
      : origin + index * spacing;
  };

  let currentSeatOrder = rowByOrder
    ? seatsRows?.at(-1)?.seats?.at(-1)?.seatOrder ?? 0
    : 0;

  return Array.from(
    { length: multipleSeatsAndRows.linesCount },
    (_, lineIndex) => {
      const y = getPosition(
        lineIndex,
        multipleSeatsAndRows.linesCount,
        multipleSeatsAndRows.lineSpacing
      );

      const seats: ISeatsData[] = Array.from(
        { length: multipleSeatsAndRows.seatsCountPerLine },
        (_, seatIndex) => {
          const x = getPosition(
            seatIndex,
            multipleSeatsAndRows.seatsCountPerLine,
            multipleSeatsAndRows.seatSpacing
          );
          const seatOrder = rowByOrder ? ++currentSeatOrder : seatIndex + 1;

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
