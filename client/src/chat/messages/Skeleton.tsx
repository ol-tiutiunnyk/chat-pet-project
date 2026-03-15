import React from "react";
import "./skeleton.css";

const Skeleton: React.FC<{ width?: string; height?: string; style?: React.CSSProperties }> = ({ width = "100%", height = "1.5em", style }) => (
  <div
    className="skeleton-message"
    style={{ width, height, borderRadius: 4, margin: "0.5em 0", ...style }}
    data-testid="skeleton"
  />
);

export default Skeleton;
