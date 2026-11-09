import {
  FloorPropTypes,
  IAreaData,
} from "Layout/Layout/Areas/types/areasTypes";
import { memo } from "react";
import Floor from "./Floor/Floor";
import Shapes from "./Shapes/Shapes";

const Areas = ({
  areas,
  floor,
  fillColor,
}: {
  areas: IAreaData[];
  floor: FloorPropTypes;
  fillColor?: string;
}) => {
  return (
    <g id="group">
      <Floor floorProperties={floor} fillColor={fillColor} />
      {areas.map((area: IAreaData) => (
        <Shapes key={area.localId} area={area} />
      ))}
    </g>
  );
};

export default memo(Areas);
