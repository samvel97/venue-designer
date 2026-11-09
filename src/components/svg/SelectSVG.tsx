import * as React from "react";
import { SVGProps, memo } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={"1em"}
    height={"1em"}
    viewBox="0 0 32 32"
    fill="none"
    {...props}
  >
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={1.5}
      d="M6.665 4.668h18.667M4.667 6.665v18.668M27.33 6.667v18.67M6.665 27.334h18.667M6.664 2.667H2.667v3.997h3.997V2.667Zm0 22.666H2.667v3.998h3.997v-3.998ZM29.329 2.67h-3.996v3.998h3.998l-.002-3.998Zm0 22.667h-3.996v3.997h3.998l-.002-3.997ZM14.663 20.003l-4-9.334 9.333 4-3.997 1.332-1.336 4.002ZM15.999 16.003l3.997 4"
    />
  </svg>
);
const Memo = memo(SvgComponent);
export default Memo;
