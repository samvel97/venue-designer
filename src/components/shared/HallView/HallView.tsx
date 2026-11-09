import { useEffect, useRef, useState } from "react";
import Areas from "./Areas/Areas";
import {
  FloorPropTypes,
  IAreaData,
  IDecodedLayout,
} from "Layout/Layout/Areas/types/areasTypes";
import {
  IMInMax,
  SvgContainerType,
  SvgElementType,
  toolType,
} from "types/types";
import {
  ActiveRadio,
  FitTowWindowSVG,
  InActiveRadio,
  Minus,
  Plus,
} from "components/svg";
import { findMinMaxCoordinates } from "utils/areasMinMaxCoords";
import { opacityFillColor } from "Layout/Layout/Areas/constants/areasConstants";
import { shapeCenter } from "utils/shapeCenter";
import { useGetAllAreasQuery, useGetAreasQuery } from "api/api";
import FloorsList from "components/ui/FloorsList/FloorsList";
import { binaryToText } from "utils";
import ConfirmButton from "components/ui/ConfirmButton/ConfirmButton";
import { ButtonTypeEnum } from "enums/button-type.enum";
import "./HallView.scss";
import { useControls } from "react-zoom-pan-pinch";
import ZoomSVG from "components/ui/ZoomSVG/ZoomSVG";
import { CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";

interface IHallView {
  venueId?: string;
}
const HallView = ({ venueId }: IHallView) => {
  const { t } = useTranslation();
  const [selectedFloor, setSelectedFloor] = useState<number>(0);
  const venueIdRef = useRef<string | number>(0);
  const { data: venueStructureData, isFetching } = useGetAllAreasQuery(
    venueId!,
    {
      skip: selectedFloor !== 0,
    }
  );

  const { data: venueStructureDataPerFloor, isFetching: isLoadingData } =
    useGetAreasQuery(
      { id: venueId!, floor: selectedFloor },
      {
        skip: selectedFloor === 0,
      }
    );

  const floorsCount =
    venueStructureDataPerFloor?.floorsCount ||
    venueStructureData?.floorsCount ||
    0;
  const [viewBox, setViewBox] = useState({
    x: 0,
    y: 0,
    width: 20000,
    height: 20000,
  });
  const [responseData, setResponseData] = useState<IDecodedLayout[]>([]);
  const svgContainerRef = useRef<SvgContainerType>(null);
  const svgRef = useRef<SvgElementType>(null);

  const getFloorsPlan = async (e: React.MouseEvent, floor: string) => {
    setSelectedFloor(+floor);
  };

  const calculateInitialViewBox = (
    floorProps: FloorPropTypes,
    areas: IAreaData[]
  ) => {
    let width: number = 0;
    let height: number = 0;
    let x: number = 0;
    let y: number = 0;

    if (areas.length > 1) {
      const { biggestX, biggestY, smallestX, smallestY } =
        findMinMaxCoordinates(areas, floorProps) as IMInMax;
      x = smallestX;
      y = smallestY;
      width = biggestX - smallestX;
      height = biggestY - smallestY;
    } else if (floorProps || areas.length === 1) {
      const {
        height: areaH,
        width: areaW,
        x: areaX,
        y: areaY,
        type,
        d,
      } = floorProps || areas[0].properties;

      if (type === toolType.pen) {
        const { minX, minY, maxX, maxY } = shapeCenter(d!);
        width = maxX - minX;
        height = maxY - minY;
        x = minX;
        y = minY;
      } else {
        width = areaW;
        height = areaH;
        x = areaX;
        y = areaY;
      }
    }

    setViewBox((prev) => {
      return {
        ...prev,
        x: x - 100,
        y: y - 100,
        width: width + 200,
        height: height + 200,
      };
    });
  };

  useEffect(() => {
    if (selectedFloor !== 0 && venueStructureDataPerFloor) {
      const decompressedData: IDecodedLayout = binaryToText(
        venueStructureDataPerFloor?.layout
      );
      venueIdRef.current = venueStructureDataPerFloor.venueId;
      setResponseData([decompressedData]);
      const concatAreas: IAreaData[] = decompressedData.areas.flat();
      calculateInitialViewBox(decompressedData.properties, concatAreas);
    } else if (venueStructureData) {
      const decompressedData: IDecodedLayout[] = binaryToText(
        venueStructureData?.layouts
      );
      const sortedData: IDecodedLayout[] = decompressedData.sort((a, b) => {
        return a.floor - b.floor;
      });
      venueIdRef.current = venueStructureData.venueId;

      setResponseData(sortedData);

      const concatAreas: IAreaData[] = sortedData
        .map((layout) => layout.areas)
        .flat();
      calculateInitialViewBox(sortedData[0]?.properties, concatAreas);
    }
  }, [venueStructureData, selectedFloor, venueStructureDataPerFloor]);

  return (
    <div className="P-hall-view-container">
      <div className="G-flex P-container">
        <div ref={svgContainerRef} className="P-svg-wrapper">
          <ZoomSVG layouts={responseData}>
            <svg
              ref={svgRef}
              className="P-svg"
              width={"1.5em"}
              height={"1em"}
              viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
              style={{
                overflow: "hidden",
                backgroundColor: "white",
              }}
            >
              {responseData.length
                ? responseData
                    .sort((a, b) => a.floor - b.floor)
                    .map((layout) => (
                      <Areas
                        key={layout.floor}
                        areas={layout.areas}
                        floor={layout.properties}
                        fillColor={
                          layout.floor !== 1 ? opacityFillColor : undefined
                        }
                      />
                    ))
                : null}
            </svg>
          </ZoomSVG>
        </div>
        <div className="P-hall-floors">
          <div style={{ paddingBottom: 8 }}>
            <ConfirmButton
              SvgIcon={!selectedFloor ? ActiveRadio : InActiveRadio}
              handleSubmit={() => {
                setSelectedFloor(0);
              }}
              buttonType={ButtonTypeEnum.outlinedSilver}
              label={
                floorsCount > 1
                  ? t("rightSide.view")
                  : `${t("rightSide.floor")} 1`
              }
            />
          </div>
          {floorsCount > 1 ? (
            <FloorsList
              floorsCount={floorsCount}
              currentFloor={selectedFloor.toString()}
              getFloorPlan={getFloorsPlan}
            />
          ) : null}
        </div>
      </div>
      {isLoadingData || isFetching ? (
        <div className="G-center P-loading">
          <CircularProgress />
        </div>
      ) : null}
    </div>
  );
};

export default HallView;

const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className={`G-justify-between P-buttons-component`}>
      <button onClick={() => zoomOut()} className="P-zoom-buttons">
        <Minus />
      </button>
      <button onClick={() => zoomIn()} className="P-zoom-buttons">
        <Plus />
      </button>
      <button className="P-zoom-buttons" onClick={() => resetTransform()}>
        <FitTowWindowSVG />
      </button>
    </div>
  );
};
