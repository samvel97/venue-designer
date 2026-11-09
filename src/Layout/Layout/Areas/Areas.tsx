import EditorLayout from "@/components/editor/EditorLayout";
import FloorsPanel from "@/components/editor/FloorsPanel";
import Header from "@/components/editor/Header";
import { toolType } from "@/types/types";
import AreasSidebar from "./components/AreasSidebar";
import AreasSvg from "./components/AreasSvg/AreasSvg";
import { useAreas } from "./useAreas";

const CANVAS_SIZE = 20000;

const Areas = () => {
  const { svgRef, svgContainerRef, inputRef, ticketsCountRef, refList, ...editor } = useAreas();
  const venueId = editor.venueId ?? "";
  const floor = editor.floor ?? "1";

  return (
    <EditorLayout
      header={<Header venueId={venueId} floor={floor} isEqual={editor.isEqual} />}
      sidebar={
        <AreasSidebar
          tool={editor.tool}
          shapeType={editor.shapeType}
          selectedArea={editor.selectedArea}
          selectedFloor={editor.selectedFloor}
          inputValues={editor.inputValues}
          inputRef={inputRef}
          ticketsCountRef={ticketsCountRef}
          refList={refList}
          venueId={venueId}
          floor={floor}
          isEqual={editor.isEqual}
          sectionContentView={editor.sectionConTentView}
          handleToolTypeChange={editor.handleToolTypeChange}
          selectShapeType={editor.selectShapeType}
          handleChange={editor.handleChange}
          handleDeleteArea={editor.handleDeleteArea}
          handleCopyArea={editor.handleCopyArea}
          handlePasteArea={editor.handlePasteArea}
          flipHorizontal={editor.flipHorizontal}
          flipVertical={editor.flipVertical}
          handleSectionContentView={editor.handleSectionContentView}
        />
      }
      aside={<FloorsPanel canAdd={!!editor.data} layoutView={editor.layoutView} />}
      canvasRef={svgContainerRef}
      panning={editor.tool === toolType.scrollSvg}
    >
      <AreasSvg
        ref={svgRef}
        areas={editor.areas}
        selectedArea={editor.selectedArea}
        resizeCursor={editor.resizeCursor}
        tempShape={editor.tempShape}
        floorProperties={editor.floorProperties}
        selectedFloor={editor.selectedFloor}
        sectionConTentView={editor.sectionConTentView}
        layoutView={editor.layoutView}
        handleSetFocused={editor.handleSetFocused}
        handleMouseDown={editor.handleMouseDown}
        handleMouseMove={editor.handleMouseMove}
        handleMouseUp={editor.handleMouseUp}
        handleSelectArea={editor.handleSelectArea}
        handleSelectFloor={editor.handleSelectFloor}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
      />
    </EditorLayout>
  );
};

export default Areas;
