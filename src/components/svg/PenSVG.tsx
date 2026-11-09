import * as React from "react";
import { SVGProps, memo } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 27 27"
    fill="none"
    {...props}
  >
    <path
      fill="#000"
      d="M26.75 10.585a1.742 1.742 0 0 0-.512-1.237L17.65.763a1.752 1.752 0 0 0-2.475 0l-3.591 3.59-7.308 2.742a1.75 1.75 0 0 0-1.112 1.35L.26 25.875a.75.75 0 0 0 .865.865l17.43-2.905a1.75 1.75 0 0 0 1.351-1.112l2.74-7.308 3.593-3.592a1.741 1.741 0 0 0 .511-1.238ZM18.5 22.196a.25.25 0 0 1-.192.16l-15.122 2.52 6.609-6.61a3.25 3.25 0 1 0-1.06-1.06l-6.61 6.61L4.646 8.691a.25.25 0 0 1 .158-.19l7.007-2.626 9.314 9.314-2.625 7.007ZM9.75 15.5a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0Zm15.426-4.737L22 13.939 13.06 5l3.178-3.177a.25.25 0 0 1 .353 0l8.585 8.586a.251.251 0 0 1 0 .354Z"
    />
  </svg>
);
const Memo = memo(SvgComponent);
export default Memo;
