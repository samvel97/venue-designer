import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import EditorLayout from "@/components/editor/EditorLayout";
import Header from "@/components/editor/Header";
import NumberFields from "@/components/editor/NumberFields";
import OptionSelect from "@/components/editor/OptionSelect";
import TextField from "@/components/editor/TextField";
import ToolGroup from "@/components/editor/ToolGroup";
import { Button } from "@/components/primitives/button";
import { Section } from "@/components/primitives/section";
import { toolType } from "@/types/types";
import { hasRotatedItem } from "@/utils/hasRotatedRow";
import { RowTypeEnums, seatCreatingActions, seatManipulationActions } from "./constants/seatsConstants";
import SeatsSvg from "./SeatsSvg/SeatsSvg";
import { useSeats } from "./useSeats";

const numberingLabels: Record<RowTypeEnums, string> = {
  [RowTypeEnums.START_AT_ONE]: "start_at_one",
  [RowTypeEnums.ROW_TO_ROW]: "row_to_row",
};

const Seats = () => {
  const { t } = useTranslation();
  const { svgRef, svgContainerRef, inputRef, refList, ...editor } = useSeats();
  const venueId = editor.venueId ?? "";
  const floor = editor.floor ?? "1";
  const { selectedRows, selectedRowData, seatsType } = editor;
  const rotated = hasRotatedItem(selectedRows);

  const handlers: Partial<Record<toolType, () => void>> = {
    [toolType.alignLeft]: editor.alignLeft,
    [toolType.alignRight]: editor.alignRight,
    [toolType.alignCenter]: editor.alignCenter,
    [toolType.delete]: editor.handleDeleteArea,
  };

  const rowActions =
    selectedRows.length === 1 || rotated
      ? seatManipulationActions.filter((action) => action.title === toolType.delete)
      : seatManipulationActions;

  const { curve, order, rotate, rowSpacing, seatSpacing } = selectedRowData;
  const rowFields = rotated
    ? { rotate }
    : selectedRows.length > 1
      ? { seatSpacing, rowSpacing, curve, rotate }
      : { seatSpacing, order, curve, rotate };

  return (
    <EditorLayout
      header={<Header venueId={venueId} floor={floor} isEqual={editor.isEqualRows} />}
      canvasRef={svgContainerRef}
      panning={seatsType === toolType.scrollSvg}
      sidebar={
        <>
          <Section>
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="icon-sm">
                <Link to={`/?id=${venueId}&floor=${floor}`} aria-label={t("toolbar.back")}>
                  <ArrowLeft />
                </Link>
              </Button>
              <h2 className="text-sm font-semibold">{t("toolbar.manage_seats")}</h2>
            </div>
          </Section>

          <Section title={t("toolbar.tools")}>
            <ToolGroup actions={seatCreatingActions} active={seatsType} onSelect={editor.handleTypeChange} />
            {seatsType === toolType.multipleXY ? (
              <NumberFields
                values={{ ...editor.multipleSeatsAndRows }}
                refList={refList}
                onChange={editor.setMultipleSeatsAndRows}
                onSubmit={editor.handleSubmit}
              />
            ) : null}
            {seatsType === toolType.multipleX ? (
              <NumberFields
                values={{ seatSpacing: editor.multipleSeatsAndRows.seatSpacing }}
                refList={refList}
                onChange={editor.setMultipleSeatsAndRows}
              />
            ) : null}
          </Section>

          <Section title={t("toolbar.numbering")}>
            <OptionSelect
              options={Object.values(RowTypeEnums)}
              value={editor.rowByOrder ?? RowTypeEnums.START_AT_ONE}
              onChange={editor.switchRowsByOrder}
              labelKey={(option) => numberingLabels[option]}
            />
          </Section>

          {selectedRows.length ? (
            <Section title={t("toolbar.rows")}>
              {selectedRows.length === 1 ? (
                <TextField
                  ref={inputRef}
                  name="order"
                  label={t("toolbar.order")}
                  value={order}
                  onChange={editor.handleChangeRowsData}
                />
              ) : null}
              <ToolGroup actions={rowActions} onSelect={(action) => handlers[action]?.()} />
              <NumberFields values={rowFields} refList={refList} onChange={editor.handleChangeRowsData} />
            </Section>
          ) : null}
        </>
      }
    >
      {(zoom) =>
        editor.selectedArea ? (
          <SeatsSvg
            ref={svgRef}
            zoom={zoom}
            tempSeats={editor.tempSeats}
            seatsRows={editor.seatsRows}
            selectedRows={selectedRows}
            multipleSelectArea={editor.multipleSelectArea}
            xyLines={editor.xyLines}
            multipleSelectedRowsArea={editor.multipleSelectedRowsArea}
            selectedArea={editor.selectedArea}
            selectionRect={editor.selectionRect}
            rotatingOutlinedArea={editor.rotatingOutlinedArea}
            seatsSpacing={editor.multipleSeatsAndRows.seatSpacing}
            resize={editor.resize}
            seatsType={seatsType}
            pathMouseDown={editor.pathMouseDown}
            chooseSeats={editor.chooseSeats}
            handleMouseDown={editor.handleMouseDown}
            handleMouseMove={editor.handleMouseMove}
            handleMouseUp={editor.handleMouseUp}
            getCoordsforResizing={editor.getCoordsforResizing}
          />
        ) : null
      }
    </EditorLayout>
  );
};

export default Seats;
