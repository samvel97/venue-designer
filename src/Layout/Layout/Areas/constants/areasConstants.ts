import { type IActions, toolType } from "@/types/types";
import {
  Circle,
  ClipboardPaste,
  Copy,
  FlipHorizontal2,
  FlipVertical2,
  Hand,
  MousePointer2,
  PenTool,
  Square,
  Trash2,
} from "lucide-react";
import type { BackgroundColorType } from "../types/areasTypes";

export const toolTypes: toolType[] = [toolType.rectangle, toolType.ellipse, toolType.pen];

export const areasCreatingActions: IActions[] = [
  { id: 1, icon: MousePointer2, title: toolType.select, option: toolType.select },
  { id: 2, icon: Hand, title: toolType.scrollSvg, option: toolType.scrollSvg },
  { id: 3, icon: PenTool, title: toolType.pen, option: toolType.pen },
  {
    id: 4,
    icon: Square,
    title: toolType.rectangle,
    option: toolType.rectangle,
  },
  { id: 5, icon: Circle, title: toolType.ellipse, option: toolType.ellipse },
];

export const areasManipulationActions: IActions[] = [
  {
    id: 1,
    icon: FlipVertical2,
    title: toolType.flipVertical,
    option: toolType.flipVertical,
  },
  {
    id: 2,
    icon: FlipHorizontal2,
    title: toolType.flipHorizontal,
    option: toolType.flipHorizontal,
  },
  { id: 3, icon: Copy, title: toolType.copy, option: toolType.copy },
  { id: 4, icon: ClipboardPaste, title: toolType.paste, option: toolType.paste },
  { id: 5, icon: Trash2, title: toolType.delete, option: toolType.delete },
];

export enum ShapeType {
  BACKGROUND = "BACKGROUND",
  WITH_SEATS = "WITH_SEATS",
  WITHOUT_SEATS = "WITHOUT_SEATS",
  NON_RESERVED = "NON_RESERVED",
}

export const backgroundColor: BackgroundColorType = {
  [ShapeType.WITH_SEATS]: "rgb(227, 227, 227)",
  [ShapeType.WITHOUT_SEATS]: "rgb(227, 227, 227)",
  [ShapeType.NON_RESERVED]: "rgba(160, 165, 188, 0.5)",
  [ShapeType.BACKGROUND]: "#FBFBFB",
};

export const strokeColor: BackgroundColorType = {
  [ShapeType.WITH_SEATS]: "rgb(204, 204, 204)",
  [ShapeType.WITHOUT_SEATS]: "rgb(204, 204, 204)",
  [ShapeType.NON_RESERVED]: "rgb(160, 165, 188)",
  [ShapeType.BACKGROUND]: "#ECECEC",
};

export const defaultCornerRadius = 4;

export const outlineColor = "4px solid #2B5EE0";
export const tempFill = "rgb(240, 240, 240)";
export const opacityFillColor = "rgba(251, 251, 251, 0.88)";

export const presentationBackgroundColor: BackgroundColorType = {
  [ShapeType.WITH_SEATS]: "#ECECEC",
  [ShapeType.WITHOUT_SEATS]: "#F7F7F7",
  [ShapeType.NON_RESERVED]: "rgba(160, 165, 188, 0.50)",
  [ShapeType.BACKGROUND]: "#FBFBFB",
};

export const presentationStrokeColor: BackgroundColorType = {
  [ShapeType.WITH_SEATS]: "#CECECE",
  [ShapeType.WITHOUT_SEATS]: "#F0F0F0",
  [ShapeType.NON_RESERVED]: "#A0A5BC",
  [ShapeType.BACKGROUND]: "#ECECEC",
};
