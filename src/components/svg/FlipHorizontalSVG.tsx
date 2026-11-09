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
      d="M13.875 1.875h1.5v1.5h-1.5v-1.5Zm3.375 0h1.5v1.5h-1.5v-1.5Zm-3.375 18.75h1.5v1.5h-1.5v-1.5Zm3.375 0h1.5v1.5h-1.5v-1.5Zm3.375-18.75h1.5v1.5h-1.5v-1.5Zm0 3.068h1.5v1.568h-1.5V4.943Zm0 3.137h1.5v1.568h-1.5V8.08Zm0 9.409h1.5v1.568h-1.5v-1.568Zm0-6.273h1.5v1.568h-1.5v-1.568Zm0 3.136h1.5v1.568h-1.5v-1.568Zm0 6.273h1.5v1.5h-1.5v-1.5Zm-18.75.75a.75.75 0 0 0 .75.75H10.5v1.125H12V.75h-1.5v1.125H2.625a.75.75 0 0 0-.75.75v18.75Zm1.5-18H10.5v17.25H3.375V3.375Z"
    />
  </svg>
);
const Memo = memo(SvgComponent);
export default Memo;
