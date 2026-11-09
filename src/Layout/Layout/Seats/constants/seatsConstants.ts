import { AlignCenter, AlignLeft, AlignRight, Ellipsis, Grip, Hand, MousePointer2, Trash2 } from "lucide-react";
import { type IActions, toolType } from "@/types/types";

export const seatCreatingActions: IActions[] = [
  {
    id: 1,
    icon: MousePointer2,
    title: toolType.select_rows,
    option: toolType.select_rows,
  },
  { id: 2, icon: Hand, title: toolType.scrollSvg, option: toolType.scrollSvg },
  {
    id: 3,
    icon: Ellipsis,
    title: toolType.multipleX,
    option: toolType.multipleX,
  },
  {
    id: 4,
    icon: Grip,
    title: toolType.multipleXY,
    option: toolType.multipleXY,
  },
];

export const seatManipulationActions: IActions[] = [
  {
    id: 1,
    icon: AlignLeft,
    title: toolType.alignLeft,
    option: toolType.alignLeft,
  },
  {
    id: 2,
    icon: AlignCenter,
    title: toolType.alignCenter,
    option: toolType.alignCenter,
  },
  {
    id: 3,
    icon: AlignRight,
    title: toolType.alignRight,
    option: toolType.alignRight,
  },
  { id: 5, icon: Trash2, title: toolType.delete, option: toolType.delete },
];

export const seatRadius: number = 8;
export const seatWidth: number = 25;
export const localStorageRowsKey = "rowByOrder";

export enum RowTypeEnums {
  START_AT_ONE = "false",
  ROW_TO_ROW = "true",
}
