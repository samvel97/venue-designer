import { useCallback } from "react";
import "./style.scss";
import { useSeats } from "./useSeats";
import SeatsSvg from "./SeatsSvg/SeatsSvg";
import { IAreaData } from "../Areas/types/areasTypes";
import Header from "Layout/Header/Header";
import ToolBar from "Layout/ToolBar/ToolBar";
import ActionsGroup from "components/ui/ActionsGroup/ActionsGroup";
import { ButtonTypeEnum } from "enums/button-type.enum";
import {
  optionsSvgs,
  seatCreatingActions,
  seatManipulationActions,
} from "./constants/seatsConstants";
import LabelInput from "components/ui/LabelInput/LabelInput";
import { ManipulationActions } from "types/types";
import Options from "components/ui/Options/Options";
import PageSwitcher from "components/ui/PageSwitcher/PageSwitcher";
import { hasRotatedItem } from "utils/hasRotatedRow";
import Switcher from "components/ui/Switcher/Switcher";
import SortOrderSelector from "components/ui/SortOrderSelector/SortOrderSelector";

const Seats = () => {
  const {
    svgRef,
    svgContainerRef,
    multipleSeatsAndRows,
    seatsType,
    tempSeats,
    seatsRows,
    selectedRows,
    multipleSelectArea,
    xyLines,
    multipleSelectedRowsArea,
    selectedRowData,
    selectionRect,
    selectedArea,
    selectedAreaId,
    inputRef,
    refList,
    rotatingOutlinedArea,
    resize,
    venueId,
    areasListFromRedux,
    floor,
    isEqualRows,
    rowByOrder,
    handleSubmit,
    pathMouseDown,
    chooseSeats,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleDeleteArea,
    alignLeft,
    alignRight,
    alignCenter,
    handleTypeChange,
    handleChangeRowsData,
    setMultipleSeatsAndRows,
    getCoordsforResizing,
    switchRowsByOrder,
  } = useSeats();

  const manipulationActions: ManipulationActions = {
    alignLeft: alignLeft,
    alignRight: alignRight,
    alignCenter: alignCenter,
    delete: handleDeleteArea,
  };
  const checkSelectedCount = () => {
    if (selectedRows.length === 1 || hasRotatedItem(selectedRows)) {
      return [seatManipulationActions[seatManipulationActions.length - 1]];
    }
    return seatManipulationActions;
  };
  const checkOptions = () => {
    const { curve, order, rotate, rowSpacing, seatSpacing } = selectedRowData;
    const multipleRows = selectedRows.length > 1;

    if (!hasRotatedItem(selectedRows)) {
      return multipleRows
        ? { seatSpacing, rowSpacing, curve, rotate }
        : { seatSpacing, order, curve, rotate };
    }
    return { rotate };
  };
  const checkAreaId = useCallback(() => {
    if (areasListFromRedux && selectedAreaId) {
      return areasListFromRedux.find(
        (area: IAreaData) => area.localId === +selectedAreaId
      );
    }
  }, [areasListFromRedux, selectedAreaId]);
  checkAreaId();
  return (
    <>
      <div id="panel-container" tabIndex={0} className="panels-container">
        <header id="panel-row" tabIndex={0} className="panel-row">
          <Header venueId={venueId!} floor={floor!} isEqual={isEqualRows} />
        </header>

        <div id="panel-row-grow" tabIndex={0} className="panel-row grow">
          <div id="snap-left" tabIndex={0} className="Panel snap-left">
            <ToolBar>
              <>
                <PageSwitcher
                  page={"seats"}
                  venueId={venueId!}
                  floor={floor!}
                />

                <ActionsGroup
                  actionsOptions={seatCreatingActions}
                  type={ButtonTypeEnum.primary}
                  tool={seatsType}
                  handleToolTypeChange={handleTypeChange}
                />
                <SortOrderSelector
                  handleClick={switchRowsByOrder}
                  isChecked={rowByOrder}
                />
                {selectedRows.length === 1 && (
                  <LabelInput
                    name="order"
                    value={selectedRowData.order}
                    ref={inputRef}
                    handleChange={handleChangeRowsData}
                  />
                )}
                {selectedRows.length > 0 && (
                  <>
                    <div
                      style={{ border: "1px solid #ECECEC", width: "100%" }}
                    />
                    <ActionsGroup
                      type={ButtonTypeEnum.secondary}
                      manipulationActions={manipulationActions}
                      padding
                      actionsOptions={checkSelectedCount()}
                      handleToolTypeChange={handleTypeChange}
                    />
                    <div
                      style={{ border: "1px solid #ECECEC", width: "100%" }}
                    />
                    <Options
                      refList={refList}
                      optionsSvgs={optionsSvgs}
                      inputValues={checkOptions()}
                      handleChange={handleChangeRowsData}
                    />
                  </>
                )}

                <div>
                  {/* <button onMouseDownCapture={handleZoomIn}>-</button>
                      <button onMouseDownCapture={handleZoomOut}>+</button> */}
                  {seatsType == "multipleXY" ? (
                    <Options
                      refList={refList}
                      inputValues={multipleSeatsAndRows}
                      optionsSvgs={optionsSvgs}
                      handleSubmit={handleSubmit}
                      handleChange={setMultipleSeatsAndRows}
                    />
                  ) : null}
                  {seatsType == "multipleX" ? (
                    <Options
                      refList={refList}
                      optionsSvgs={optionsSvgs}
                      inputValues={{
                        seatSpacing: multipleSeatsAndRows.seatSpacing,
                      }}
                      handleChange={setMultipleSeatsAndRows}
                    />
                  ) : null}
                </div>
              </>
            </ToolBar>
          </div>
        </div>
      </div>

      <div
        className="svg-container"
        ref={svgContainerRef}
        style={{ cursor: seatsType === "scrollSvg" ? "grab" : "default" }}
      >
        {selectedArea && (
          <SeatsSvg
            ref={svgRef}
            tempSeats={tempSeats}
            seatsRows={seatsRows}
            selectedRows={selectedRows}
            multipleSelectArea={multipleSelectArea}
            xyLines={xyLines}
            multipleSelectedRowsArea={multipleSelectedRowsArea}
            selectedArea={selectedArea}
            selectionRect={selectionRect}
            rotatingOutlinedArea={rotatingOutlinedArea}
            seatsSpacing={multipleSeatsAndRows.seatSpacing}
            resize={resize}
            seatsType={seatsType}
            pathMouseDown={pathMouseDown}
            chooseSeats={chooseSeats}
            handleMouseDown={handleMouseDown}
            handleMouseMove={handleMouseMove}
            handleMouseUp={handleMouseUp}
            getCoordsforResizing={getCoordsforResizing}
          />
        )}
      </div>
    </>
  );
};
export default Seats;
