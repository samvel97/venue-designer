import { IRowData, ISeatsData } from "Layout/Layout/Seats/types/seatsTypes";
import { curveRow } from "./curveRow";
import { selectedItemsOutlinedArea } from "./selectedRowsOutlinedArea";
import {
  calculateRowSeatsMaxCoords,
  calculatingSelectedRowsMInCoords,
} from "./calculatingSelectedRowsMInCoords";
import { IStandardProperties } from "types/types";
import { getStoredNumberingMode, isContinuousNumbering } from "./seatNumbering";

export const createSeats = (
  startX: number,
  x: number,
  startY: number,
  seatRadius: number,
  seatWidth: number,
  seatSpacing: number,
  nextId: number,
  selectedAreaId: string | undefined,
  seatsRows: IRowData[]
) => {
  const width = x - startX;
  const spacing = Math.abs(+seatSpacing);

  const seatsCount = Math.floor(Math.abs(width) / +spacing);
  const byOrder = isContinuousNumbering(getStoredNumberingMode());

  if (spacing) {
    const seats = Array.from({ length: seatsCount }, (_, index) => {
      const myX = startX + (width < 0 ? -1 : 1) * (index * spacing);
      const myY = startY + seatRadius;
      const seatOrder = byOrder
        ? index +
          (seatsRows?.[seatsRows.length - 1]?.seats?.at(-1)?.seatOrder ?? 0) +
          1
        : index + 1;
      return {
        localId: index,
        seatOrder: seatOrder,
        properties: {
          x: myX,
          y: myY,
          width: seatWidth,
          height: seatWidth,
        },
      };
    });

    const rowWidth = seatsCount * spacing - spacing;

    const row = {
      localId: `${nextId}_${selectedAreaId}`,
      rowOrder: String(seatsRows.length + 1),
      properties: {
        width: rowWidth,
        height: seatRadius * 2,
        rotate: 0,
        curve: 0,
      },
      seats,
    };

    return seatsCount ? [row] : [];
  }
};

export const resizingRow = (
  x: number,
  seatWidth: number,
  selectedRows: IRowData[]
) => {
  const byOrder = isContinuousNumbering(getStoredNumberingMode());

  let currentSeatOrder = 1;

  let updatedRows = selectedRows.map((row) => {
    const { y: rowY, x: rowX } = row.seats[0].properties;

    const deltaX = x - rowX;
    let seatSpacing = 18;

    if (row.seats.length > 1) {
      seatSpacing = Math.abs(row.seats[1].properties.x - rowX);
    }

    const direction = deltaX < 0 ? -1 : 1;
    const absWidth = Math.abs(deltaX);
    const seatCount = Math.max(1, Math.ceil(absWidth / seatSpacing));

    const seats: ISeatsData[] = Array.from({ length: seatCount }, (_, i) => {
      const myX = rowX + direction * i * seatSpacing;
      const seatOrder = byOrder ? currentSeatOrder++ : i + 1;

      return {
        localId: i,
        seatOrder,
        properties: {
          x: myX,
          y: rowY,
          width: seatWidth,
          height: seatWidth,
        },
      };
    });

    const rowWidth = seatCount * seatSpacing - seatSpacing;

    return {
      ...row,
      seats,
      properties: {
        ...row.properties,
        width: rowWidth,
      },
    };
  });

  updatedRows = curveRow(updatedRows);
  const selectedRowsOutlinedArea = selectedItemsOutlinedArea(updatedRows);
  return { updatedRows, selectedRowsOutlinedArea };
};

export const rowRotation = (
  x: number,
  y: number,
  multY: number,
  height: number,
  rotationInitialX: any
) => {
  const r = multY + height / 2 - rotationInitialX.y;
  const b = x - rotationInitialX.x;
  let rotation;
  const newR = r - (y - rotationInitialX.y);
  const newC = Math.sqrt(newR * newR + b * b);
  const newY = y - (multY + height / 2);
  const newangleRad = Math.asin(newY / newC);
  const newangleDeg = (180 / Math.PI) * newangleRad;
  const angleRad = Math.asin(b / newC);
  const angleDeg = (180 / Math.PI) * angleRad;
  if (x > rotationInitialX.x) {
    rotation = y > multY + height / 2 ? 90 + newangleDeg : angleDeg;
  } else if (x < rotationInitialX.x) {
    rotation = y > multY + height / 2 ? -(90 + newangleDeg) : angleDeg;
  } else {
    rotation = y > multY + height / 2 ? 180 : 0;
  }
  return rotation;
};

export const rowsMoving = (
  newX: number,
  newY: number,
  selectedRows: IRowData[]
) => {
  const { x: minX, y: minY } = calculatingSelectedRowsMInCoords(
    selectedRows,
    true
  );
  let updatedRows: IRowData[] = selectedRows.map((row) => {
    const updatedSeats = row.seats.map((seat: ISeatsData) => {
      const myX = newX - (minX - seat.properties.x);
      const myY = newY - (minY - seat.properties.y);
      return {
        ...seat,
        properties: {
          ...seat.properties,
          x: myX,
          y: myY,
        },
      };
    });
    return {
      ...row,
      seats: updatedSeats,
    };
  });
  const selectedRowsArea = selectedItemsOutlinedArea(updatedRows);
  return { updatedRows, selectedRowsArea };
};

const compare = (a: number, b1: number, b2: number) =>
  Math.floor(a) === Math.floor(b1) - 8 || Math.floor(a) === Math.floor(b2) + 8;

export const handleSameCoordinates = (
  rows: IRowData[],
  selectedRows: IRowData[],
  selectedRowsArea: IStandardProperties
) => {
  const { height, width, x, y } = selectedRowsArea;
  const notSelectedRows = rows.filter(
    (row) =>
      !selectedRows.some((selectedRow) => row.localId === selectedRow.localId)
  );

  const coords = {
    top: false,
    bottom: false,
    left: false,
    right: false,
  };

  for (const row of notSelectedRows) {
    const { x: rowX, y: rowY } = calculatingSelectedRowsMInCoords([row]);
    const maxSeats = calculateRowSeatsMaxCoords([row]);

    coords.left = coords.left || compare(x, rowX, maxSeats.x);
    coords.top = coords.top || compare(y, rowY, maxSeats.y);
    coords.right = coords.right || compare(x + width, rowX, maxSeats.x);
    coords.bottom = coords.bottom || compare(y + height, rowY, maxSeats.y);

    if (Object.values(coords).some((e) => e)) break;
  }

  return coords;
};
