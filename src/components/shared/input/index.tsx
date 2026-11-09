import React, { ComponentProps, forwardRef, useId } from "react";
import "./style.scss";

import { InputTypeEnum } from "enums/input-type.enum";

interface IInput extends ComponentProps<"input"> {
  label?: string;
  error?: boolean;
  errorText?: string;
  leftIcon?: string;
  rightIcon?: string;
  readOnly?: boolean;
  inputType?: InputTypeEnum;
  customClass?: string;
  isRequired?: boolean;
  onClick?(data: React.MouseEvent<HTMLInputElement>): void;
  onClickIcon?(): void;
}

const Input = forwardRef<HTMLInputElement, IInput>(
  (
    {
      customClass = "",
      label,
      error,
      errorText,
      leftIcon = "",
      rightIcon = "",
      onClickIcon,
      readOnly,
      onClick,
      isRequired = false,
      disabled,
      inputType = InputTypeEnum.text,
      ...props
    }: IInput,
    ref
  ) => {
    function setIcons() {
      if (leftIcon && !error) {
        return <span className={`G-left-icon ${leftIcon}`} />;
      }
      if (leftIcon && error) {
        return (
          <>
            <span className={`G-left-icon ${leftIcon}`} />
            <span className="G-error-icon icon-warning" />
          </>
        );
      }
      if (rightIcon && !error) {
        return (
          <span onClick={onClickIcon} className={`G-right-icon ${rightIcon}`} />
        );
      }
      if (error) {
        return <span className="G-error-icon icon-warning" />;
      }
    }

    const handlerClick = (data: React.MouseEvent<HTMLInputElement>) => {
      onClick?.(data);
    };
    const id = useId();
    return (
      <div
        className={`G-input ${error ? "G-input-error" : ""} ${
          disabled ? "G-input-disables" : ""
        }${readOnly ? "G-input-readonly" : ""}`}
        onClick={handlerClick}
      >
        <label htmlFor={id}>
          {setIcons()}
          <input
            id={id}
            {...props}
            ref={ref}
            type={InputTypeEnum[inputType]}
            className={`${customClass} ${
              error || rightIcon ? "P-has-icon-right" : ""
            } ${leftIcon ? "P-has-icon-left" : ""}`}
            disabled={readOnly || disabled}
            autoComplete={"off"}
          />
          {label ? (
            <span
              className={`G-input-label ${
                isRequired ? "G-input-label-required" : ""
              }`}
              title={label}
            >
              {label}
            </span>
          ) : null}
        </label>
        {error && errorText && <p className="G-error-label">{errorText}</p>}
      </div>
    );
  }
);

export default Input;
