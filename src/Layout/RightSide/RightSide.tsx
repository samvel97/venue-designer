import {
  useCreateEditAreaMutation,
  useDeleteFloorMutation,
  useLazyGetLayoutViewQuery,
} from "api/api";
import ConfirmButton from "components/ui/ConfirmButton/ConfirmButton";
import FloorsList from "components/ui/FloorsList/FloorsList";
import { ButtonTypeEnum } from "enums/button-type.enum";
import {
  IAreasResponse,
  ILayoutView,
} from "Layout/Layout/Areas/types/areasTypes";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "store/hooks";
import { openSuccessSnackBar } from "store/SnackBarSlice";
import { RootState } from "store/store";
import { setIsLoading, setLayoutViewProps } from "store/venueSlice";
import { IFetching, RequestTypeEnum } from "types/types";
import { binaryToText, textToBinary } from "utils";

const RightSide = ({
  data,
  layoutView,
}: {
  data?: IAreasResponse;
  layoutView: ILayoutView;
}) => {
  const { t } = useTranslation();
  const [mutateVenue] = useCreateEditAreaMutation();
  const [deleteFloor] = useDeleteFloorMutation();
  const [getLayoutView] = useLazyGetLayoutViewQuery();
  const reduxDispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const venueId = searchParams.get("id");
  const currentFloor = searchParams.get("floor");
  const floorsCount: number = useSelector(
    (state: RootState) => state.venue.floorsCount
  );
  const isLoading: IFetching = useSelector(
    (state: RootState) => state.venue.isLoading
  );

  const getFloorPlan = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    floor: string
  ) => {
    e.stopPropagation();
    setSearchParams((prev) => {
      prev.set("floor", floor);
      return prev;
    });
    if (layoutView.floor === floor) {
      reduxDispatch(setLayoutViewProps({ floor: "", properties: null }));
    }
  };

  const handleLayoutView = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    floor: string
  ) => {
    e.stopPropagation();
    if (layoutView.floor === floor) {
      reduxDispatch(setLayoutViewProps({ floor: "", layoutView: null }));
      return;
    }

    try {
      const resultData = await getLayoutView({
        id: venueId!,
        floor: +floor,
      });

      if (resultData && "data" in resultData) {
        const decodedData = binaryToText(resultData.data?.layout!);
        reduxDispatch(
          setLayoutViewProps({
            floor: floor,
            properties: decodedData.properties,
          })
        );
      }
    } catch (e) {}
  };

  const addFloor = async () => {
    reduxDispatch(
      setIsLoading({ key: RequestTypeEnum.ADD_FLOOR, value: true })
    );
    try {
      const compressedData = textToBinary({
        floor: +floorsCount! + 1,
        properties: {},
        areas: [],
      });

      const data = await mutateVenue({
        venue: compressedData,
        venueId: venueId!,
      });
      if ("data" in data && data.data.message === "Ok") {
        reduxDispatch(openSuccessSnackBar(["created_success"]));
        reduxDispatch(
          setIsLoading({ key: RequestTypeEnum.ADD_FLOOR, value: false })
        );
      }
    } catch (err) {
      reduxDispatch(
        setIsLoading({ key: RequestTypeEnum.ADD_FLOOR, value: false })
      );
    }
  };
  const handleDelete = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    let isLastFloor = +currentFloor! === +floorsCount!;
    localStorage.removeItem(`venue_${+floorsCount!}_${venueId}_areas`);
    localStorage.removeItem(`${+currentFloor!}_${venueId}_selectedArea`);
    reduxDispatch(
      setIsLoading({ key: RequestTypeEnum.REMOVE_FLOOR, value: true })
    );
    try {
      await deleteFloor(venueId!);
      reduxDispatch(openSuccessSnackBar(["removed_success"]));
      reduxDispatch(
        setIsLoading({ key: RequestTypeEnum.REMOVE_FLOOR, value: false })
      );
      if (isLastFloor) {
        navigate(`/?id=${venueId}&floor=1`);
      }
    } catch (e) {
      reduxDispatch(
        setIsLoading({ key: RequestTypeEnum.REMOVE_FLOOR, value: false })
      );
    }
  };

  return (
    <div className="Inspector">
      <FloorsList
        isLoadingRemove={isLoading[RequestTypeEnum.REMOVE_FLOOR]}
        isLoadingGet={isLoading[RequestTypeEnum.GET_FLOOR]}
        floorsCount={floorsCount}
        currentFloor={currentFloor!}
        layoutView={layoutView}
        getFloorPlan={getFloorPlan}
        handleDelete={handleDelete}
        handleLayoutView={handleLayoutView}
      />
      {+floorsCount! < 5 ? (
        <div style={{ width: 170 }}>
          <ConfirmButton
            disabled={!data}
            isLoading={isLoading[RequestTypeEnum.ADD_FLOOR]}
            handleSubmit={addFloor}
            buttonType={ButtonTypeEnum.outlinedBlack}
            label={t("rightSide.add_floor")}
          />
        </div>
      ) : null}
    </div>
  );
};

export default memo(RightSide);
