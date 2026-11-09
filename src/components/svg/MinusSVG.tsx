import * as React from "react";
import { SVGProps, memo } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={"1em"}
    height={"1em"}
    viewBox="0 0 16 2"
    fill="none"
    {...props}
  >
    <path fill="#000" d="M16 2H0V0h16v2Z" />
  </svg>
);
const Memo = memo(SvgComponent);
export default Memo;
