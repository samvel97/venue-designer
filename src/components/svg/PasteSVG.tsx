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
    <g fill="#000" clipPath="url(#a)">
      <path d="M20 8h-2.667v1.333H20v1.334h1.333V9.333A1.333 1.333 0 0 0 20 8ZM20 12h1.333v4H20v-4ZM20 20h-1.333v1.333H20A1.334 1.334 0 0 0 21.333 20v-2.667H20V20ZM16 14.667V4a1.333 1.333 0 0 0-1.333-1.333H4A1.333 1.333 0 0 0 2.667 4v10.667A1.333 1.333 0 0 0 4 16h10.667A1.333 1.333 0 0 0 16 14.667ZM4 4h10.667v10.667H4V4ZM13.333 20h4v1.333h-4V20ZM9.333 17.333H8V20a1.333 1.333 0 0 0 1.333 1.333H12V20H9.333v-2.667Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
const Memo = memo(SvgComponent);
export default Memo;
