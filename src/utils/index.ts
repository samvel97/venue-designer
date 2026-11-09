import { IRowData, ISeatsData } from "Layout/Layout/Seats/types/seatsTypes";
import { IStandardProperties } from "../types/types";
import { rotateCalculation } from "./rotateCalculation";
import Pako from "pako";
export const isPointInPolygon = (x: number, y: number, polygon: any) => {
  let isInside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) isInside = !isInside;
  }
  return isInside;
};
export const getLineCenters = (
  x: number,
  y: number,
  width: number,
  height: number
) => {
  const centerXTop = x + width / 2;
  const centerYTop = y;
  const centerXBottom = x + width / 2;
  const centerYBottom = y + height;
  const centerXLeft = x;
  const centerYLeft = y + height / 2;
  const centerXRight = x + width;
  const centerYRight = y + height / 2;

  return {
    top: { x: centerXTop, y: centerYTop },
    bottom: { x: centerXBottom, y: centerYBottom },
    left: { x: centerXLeft, y: centerYLeft },
    right: { x: centerXRight, y: centerYRight },
  };
};
export const getCoordForResizing = (x: number, y: number, foundRow: any) => {
  let blum = getLineCenters(
    foundRow.x,
    foundRow.y,
    foundRow.width,
    foundRow.height
  );
  return (
    (x < blum.left.x + 10 &&
      x > blum.left.x - 10 &&
      y < blum.left.y + 5 &&
      y > blum.left.y - 5) ||
    (x < blum.right.x + 20 &&
      x >= blum.right.x - 5 &&
      y > blum.right.y - 20 &&
      y < blum.right.y + 20)
  );
};
export const getItemWithMinX = (rows: IRowData[]) => {
  const minRow = rows.reduce((minRow, currentRow) => {
    const minSeatX = Math.min(
      ...currentRow.seats.map((seat) => seat.properties.x)
    );
    const currentMinSeatX = Math.min(
      ...minRow.seats.map((seat) => seat.properties.x)
    );

    return minSeatX < currentMinSeatX ? currentRow : minRow;
  }, rows[0]);

  return minRow;
};
export const getItemWithMinY = (rows: IRowData[]) => {
  const minRow = rows.reduce((minRow, currentRow) => {
    const minSeatY = Math.min(
      ...currentRow.seats.map((seat) => seat.properties.y)
    );
    const currentMinSeatY = Math.min(
      ...minRow.seats.map((seat) => seat.properties.y)
    );

    return minSeatY < currentMinSeatY ? currentRow : minRow;
  }, rows[0]);

  return minRow;
};

export const sortRowsByMinY = (rows: IRowData[]) => {
  return rows.sort((a, b) => {
    const minYInRowA = Math.min(...a.seats.map((seat) => seat.properties.y));
    const minYInRowB = Math.min(...b.seats.map((seat) => seat.properties.y));

    return minYInRowA - minYInRowB;
  });
};

export function textToBinary(obj: any): string {
  const jsonString = JSON.stringify(obj);
  const compressed = Pako.gzip(jsonString);
  const compressedString = window.btoa(
    String.fromCharCode.apply(null, compressed as any)
  );
  return compressedString;
}

export function binaryToText(compressedData: string): any {
  const binaryString = window.atob(compressedData);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return JSON.parse(new TextDecoder().decode(Pako.inflate(bytes)));
}

export const makeCoordsPath = (
  selectedRows: IRowData[],
  multipleSelectedRowsArea?: IStandardProperties | null,
  inputRotate?: number,
  isContinuously?: boolean
) => {
  return selectedRows.map((row: IRowData) => {
    const { rotate } = row.properties;
    const initialRotate = inputRotate ?? row.properties.rotate + 1;
    const updatedSets: ISeatsData[] = row.seats.map(
      (seat: ISeatsData, i: number) => {
        const { x, y } = seat.properties;
        const rotation = inputRotate ?? 1;
        let seatsRadians;
        if (!isContinuously) {
          seatsRadians =
            ((inputRotate === 0 ? -rotate : rotation - rotate) * Math.PI) / 180;
        } else {
          seatsRadians = ((inputRotate ?? 0) * Math.PI) / 180;
        }
        const cos = Math.cos(seatsRadians);
        const sin = Math.sin(seatsRadians);
        const mySeat = rotateCalculation(
          x,
          y,
          cos,
          sin,
          multipleSelectedRowsArea,
          selectedRows
        );
        seat.properties.x = mySeat.x;
        seat.properties.y = mySeat.y;
        return seat;
      }
    );
    return {
      ...row,
      properties: {
        ...row.properties,
        rotate: isContinuously
          ? initialRotate + row.properties.rotate
          : initialRotate,
      },
      seats: updatedSets,
    };
  });
};

export const stringSlicer = (coords: string) => {
  let lastIndex = coords.lastIndexOf("l");

  if (lastIndex !== -1) {
    coords = coords.substring(0, lastIndex - 1); // Add 1 to include the 'l' itself
  }
  return coords;
};
