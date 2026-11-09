import * as React from 'react';
import { SVGProps, memo } from 'react';
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} fill="none" {...props}>
    <path
      fill="#12B76A"
      d="M19.1 35.15c-.266 0-.516-.042-.75-.126a1.776 1.776 0 0 1-.65-.424L9.1 26c-.366-.367-.542-.842-.526-1.426.016-.584.208-1.059.576-1.424.367-.367.834-.55 1.4-.55.567 0 1.034.183 1.4.55l7.15 7.15 16.95-16.95c.367-.367.842-.55 1.426-.55s1.059.183 1.424.55c.367.367.55.842.55 1.426s-.183 1.059-.55 1.424L20.5 34.6c-.2.2-.416.342-.65.426a2.166 2.166 0 0 1-.75.124Z"
    />
  </svg>
);
const Memo = memo(SvgComponent);
export default Memo;
