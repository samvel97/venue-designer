import { memo } from "react";
import { IStandardProperties } from "../../../../../types/types";

const AreaForSelectingRows = ({
  selectionRect,
}: {
  selectionRect: IStandardProperties;
}) => {
  return (
    <rect
      x={selectionRect.x}
      y={selectionRect.y}
      width={selectionRect.width}
      height={selectionRect.height}
      fill="rgba(0, 0, 0, 0.1)"
    />
  );
};

export default memo(AreaForSelectingRows);
