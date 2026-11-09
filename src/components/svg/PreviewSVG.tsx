import * as React from "react";
import { SVGProps, memo } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => {
  const { fill = "black" } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="none"
      {...props}
    >
      <path
        fill={fill}
        d="M18.75 10a1.23 1.23 0 0 1-.594 1.055L6.9 17.941a1.25 1.25 0 0 1-1.73-.43 1.239 1.239 0 0 1-.17-.626V3.115a1.24 1.24 0 0 1 .634-1.08 1.25 1.25 0 0 1 1.266.023l11.256 6.886A1.23 1.23 0 0 1 18.75 10Z"
      />
    </svg>
  );
};
const Memo = memo(SvgComponent);
export default Memo;
