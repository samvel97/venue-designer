import React, {
  useState,
  useRef,
  useEffect,
  useReducer,
  useMemo,
  useCallback,
} from "react";
import {
  binaryToText,
  getLineCenters,
  stringSlicer,
  textToBinary,
} from "../../../utils";
import {
  SvgContainerType,
  SvgElementType,
  toolType,
} from "../../../types/types";
import {
  ActionType,
  FloorPropTypes,
  IAreaData,
  IAreasProperties,
  IComparingData,
  ILayoutView,
} from "./types/areasTypes";
import { IRowData, ISeatsData } from "../Seats/types/seatsTypes";
import { defaultCornerRadius, ShapeType } from "./constants/areasConstants";
import { getHigherOrder } from "utils/higherOrder";
import { calculatingSelectedRowsMInCoords } from "utils/calculatingSelectedRowsMInCoords";
import { useGetAreasQuery } from "api/api";
import { reducer, initialState } from "./Reducer/areasReducer";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch } from "store/hooks";
import {
  setAreas,
  setFloorProps,
  setFloorsCount,
  setValidations,
} from "store/venueSlice";
import { useSelector } from "react-redux";
import { updateAreas } from "utils/updateAreas";
import { RootState } from "store/store";
import { shapeCenter } from "utils/shapeCenter";

export const useAreas = () => {
  const [params] = useSearchParams();
  const venueId = params.get("id");
  const floor = params.get("floor");
  const areas: IAreaData[] = useSelector(
    (state: RootState) => state.venue.areas
  );
  const floorProperties: FloorPropTypes = useSelector(
    (state: RootState) => state.venue.floorProps
  );
  const floorsCount: number = useSelector(
    (state: RootState) => state.venue.floorsCount
  );
  const layoutView: ILayoutView = useSelector(
    (state: RootState) => state.venue.layoutView
  );

  const { data } = useGetAreasQuery({
    id: venueId as string,
    floor: +floor!,
  });

  const reduxDispatch = useAppDispatch();
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    sectionConTentView,
    inputValues,
    selectedFloor,
    shapeType,
    tempShape,
    copiedAreaIndex,
    isCopying,
    selectedArea,
    resizeCursor,
    selectionRect,
    isPasting,
    dragging,
    resizing,
    isSVGFocused,
    resizeCorner,
    startX,
    startY,
    scrollLeft,
    scrollTop,
    mouseOffsetX,
    mouseOffsetY,
    rowsMouseOffset,
    multipleSelectArea,
  } = state;

  useEffect(() => {
    reduxDispatch(setValidations({ floor, area: undefined }));
  }, [areas, floorProperties, floor]);

  const nextIdRef = useRef(1);
  const svgRef = useRef<SvgElementType>(null);
  const inputRef = useRef<null | HTMLInputElement>(null);
  const ticketsCountRef = useRef<null | HTMLInputElement>(null);
  const refList = useRef<HTMLImageElement[]>([]);
  const svgContainerRef = useRef<SvgContainerType>(null);
  const selectOnShapeRef = useRef<boolean>(false);
  const selectOnFloorRef = useRef<boolean>(false);
  const [tool, setTool] = useState<toolType>(toolType.select);
  const toolTypeRef = useRef<toolType>(tool);
  const createRefActionName = useRef<string>("");
  const anglesCount = useRef<number>(0);
  const decompressedDataFromDbRef = useRef<IComparingData | null>(null);
  const storageKey = `venue_${floor}_${venueId}_areas`;

  const isEqual = useMemo(
    () => !localStorage.getItem(storageKey),

    [data, areas, floorProperties]
  );

  const selectShapeType = useCallback(
    (prop: ShapeType) => {
      createRefActionName.current = "";

      dispatch({ type: ActionType.SET_SHAPE_TYPE, payload: prop });
    },
    [shapeType]
  );
  const handleCopyArea = useCallback(() => {
    if (selectedArea.length === 1) {
      dispatch({ type: ActionType.SET_IS_COPYING, payload: true });
      dispatch({
        type: ActionType.SET_COPIED_AREA_INDEX,
        payload: areas.findIndex(
          (area) => area?.localId === selectedArea[0]?.localId
        ),
      });
    }
  }, [selectedArea, isCopying, copiedAreaIndex]);
  const handlePasteArea = useCallback(() => {
    if (copiedAreaIndex !== null) {
      const copiedArea = areas[copiedAreaIndex];
      const { x, y, d, type, width } = copiedArea.properties;

      let firstLOccurrence = d?.indexOf("l") || 0;
      let result = d?.substring(firstLOccurrence);
      let copiedWidth = width;
      if (type === toolType.pen) {
        const { minX, maxX } = shapeCenter(d!);
        copiedWidth = maxX - minX;
      }
      const copiedRows = copiedArea.rows.map((row, index) => {
        return {
          ...row,
          localId: `${index + 1}_${nextIdRef.current}`,
          seats: row.seats.map((seat) => {
            return {
              ...seat,
              properties: {
                ...seat.properties,
                x: seat.properties.x + copiedWidth + 20,
              },
            };
          }),
        };
      });

      const newArea = {
        localId: nextIdRef.current,
        title: { am: "", ru: "", en: "" },
        properties: {
          ...copiedArea.properties,
          x: x + copiedWidth + 20,
          d:
            type === toolType.pen
              ? `M ${Math.max(x + copiedWidth + 20, 0)} ${Math.max(y, 0)}` +
                result
              : undefined,
        },
        areaType: copiedArea.areaType,
        ticketsCount: copiedArea.ticketsCount,
        rows: copiedRows,
      };
      reduxDispatch(setAreas([...areas, newArea]));
      const makeBinary = textToBinary({
        floorsCount: floorsCount,
        properties: floorProperties,
        areas: [...areas, newArea],
      });
      localStorage.setItem(`venue_${floor}_${venueId}_areas`, makeBinary);
      nextIdRef.current++;
      dispatch({ type: ActionType.SET_IS_PASTING, payload: false });
    }
  }, [areas, isPasting, copiedAreaIndex]);
  const flipHorizontal = useCallback(
    (selectedArea: IAreaData[]) => {
      if (selectedArea.length > 0 || selectedFloor) {
        const selected = selectedFloor || selectedArea[0].properties;
        const {
          cornerBottomLeft,
          cornerBottomRight,
          cornerTopLeft,
          cornerTopRight,
        } = selected;

        const props = {
          ...selected,
          cornerTopLeft: cornerTopRight,
          cornerTopRight: cornerTopLeft,
          cornerBottomLeft: cornerBottomRight,
          cornerBottomRight: cornerBottomLeft,
        };
        if (selectedFloor) {
          dispatch({ type: ActionType.SET_SELECTED_FLOOR, payload: props });
          reduxDispatch(setFloorProps(props));
          const makeBinary = textToBinary({
            floorsCount: floorsCount,
            properties: props,
            areas: areas,
          });
          localStorage.setItem(`venue_${floor}_${venueId}_areas`, makeBinary);
          return;
        }

        const mirroredArea = {
          ...selectedArea[0],
          properties: props,
        };

        dispatch({
          type: ActionType.SET_SELECTED_AREAS,
          payload: [mirroredArea],
        });
        const areaIndex = areas.findIndex(
          (area) => area.localId === selectedArea[0].localId
        );
        const updatedAreas = [...areas];
        updatedAreas[areaIndex] = mirroredArea;
        reduxDispatch(setAreas(updatedAreas));
        const makeBinary = textToBinary({
          floorsCount: floorsCount,
          properties: floorProperties,
          areas: updatedAreas,
        });
        localStorage.setItem(`venue_${floor}_${venueId}_areas`, makeBinary);
      }
    },
    [selectedArea, inputValues, areas]
  );
  const flipVertical = useCallback(
    (selectedArea: IAreaData[]) => {
      if (selectedArea.length > 0 || selectedFloor) {
        const selected = selectedFloor || selectedArea[0].properties;
        const {
          cornerBottomLeft,
          cornerBottomRight,
          cornerTopLeft,
          cornerTopRight,
        } = selected;
        const props = {
          ...selected,
          cornerTopRight: cornerBottomRight,
          cornerBottomRight: cornerTopRight,
          cornerTopLeft: cornerBottomLeft,
          cornerBottomLeft: cornerTopLeft,
        };
        if (selectedFloor) {
          dispatch({ type: ActionType.SET_SELECTED_FLOOR, payload: props });
          reduxDispatch(setFloorProps(props));
          const makeBinary = textToBinary({
            floorsCount: floorsCount,
            properties: props,
            areas: areas,
          });
          // handlingSelectProps(mirroredArea)

          localStorage.setItem(`venue_${floor}_${venueId}_areas`, makeBinary);
          return;
        }

        const mirroredArea = {
          ...selectedArea[0],
          properties: props,
        };

        dispatch({
          type: ActionType.SET_SELECTED_AREAS,
          payload: [mirroredArea],
        });
        const areaIndex = areas.findIndex(
          (area) => area.localId === selectedArea[0].localId
        );
        const updatedAreas = [...areas];
        updatedAreas[areaIndex] = mirroredArea;
        reduxDispatch(setAreas(updatedAreas));
        const makeBinary = textToBinary({
          floorsCount: floorsCount,
          properties: floorProperties,
          areas: updatedAreas,
        });
        localStorage.setItem(`venue_${floor}_${venueId}_areas`, makeBinary);
      }
    },
    [selectedArea, areas, inputValues]
  );

  const handleSelectArea = useCallback(
    (event: React.MouseEvent, area: IAreaData, scale: number) => {
      if (svgRef.current && toolTypeRef?.current === toolType.select) {
        selectOnShapeRef.current = true;
        const rect = svgRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const scaledX = x / scale;
        const scaledY = y / scale;
        const { x: areaX, y: areaY } = area.properties;
        if (event.ctrlKey) {
          let newSelectedAreas = [];
          if (selectedArea.some((item) => item.localId === area.localId)) {
            newSelectedAreas = selectedArea.filter(
              (elem) => elem.localId !== area.localId
            );
          } else {
            newSelectedAreas = [...selectedArea, area];
          }
          dispatch({
            type: ActionType.SET_SELECTED_AREAS,
            payload: newSelectedAreas,
          });
        } else {
          dispatch({ type: ActionType.SET_SELECTED_AREAS, payload: [area] });
          dispatch({
            type: ActionType.SET_MOUSE_OFFSET_X,
            payload: scaledX - areaX,
          });
          dispatch({
            type: ActionType.SET_MOUSE_OFFSET_Y,
            payload: scaledY - areaY,
          });
          if (area.rows.length) {
            const selectedRowsAreaForRotating =
              calculatingSelectedRowsMInCoords(area.rows);
            dispatch({
              type: ActionType.SET_ROWS_MOUSE_OFFSET,
              payload: {
                x: scaledX - selectedRowsAreaForRotating.x,
                y: scaledY - selectedRowsAreaForRotating.y,
              },
            });
          }
        }
      }
    },
    [selectedArea, mouseOffsetX, mouseOffsetY, rowsMouseOffset]
  );
  const handleSelectFloor = useCallback(
    (event: React.MouseEvent, floor: FloorPropTypes, scale: number) => {
      if (svgRef.current && toolTypeRef?.current === toolType.select && floor) {
        const rect = svgRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const scaledX = x / scale;
        const scaledY = y / scale;
        selectOnFloorRef.current = true;
        if (event.ctrlKey && selectedFloor) {
          dispatch({ type: ActionType.SET_SELECTED_FLOOR, payload: null });
          selectOnShapeRef.current = false;
          return;
        }
        dispatch({ type: ActionType.SET_SELECTED_FLOOR, payload: floor });
        dispatch({
          type: ActionType.SET_MOUSE_OFFSET_X,
          payload: scaledX - floor.x,
        });
        dispatch({
          type: ActionType.SET_MOUSE_OFFSET_Y,
          payload: scaledY - floor.y,
        });
      }
    },
    [selectedFloor, mouseOffsetX, mouseOffsetY, selectOnShapeRef]
  );
  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (
        toolTypeRef?.current !== toolType.select &&
        toolTypeRef?.current !== toolType.selectFloor
      ) {
        if (
          toolTypeRef?.current === toolType.scrollSvg &&
          svgContainerRef.current
        ) {
          //scrolling svg
          dispatch({ type: ActionType.SET_START_X, payload: event.clientX });
          dispatch({ type: ActionType.SET_START_Y, payload: event.clientY });
          dispatch({
            type: ActionType.SET_SCROLL_LEFT,
            payload: svgContainerRef.current.scrollLeft,
          });
          dispatch({
            type: ActionType.SET_SCROLL_TOP,
            payload: svgContainerRef.current.scrollTop,
          });
        } else {
          dispatch({ type: ActionType.SET_START_X, payload: x });
          dispatch({ type: ActionType.SET_START_Y, payload: y });
          if (toolTypeRef?.current === toolType.pen) {
            let props;
            anglesCount.current += 1;
            if (tempShape.length) {
              props = {
                ...tempShape[0].properties,
                d: `${tempShape[0].properties.d} l 0 0`,
              };
            } else {
              props = {
                x: x,
                y: y,
                width: 0,
                height: 0,
                type: toolTypeRef?.current,
                rotate: 0,
                d: `M ${x} ${y}`,
              };
            }
            const newArea: IAreaData = {
              localId: nextIdRef.current,
              title: {
                am: "",
                ru: "",
                en: "",
              },
              rows: [],
              ticketsCount: 0,
              areaType: shapeType,
              properties: props,
            };
            dispatch({ type: ActionType.SET_TEMP_SHAPE, payload: [newArea] });
          }
        }
        dispatch({ type: ActionType.SET_DRAGGING, payload: true });
      } else {
        if (selectedFloor && !selectOnFloorRef.current && !event.ctrlKey) {
          dispatch({ type: ActionType.SET_SELECTED_FLOOR, payload: null });
        }
        if (
          selectedArea.length &&
          !selectOnShapeRef.current &&
          !event.ctrlKey
        ) {
          dispatch({
            type: ActionType.SET_START_POSITION,
            payload: { x: event.clientX, y: event.clientY },
          });
          dispatch({
            type: ActionType.SET_SELECTION_RECT,
            payload: {
              x: 0,
              y: 0,
              width: 0,
              height: 0,
            },
          });
          dispatch({
            type: ActionType.SET_MULTIPLE_SELECT_AREA,
            payload: true,
          });
          dispatch({ type: ActionType.SET_SELECTED_AREAS, payload: [] });
          dispatch({ type: ActionType.SET_RESIZING, payload: false });
          dispatch({ type: ActionType.SET_RESIZE_CORNER, payload: null });
        }
        selectOnShapeRef.current = false;
        selectOnFloorRef.current = false;
        dispatch({ type: ActionType.SET_DRAGGING, payload: true });
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    event.preventDefault();
    const scale = 1;
    // dispatch({ type: ActionType.SET_RESIZE_CURSOR, payload: false });
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const scaledX = x / scale;
      const scaledY = y / scale;
      const scaledStartX = startX / scale;
      const scaledStartY = startY / scale;
      const mouseOffsetXScaled = mouseOffsetX / scale;
      const mouseOffsetYScaled = mouseOffsetY / scale;
      if (dragging) {
        if (
          toolTypeRef?.current !== toolType.select &&
          toolTypeRef?.current !== toolType.selectFloor
        ) {
          if (tool === toolType.scrollSvg && svgContainerRef.current) {
            const x = event.clientX / scale;
            const y = event.clientY / scale;
            const deltaX = x - scaledStartX;
            const deltaY = y - scaledStartY;
            svgContainerRef.current.scrollTop = scrollTop - deltaY;
            svgContainerRef.current.scrollLeft = scrollLeft - deltaX;
          } else {
            // drawing a new shape

            // const scaledX = x / scale;
            // const scaledY = y / scale;
            // const scaledStartX = startX / scale;
            // const scaledStartY = startY / scale;
            const width = scaledX - scaledStartX;
            const height = scaledY - scaledStartY;
            const pathX = width < 0 ? scaledX : scaledStartX;
            const pathY = height < 0 ? scaledY : scaledStartY;
            let props: IAreasProperties = {
              x: pathX,
              y: pathY,
              width: Math.abs(width),
              height: Math.abs(height),
              type: toolTypeRef?.current,
              rotate: 0,
            };
            if (toolTypeRef?.current === toolType.pen) {
              //pti scale dzvi
              let initCoords = tempShape[0].properties.d;
              if (tempShape[0].properties.d?.includes("l")) {
                initCoords = stringSlicer(tempShape[0].properties.d!);
              }
              props = {
                ...tempShape[0].properties,
                d: `${initCoords} l ${width} ${height}`,
              };
            } else if (toolTypeRef?.current === toolType.rectangle) {
              props = {
                ...props,
                cornerTopRight: defaultCornerRadius,
                cornerTopLeft: defaultCornerRadius,
                cornerBottomRight: defaultCornerRadius,
                cornerBottomLeft: defaultCornerRadius,
              };
            }
            const newArea: IAreaData = {
              localId: nextIdRef.current,
              title: {
                am: "",
                ru: "",
                en: "",
              },
              rows: [],
              ticketsCount: 0,
              areaType: shapeType,
              properties: props,
            };

            dispatch({ type: ActionType.SET_TEMP_SHAPE, payload: [newArea] });
          }
        } else {
          //moving floor
          if (selectedFloor) {
            createRefActionName.current = "moving";
            const newX = scaledX - mouseOffsetX;
            const newY = scaledY - mouseOffsetY;
            let firstLOccurrence = selectedFloor.d?.indexOf("l") || 0;
            let result = selectedFloor.d?.substring(firstLOccurrence);
            const props = {
              ...selectedFloor,
              x: Math.max(newX, 0),
              y: Math.max(newY, 0),
              d:
                selectedFloor.type === toolType.pen
                  ? `M ${Math.max(newX, 0)} ${Math.max(newY, 0)}` + result
                  : undefined,
            };
            dispatch({ type: ActionType.SET_SELECTED_FLOOR, payload: props });
            reduxDispatch(setFloorProps(props));
            const makeBinary = textToBinary({
              floorsCount: floorsCount,
              properties: props,
              areas: areas,
            });
            localStorage.setItem(`venue_${floor}_${venueId}_areas`, makeBinary);
            return;
          }
          if (selectedArea.length === 1) {
            if (resizing && resizeCorner === "bottom-right") {
            } else {
              // moving a shape
              createRefActionName.current = "moving";
              const newX = scaledX - mouseOffsetX;
              const newY = scaledY - mouseOffsetY;
              const selected = selectedArea[0].properties;
              let firstLOccurrence = selected.d?.indexOf("l") || 0;
              let result = selected.d?.substring(firstLOccurrence);

              const props = {
                ...selected,
                x: Math.max(newX, 0),
                y: Math.max(newY, 0),
                d:
                  selected.type === "pen"
                    ? `M ${Math.max(newX, 0)} ${Math.max(newY, 0)}` + result
                    : undefined,
              };

              let rows: null | IRowData[] = null;
              if (selectedArea[0].rows.length) {
                const newXForRows = x - rowsMouseOffset.x;
                const newYForRows = y - rowsMouseOffset.y;
                const { x: minX, y: minY } = calculatingSelectedRowsMInCoords(
                  selectedArea[0].rows,
                  true
                );
                const updatedRows: IRowData[] = selectedArea[0].rows.map(
                  (row) => {
                    const updatedSeats = row.seats.map((seat: ISeatsData) => {
                      const myX = newXForRows - (minX - seat.properties.x);
                      const myY = newYForRows - (minY - seat.properties.y);
                      return {
                        ...seat,
                        properties: {
                          ...seat.properties,
                          x: myX,
                          y: myY,
                        },
                      };
                    });
                    return {
                      ...row,
                      seats: updatedSeats,
                    };
                  }
                );
                rows = updatedRows;
              }
              dispatch({
                type: ActionType.SET_TEMP_SHAPE,
                payload: [
                  {
                    ...selectedArea[0],
                    rows: rows || selectedArea[0].rows,
                    properties: props,
                  },
                ],
              });
            }
          }
        }
      } else {
        if (selectedArea.length === 1) {
          let blum = getLineCenters(
            selectedArea[0].properties.x,
            selectedArea[0].properties.y,
            selectedArea[0].properties.width,
            selectedArea[0].properties.height
          );
          if (
            (x < blum.top.x + 10 &&
              x > blum.top.x - 10 &&
              y < blum.top.y + 5 &&
              y > blum.top.y - 5) ||
            (x < blum.bottom.x + 10 &&
              x > blum.bottom.x - 10 &&
              y > blum.bottom.y - 5 &&
              y < blum.bottom.y + 5) ||
            (x === blum.left.x && y === blum.left.y) ||
            (x === blum.right.x && y === blum.right.y)
          ) {
            dispatch({ type: ActionType.SET_RESIZE_CURSOR, payload: true });
          }
          const {
            x: areaX,
            y: areaY,
            width,
            height,
          } = selectedArea[0].properties;
          const isResizing =
            x >= areaX + width - 10 &&
            x <= areaX + width &&
            y >= areaY + height - 10 &&
            y <= areaY + height;
          if (isResizing) {
            dispatch({ type: ActionType.SET_RESIZE_CURSOR, payload: true });
          }
        }
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (tempShape.length) {
      let temp = tempShape;

      if (createRefActionName.current === "moving") {
        const updatedAreas = areas.map((area) =>
          area?.localId === temp[0]?.localId ? temp[0] : area
        );
        reduxDispatch(setAreas(updatedAreas));
        const makeBinary = textToBinary({
          floorsCount: floorsCount,
          properties: floorProperties,
          areas: updatedAreas,
        });
        localStorage.setItem(`venue_${floor}_${venueId}_areas`, makeBinary);
        dispatch({ type: ActionType.SET_SELECTED_AREAS, payload: temp });
      } else {
        if (toolTypeRef?.current === toolType.pen) {
          if (
            startX <= temp[0].properties.x + 5 &&
            startX >= temp[0].properties.x - 5 &&
            startY >= temp[0].properties.y - 5 &&
            startY <= temp[0].properties.y + 5 &&
            anglesCount.current > 2
          ) {
            let coords = stringSlicer(temp[0].properties.d!);
            coords = stringSlicer(coords);
            temp = [
              {
                ...temp[0],
                properties: {
                  ...temp[0].properties,
                  d:
                    coords +
                    `l ${temp[0].properties.x - startX} ${
                      temp[0].properties.y - startY
                    } Z`,
                },
              },
            ];
            anglesCount.current = 0;
          } else {
            return;
          }
        }
        if (temp[0].areaType === ShapeType.BACKGROUND) {
          reduxDispatch(setFloorProps(temp[0].properties));
          const makeBinary = textToBinary({
            floorsCount: floorsCount,
            properties: temp[0].properties,
            areas: areas,
          });
          localStorage.setItem(`venue_${floor}_${venueId}_areas`, makeBinary);
        } else {
          const newAreas = [...areas, ...temp];
          reduxDispatch(setAreas(newAreas));
          const makeBinary = textToBinary({
            floorsCount: floorsCount,
            properties: floorProperties,
            areas: newAreas,
          });
          localStorage.setItem(`venue_${floor}_${venueId}_areas`, makeBinary);
          nextIdRef.current++;
        }
      }
      createRefActionName.current = "";
      dispatch({ type: ActionType.SET_TEMP_SHAPE, payload: [] });
    }
    dispatch({ type: ActionType.SET_DRAGGING, payload: false });
    dispatch({ type: ActionType.SET_RESIZING, payload: false });
    dispatch({ type: ActionType.SET_RESIZE_CORNER, payload: null });
  };
  const handleDeleteArea = useCallback(() => {
    if (selectedFloor) {
      dispatch({ type: ActionType.SET_SELECTED_FLOOR, payload: null });
      reduxDispatch(setFloorProps(null));
      const makeBinary = textToBinary({
        floorsCount: floorsCount,
        properties: null,
        areas: areas,
      });
      localStorage.setItem(`venue_${floor}_${venueId}_areas`, makeBinary);
    }
    if (selectedArea.length > 0) {
      const updatedAreas = areas.filter(
        (area) =>
          !selectedArea.some((selected) => selected.localId === area.localId)
      );
      reduxDispatch(setAreas(updatedAreas));
      const makeBinary = textToBinary({
        floorsCount: floorsCount,
        properties: floorProperties,
        areas: updatedAreas,
      });
      localStorage.setItem(`venue_${floor}_${venueId}_areas`, makeBinary);

      dispatch({ type: ActionType.SET_SELECTED_AREAS, payload: [] });
      dispatch({ type: ActionType.SET_RESIZING, payload: false });
      dispatch({ type: ActionType.SET_RESIZE_CORNER, payload: null });
      dispatch({
        type: ActionType.SET_INPUT_VALUES,
        payload: {
          width: 0,
          height: 0,
          rotate: 0,
          cornerTopRight: 0,
          cornerTopLeft: 0,
          cornerBottomRight: 0,
          cornerBottomLeft: 0,
          title: { am: "", ru: "", en: "" },
        },
      });
    }
  }, [selectedArea, areas, resizing, resizeCorner, inputValues, selectedFloor]);
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;

      dispatch({
        type: ActionType.SET_INPUT_VALUES,
        payload: { ...inputValues, [name]: value },
      });
      if (selectedArea?.length || selectedFloor) {
        const areaProps = selectedFloor || selectedArea[0].properties;
        if (selectedFloor) {
          const props = { ...areaProps, [name]: parseFloat(value) };
          dispatch({ type: ActionType.SET_SELECTED_FLOOR, payload: props });
          reduxDispatch(setFloorProps(props));
          const makeBinary = textToBinary({
            floorsCount: floorsCount,
            properties: props,
            areas: areas,
          });
          localStorage.setItem(`venue_${floor}_${venueId}_areas`, makeBinary);
        } else {
          const updatedArea = { ...selectedArea[0] };
          if (["am", "en", "ru"].includes(name)) {
            const selectedAreaTitle = {
              ...selectedArea[0].title,
              [name]: value,
            };
            updatedArea.title = selectedAreaTitle;
          } else if (name === "ticketsCount") {
            updatedArea.ticketsCount = parseFloat(value);
          } else {
            const props = { ...areaProps, [name]: parseFloat(value) };
            const selectedAreaTitle = {
              am: selectedArea[0].title.am,
              en: selectedArea[0].title.en,
              ru: selectedArea[0].title.ru,
            };
            updatedArea.properties = props;
            updatedArea.title = selectedAreaTitle;
          }
          dispatch({
            type: ActionType.SET_SELECTED_AREAS,
            payload: [updatedArea],
          });
          reduxDispatch(
            setAreas(
              areas.map((area) =>
                area?.localId === selectedArea[0]?.localId ? updatedArea : area
              )
            )
          );
          const makeBinary = textToBinary({
            floorsCount: floorsCount,
            properties: floorProperties,
            areas: areas.map((area) =>
              area?.localId === selectedArea[0]?.localId ? updatedArea : area
            ),
          });
          localStorage.setItem(`venue_${floor}_${venueId}_areas`, makeBinary);
        }
      }
    },
    [inputValues, areas, selectedArea]
  );
  const handleToolTypeChange = useCallback(
    (type: toolType) => {
      if (type === toolType.selectFloor) {
        dispatch({
          type: ActionType.SET_SELECTED_FLOOR,
          payload: floorProperties,
        });
      } else {
        dispatch({ type: ActionType.SET_SELECTED_FLOOR, payload: null });
      }
      setTool(type);
      dispatch({ type: ActionType.SET_SELECTED_AREAS, payload: [] });
      dispatch({ type: ActionType.SET_RESIZING, payload: false });
      dispatch({ type: ActionType.SET_RESIZE_CORNER, payload: null });
      dispatch({
        type: ActionType.SET_INPUT_VALUES,
        payload: {
          width: 0,
          height: 0,
          rotate: 0,
          cornerTopRight: 0,
          cornerTopLeft: 0,
          cornerBottomRight: 0,
          cornerBottomLeft: 0,
          title: { am: "", ru: "", en: "" },
        },
      });
    },
    [floorProperties, inputValues, selectedArea, resizing, resizeCorner]
  );
  const handleSetFocused = () => {
    if (
      !inputRef.current ||
      (selectedArea[0]?.areaType === ShapeType.WITHOUT_SEATS &&
        !ticketsCountRef.current) ||
      refList.current.length === 0
    )
      return;
    dispatch({ type: ActionType.SET_IS_SVG_FOCUSED, payload: true });
    refList.current.map((ref) => {
      ref?.blur();
    });
    inputRef.current.blur();
    ticketsCountRef.current?.blur();
  };
  const handleFocusChange = (event: any) => {
    if (event.target !== svgRef.current) {
      dispatch({ type: ActionType.SET_IS_SVG_FOCUSED, payload: false });
    }
  };
  const handleSectionContentView = useCallback(() => {
    dispatch({
      type: ActionType.SET_SECTION_CONTENT_VIEW,
      payload: !sectionConTentView,
    });
  }, [sectionConTentView]);
  const movingSVGToCenter = (
    svgContainerRef: any,
    floorProps?: FloorPropTypes
  ) => {
    let coordX = 10000;
    let coordY = 10000;
    const containerWidth = svgContainerRef.current.clientWidth;
    const containerHeight = svgContainerRef.current.clientHeight;
    if (floorProps && floorProps.type) {
      if (floorProps.type === "pen") {
        const { minX, minY } = shapeCenter(floorProps.d!);
        coordX = minX;
        coordY = minY;
      }
      coordX = floorProps.x;
      coordY = floorProps.y;
      svgContainerRef.current.scrollLeft = coordX - (containerWidth / 2 - 300);
      svgContainerRef.current.scrollTop = coordY - (containerHeight / 2 - 200);
      return;
    }
    svgContainerRef.current.scrollLeft = coordX;
    svgContainerRef.current.scrollTop = coordY;
  };

  useEffect(() => {
    toolTypeRef.current = tool;
    createRefActionName.current = "";
  }, [tool]);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isSVGFocused) {
        if ((event.ctrlKey && event.key === "c") || event.key === "C") {
          event.preventDefault();
          handleCopyArea();
        } else if ((event.ctrlKey && event.key === "v") || event.key === "C") {
          dispatch({ type: ActionType.SET_IS_PASTING, payload: true });
          event.preventDefault();
          handlePasteArea();
        } else if ((event.ctrlKey && event.key === "a") || event.key === "A") {
          event.preventDefault();
          dispatch({ type: ActionType.SET_SELECTED_AREAS, payload: areas });
          dispatch({
            type: ActionType.SET_SELECTED_FLOOR,
            payload: floorProperties,
          });
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isSVGFocused,
    isCopying,
    isPasting,
    selectedArea,
    selectedFloor,
    copiedAreaIndex,
  ]);
  useEffect(() => {
    if (
      inputRef.current !== document.activeElement &&
      ticketsCountRef.current !== document.activeElement &&
      !refList.current.some((ref) => ref === document.activeElement)
    ) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Delete") {
          event.preventDefault();
          handleDeleteArea();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedArea, selectedFloor]);
  useEffect(() => {
    const fromLocalStorage = localStorage.getItem(
      `venue_${floor}_${venueId}_areas`
    ) as any;
    const decodedData = data?.layout ? binaryToText(data?.layout) : null;

    decompressedDataFromDbRef.current = decodedData
      ? { areas: decodedData.areas, floorProps: decodedData.properties }
      : { areas: [], floorProps: null };

    if (svgContainerRef.current) {
      if (fromLocalStorage) {
        const decodedData = binaryToText(fromLocalStorage);

        if (decodedData) {
          nextIdRef.current = getHigherOrder(decodedData.areas) + 1;
          reduxDispatch(setAreas(decodedData.areas));
          reduxDispatch(setFloorProps(decodedData.properties));
          movingSVGToCenter(svgContainerRef, decodedData.properties);
        }
      } else if (decodedData) {
        nextIdRef.current = getHigherOrder(decodedData.areas) + 1;
        reduxDispatch(setAreas(decodedData.areas));
        reduxDispatch(setFloorProps(decodedData.properties));
        movingSVGToCenter(svgContainerRef, decodedData.properties);
      } else {
        movingSVGToCenter(svgContainerRef);
      }

      reduxDispatch(setFloorsCount(data?.floorsCount || 1));
    }
  }, [data]);
  useEffect(() => {
    if (svgRef.current && isSVGFocused) {
      document.addEventListener("focus", handleFocusChange, true);
    }
    return () => {
      document.removeEventListener("focus", handleFocusChange, true);
    };
  }, [svgRef.current, handleFocusChange]);
  useEffect(() => {
    const selectedArea = localStorage.getItem(
      `${floor}_${venueId}_selectedArea`
    );
    if (selectedArea && areas) {
      const areasList = updateAreas(
        areas,
        floorsCount,
        floorProperties,
        selectedArea,
        venueId!,
        floor!
      );
      reduxDispatch(setAreas(areasList?.managedList));
    }
  }, [areas, floorsCount, floorProperties]);

  return {
    svgRef,
    svgContainerRef,
    areas,
    tool,
    selectedArea,
    inputValues,
    copiedAreaIndex,
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
    floorProperties,
    floor,
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
  };
};
