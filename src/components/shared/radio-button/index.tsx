import React, { forwardRef, Ref, HTMLProps } from "react";
import { ActiveRadio, InActiveRadio } from "components/svg";
import "./style.scss";

interface RadioButtonProps extends HTMLProps<HTMLInputElement> {
  label: string;
}

const RadioButton = forwardRef(
  (props: RadioButtonProps, ref: Ref<HTMLInputElement>) => {
    const { label, checked, ...rest } = props;

    return (
      <label className="G-align-center">
        <div className="G-radio-icon">
          {checked ? <ActiveRadio /> : <InActiveRadio />}
        </div>
        <div className="title">{label}</div>
        <input
          type="radio"
          checked={checked}
          ref={ref}
          {...rest}
          className="radio-button"
        />
      </label>
    );
  }
);

export default RadioButton;
