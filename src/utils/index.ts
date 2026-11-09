import { type IRowData, type ISeatsData } from "@/Layout/Layout/Seats/types/seatsTypes";
import { type IStandardProperties } from "../types/types";
import { rotateCalculation } from "./rotateCalculation";
import { gzip, inflate } from "pako";
export const getLineCenters = (x: number, y: number, width: number, height: number) => {
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
export const sortRowsByMinY = (rows: IRowData[]) => {
  return rows.sort((a, b) => {
    const minYInRowA = Math.min(...a.seats.map((seat) => seat.properties.y));
    const minYInRowB = Math.min(...b.seats.map((seat) => seat.properties.y));

    return minYInRowA - minYInRowB;
  });
};

export const textToBinary = (obj: unknown): string => {
  const bytes = gzip(JSON.stringify(obj));
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const binaryToText = (data: string): any =>
  JSON.parse(new TextDecoder().decode(inflate(Uint8Array.from(atob(data), (c) => c.charCodeAt(0)))));

export const makeCoordsPath = (
  selectedRows: IRowData[],
  multipleSelectedRowsArea?: IStandardProperties | null,
  inputRotate?: number,
  isContinuously?: boolean,
) => {
  return selectedRows.map((row: IRowData) => {
    const { rotate } = row.properties;
    const initialRotate = inputRotate ?? row.properties.rotate + 1;
    const updatedSets: ISeatsData[] = row.seats.map((seat: ISeatsData) => {
      const { x, y } = seat.properties;
      const rotation = inputRotate ?? 1;
      let seatsRadians;
      if (!isContinuously) {
        seatsRadians = ((inputRotate === 0 ? -rotate : rotation - rotate) * Math.PI) / 180;
      } else {
        seatsRadians = ((inputRotate ?? 0) * Math.PI) / 180;
      }
      const cos = Math.cos(seatsRadians);
      const sin = Math.sin(seatsRadians);
      const mySeat = rotateCalculation(x, y, cos, sin, multipleSelectedRowsArea, selectedRows);
      seat.properties.x = mySeat.x;
      seat.properties.y = mySeat.y;
      return seat;
    });
    return {
      ...row,
      properties: {
        ...row.properties,
        rotate: isContinuously ? initialRotate + row.properties.rotate : initialRotate,
      },
      seats: updatedSets,
    };
  });
};

export const stringSlicer = (coords: string) => {
  const lastIndex = coords.lastIndexOf("l");

  if (lastIndex !== -1) {
    coords = coords.substring(0, lastIndex - 1); // Add 1 to include the 'l' itself
  }
  return coords;
};
