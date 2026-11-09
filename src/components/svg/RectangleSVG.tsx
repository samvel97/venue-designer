import * as React from "react";
import { SVGProps, memo } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={"1em"}
    height={"1em"}
    viewBox="0 0 32 32"
    fill="none"
    {...props}
  >
    <path stroke="#000" d="M2.5 2.5h27v27h-27z" />
  </svg>
);
const Memo = memo(SvgComponent);
export default Memo;
