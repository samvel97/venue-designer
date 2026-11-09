import React, { ReactElement } from "react";

interface IToolBar {
  children: ReactElement;
}
const ToolBar = ({ children }: IToolBar) => {
  return <div className="ToolPicker">{children}</div>;
};
export default ToolBar;
