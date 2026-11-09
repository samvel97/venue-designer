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
    <circle cx={9.053} cy={9.053} r={5.053} fill="#000" />
    <circle cx={9.053} cy={22.947} r={5.053} fill="#000" />
    <circle cx={22.947} cy={9.053} r={5.053} fill="#000" />
    <circle cx={22.947} cy={22.947} r={5.053} fill="#000" />
  </svg>
);
const Memo = memo(SvgComponent);
export default Memo;
