import "./PageSwitcherStyle.scss";
import { ArrowLeft, ManagePageArrowSVG } from "components/svg";
import { Link, useNavigate } from "react-router-dom";
import {
  FloorPropTypes,
  IAreaData,
} from "Layout/Layout/Areas/types/areasTypes";
import { memo } from "react";
import { textToBinary } from "utils";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
interface IPageSwitcher {
  page: string;
  selectedArea?: IAreaData[];
  venueId: string;
  areas?: IAreaData[];
  floor: string;
  isEqual?: boolean;
  floorProperties?: FloorPropTypes;
}
const PageSwitcher = ({
  page,
  selectedArea,
  venueId,
  // areas,
  floor,
  isEqual,
}: // floorProperties,
IPageSwitcher) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const areas: IAreaData[] = useSelector(
    (state: RootState) => state.venue.areas
  );
  const floorProperties: FloorPropTypes = useSelector(
    (state: RootState) => state.venue.floorProps
  );
  const floorsCount: number = useSelector(
    (state: RootState) => state.venue.floorsCount
  );

  const setAreaToLocalStorage = () => {
    const fromLocalStorage = localStorage.getItem(
      `venue_${venueId}_areas`
    ) as any;
    if (fromLocalStorage) return;

    const makeBinary = textToBinary({
      floorsCount,
      properties: floorProperties,
      areas,
    });
    !isEqual &&
      localStorage.setItem(`venue_${floor}_${venueId}_areas`, makeBinary);
    navigate(`seats/${selectedArea?.[0].localId}?id=${venueId}&floor=${floor}`);
  };

  return (
    <div className="P-switcher-container">
      {page === "seats" ? (
        <>
          <Link
            to={`/?id=${venueId}&floor=${floor}`}
            className="G-align-center P-switch-to-areas"
          >
            {page === "seats" ? (
              <div style={{ marginRight: 8 }}>
                <ArrowLeft />
              </div>
            ) : null}
            <span>{t("toolbar.back")}</span>
          </Link>
          <span style={{ fontWeight: 600 }}>{t("toolbar.manage_seats")}</span>
        </>
      ) : (
        <Button
          className="switch-button"
          variant="outlined"
          fullWidth
          onClick={setAreaToLocalStorage}
          sx={{
            borderRadius: 30,
            borderColor: "black",
            textTransform: "capitalize",
            "&:hover": {
              borderColor: "black",
              backgroundColor: "white",
            },
          }}
        >
          <span style={{ fontSize: 14 }}>{t("toolbar.manage_seats")}</span>
          <div style={{ fontSize: 16, display: "flex", alignItems: "center" }}>
            <ManagePageArrowSVG />
          </div>
        </Button>
      )}
    </div>
  );
};

export default memo(PageSwitcher);
