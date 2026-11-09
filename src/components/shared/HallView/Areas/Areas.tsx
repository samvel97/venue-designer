import { type FloorPropTypes, type IAreaData } from "@/Layout/Layout/Areas/types/areasTypes";
import { memo } from "react";
import Floor from "./Floor/Floor";
import Shapes from "./Shapes/Shapes";
import type { Viewport } from "../viewport";

interface AreasProps {
  areas: IAreaData[];
  floor: FloorPropTypes;
  fillColor?: string;
  viewport: Viewport | null;
}

const Areas = ({ areas, floor, fillColor, viewport }: AreasProps) => {
  return (
    <g id="group">
      <Floor floorProperties={floor} fillColor={fillColor} />
      {areas.map((area: IAreaData) => (
        <Shapes key={area.localId} area={area} viewport={viewport} />
      ))}
    </g>
  );
};

export default memo(Areas);
