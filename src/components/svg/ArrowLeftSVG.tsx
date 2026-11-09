import * as React from "react";
import { SVGProps, memo } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={"1em"}
    height={"1em"}
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      fill="#000"
      d="M4.375 9.375h12.5a.625.625 0 1 1 0 1.25h-12.5a.625.625 0 1 1 0-1.25Z"
    />
    <path
      fill="#000"
      d="m4.634 10 5.184 5.182a.626.626 0 0 1-.885.885l-5.625-5.625a.624.624 0 0 1 0-.885l5.625-5.625a.626.626 0 1 1 .885.885L4.634 10Z"
    />
  </svg>
);
const Memo = memo(SvgComponent);
export default Memo;
