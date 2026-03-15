import React from "react";

const PlusIcon: React.FC<{ width?: number; height?: number }> = ({ width = 20, height = 20 }) => (
  <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="9" stroke="#007bff" strokeWidth="2" fill="white" />
    <line x1="10" y1="6" x2="10" y2="14" stroke="#007bff" strokeWidth="2" strokeLinecap="round" />
    <line x1="6" y1="10" x2="14" y2="10" stroke="#007bff" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default PlusIcon;
