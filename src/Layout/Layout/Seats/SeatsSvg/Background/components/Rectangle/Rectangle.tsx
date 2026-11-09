import { memo } from "react";
import { IBackground } from "../../types/background";

const Rectangle = ({
  d,
  rotate,
  centerX,
  width,
  centerY,
  height,
}: IBackground) => {
  return (
    <>
      <path
        d={d}
        transform={`rotate(${rotate}, ${centerX + width / 2}, ${
          centerY + height / 2
        })`}
        fill={"rgb(244, 244, 244)"}
        stroke="rgb(0, 0, 0)"
        strokeWidth={0}
        strokeLinejoin={"round"}
        pointerEvents={"none"}
      />
      <path
        d={d}
        transform={`rotate(${rotate}, ${centerX + width / 2}, ${
          centerY + height / 2
        })`}
        fill={"none"}
        stroke="rgba(230, 230, 230, 0.4)"
        strokeWidth={40}
        strokeLinejoin={"round"}
        pointerEvents={"none"}
      />
      <path
        d={d}
        transform={`rotate(${rotate}, ${centerX + width / 2}, ${
          centerY + height / 2
        })`}
        fill={"rgba(242, 242, 242, 0.3)"}
        stroke="rgb(217, 217, 217)"
        strokeWidth={4}
        strokeLinejoin={"round"}
        pointerEvents={"none"}
      />
    </>
  );
};

export default memo(Rectangle);
