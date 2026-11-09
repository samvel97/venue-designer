import { forwardRef, Fragment, useMemo } from "react";
import Background from "./Background/Background";
import AreaForSelectingRows from "./AreaForSelectingRows/AreaForSelectingRows";
import MultipleSelectedRowsArea from "./MultipleSelectedRowsArea/MultipleSelectedRowsArea";
import TempSeats from "./TempSeats/TempSeats";
import { IAreaData } from "../../Areas/types/areasTypes";
import { IRowData, ISeatsData, TActionType } from "../types/seatsTypes";
import RowsComponent from "./Rows/RowsComponent";
import { IStandardProperties } from "types/types";
import CoordinateAxis from "./CoordinateAxis/CoordinateAxis";
import Grid from "components/ui/Grid/Grid";

interface ISeatsSvg {
  tempSeats: IRowData[];
  seatsRows: IRowData[];
  selectedRows: IRowData[];
  multipleSelectArea: any;
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
const SeatsSvg = forwardRef<any, ISeatsSvg>(
  (
    {
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
    },
    ref
  ) => {
    const {
      width,
      height,
      rotate,
      cornerTopRight,
      cornerTopLeft,
      cornerBottomRight,
      cornerBottomLeft,
      d: shapeD,
    } = selectedArea.properties;

    const centerX = 10000;
    const centerY = 10000;
    const topLeft = cornerTopLeft ?? 0;
    const topRight = cornerTopRight ?? 0;
    const bottomLeft = cornerBottomLeft ?? 0;
    const bottomRight = cornerBottomRight ?? 0;

    const d = useMemo(() => {
      if (shapeD) {
        let firstLOccurrence = shapeD?.indexOf("l");
        let result = shapeD?.substring(firstLOccurrence);
        const resultD = `M ${centerX} ${centerY} ` + result;
        return resultD;
      }
      return `
        M ${centerX + topLeft || 0} ${centerY}
        L ${centerX + width - (topRight || 0)} ${centerY}
        A ${topRight || 0} ${topRight || 0}, 0, 0, 1, ${centerX + width} ${
        centerY + (topRight || 0)
      }
        L ${centerX + width} ${centerY + height - (bottomRight || 0)}
        A ${bottomRight || 0} ${bottomRight || 0}, 0, 0, 1, ${
        centerX + width - (bottomRight || 0)
      } ${centerY + height}
        L ${centerX + (bottomLeft || 0)} ${centerY + height}
        A ${bottomLeft || 0} ${bottomLeft || 0}, 0, 0, 1, ${centerX} ${
        centerY + height - (bottomLeft || 0)
      }
        L ${centerX} ${centerY + (topLeft || 0)}
        A ${topLeft || 0} ${topLeft || 0}, 0, 0, 1, ${
        centerX + (topLeft || 0)
      } ${centerY}
        Z
      `;
    }, [
      centerX,
      centerY,
      shapeD,
      width,
      height,
      rotate,
      cornerTopRight,
      cornerTopLeft,
      cornerBottomRight,
      cornerBottomLeft,
    ]);

    return (
      <svg
        id="panel-svg"
        tabIndex={0}
        className="pannable-svg"
        ref={ref}
        width={20000}
        height={20000}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          overflow: "hidden",
          backgroundColor: "white",
        }}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <Grid />
        <Background
          d={d}
          selectedArea={selectedArea}
          centerX={centerX}
          centerY={centerY}
        />
        {multipleSelectArea ? (
          <AreaForSelectingRows selectionRect={selectionRect} />
        ) : null}

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
  }
);

export default SeatsSvg;
