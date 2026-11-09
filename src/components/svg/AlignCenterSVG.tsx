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
    <rect
      width={12}
      height={2}
      fill="#000"
      rx={1}
      transform="matrix(-1 0 0 1 18 9)"
    />
    <rect
      width={14}
      height={2}
      fill="#000"
      rx={1}
      transform="matrix(-1 0 0 1 19 13)"
    />
    <rect
      width={2}
      height={12}
      fill="#000"
      rx={1}
      transform="matrix(-1 0 0 1 13 6)"
    />
  </svg>
);
const Memo = memo(SvgComponent);
export default Memo;
