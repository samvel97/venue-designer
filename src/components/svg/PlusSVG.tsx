import * as React from "react";
import { SVGProps, memo } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={"1em"}
    height={"1em"}
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <path
      fill="#000"
      d="M16 9.14H9.123V16H6.86V9.14H0V6.86h6.86V0h2.263v6.86H16v2.28Z"
    />
  </svg>
);
const Memo = memo(SvgComponent);
export default Memo;
