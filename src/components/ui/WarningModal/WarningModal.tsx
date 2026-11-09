import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { ArrowLeft, ArrowRight, WarningIcon } from "components/svg";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { leaveEditor } from "config";

export default function WarningModal({
  handleSaveStructure,
}: {
  handleSaveStructure: (
    isFromModal?: boolean,
    floor?: number,
    handleClose?: () => void
  ) => void;
}) {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const venueId = params.get("id");
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const floorsCount: number = useSelector(
    (state: RootState) => state.venue.floorsCount
  );

  const handleUnsavedChanges = () => {
    const floorsWithUnsavedChanges = Array.from(
      { length: floorsCount },
      (_, index) => {
        const areasStorageKey = `venue_${index + 1}_${venueId}_areas`;
        const rowsStorageKey = `${index + 1}_${venueId}_selectedArea`;
        if (
          localStorage.getItem(areasStorageKey) ||
          localStorage.getItem(rowsStorageKey)
        ) {
          return index + 1;
        }

        return null;
      }
    ).filter((floor) => floor !== null);
    return floorsWithUnsavedChanges;
  };

  const unsavedFloors = handleUnsavedChanges();

  const handleClickOpen = () => {
    if (unsavedFloors.length) {
      setOpen(true);
      return;
    }
    backToTable();
  };

  const handleClose = () => {
    setOpen(false);
    setStep(1);
  };

  const handleNavigate = (floor?: number) => {
    if (floor) {
      navigate(`?id=${venueId}&floor=${floor}`);
    }
    handleClose();
  };

  const modalSecondStep = () => {
    if (unsavedFloors.length > 1) {
      setStep(2);
      return;
    }
    const currentFloor = unsavedFloors[0] ?? undefined;
    navigate(`/?id=${venueId}&floor=${currentFloor}`);
    handleSaveStructure(true, currentFloor, handleClose);
  };

  const backToTable = () => {
    handleClose();
    leaveEditor(navigate);
  };

  return (
    <React.Fragment>
      <Button
        sx={{
          textTransform: "capitalize",
          color: "black",
          "&:hover": {
            backgroundColor: "white",
            color: "black",
          },
          marginLeft: 1,
        }}
        onClick={handleClickOpen}
      >
        <div
          role="button"
          aria-label="back to table"
          style={{
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            margin: "0 5px",
          }}
        >
          <ArrowLeft />
        </div>
        <span style={{ fontSize: 14 }}>{t("header.back")}</span>
      </Button>
      <Dialog
        open={open}
        onClose={() => handleClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div
          className="G-center"
          style={{
            textAlign: "center",
            padding: 48,
            width: 525,
            flexDirection: "column",
          }}
        >
          <div style={{ fontSize: 48 }}>
            <WarningIcon />
          </div>
          <h3 style={{ padding: "16px 0" }}>
            {t(
              `${
                unsavedFloors.length === 1
                  ? "modal.attention"
                  : "modal.attention_multi"
              }`,
              { values: unsavedFloors.join(", ") }
            )}
          </h3>
          {step === 1 ? (
            <div>{t("modal.warning_message")}</div>
          ) : (
            <div className="G-flex-column">
              {unsavedFloors.map((floor) => (
                <div
                  key={floor}
                  className="G-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleNavigate(floor as number)}
                >
                  <span style={{ padding: 5, color: "#2B5EE0" }}>{`${t(
                    "modal.go_to_floor"
                  )} ${floor}`}</span>
                  <ArrowRight />
                </div>
              ))}
            </div>
          )}
          <div className="G-flex" style={{ width: "100%", marginTop: 48 }}>
            <Button
              className="switch-button"
              variant="outlined"
              fullWidth
              onClick={backToTable}
              sx={{
                borderRadius: 30,
                fontSize: 12,
                borderColor: "black",
                textTransform: "capitalize",
                color: "black",
                marginRight: step === 1 ? 5 : 0,
                "&:hover": {
                  borderColor: "black",
                  backgroundColor: "white",
                  color: "black",
                },
              }}
            >
              {t("modal.continue_without_save")}
            </Button>
            {step === 1 && (
              <Button
                className="switch-button"
                variant="outlined"
                onClick={modalSecondStep}
                fullWidth
                sx={{
                  borderRadius: 30,
                  fontSize: 12,
                  borderColor: "#8EC34E",
                  backgroundColor: "#8EC34E",
                  textTransform: "capitalize",
                  color: "white",
                  "&:hover": {
                    borderColor: "#8EC34E",
                    backgroundColor: "#8EC34E",
                    color: "white",
                  },
                }}
              >
                {t("modal.save_continue")}
              </Button>
            )}
          </div>
        </div>
      </Dialog>
    </React.Fragment>
  );
}
