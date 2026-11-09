import React, { memo, useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  ManagePageArrowSVG,
  Preview,
  SectionContentView,
} from "../../components/svg/index";
import "../style.scss";
import HallView from "components/shared/HallView/HallView";
import NativePopup from "components/shared/NativePopup/NativePopup";
import {
  FloorPropTypes,
  IAreaData,
} from "Layout/Layout/Areas/types/areasTypes";
import { useCreateEditAreaMutation } from "api/api";
import ConfirmButton from "components/ui/ConfirmButton/ConfirmButton";
import { ButtonTypeEnum } from "enums/button-type.enum";
import { useDispatch, useSelector } from "react-redux";
import { textToBinary } from "utils";
import { updateAreas } from "utils/updateAreas";
import { IValidation, setAreas, setIsLoading } from "store/venueSlice";
import { RootState } from "store/store";
import { useTranslation } from "react-i18next";
import { openSuccessSnackBar } from "store/SnackBarSlice";
import WarningModal from "components/ui/WarningModal/WarningModal";
import { IFetching, RequestTypeEnum } from "types/types";
import { useNavigate } from "react-router-dom";
import { leaveEditor } from "config";
interface IHeader {
  venueId: string;
  floor: string;
  isEqual: boolean;
}
const Header = ({ venueId, floor, isEqual }: IHeader) => {
  const { t } = useTranslation();
  const [mutateVenue] = useCreateEditAreaMutation();
  const reduxDispatch = useDispatch();
  const navigate = useNavigate();
  const validations: IValidation = useSelector(
    (state: RootState) => state.venue.validations
  );
  const areasFromRedux: IAreaData[] = useSelector(
    (state: RootState) => state.venue.areas
  );
  const floorPropsFromRedux: FloorPropTypes = useSelector(
    (state: RootState) => state.venue.floorProps
  );
  const floorsCount: number = useSelector(
    (state: RootState) => state.venue.floorsCount
  );
  const isLoading: IFetching = useSelector(
    (state: RootState) => state.venue.isLoading
  );
  const [viewHall, setViewHall] = useState(false);

  const handleOpen = async () => {
    const selectedArea = localStorage.getItem(
      `${floor}_${venueId}_selectedArea`
    );
    try {
      selectedArea &&
        updateAreas(
          areasFromRedux,
          floorsCount,
          floorPropsFromRedux,
          selectedArea,
          venueId!,
          floor
        );
      setViewHall(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = useCallback(() => {
    setViewHall(false);
  }, []);

  const handleSaveStructure = async (
    isFromModal?: boolean,
    inValidFloor?: number,
    handleClose?: () => void
  ) => {
    reduxDispatch(openSuccessSnackBar([]));
    const currentFloor = inValidFloor ?? +floor;
    const isInValidVenue = validations[currentFloor]
      ? validations[currentFloor].some((item) => !item.isValidate)
      : true;

    if (isInValidVenue) {
      handleClose?.();
      return;
    }
    reduxDispatch(setIsLoading({ key: RequestTypeEnum.SAVE, value: true }));

    const selectedArea = localStorage.getItem(
      `${floor}_${venueId}_selectedArea`
    );
    let managedList = areasFromRedux;
    if (selectedArea) {
      const selected: IAreaData = JSON.parse(selectedArea);
      managedList = areasFromRedux.map((area) => {
        if (area.localId === selected.localId) {
          return selected;
        }
        return area;
      });
    }
    reduxDispatch(setAreas(managedList));

    try {
      const compressedData = textToBinary({
        floor: +floor,
        properties: floorPropsFromRedux,
        areas: managedList,
      });

      const data = await mutateVenue({
        venue: compressedData,
        venueId: venueId!,
      });

      reduxDispatch(setIsLoading({ key: RequestTypeEnum.SAVE, value: false }));
      if ("data" in data) {
        if (data.data.message !== "Ok") return;
        localStorage.removeItem(`venue_${floor}_${venueId}_areas`);
        localStorage.removeItem(`${floor}_${venueId}_selectedArea`);
        reduxDispatch(openSuccessSnackBar(["saved_success"]));
        if (isFromModal) {
          leaveEditor(navigate);
        }
      }
    } catch (err) {
      reduxDispatch(setIsLoading({ key: RequestTypeEnum.SAVE, value: false }));
    }
  };

  return (
    <div className="Panel snap-top G-justify-around">
      <WarningModal handleSaveStructure={handleSaveStructure} />

      <h3
        style={{
          width: "fit-content",
          transform: "translateX(50%)",
        }}
      >
        {t("header.title")}
      </h3>
      <div className="G-center">
        <NativePopup
          ActiveIcon={Preview}
          isOpen={viewHall}
          popupName={t("header.preview")}
          handleOpen={handleOpen}
          handleClose={handleClose}
        >
          <HallView venueId={venueId} />
        </NativePopup>
        <div style={{ width: 120, marginRight: 10 }}>
          <ConfirmButton
            disabled={isLoading[RequestTypeEnum.SAVE] || isEqual}
            label={isEqual ? t("header.saved") : t("header.save")}
            buttonType={ButtonTypeEnum.outlinedBlack}
            handleSubmit={() => handleSaveStructure()}
            isLoading={isLoading[RequestTypeEnum.SAVE]}
          />
        </div>
      </div>
    </div>
  );
};
export default memo(Header);
