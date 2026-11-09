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
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 18.857a5.714 5.714 0 0 0-5.714-5.714"
    />
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M6.286 6.286v12.571h12.571"
    />
  </svg>
);
const Memo = memo(SvgComponent);
export default Memo;
