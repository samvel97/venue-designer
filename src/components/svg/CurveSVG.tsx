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
    <path
      fill="#000"
      d="M18 20c0-1.933-.367-3.75-1.1-5.45a14.154 14.154 0 0 0-3-4.45 14.155 14.155 0 0 0-4.45-3C7.75 6.367 5.933 6 4 6V4c2.2 0 4.27.421 6.212 1.263A16.3 16.3 0 0 1 15.3 8.7a16.275 16.275 0 0 1 3.438 5.088C19.58 15.73 20.001 17.801 20 20h-2Z"
    />
  </svg>
);
const Memo = memo(SvgComponent);
export default Memo;
