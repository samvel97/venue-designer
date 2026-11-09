import * as React from "react";
import { SVGProps, memo } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m.571 15.428 4.572-4.571m0 0h-4m4 0v4m10.285.571-4.571-4.571m0 0h4m-4 0v4M.571.571l4.572 4.572m0 0h-4m4 0v-4M15.428.57l-4.571 4.572m0 0h4m-4 0v-4"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
);
const Memo = memo(SvgComponent);
export default Memo;
