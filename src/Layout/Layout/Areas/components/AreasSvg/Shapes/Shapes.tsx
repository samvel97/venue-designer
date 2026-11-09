import SvgEllipseElement from "components/ui/SvgEllipseElement/SvgEllipseElement";
import SvgPathElement from "components/ui/SvgPathElement/SvgPathElement";
import {
  backgroundColor,
  outlineColor,
  strokeColor,
} from "Layout/Layout/Areas/constants/areasConstants";
import { IAreaData } from "Layout/Layout/Areas/types/areasTypes";
import { IRowData } from "Layout/Layout/Seats/types/seatsTypes";
import { memo } from "react";
import { toolType } from "types/types";
import { getLSData } from "utils/getLsData";
interface IShapes {
  area: IAreaData;
  selectedArea: IAreaData[];
  resizeCursor: boolean;
  sectionConTentView: boolean;
  handleSelectArea: (e: React.MouseEvent, area: IAreaData) => void;
}
const Shapes = ({
  area,
  selectedArea,
  resizeCursor,
  sectionConTentView,
  handleSelectArea,
}: IShapes) => {
  const lang = getLSData("locale");
  const drawingShape = () => {
    switch (area.properties.type) {
      case toolType.ellipse:
        return (
          <SvgEllipseElement
            id={`area-${area.localId}`}
            area={area}
            properties={area.properties}
            title={area.title[lang! as keyof typeof area.title]}
            handleSelectShape={handleSelectArea}
            fill={backgroundColor[area.areaType]}
            stroke={strokeColor[area.areaType]}
            style={{
              cursor: selectedArea[0] === area ? "move" : "",
              outline: selectedArea.some(
                (selectedRow: IAreaData) => selectedRow.localId === area.localId
              )
                ? outlineColor
                : "",
            }}
          />
        );
      case toolType.rectangle:
      case toolType.pen:
        return (
          <SvgPathElement
            id={`area-${area.localId}`}
            area={area}
            properties={area.properties}
            title={area.title[lang! as keyof typeof area.title]}
            handleSelectShape={handleSelectArea}
            fill={backgroundColor[area.areaType]}
            stroke={strokeColor[area.areaType]}
            style={{
              cursor: selectedArea[0] === area ? "move" : "",
              outline: selectedArea.some(
                (selectedRow: IAreaData) => selectedRow.localId === area.localId
              )
                ? outlineColor
                : "",
            }}
          />
        );
    }
  };

  return (
    <>
      {drawingShape()}
      {area.rows.length && sectionConTentView
        ? area.rows.map((row: IRowData) => {
            const x = row.seats[0].properties.x;
            const y = row.seats[0].properties.y;
            const width = row.properties.width + 25;
            const height = 15;
            const rotate = row.properties.rotate;
            return (
              <rect
                style={{ pointerEvents: "none" }}
                key={row.localId}
                width={width}
                height={height}
                transform={`rotate(${rotate}, ${x}, ${y})`}
                x={x - 10}
                y={y - 10}
                rx="10"
                ry="10"
                fill="rgba(200, 200, 200, 0.4)"
              />
            );
          })
        : null}
    </>
  );
};

export default memo(Shapes);
