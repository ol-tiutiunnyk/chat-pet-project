import { FC } from "react";

const DoorOutIcon: FC<{ width?: number; height?: number }> = ({ width = 24, height = 24 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Door with less rounded corners (rx=0.5) */}
    <rect x="3" y="3" width="13" height="18" rx="0.5" stroke="currentColor" strokeWidth="2"/>
    {/* Arrow group for animation */}
    <g className="door-out-arrow">
      <path d="M8 12h13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M20 9l3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  </svg>
);

export default DoorOutIcon;
