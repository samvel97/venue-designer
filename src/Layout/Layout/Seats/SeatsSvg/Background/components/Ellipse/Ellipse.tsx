import { memo } from "react";
import { type ICoordinates } from "../../types/background";

const Ellipse = ({ rotate, centerX, width, centerY, height }: ICoordinates) => {
  return (
    <>
      <ellipse
        cx={centerX + width / 2}
        cy={centerY + height / 2}
        rx={width / 2}
        ry={height / 2}
        transform={`rotate(${rotate}, ${centerX + width / 2}, ${centerY + height / 2})`}
        fill={"rgb(244, 244, 244)"}
        stroke="rgb(0, 0, 0)"
        strokeWidth={0}
        strokeLinejoin={"round"}
        pointerEvents={"none"}
      />
      <ellipse
        cx={centerX + width / 2}
        cy={centerY + height / 2}
        rx={width / 2}
        ry={height / 2}
        transform={`rotate(${rotate}, ${centerX + width / 2}, ${centerY + height / 2})`}
        fill={"none"}
        stroke="rgba(230, 230, 230, 0.4)"
        strokeWidth={40}
        strokeLinejoin={"round"}
        pointerEvents={"none"}
      />
      <ellipse
        cx={centerX + width / 2}
        cy={centerY + height / 2}
        rx={width / 2}
        ry={height / 2}
        transform={`rotate(${rotate}, ${centerX + width / 2}, ${centerY + height / 2})`}
        fill={"rgba(242, 242, 242, 0.3)"}
        stroke="rgb(217, 217, 217)"
        strokeWidth={4}
        strokeLinejoin={"round"}
        pointerEvents={"none"}
      />
    </>
  );
};

export default memo(Ellipse);
