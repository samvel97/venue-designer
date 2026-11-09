import React from "react";
import {
  Slide,
  SlideProps,
  Snackbar,
  SnackbarContent,
  Stack,
} from "@mui/material";

import styles from "./SnackBar.module.scss";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { useTranslation } from "react-i18next";
import { SnackErrorIcon, SnackSuccessIcon } from "components/svg";
import { IValidation } from "store/venueSlice";
import { RootState } from "store/store";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { snackBarDispatcher, snackBarState } from "store/SnackBarSlice";

type TransitionProps = Omit<SlideProps, "direction">;

function TransitionLeft(props: TransitionProps) {
  return <Slide {...props} direction="left" />;
}

const SnackBar: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const currentFloor = +searchParams.get("floor")!;
  const dispatch = useAppDispatch();
  const { onClose } = snackBarDispatcher(dispatch);
  const { open, error, message } = useAppSelector(snackBarState);

  const validations: IValidation = useSelector(
    (state: RootState) => state.venue.validations
  );

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      onClose={() => onClose()}
      autoHideDuration={5000}
      TransitionComponent={TransitionLeft}
    >
      {message.length ? (
        <Stack spacing={2} maxWidth={600}>
          {message.map((message) => (
            <SnackbarContent
              key={message}
              message={
                <span style={{ display: "flex", alignItems: "center" }}>
                  {error ? <SnackErrorIcon /> : <SnackSuccessIcon />}
                  {t(`snack.${message}`)}
                </span>
              }
              className={`${styles.snackContent} ${error && styles.error}`}
            />
          ))}
        </Stack>
      ) : (
        <Stack spacing={2} maxWidth={600}>
          {validations[currentFloor] &&
            validations[currentFloor].map(
              (validation) =>
                !validation.isValidate && (
                  <SnackbarContent
                    key={validation.name}
                    className={`${styles.snackContent} ${styles.error}`}
                    message={
                      <span style={{ display: "flex", alignItems: "center" }}>
                        {<SnackErrorIcon />}
                        {t(`snack.${validation.message}`)}
                      </span>
                    }
                  />
                )
            )}
        </Stack>
      )}
    </Snackbar>
  );
};

export default SnackBar;
