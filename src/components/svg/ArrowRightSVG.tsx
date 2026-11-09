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
    <path
      fill="#2B5EE0"
      d="M2.5 7.5a.5.5 0 1 0 0 1h9.697l-4.03 3.629a.5.5 0 0 0 .667.744l5-4.5a.499.499 0 0 0 0-.744l-5-4.5a.5.5 0 0 0-.668.744L12.197 7.5H2.5Z"
    />
  </svg>
);
const Memo = memo(SvgComponent);
export default Memo;
