import { memo, useMemo } from "react";
import SvgEllipseElement from "@/components/canvas/SvgEllipseElement";
import SvgPathElement from "@/components/canvas/SvgPathElement";
import { presentationBackgroundColor, presentationStrokeColor } from "@/Layout/Layout/Areas/constants/areasConstants";
import type { IAreaData } from "@/Layout/Layout/Areas/types/areasTypes";
import type { IRowData } from "@/Layout/Layout/Seats/types/seatsTypes";
import { toolType } from "@/types/types";
import { areaTitle } from "@/utils/areaTitle";
import { seatsPath } from "@/utils/seatsPath";
import type { Viewport } from "../../viewport";

const SEAT_RADIUS = 8;
const SEAT_SIZE = 25;
const labelStyle = { fontSize: 11, fontFamily: "Segoe UI" } as const;

const rowBounds = (row: IRowData) => {
  const xs = row.seats.map((seat) => seat.properties.x);
  const ys = row.seats.map((seat) => seat.properties.y);
  return {
    minX: Math.min(...xs) - SEAT_SIZE * 2,
    maxX: Math.max(...xs) + SEAT_SIZE,
    minY: Math.min(...ys) - SEAT_SIZE,
    maxY: Math.max(...ys) + SEAT_SIZE,
  };
};

const RowLabels = ({ row, rotate }: { row: IRowData; rotate: number }) => {
  const [first] = row.seats;
  return (
    <g pointerEvents="none">
      <text
        x={first.properties.x - 25}
        y={first.properties.y + SEAT_SIZE / 2 - 11.5}
        transform={`rotate(${rotate} ${first.properties.x + SEAT_SIZE / 2 - 12} ${first.properties.y + SEAT_SIZE / 2 - 12.5})`}
        textAnchor="middle"
        alignmentBaseline="middle"
        style={labelStyle}
      >
        {row.rowOrder || "?"}
      </text>
      {row.seats.map(({ localId, seatOrder, properties: { x, y, width, height } }) => (
        <text
          key={localId}
          x={x + width / 2 - 12.5}
          y={y + height / 2 - 11.5}
          textAnchor="middle"
          alignmentBaseline="middle"
          fill="white"
          transform={`rotate(${row.properties.rotate} ${x + width / 2 - 12} ${y + height / 2 - 12.5})`}
          style={labelStyle}
        >
          {seatOrder}
        </text>
      ))}
    </g>
  );
};

const Shapes = ({ area, viewport }: { area: IAreaData; viewport: Viewport | null }) => {
  const rows = useMemo(
    () =>
      area.rows
        .filter((row) => row.seats.length)
        .map((row) => ({ row, path: seatsPath(row.seats, SEAT_RADIUS), bounds: rowBounds(row) })),
    [area.rows],
  );

  const Shape = area.properties.type === toolType.ellipse ? SvgEllipseElement : SvgPathElement;

  return (
    <>
      <Shape
        id={`area-${area.localId}`}
        area={area}
        properties={area.properties}
        title={areaTitle(area.title)}
        textSize={11}
        fill={presentationBackgroundColor[area.areaType]}
        stroke={presentationStrokeColor[area.areaType]}
        strokeWidth={2}
      />
      {rows.map(({ row, path, bounds }) => (
        <g key={row.localId}>
          <path d={path} fill="#656A81" stroke="rgb(162, 162, 162)" strokeWidth={1} />
          {viewport?.detailed &&
          bounds.maxX >= viewport.minX &&
          bounds.minX <= viewport.maxX &&
          bounds.maxY >= viewport.minY &&
          bounds.minY <= viewport.maxY ? (
            <RowLabels row={row} rotate={area.properties.rotate} />
          ) : null}
        </g>
      ))}
    </>
  );
};

export default memo(Shapes);
