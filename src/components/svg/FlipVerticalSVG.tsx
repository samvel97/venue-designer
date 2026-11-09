import * as React from "react";
import { SVGProps, memo } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={"1em"}
    height={"1em"}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      fill="#000"
      d="M22.125 13.875v1.5h-1.5v-1.5h1.5Zm0 3.375v1.5h-1.5v-1.5h1.5Zm-18.75-3.375v1.5h-1.5v-1.5h1.5Zm0 3.375v1.5h-1.5v-1.5h1.5Zm18.75 3.375v1.5h-1.5v-1.5h1.5Zm-3.068 0v1.5h-1.568v-1.5h1.568Zm-3.136 0v1.5h-1.569v-1.5h1.569Zm-9.41 0v1.5H4.943v-1.5h1.568Zm6.273 0v1.5h-1.568v-1.5h1.568Zm-3.136 0v1.5H8.08v-1.5h1.568Zm-6.273 0v1.5h-1.5v-1.5h1.5Zm-.75-18.75a.75.75 0 0 0-.75.75V10.5H.75V12h22.5v-1.5h-1.125V2.625a.75.75 0 0 0-.75-.75H2.625Zm18 1.5V10.5H3.375V3.375h17.25Z"
    />
  </svg>
);
const Memo = memo(SvgComponent);
export default Memo;
