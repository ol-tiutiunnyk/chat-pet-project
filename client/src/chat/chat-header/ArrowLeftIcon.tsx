import React from "react";

const ArrowLeftIcon: React.FC<{ width?: number; height?: number }> = ({ width = 24, height = 24 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 18l-6-6 6-6" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default ArrowLeftIcon;
