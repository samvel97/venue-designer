import * as React from "react";
import { SVGProps, memo } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 16 14"
    fill="none"
    {...props}
  >
    <path
      stroke="#595959"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M6.82 2.383c.281-.033.564-.05.847-.049 3.109 0 5.6 1.935 6.666 4.667a7.73 7.73 0 0 1-1.036 1.858M4.013 3.347C2.653 4.177 1.6 5.463 1 7c1.067 2.731 3.557 4.666 6.667 4.666a6.96 6.96 0 0 0 3.653-1.013M6.253 5.587a2 2 0 0 0 2.829 2.829"
    />
    <path
      stroke="#595959"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M2.333 1.667 13 12.334"
    />
  </svg>
);
const Memo = memo(SvgComponent);
export default Memo;
