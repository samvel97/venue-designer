import { memo } from "react";

interface ISelectedRowArea {
  pathMouseDown: (e: any, rowId: any) => void;
  d: string;
  rowId: any;
}
const SelectedRowArea = ({ pathMouseDown, d, rowId }: ISelectedRowArea) => {
  return (
    <path
      onMouseDown={(e) => pathMouseDown(e, rowId)}
      d={d}
      stroke="#A0A5BC"
      strokeWidth={0}
      fill="rgba(0, 0, 0, 0)"
    />
  );
};

export default memo(SelectedRowArea);
