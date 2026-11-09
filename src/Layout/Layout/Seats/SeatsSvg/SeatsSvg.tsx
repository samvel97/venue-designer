import { Fragment, type Ref } from "react";
import { roundedRectPath } from "@/utils/roundedRectPath";
import Background from "./Background/Background";
import AreaForSelectingRows from "./AreaForSelectingRows/AreaForSelectingRows";
import MultipleSelectedRowsArea from "./MultipleSelectedRowsArea/MultipleSelectedRowsArea";
import TempSeats from "./TempSeats/TempSeats";
import { type IAreaData } from "../../Areas/types/areasTypes";
import { type IRowData, type ISeatsData, type TActionType } from "../types/seatsTypes";
import RowsComponent from "./Rows/RowsComponent";
import { type IStandardProperties } from "@/types/types";
import CoordinateAxis from "./CoordinateAxis/CoordinateAxis";
import Grid, { CANVAS_SIZE } from "@/components/canvas/Grid";

interface ISeatsSvg {
  zoom: number;
  ref: Ref<SVGSVGElement | null>;
  tempSeats: IRowData[];
  seatsRows: IRowData[];
  selectedRows: IRowData[];
  multipleSelectArea: boolean;
  xyLines: boolean;
  multipleSelectedRowsArea: IStandardProperties | null;
  selectedArea: IAreaData;
  selectionRect: IStandardProperties;
  rotatingOutlinedArea: number;
  resize: string | null;
  seatsSpacing: number;
  seatsType: string;
  pathMouseDown: (e: React.MouseEvent, selectedRow: IRowData) => void;
  chooseSeats: (seat: ISeatsData) => void;
  handleMouseDown: (e: React.MouseEvent<Element, MouseEvent>) => void;
  handleMouseMove: (e: React.MouseEvent<Element, MouseEvent>) => void;
  handleMouseUp: (e: React.MouseEvent<Element, MouseEvent>) => void;
  getCoordsforResizing: (e: React.MouseEvent, actionName: TActionType) => void;
}
const SeatsSvg = ({
  ref,
  zoom,
  tempSeats,
  seatsRows,
  selectedRows,
  multipleSelectArea,
  xyLines,
  multipleSelectedRowsArea,
  selectedArea,
  selectionRect,
  rotatingOutlinedArea,
  resize,
  seatsSpacing,
  seatsType,
  pathMouseDown,
  chooseSeats,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  getCoordsforResizing,
}: ISeatsSvg) => {
  const {
    width,
    height,
    cornerTopRight,
    cornerTopLeft,
    cornerBottomRight,
    cornerBottomLeft,
    d: shapeD,
  } = selectedArea.properties;

  const centerX = 10000;
  const centerY = 10000;
  const d = shapeD
    ? `M ${centerX} ${centerY} ` + shapeD.substring(shapeD.indexOf("l"))
    : roundedRectPath(centerX, centerY, width, height, {
        cornerTopLeft,
        cornerTopRight,
        cornerBottomRight,
        cornerBottomLeft,
      });

  return (
    <svg
      id="panel-svg"
      tabIndex={0}
      className="block bg-white outline-none"
      ref={ref}
      width={CANVAS_SIZE * zoom}
      height={CANVAS_SIZE * zoom}
      viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
      onContextMenu={(e) => e.preventDefault()}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <Grid />
      <Background d={d} selectedArea={selectedArea} centerX={centerX} centerY={centerY} />
      {multipleSelectArea ? <AreaForSelectingRows selectionRect={selectionRect} /> : null}

      {seatsRows.map((row: IRowData) => (
        <Fragment key={row.localId}>
          <RowsComponent
            row={row}
            selectedRows={selectedRows}
            resize={resize}
            pathMouseDown={pathMouseDown}
            getCoordsforResizing={getCoordsforResizing}
            chooseSeats={chooseSeats}
          />
        </Fragment>
      ))}
      {tempSeats.length ? (
        <TempSeats
          tempSeats={tempSeats}
          seatsSpacing={seatsSpacing}
          multipleSelectedRowsArea={multipleSelectedRowsArea}
          rotatingOutlinedArea={rotatingOutlinedArea}
          resize={resize}
          seatsType={seatsType}
          getCoordsforResizing={getCoordsforResizing}
        />
      ) : null}

      {multipleSelectedRowsArea ? (
        <>
          <MultipleSelectedRowsArea
            rotatingOutlinedArea={rotatingOutlinedArea}
            multipleSelectedRowsArea={multipleSelectedRowsArea}
            getCoordsforResizing={getCoordsforResizing}
          />
          {xyLines && (
            <CoordinateAxis
              seatsRows={seatsRows}
              selectedRows={selectedRows}
              rotatingOutlinedArea={rotatingOutlinedArea}
              multipleSelectedRowsArea={multipleSelectedRowsArea}
            />
          )}
        </>
      ) : null}
    </svg>
  );
};

export default SeatsSvg;
