import { type IStandardProperties } from "@/types/types";
import { selectedItemsOutlinedArea } from "./selectedRowsOutlinedArea";
import { type IRowData } from "@/Layout/Layout/Seats/types/seatsTypes";

export const rotateCalculation = (
  coordX: number,
  coordY: number,
  cos: number,
  sin: number,
  multipleSelectedRowsArea: IStandardProperties | null | undefined,
  selectedRows: IRowData[],
) => {
  let selectedRowsArea;
  if (!multipleSelectedRowsArea) {
    selectedRowsArea = selectedItemsOutlinedArea(selectedRows);
  } else {
    selectedRowsArea = multipleSelectedRowsArea;
  }
  const centerX = selectedRowsArea.x + selectedRowsArea.width / 2;
  const centerY = selectedRowsArea.y + selectedRowsArea.height / 2;
  return {
    x: (coordX - centerX) * cos - (coordY - centerY) * sin + centerX,
    y: (coordX - centerX) * sin + (coordY - centerY) * cos + centerY,
  };
};
