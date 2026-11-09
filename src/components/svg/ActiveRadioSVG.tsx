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
    <circle cx={8} cy={8} r={8} fill="#A6CE39" />
    <circle cx={8} cy={8} r={4} fill="#fff" />
  </svg>
);
const Memo = memo(SvgComponent);
export default Memo;
