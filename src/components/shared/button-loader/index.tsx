import React from "react";
import "./style.scss";
import { ButtonTypeEnum } from "enums/button-type.enum";
import { CircularProgress } from "@mui/material";

interface IButtonLoader extends React.ComponentProps<"button"> {
  isLoading?: boolean;
  isDisable?: boolean;
  buttonTypes?: ButtonTypeEnum;
  iconClass?: string;
  customClass?: string;
  SvgIcon?: React.ElementType;
  handleDelete?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  label?: string;
}

const ButtonLoader = ({
  buttonTypes = ButtonTypeEnum.primary,
  iconClass,
  label,
  SvgIcon,
  customClass,
  isLoading,
  handleDelete,
  ...props
}: IButtonLoader) => {
  return (
    <button
      {...props}
      tabIndex={0}
      className={`G-button ${ButtonTypeEnum[buttonTypes]} ${customClass}`}
    >
      {SvgIcon && <SvgIcon />}
      {label && <p style={{ padding: "0 5px" }}>{label}</p>}
      {isLoading && (
        <CircularProgress
          style={{
            position: "absolute",
            right: 15,
          }}
          size={16}
        />
      )}
    </button>
  );
};

export default ButtonLoader;
