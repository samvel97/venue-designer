import {
  ActiveRadio,
  HideFloorLayout,
  InActiveRadio,
  PreviewFloorLayout,
  RemoveFloor,
} from "components/svg";
import { ButtonTypeEnum } from "enums/button-type.enum";
import ConfirmButton from "../ConfirmButton/ConfirmButton";
import { ILayoutView } from "Layout/Layout/Areas/types/areasTypes";
import { useTranslation } from "react-i18next";
import "./style.scss";
import { CircularProgress } from "@mui/material";
import { RequestTypeEnum } from "types/types";
interface IFloorsList {
  floorsCount: number;
  currentFloor: string;
  layoutView?: ILayoutView;
  isLoadingRemove?: boolean;
  isLoadingGet?: boolean;
  getFloorPlan: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    floor: string
  ) => void;
  handleDelete?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  handleLayoutView?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    floor: string
  ) => void;
}
const FloorsList = ({
  floorsCount,
  currentFloor,
  isLoadingRemove = false,
  isLoadingGet = false,
  getFloorPlan,
  handleDelete,
  handleLayoutView,
  layoutView,
}: IFloorsList) => {
  const { t } = useTranslation();

  return (
    <>
      {[...new Array(floorsCount)].map((_, index) => (
        <div
          className="P-Floor-button-wrapper"
          key={index}
          style={{ paddingBottom: 8 }}
        >
          <div
            role="button"
            aria-label="Floor-change"
            className="P-button-item"
            onClick={(e) => getFloorPlan(e, (index + 1).toString())}
          >
            <ConfirmButton
              SvgIcon={
                currentFloor === (index + 1).toString()
                  ? ActiveRadio
                  : InActiveRadio
              }
              isLoading={isLoadingGet}
              handleSubmit={(e) => console.log()}
              buttonType={ButtonTypeEnum.outlinedSilver}
              label={`${t("rightSide.floor")} ${index + 1}`}
            />
            {handleLayoutView && currentFloor !== (index + 1).toString() && (
              <div className="P-view-icon ">
                <div
                  role="button"
                  aria-label="Preview-Layout"
                  className="P-view"
                  onClick={(e) => handleLayoutView(e, (index + 1).toString())}
                >
                  {layoutView?.floor !== (index + 1).toString() ? (
                    <HideFloorLayout />
                  ) : (
                    <PreviewFloorLayout />
                  )}
                </div>
              </div>
            )}
          </div>
          {handleDelete && index === floorsCount - 1 && index !== 0 ? (
            <div
              role="button"
              aria-label="remove"
              style={{ cursor: "pointer" }}
              onClick={(e) => handleDelete?.(e)}
            >
              {isLoadingRemove ? (
                <CircularProgress size={16} />
              ) : (
                <RemoveFloor />
              )}
            </div>
          ) : null}
        </div>
      ))}
    </>
  );
};

export default FloorsList;
