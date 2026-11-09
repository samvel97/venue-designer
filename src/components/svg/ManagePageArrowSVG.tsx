import * as React from "react";
import { SVGProps, memo } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <path
      fill="#474C63"
      d="m5.53 11.257.94.94 4-4-4-4-.94.94 3.054 3.06-3.054 3.06Z"
    />
  </svg>
);
const Memo = memo(SvgComponent);
export default Memo;
