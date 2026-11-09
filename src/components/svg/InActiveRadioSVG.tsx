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
    <circle cx={8} cy={8} r={7.5} fill="#fff" stroke="#ECECEC" />
  </svg>
);
const Memo = memo(SvgComponent);
export default Memo;
