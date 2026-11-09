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
    <circle cx={9} cy={16} r={5} fill="#000" />
    <circle cx={23} cy={16} r={5} fill="#000" />
  </svg>
);
const Memo = memo(SvgComponent);
export default Memo;
