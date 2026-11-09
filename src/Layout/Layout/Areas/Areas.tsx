import React from "react";
import "./style.scss";
import { useAreas } from "./useAreas";
import Header from "Layout/Header/Header";
import ToolBar from "Layout/ToolBar/ToolBar";
import RightSide from "Layout/RightSide/RightSide";
import AreasSvg from "./components/AreasSvg/AreasSvg";
import ActionsBar from "./components/actionsBar/ActionsBar";
import { toolType } from "types/types";
import ZoomSVG from "components/ui/ZoomSVG/ZoomSVG";

const Areas = () => {
  const {
    svgRef,
    svgContainerRef,
    areas,
    tool,
    selectedArea,
    inputValues,
    resizeCursor,
    selectionRect,
    multipleSelectArea,
    tempShape,
    inputRef,
    refList,
    shapeType,
    ticketsCountRef,
    venueId,
    isEqual,
    floor,
    floorProperties,
    selectedFloor,
    data,
    sectionConTentView,
    layoutView,
    handleChange,
    handleToolTypeChange,
    handleDeleteArea,
    handleCopyArea,
    handlePasteArea,
    flipHorizontal,
    flipVertical,
    handleSetFocused,
    selectShapeType,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleSelectArea,
    handleSelectFloor,
    handleSectionContentView,
  } = useAreas();

  return (
    <>
      <div id="panel-container" tabIndex={0} className="panels-container">
        <header id="panel-row" tabIndex={0} className="panel-row">
          <Header venueId={venueId!} floor={floor!} isEqual={isEqual} />
        </header>

        <div id="panel-row-grow" tabIndex={0} className="panel-row grow">
          <div id="snap-left" tabIndex={0} className="Panel snap-left">
            <ToolBar>
              <ActionsBar
                tool={tool}
                shapeType={shapeType}
                selectedArea={selectedArea}
                inputRef={inputRef}
                inputValues={inputValues}
                refList={refList}
                selectedFloor={selectedFloor}
                venueId={venueId}
                areas={areas}
                floor={floor}
                ticketsCountRef={ticketsCountRef}
                floorProperties={floorProperties}
                isEqual={isEqual}
                handleToolTypeChange={handleToolTypeChange}
                selectShapeType={selectShapeType}
                handleChange={handleChange}
                handleDeleteArea={handleDeleteArea}
                handleCopyArea={handleCopyArea}
                handlePasteArea={handlePasteArea}
                flipHorizontal={flipHorizontal}
                flipVertical={flipVertical}
                handleSectionContentView={handleSectionContentView}
              />
            </ToolBar>
          </div>
          <div id="snap-right" tabIndex={0} className="Panel snap-right">
            <RightSide data={data} layoutView={layoutView} />
          </div>
        </div>
      </div>

      <div
        className="svg-container"
        ref={svgContainerRef}
        style={{
          cursor: tool === toolType.scrollSvg ? "grab" : "default",
        }}
      >
        {/* <ZoomSVG isPreview={true}> */}
        <AreasSvg
          ref={svgRef}
          areas={areas}
          selectedArea={selectedArea}
          resizeCursor={resizeCursor}
          multipleSelectArea={multipleSelectArea}
          selectionRect={selectionRect}
          tempShape={tempShape}
          floorProperties={floorProperties}
          selectedFloor={selectedFloor}
          sectionConTentView={sectionConTentView}
          layoutView={layoutView}
          handleDeleteArea={handleDeleteArea}
          handleCopyArea={handleCopyArea}
          handlePasteArea={handlePasteArea}
          handleSetFocused={handleSetFocused}
          handleMouseDown={handleMouseDown}
          handleMouseMove={handleMouseMove}
          handleMouseUp={handleMouseUp}
          handleSelectArea={handleSelectArea}
          handleSelectFloor={handleSelectFloor}
          width={20000}
          height={20000}
        />
        {/* </ZoomSVG> */}
      </div>
    </>
  );
};
export default Areas;
