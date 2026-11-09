import { Fragment, memo } from "react";
import { IRowData, ISeatsData, TActionType } from "../../types/seatsTypes";
import { seatRadius } from "../../constants/seatsConstants";
import { IStandardProperties } from "types/types";
import ResizePoints from "../Rows/ResizePoints/ResizePoints";
import { hasRotatedItem } from "utils/hasRotatedRow";
interface ITempSeats {
  tempSeats: IRowData[];
  seatsSpacing: number;
  multipleSelectedRowsArea: IStandardProperties | null;
  rotatingOutlinedArea: number;
  resize: string | null;
  seatsType: string;
  getCoordsforResizing: (e: React.MouseEvent, actionName: TActionType) => void;
}
const TempSeats = ({
  tempSeats,
  seatsSpacing,
  multipleSelectedRowsArea,
  rotatingOutlinedArea,
  resize,
  seatsType,
  getCoordsforResizing,
}: ITempSeats) => {
  return (
    <>
      {tempSeats.map((row: IRowData) => {
        const { seats } = row;
        const length = row.seats.length;
        const initX = (row?.seats?.[0]?.properties?.x ?? 0) - 8;
        const initY = (row?.seats?.[0]?.properties?.y ?? 0) - 8;
        const spacing =
          -(row?.seats?.[0]?.properties?.x - row?.seats?.[1]?.properties?.x) ||
          18;

        return (
          <Fragment key={row.localId}>
            {seats.map((seat: ISeatsData, index: number) => (
              <circle
                key={index}
                cx={seat.properties.x}
                cy={seat.properties.y}
                r={seatRadius}
                transform={
                  multipleSelectedRowsArea
                    ? `rotate(${rotatingOutlinedArea}, ${
                        multipleSelectedRowsArea.x +
                        multipleSelectedRowsArea.width / 2
                      }, ${
                        multipleSelectedRowsArea.y +
                        multipleSelectedRowsArea.height / 2
                      })`
                    : ""
                }
                fill={"#A0A5BC"}
                stroke="rgb(162, 162, 162)"
                strokeWidth={1.6}
                opacity={1}
              />
            ))}
            {resize === "resizeX" || seatsType === "multipleX" ? (
              <>
                <rect
                  x={initX + (spacing * length - spacing) / 2}
                  y={initY}
                  width={30}
                  height={16}
                />
                <text
                  x={initX + (spacing * length - spacing) / 2 + 15}
                  y={initY + 8.5}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fill="white"
                  style={{
                    color: "black",
                    fontFamily: "Segoe UI",
                    fontSize: "11px",
                    fontStyle: "normal",
                    fontWeight: 400,
                  }}
                >
                  {length}
                </text>
                {!hasRotatedItem(tempSeats) && (
                  <>
                    <ResizePoints
                      row={row}
                      getCoordsforResizing={getCoordsforResizing}
                    />
                  </>
                )}
              </>
            ) : null}
          </Fragment>
        );
      })}
    </>
  );
};

export default memo(TempSeats);
