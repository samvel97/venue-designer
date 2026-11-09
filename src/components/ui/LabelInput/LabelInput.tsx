import { ChangeEvent, forwardRef, memo } from "react";
import "./LabelInputStyle.scss";
import { TextField } from "@mui/material";

interface ILabelInput {
  name: string;
  value: string;
  handleChange: (value: ChangeEvent<HTMLInputElement>) => void;
}
const textFieldProps = {
  style: {
    borderRadius: "20px",
    borderColor: "#85A52E",
  },
};
const LabelInput = forwardRef<HTMLInputElement, ILabelInput>(
  ({ value, name, handleChange }, ref) => {
    return (
      <div className="P-permission-input">
        <TextField
          ref={ref}
          name={name}
          fullWidth
          label={`Name ${name}`}
          value={value}
          onChange={handleChange}
          size="small"
          className="P-Input"
          InputProps={textFieldProps}
        />
      </div>
    );
  }
);

export default memo(LabelInput);
