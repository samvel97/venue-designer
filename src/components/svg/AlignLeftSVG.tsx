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
    <rect width={12} height={2} x={7} y={9} fill="#000" rx={1} />
    <rect width={14} height={2} x={7} y={13} fill="#000" rx={1} />
    <rect width={2} height={12} x={4} y={6} fill="#000" rx={1} />
  </svg>
);
const Memo = memo(SvgComponent);
export default Memo;
