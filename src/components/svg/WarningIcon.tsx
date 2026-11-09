import * as React from 'react';
import { SVGProps, memo } from 'react';
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={'1em'}
    height={'1em'}
    viewBox="0 0 48 49"
    fill="none"
    {...props}
  >
    <path
      stroke="#FDB022"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.522 41.836h31.956a3 3 0 0 0 2.64-4.422L27.143 7.742c-1.134-2.104-4.15-2.104-5.284 0L5.881 37.414a3 3 0 0 0 2.641 4.422Z"
    />
    <path
      stroke="#FDB022"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m23.962 18.318.538 11.437.537-11.433a.537.537 0 1 0-1.075-.004Z"
    />
    <path fill="#FDB022" d="M24.5 37.242a1.875 1.875 0 1 1 0-3.75 1.875 1.875 0 0 1 0 3.75Z" />
  </svg>
);
const Memo = memo(SvgComponent);
export default Memo;
