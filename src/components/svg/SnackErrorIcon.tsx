import * as React from 'react';
import { SVGProps, memo } from 'react';
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} fill="none" {...props}>
    <path
      fill="#F97066"
      d="M35.648 33.95A1.202 1.202 0 0 1 34.8 36a1.202 1.202 0 0 1-.849-.352L24 25.696l-9.95 9.952a1.201 1.201 0 0 1-1.698-1.698L22.304 24l-9.952-9.95a1.201 1.201 0 0 1 1.698-1.698L24 22.304l9.95-9.952a1.201 1.201 0 0 1 1.698 1.698L25.696 24l9.952 9.95Z"
    />
  </svg>
);
const Memo = memo(SvgComponent);
export default Memo;
