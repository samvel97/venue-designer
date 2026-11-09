import type React from "react";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  type ICreatingProps,
  type IRowData,
  type ISeatsData,
  type ISelectedRowProps,
  type TActionType,
} from "./types/seatsTypes";
import {
  type Coords,
  type IStandardProperties,
  type SvgContainerType,
  type SvgElementType,
  toolType,
} from "../../../types/types";
import { type FloorPropTypes, type IAreaData } from "../Areas/types/areasTypes";
import { binaryToText, makeCoordsPath, sortRowsByMinY } from "../../../utils";
import { highestOrderSeat } from "@/utils/highestOrderSeat";
import { localStorageRowsKey, RowTypeEnums, seatRadius, seatWidth } from "./constants/seatsConstants";
import { selectedItemsOutlinedArea } from "@/utils/selectedRowsOutlinedArea";
import { useParams, useSearchParams } from "react-router";
import { curveRow } from "@/utils/curveRow";
import { calculatingSelectedRowsMInCoords } from "@/utils/calculatingSelectedRowsMInCoords";
import { createSeats, resizingRow, rowRotation, rowsMoving } from "@/utils/dragging";
import { updateAreas } from "@/utils/updateAreas";
import { useSelector } from "react-redux";
import { useGetAreasQuery } from "@/api/api";
import { useAppDispatch } from "@/store/hooks";
import { setAllInOne, setValidations } from "@/store/venueSlice";
import { type RootState } from "@/store/store";
import { notify } from "@/lib/notify";
import { isTypingTarget } from "@/utils/isTypingTarget";
import { toSvgPoint } from "@/utils/svgPoint";
import { generateLinesAndSeats } from "@/utils/generateLinesAndSeats";

export const useSeats = () => {
  const [params] = useSearchParams();
  const venueId = params.get("id");
  const floor = params.get("floor");
  const [rowByOrder, setRowByOrder] = useState(
    () => (localStorage.getItem(localStorageRowsKey) as RowTypeEnums) || RowTypeEnums.START_AT_ONE,
  );
  const { data: areasListFromDb } = useGetAreasQuery({
    id: venueId as string,
    floor: +floor!,
  });
  const areasListFromRedux: IAreaData[] = useSelector((state: RootState) => state.venue.areas);
  const floorPropsFromRedux: FloorPropTypes = useSelector((state: RootState) => state.venue.floorProps);
  const floorsCount: number = useSelector((state: RootState) => state.venue.floorsCount);

  const reduxDispatch = useAppDispatch();
  const { id: selectedAreaId } = useParams();
  const nextIdRef = useRef(1);
  const svgRef = useRef<SvgElementType>(null);
  const svgContainerRef = useRef<SvgContainerType>(null);
  const inputRef = useRef<null | HTMLInputElement>(null);
  const refList = useRef<(HTMLInputElement | null)[]>([]);
  const initialRowsRef = useRef<IRowData[]>([]);
  const actionsRef = useRef<TActionType>("");
  const isDraggingRef = useRef<boolean>(false);
  const selectIngSingleRowRef = useRef<boolean>(false);
  const rotationInitialXRef = useRef<Coords>({ x: 0, y: 0 });
  const scrollPositionRef = useRef<Coords>({ x: 0, y: 0 });
  const mouseOffsetRef = useRef<Coords>({ x: 0, y: 0 });
  const startPositionRef = useRef<Coords>({ x: 0, y: 0 });
  const isRowSelectedRef = useRef<boolean>(false);

  const [selectedArea, setSelectedArea] = useState<IAreaData | null>(null);
  const [seatsRows, setSeatsRows] = useState<IRowData[]>([]);
  const [selectedRows, setSelectedRows] = useState<IRowData[]>([]);
  const [selectionRect, setSelectionRect] = useState<IStandardProperties>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [multipleSeatsAndRows, setMultipleSeatsAndRows] = useState<ICreatingProps>({
    linesCount: 5,
    seatsCountPerLine: 8,
    seatSpacing: 18,
    lineSpacing: 18,
  });
  const [seatsType, setSeatsType] = useState<toolType>(toolType.select_rows);
  const [tempSeats, setTempSeats] = useState<IRowData[]>([]);
  const [multipleSelectArea, setMultipleSelectArea] = useState<boolean>(false);
  const [rotatingOutlinedArea, setRotatingOutlinedArea] = useState<number>(0);
  const [xyLines, setXYLines] = useState<boolean>(false);
  const [multipleSelectedRowsArea, setMultipleSelectedRowsArea] = useState<null | IStandardProperties>(null);
  const [selectedRowData, setSelectedRowData] = useState<ISelectedRowProps>({
    order: "",
    rotate: 0,
    rowSpacing: 0,
    seatSpacing: 0,
    curve: 0,
  });

  const areasStorageKey = useMemo(() => `venue_${floor}_${venueId}_areas`, [floor, venueId]);
  const rowsStorageKey = useMemo(() => `${floor}_${venueId}_selectedArea`, [floor, venueId]);

  const isEqualRows = useMemo(() => {
    return !(!!localStorage.getItem(areasStorageKey) || !!localStorage.getItem(rowsStorageKey));
  }, [initialRowsRef, seatsRows]);

  useEffect(() => {
    const selectedAreaFromStorage = localStorage.getItem(rowsStorageKey);
    if (selectedAreaFromStorage) {
      const selected: IAreaData = JSON.parse(selectedAreaFromStorage);
      const managedList = areasListFromRedux.map((area) => {
        if (area.localId === selected.localId) {
          return selected;
        }
        return area;
      });
      reduxDispatch(setValidations({ floor, area: managedList }));
    }
  }, [areasListFromRedux, floorPropsFromRedux, floor, seatsRows]);

  const handlingSelectedRowsProps = useCallback((selectedRows: IRowData[], selectedRowData: ISelectedRowProps) => {
    let rowData = selectedRowData;

    if (selectedRows.length > 0) {
      if (selectedRows.length === 1) {
        const seatSpacing = selectedRows[0].seats[1]
          ? selectedRows[0].seats[1].properties.x - selectedRows[0].seats[0].properties.x
          : selectedRowData.seatSpacing;

        rowData = {
          ...selectedRowData,
          order: selectedRows[0].rowOrder || "",
          rotate: selectedRows[0].properties.rotate || 0,
          curve: selectedRows[0].properties.curve || 0,
          seatSpacing: seatSpacing,
        };
      } else {
        rowData = {
          ...selectedRowData,
          rotate: selectedRowData.rotate,
          order: "",
          curve: selectedRowData.curve,
          seatSpacing: selectedRowData.seatSpacing,
          rowSpacing: selectedRowData.rowSpacing,
        };
      }
    } else {
      rowData = {
        ...selectedRowData,
        rotate: 0,
        order: "",
        curve: 0,
        seatSpacing: 0,
        rowSpacing: 0,
      };
      setMultipleSelectedRowsArea(null);
    }

    setSelectedRowData(rowData);
  }, []);
  const handleLinesAndSeatsCount = useCallback((multipleSeatsAndRows: ICreatingProps) => {
    const { linesCount, seatsCountPerLine } = multipleSeatsAndRows;
    let isValid = true;

    if (!linesCount || linesCount === 0) {
      isValid = false;
      notify.error("empty_row");
    }

    if (!seatsCountPerLine || seatsCountPerLine === 0) {
      isValid = false;
      notify.error("empty_seat");
    }

    return isValid;
  }, []);
  const handleSubmit = useCallback(() => {
    const validate = handleLinesAndSeatsCount(multipleSeatsAndRows);
    const rowByOrder = (localStorage.getItem(localStorageRowsKey) as RowTypeEnums) || RowTypeEnums.START_AT_ONE;

    if (!validate) return;
    const lines = generateLinesAndSeats({
      multipleSeatsAndRows,
      seatsRows,
      rowByOrder,
      seatWidth,
      seatRadius,
      nextIdRef,
      selectedAreaId,
    });
    nextIdRef.current = nextIdRef.current + lines.length;

    setSeatsRows((prev) => [...prev, ...lines]);
    setChangesToLocalStorage([...seatsRows, ...lines]);
    setSelectedRows(lines);
    handlingSelectedRowsProps(lines, selectedRowData);
    const selectedRowsArea = selectedItemsOutlinedArea(lines);
    setMultipleSelectedRowsArea(selectedRowsArea);
    setSeatsType(toolType.select_rows);
  }, [multipleSeatsAndRows, selectedArea, seatsRows]);
  const getCoordsforResizing = useCallback((e: React.MouseEvent, actionName: TActionType) => {
    e.preventDefault();
    actionsRef.current = actionName;
  }, []);
  const pathMouseDown = useCallback(
    (e: React.MouseEvent, selectedRow: IRowData) => {
      e.preventDefault();
      if (seatsType === toolType.select_rows && svgRef.current) {
        selectIngSingleRowRef.current = true;
        const { x, y } = toSvgPoint(svgRef.current, e);

        isRowSelectedRef.current = true;
        setSelectedRows([selectedRow]);
        handlingSelectedRowsProps([selectedRow], selectedRowData);

        const selectedRowsOutlinedArea = selectedItemsOutlinedArea([selectedRow]);
        setMultipleSelectedRowsArea(selectedRowsOutlinedArea);

        const selectedRowsAreaForRotating = calculatingSelectedRowsMInCoords([selectedRow]);
        mouseOffsetRef.current = {
          x: x - selectedRowsAreaForRotating.x,
          y: y - selectedRowsAreaForRotating.y,
        };

        actionsRef.current = "moving";
      }
    },
    [seatsType, isRowSelectedRef, selectedRowData, mouseOffsetRef],
  );
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      if (svgRef.current) {
        const { x, y } = toSvgPoint(svgRef.current, e);

        if (seatsType === toolType.select_rows) {
          if (selectedRows.length && multipleSelectedRowsArea && !selectIngSingleRowRef.current) {
            const {
              x: selectedAreaX,
              y: selectedAreaY,
              width: selectedAreaWidth,
              height: selectedAreaHeight,
            } = multipleSelectedRowsArea;

            const foundSelectedRowsArea = selectedRows.find(() => {
              return (
                x >= selectedAreaX &&
                x <= selectedAreaX + selectedAreaWidth &&
                y >= selectedAreaY &&
                y <= selectedAreaY + selectedAreaHeight
              );
            });

            setMultipleSelectArea(true);

            if (
              x > selectedAreaX + selectedAreaWidth / 2 - 20 &&
              x < selectedAreaX + selectedAreaWidth / 2 + 4 &&
              y < selectedAreaY - 4 &&
              y > selectedAreaY - 30
            ) {
              rotationInitialXRef.current = { x, y };
              setMultipleSelectArea(false);
              isDraggingRef.current = true;
              actionsRef.current = "rotating";
              return;
            } else if (foundSelectedRowsArea) {
              actionsRef.current = "moving";
              const selectedRowsAreaForRotating = calculatingSelectedRowsMInCoords(selectedRows);
              mouseOffsetRef.current = {
                x: x - selectedRowsAreaForRotating.x,
                y: y - selectedRowsAreaForRotating.y,
              };
              setMultipleSelectArea(false);
              isDraggingRef.current = true;
              return;
            } else if (actionsRef.current === "resizeX") {
              setMultipleSelectArea(false);
              isDraggingRef.current = true;
              return;
            } else {
              setSelectedRows([]);
              handlingSelectedRowsProps([], selectedRowData);
            }
          }

          selectIngSingleRowRef.current = false;
          startPositionRef.current = { x, y };
          setSelectionRect({
            x: 0,
            y: 0,
            width: 0,
            height: 0,
          });
          setMultipleSelectArea(true);
        } else if (seatsType === toolType.select_seats) {
          startPositionRef.current = { x, y };
          setSelectionRect({
            x: 0,
            y: 0,
            width: 0,
            height: 0,
          });
          setMultipleSelectArea(true);
        } else if (seatsType === toolType.multipleX) {
          setSelectedRows([]);
          handlingSelectedRowsProps([], selectedRowData);
          startPositionRef.current = { x, y };
        } else if (seatsType === toolType.scrollSvg && svgContainerRef.current) {
          startPositionRef.current = { x: e.clientX, y: e.clientY };
          scrollPositionRef.current = {
            x: svgContainerRef.current.scrollLeft,
            y: svgContainerRef.current.scrollTop,
          };
        }

        isDraggingRef.current = true;
      }
    },
    [seatsType, selectedRows, multipleSelectedRowsArea, selectedRowData],
  );
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      if (svgRef.current && isDraggingRef.current) {
        const { x, y } = toSvgPoint(svgRef.current, e);

        if (seatsType === toolType.scrollSvg && svgContainerRef.current) {
          const deltaX = e.clientX - startPositionRef.current.x;
          const deltaY = e.clientY - startPositionRef.current.y;
          svgContainerRef.current.scrollTop = scrollPositionRef.current.y - deltaY;
          svgContainerRef.current.scrollLeft = scrollPositionRef.current.x - deltaX;
        } else if (seatsType === toolType.multipleX) {
          const newRow: IRowData[] | undefined = createSeats(
            startPositionRef.current.x,
            x,
            startPositionRef.current.y,
            seatRadius,
            seatWidth,
            multipleSeatsAndRows.seatSpacing,
            nextIdRef.current,
            selectedAreaId,
            seatsRows,
          );
          setTempSeats(newRow || []);
        } else if (multipleSelectArea) {
          const start = startPositionRef.current;
          setSelectionRect({
            x: Math.min(start.x, x),
            y: Math.min(start.y, y),
            width: Math.abs(x - start.x),
            height: Math.abs(y - start.y),
          });
        }

        if (selectedRows.length) {
          if (actionsRef.current === "resizeX") {
            setMultipleSelectArea(false);
            const { updatedRows, selectedRowsOutlinedArea } = resizingRow(x, seatWidth, selectedRows);
            setMultipleSelectedRowsArea(selectedRowsOutlinedArea);

            setTempSeats(updatedRows);
          } else if (actionsRef.current === "rotating") {
            if (multipleSelectedRowsArea) {
              const { y: multY, height } = multipleSelectedRowsArea;
              const rotation = rowRotation(x, y, multY, height, rotationInitialXRef.current);
              if (rotation) {
                setRotatingOutlinedArea(Math.floor(rotation));
                setTempSeats(selectedRows);
              }
            }
          } else {
            setXYLines(true);
            setMultipleSelectArea(false);
            const newX = x - mouseOffsetRef.current.x;
            const newY = y - mouseOffsetRef.current.y;
            const { updatedRows, selectedRowsArea } = rowsMoving(newX, newY, selectedRows);
            setTempSeats(updatedRows);
            setMultipleSelectedRowsArea(selectedRowsArea);
          }
        }
      }
    },
    [
      seatsType,
      multipleSeatsAndRows,
      selectedAreaId,
      seatsRows,
      multipleSelectArea,
      selectedRows,
      multipleSelectedRowsArea,
    ],
  );
  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      isDraggingRef.current = false;
      setXYLines(false);
      setRotatingOutlinedArea(0);

      if (multipleSelectArea && !isRowSelectedRef.current && svgRef.current) {
        const start = startPositionRef.current;
        const end = toSvgPoint(svgRef.current, e);
        const xMin = Math.min(start.x, end.x);
        const xMax = Math.max(start.x, end.x);
        const yMin = Math.min(start.y, end.y);
        const yMax = Math.max(start.y, end.y);

        if (seatsType === toolType.select_rows) {
          const arr: IRowData[] = [];
          seatsRows.forEach((row) => {
            let rowAdded = false;
            row.seats.forEach((seat: ISeatsData) => {
              const { x, y, width, height } = seat.properties;
              const seatX = x;
              const seatY = y;
              const rowXMax = seatX + width - 25;
              const rowYMax = seatY + height - 25;
              const intersectsX = seatX <= xMax && rowXMax >= xMin;
              const intersectsY = seatY <= yMax && rowYMax >= yMin;
              if (intersectsX && intersectsY && !rowAdded) {
                arr.push(row);
                rowAdded = true;
              }
            });
          });
          setSelectedRows(arr);
          handlingSelectedRowsProps(arr, selectedRowData);
          const selectedRowsArea = selectedItemsOutlinedArea(arr);
          setMultipleSelectedRowsArea(selectedRowsArea);
        } else if (seatsType === toolType.select_seats) {
          const arr: ISeatsData[] = [];
          seatsRows.forEach((row) =>
            row.seats.forEach((seat: ISeatsData) => {
              const { x, y, width, height } = seat.properties;
              const rowXMax = x + width - 25;
              const rowYMax = y + height - 25;
              const intersectsX = x <= xMax && rowXMax >= xMin;
              const intersectsY = y <= yMax && rowYMax >= yMin;

              if (intersectsX && intersectsY) {
                arr.push(seat);
              }
            }),
          );
          setSelectedRows([]);
          handlingSelectedRowsProps([], selectedRowData);
        }

        setMultipleSelectArea(false);
      }

      if (tempSeats.length) {
        if (actionsRef.current === "resizeX") {
          console.log(tempSeats);

          setSeatsRows((prevAreas) =>
            prevAreas.map((prevRow) => {
              const updatedRow = tempSeats.find((row) => row.localId === prevRow.localId);
              if (updatedRow) {
                return {
                  ...updatedRow,
                  seats: updatedRow.seats.map((seat) => ({
                    ...seat,
                  })),
                };
              }
              return prevRow;
            }),
          );
          setSelectedRows(tempSeats);
          setChangesToLocalStorage(
            seatsRows.map((prevRow) => {
              const updatedRow = tempSeats.find((row) => row.localId === prevRow.localId);
              if (updatedRow) {
                return {
                  ...updatedRow,
                  seats: updatedRow.seats.map((seat, index) => ({
                    ...seat,
                    seatOrder: prevRow.seats[0].seatOrder + index,
                  })),
                };
              }
              return prevRow;
            }),
          );
          const selectedRowsArea = selectedItemsOutlinedArea(tempSeats);
          setMultipleSelectedRowsArea(selectedRowsArea);
        } else if (actionsRef.current === "rotating") {
          const updatedRows = makeCoordsPath(
            selectedRows,
            multipleSelectedRowsArea,
            Math.floor(rotatingOutlinedArea),
            true,
          );
          setSeatsRows((prevAreas) =>
            prevAreas.map((area) => updatedRows.find((row) => row.localId === area.localId) || area),
          );
          setChangesToLocalStorage(
            seatsRows.map((area) => updatedRows.find((row) => row.localId === area.localId) || area),
          );
          setSelectedRows(updatedRows);
          const selectedRowsArea = selectedItemsOutlinedArea(updatedRows);
          setMultipleSelectedRowsArea(selectedRowsArea);
          if (updatedRows.length === 1) {
            const rotationAngle = updatedRows[0].properties.rotate;
            setSelectedRowData((prevInputValues) => ({
              ...prevInputValues,
              rotate: rotationAngle,
            }));
          }
        } else if (actionsRef.current === "moving") {
          setSelectedRows(tempSeats);
          setSeatsRows((prevAreas) =>
            prevAreas.map((area) => tempSeats.find((row) => row.localId === area.localId) || area),
          );
          setChangesToLocalStorage(
            seatsRows.map((area) => tempSeats.find((row) => row.localId === area.localId) || area),
          );
        } else {
          setSeatsRows([...seatsRows, ...tempSeats]);
          setChangesToLocalStorage([...seatsRows, ...tempSeats]);
          nextIdRef.current++;
        }

        setTempSeats([]);
      }

      actionsRef.current = "";
      isRowSelectedRef.current = false;
    },
    [multipleSelectArea, seatsType, seatsRows, tempSeats, selectedRowData, rotatingOutlinedArea, selectedRows],
  );
  const handleDeleteArea = useCallback(() => {
    if (selectedRows.length) {
      const updatedRows = seatsRows.filter(
        (row) => !selectedRows.some((selectedRow) => selectedRow.localId === row.localId),
      );
      setSeatsRows(updatedRows);
      setChangesToLocalStorage(updatedRows);
      setSelectedRows([]);
      handlingSelectedRowsProps([], selectedRowData);
    }
  }, [selectedRows, seatsRows, selectedRowData]);

  const alignLeft = useCallback(() => {
    const minXSeats = Math.min(
      ...selectedRows.map((row) => Math.min(...row.seats.map((seat: ISeatsData) => seat.properties.x))),
    );

    const updatedRows: IRowData[] = selectedRows.map((row) => {
      const seatsSpace = row.seats.length > 1 ? row.seats[1].properties.x - row.seats[0].properties.x : 18;
      const updatedSeats = row.seats.map((seat: ISeatsData, index: number) => {
        const AToZ = row.seats.length - (index + 1);
        const myX = (seatsSpace < 0 ? AToZ : index) * Math.abs(seatsSpace) + minXSeats;
        return {
          ...seat,
          properties: {
            ...seat.properties,
            x: myX,
          },
        };
      });

      return {
        ...row,
        seats: updatedSeats,
      };
    });

    setSeatsRows((prevAreas) =>
      prevAreas.map((area) => updatedRows.find((row) => row.localId === area.localId) || area),
    );

    setChangesToLocalStorage(seatsRows.map((area) => updatedRows.find((row) => row.localId === area.localId) || area));

    setSelectedRows(updatedRows);
    handlingSelectedRowsProps(updatedRows, selectedRowData);
    const selectedRowsArea = selectedItemsOutlinedArea(updatedRows);
    setMultipleSelectedRowsArea(selectedRowsArea);
  }, [selectedRows, seatsRows, selectedRowData]);
  const alignRight = useCallback(() => {
    const maxXSeats = Math.max(
      ...selectedRows.map((row) => Math.max(...row.seats.map((seat: ISeatsData) => seat.properties.x))),
    );

    const updatedRows = selectedRows.map((row) => {
      const seatSpace = row.seats.length > 1 ? row.seats[1].properties.x - row.seats[0].properties.x : 18;

      const updatedSeats: ISeatsData[] = row.seats.map((seat, index) => {
        const AToZ = row.seats.length - (index + 1);
        const myX = maxXSeats - (seatSpace > 0 ? AToZ : index) * Math.abs(seatSpace);

        return {
          ...seat,
          properties: {
            ...seat.properties,
            x: myX,
          },
        };
      });

      return {
        ...row,
        seats: updatedSeats,
      };
    });

    setSeatsRows((prevAreas) =>
      prevAreas.map((area) => updatedRows.find((row) => row.localId === area.localId) || area),
    );

    setChangesToLocalStorage(seatsRows.map((area) => updatedRows.find((row) => row.localId === area.localId) || area));

    setSelectedRows(updatedRows);
    handlingSelectedRowsProps(updatedRows, selectedRowData);
    const selectedRowsArea = selectedItemsOutlinedArea(updatedRows);
    setMultipleSelectedRowsArea(selectedRowsArea);
  }, [selectedRows, seatsRows, selectedRowData]);
  const alignCenter = useCallback(() => {
    const maxX = Math.max(
      ...selectedRows.map((row) => Math.max(...row.seats.map((seat: ISeatsData) => seat.properties.x))),
    );
    const minX = Math.min(
      ...selectedRows.map((row) => Math.min(...row.seats.map((seat: ISeatsData) => seat.properties.x))),
    );

    const updatedRows = selectedRows.map((row) => {
      const seatSpace = row.seats.length > 1 ? row.seats[1].properties.x - row.seats[0].properties.x : 18;

      const updatedSeats: ISeatsData[] = row.seats.map((seat, index) => {
        const AToZ = row.seats.length - (index + 1);
        const myX =
          (seatSpace < 0 ? AToZ : index) * Math.abs(seatSpace) + minX + (maxX - minX) / 2 - row.properties.width / 2;

        return {
          ...seat,
          properties: {
            ...seat.properties,
            x: myX,
          },
        };
      });

      return {
        ...row,
        seats: updatedSeats,
      };
    });

    setSeatsRows((prevAreas) =>
      prevAreas.map((area) => updatedRows.find((row) => row.localId === area.localId) || area),
    );

    setChangesToLocalStorage(seatsRows.map((area) => updatedRows.find((row) => row.localId === area.localId) || area));

    setSelectedRows(updatedRows);
    handlingSelectedRowsProps(updatedRows, selectedRowData);
    const selectedRowsArea = selectedItemsOutlinedArea(updatedRows);
    setMultipleSelectedRowsArea(selectedRowsArea);
  }, [selectedRows, seatsRows, selectedRowData]);
  const handleTypeChange = useCallback(
    (type: toolType) => {
      setSeatsType(type);
      setSelectedRows([]);
      handlingSelectedRowsProps([], selectedRowData);
    },
    [selectedRowData],
  );
  const handleChangeInitOption = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMultipleSeatsAndRows((prev) => ({ ...prev, [name]: value }));
  }, []);
  const handleChangeRowsData = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value: val } = event.target;

      let value = val;
      if (name !== "order" && value === "") {
        value = "0";
      }

      if (selectedRows.length > 0) {
        const newSelectedRows = [...selectedRows];
        const newAllRows = [...seatsRows];
        let highestOrder: number | undefined;
        newSelectedRows.sort((a, b) => a.seats[0].properties.y - b.seats[0].properties.y);
        newAllRows.sort((a, b) => a.seats[0].properties.y - b.seats[0].properties.y);
        if (name === "order") {
          const sameLines: IRowData[] = [...seatsRows].filter((row) => {
            return row.rowOrder === value;
          });

          highestOrder = highestOrderSeat(sameLines)?.seatOrder ?? 0;
        }
        const sortedRows: IRowData[] = sortRowsByMinY(selectedRows);
        const updatedRows: IRowData[] = sortedRows.map((row, i) => {
          const width = row.seats.length * parseFloat(value) - parseFloat(value);
          const myRow: IRowData = {
            ...row,
            properties: {
              ...row.properties,
              width: name === "seatSpacing" ? width : row.properties.width,
            },
            rowOrder: name === "order" && row.localId === newSelectedRows[0].localId ? value : row.rowOrder,
            seats: row.seats.map((seat: ISeatsData, seatIndex: number) => {
              if (name === "seatSpacing") {
                const perSeatX = seatIndex * parseFloat(value);
                const firstSeatX = row.seats[0].properties.x;
                const seatsX = firstSeatX + perSeatX;
                return {
                  ...seat,
                  properties: {
                    ...seat.properties,
                    x: seatsX,
                  },
                };
              } else if (name === "rowSpacing") {
                const seatsY = sortedRows[0].seats[0].properties.y - 8 + i * parseFloat(value) + seatRadius;
                return {
                  ...seat,
                  properties: { ...seat.properties, y: seatsY },
                };
              } else if (name === "order" && highestOrder !== undefined) {
                return {
                  ...seat,
                  seatOrder: highestOrder + seatIndex + 1,
                };
              }
              return seat;
            }),
          };
          return myRow;
        });
        let managedRow: IRowData[] = updatedRows;
        if (name === "curve") {
          managedRow = curveRow(selectedRows, parseFloat(value));
        }
        if (name === "rotate") {
          managedRow = makeCoordsPath(selectedRows, multipleSelectedRowsArea, parseFloat(value));
          if (val == "0" || val === "") {
            const seatSpacing = managedRow[0].seats[1]
              ? managedRow[0].seats[1].properties.x - managedRow[0].seats[0].properties.x
              : selectedRowData.seatSpacing;

            setSelectedRowData((prevInputValues) => ({
              ...prevInputValues,
              seatSpacing: seatSpacing,
            }));
          }
        }

        setSelectedRowData((prevInputValues) => ({
          ...prevInputValues,
          [name]: val,
        }));

        setSelectedRows(managedRow);
        const selectedRowsArea = selectedItemsOutlinedArea(managedRow);
        setMultipleSelectedRowsArea(selectedRowsArea);
        setSeatsRows((prev) =>
          prev.map((row) => {
            const updatedRow = managedRow.find((updatedRow) => updatedRow.localId === row.localId);
            return updatedRow ? updatedRow : row;
          }),
        );
        setChangesToLocalStorage(
          seatsRows.map((row) => {
            const updatedRow = managedRow.find((updatedRow) => updatedRow.localId === row.localId);
            return updatedRow ? updatedRow : row;
          }),
        );
      }
    },
    [selectedRows, seatsRows, selectedRowData],
  );
  const setChangesToLocalStorage = useCallback(
    (seatsRows: IRowData[]) => {
      if (selectedArea) {
        const updatedRowsAndSeats: IRowData[] = seatsRows.map((item) => {
          return {
            ...item,
            seats: item.seats.map((seat: ISeatsData) => {
              return {
                ...seat,
                properties: {
                  ...seat.properties,
                  x: seat.properties.x - (10000 - selectedArea.properties.x),
                  y: seat.properties.y - (10000 - selectedArea.properties.y),
                },
              };
            }),
          };
        });
        const { rows, ...rest } = selectedArea;
        localStorage.setItem(rowsStorageKey, JSON.stringify({ ...rest, rows: updatedRowsAndSeats }));
      }
    },
    [selectedArea, rowsStorageKey],
  );
  const getItemFromLocalStorage = useCallback(
    (chosenArea: IAreaData, trigger: boolean) => {
      if (chosenArea?.rows.length) {
        let id: number = 0;
        const updatedRowsAndSeats = chosenArea.rows.map((item: IRowData) => {
          const itemId = item.localId.split(`_${selectedAreaId}`).join("");
          if (+itemId > id) {
            id = +itemId;
          }
          return {
            ...item,
            seats: item.seats.map((seat: ISeatsData) => {
              return {
                ...seat,
                properties: {
                  ...seat.properties,
                  x: seat.properties.x + (10000 - chosenArea.properties.x),
                  y: seat.properties.y + (10000 - chosenArea.properties.y),
                },
              };
            }),
          };
        });
        nextIdRef.current = id + 1;
        setSeatsRows(updatedRowsAndSeats);
        initialRowsRef.current = trigger ? updatedRowsAndSeats : [];
      }
    },
    [selectedAreaId],
  );
  const movingSVGToCenter = useCallback((svgContainerRef: any, selectedArea: IAreaData) => {
    const containerWidth = svgContainerRef.current.clientWidth;
    const containerHeight = svgContainerRef.current.clientHeight;
    const { height, width, type } = selectedArea.properties;
    let areaWith = width;
    let areaHeight = height;
    if (type === toolType.pen) {
      areaWith = 0;
      areaHeight = 0;
    }
    svgContainerRef.current.scrollLeft = 10000 - containerWidth / 2 + areaWith / 2;
    svgContainerRef.current.scrollTop = 10000 - containerHeight / 2 + areaHeight / 2;
  }, []);
  const switchRowsByOrder = useCallback((byOrder: RowTypeEnums) => {
    localStorage.setItem(localStorageRowsKey, byOrder);
    setRowByOrder(byOrder);
  }, []);

  useEffect(() => {
    if (inputRef.current !== document.activeElement && !refList.current.some((ref) => ref === document.activeElement)) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Delete" && !isTypingTarget(event)) {
          handleDeleteArea();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedRows]);
  useEffect(() => {
    if (svgContainerRef.current && selectedArea) {
      movingSVGToCenter(svgContainerRef, selectedArea);
    }
  }, [selectedArea]);
  useEffect(() => {
    let trigger = false;
    const areasListFromLocalStorage = localStorage.getItem(areasStorageKey) as any;
    const chosenArea: IAreaData = JSON.parse(localStorage.getItem(rowsStorageKey) as string);
    let areasList: IAreaData[] = [];
    if (areasListFromLocalStorage) {
      const decodedData = binaryToText(areasListFromLocalStorage);
      areasList = decodedData.areas;
      reduxDispatch(
        setAllInOne({
          areas: decodedData.areas,
          floorProps: decodedData.properties,
          floorsCount: decodedData.floorsCount,
        }),
      );
    } else if (areasListFromDb?.layout) {
      const decodedData = binaryToText(areasListFromDb.layout);
      reduxDispatch(
        setAllInOne({
          areas: decodedData.areas,
          floorProps: decodedData.properties,
          floorsCount: decodedData.floorsCount,
        }),
      );
      areasList = decodedData.areas;
      trigger = true;
    }
    if (areasList.length && selectedAreaId) {
      if (chosenArea?.rows) {
        const selected = chosenArea;
        if (selected.localId === +selectedAreaId) {
          setSelectedArea(selected);
          getItemFromLocalStorage(selected, trigger);
          return;
        }
      }
      const handledArea = areasList.find((item: IAreaData) => item.localId === +selectedAreaId);
      setSelectedArea(handledArea!);
      getItemFromLocalStorage(handledArea!, trigger);
    }
    return () => {
      const selectedAreaFromStorage = localStorage.getItem(rowsStorageKey);
      if (selectedAreaFromStorage) {
        updateAreas(
          areasListFromRedux || [],
          floorsCount,
          floorPropsFromRedux,
          selectedAreaFromStorage,
          venueId!,
          floor!,
        );
      }
    };
  }, [areasListFromDb]);

  return {
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
    resize: actionsRef.current,
    venueId,
    areasListFromRedux,
    floor,
    isEqualRows,
    rowByOrder,
    handleSubmit,
    pathMouseDown,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleDeleteArea,
    alignLeft,
    alignRight,
    alignCenter,
    handleTypeChange,
    handleChangeRowsData,
    setMultipleSeatsAndRows: handleChangeInitOption,
    getCoordsforResizing,
    switchRowsByOrder,
  };
};
