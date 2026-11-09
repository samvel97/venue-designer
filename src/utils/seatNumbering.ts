import {
  localStorageRowsKey,
  RowTypeEnums,
} from "Layout/Layout/Seats/constants/seatsConstants";

/**
 * Seat numbering mode is stored as the string "true" / "false"
 * (see RowTypeEnums). Never test it for truthiness: "false" is a truthy string.
 */
export const isContinuousNumbering = (mode?: RowTypeEnums | null): boolean =>
  mode === RowTypeEnums.ROW_TO_ROW;

export const getStoredNumberingMode = (): RowTypeEnums => {
  try {
    const stored = localStorage.getItem(localStorageRowsKey);
    return stored === RowTypeEnums.ROW_TO_ROW
      ? RowTypeEnums.ROW_TO_ROW
      : RowTypeEnums.START_AT_ONE;
  } catch {
    return RowTypeEnums.START_AT_ONE;
  }
};
