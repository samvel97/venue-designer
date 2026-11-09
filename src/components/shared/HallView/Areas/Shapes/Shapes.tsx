import SvgEllipseElement from "components/ui/SvgEllipseElement/SvgEllipseElement";
import SvgPathElement from "components/ui/SvgPathElement/SvgPathElement";
import {
  presentationBackgroundColor,
  presentationStrokeColor,
} from "Layout/Layout/Areas/constants/areasConstants";
import { IAreaData } from "Layout/Layout/Areas/types/areasTypes";
import { IRowData, ISeatsData } from "Layout/Layout/Seats/types/seatsTypes";
import { Fragment, memo } from "react";
import { toolType } from "types/types";
import { getLSData } from "utils/getLsData";
interface IShapes {
  area: IAreaData;
}
const Shapes = ({ area }: IShapes) => {
  const lang = getLSData("locale");

  const drawingShape = () => {
    const { type } = area.properties;
    switch (type) {
      case toolType.ellipse:
        return (
          <SvgEllipseElement
            id={`area-${area.localId}`}
            area={area}
            properties={area.properties}
            title={area.title[lang! as keyof typeof area.title]}
            textSize={11}
            fill={presentationBackgroundColor[area.areaType]}
            stroke={presentationStrokeColor[area.areaType]}
            strokeWidth={2}
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
            textSize={11}
            fill={presentationBackgroundColor[area.areaType]}
            stroke={presentationStrokeColor[area.areaType]}
            strokeWidth={2}
          />
        );
    }
  };

  return (
    <>
      {drawingShape()}
      {area.rows.map((row: IRowData) => {
        return (
          <g key={row.localId}>
            <text
              x={row.seats[0].properties.x - 25}
              y={row.seats[0].properties.y + 25 / 2 - 11.5}
              transform={`rotate(${area.properties.rotate} ${
                row.seats[0].properties.x + 25 / 2 - 12
              } ${row.seats[0].properties.y + 25 / 2 - 12.5})`}
              textAnchor="middle"
              alignmentBaseline="middle"
              fill="black"
              style={{ fontSize: "11px" }}
            >
              {row.rowOrder || "?"}
            </text>
            {row.seats.map((seat: ISeatsData, index: number) => {
              const { x, y, width, height } = seat.properties;
              const seatX = x;
              const seatY = y;
              return (
                <Fragment key={seat.localId}>
                  <circle
                    key={index}
                    cx={seatX}
                    cy={seatY}
                    r={8}
                    fill={"#656A81"}
                    stroke="rgb(162, 162, 162)"
                    strokeWidth={1}
                    strokeLinejoin={"round"}
                    opacity={1}
                  />
                  <text
                    x={x + width / 2 - 12.5}
                    y={y + height / 2 - 11.5}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fill="white"
                    transform={`rotate(${row.properties.rotate} ${
                      seatX + width / 2 - 12
                    } ${seatY + height / 2 - 12.5})`}
                    style={{
                      color: "black",
                      fontFamily: "Segoe UI",
                      fontSize: "11px",
                      fontStyle: "normal",
                      fontWeight: 400,
                    }}
                  >
                    {seat.seatOrder}
                  </text>
                </Fragment>
              );
            })}
          </g>
        );
      })}
    </>
  );
};

export default memo(Shapes);
