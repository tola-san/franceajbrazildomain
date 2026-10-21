import React from 'react';

interface ScrollShapeProps {
  className?: string;
  fill?: string;
  width?: number | string;
  height?: number | string;
}

const ScrollShape: React.FC<ScrollShapeProps> = ({
  className = '',
  fill = '#faf4f0',
  width = 140,
  height = 'auto',
}) => {
  // "auto" is a valid CSS value but NOT a valid SVG height attribute
  // (it expects a length) — apply it via style to avoid a console error.
  const isAutoHeight = height === 'auto';
  return (
    <svg
      viewBox="0 0 140.6 29.5"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      className={`${className}`}
      width={width}
      height={isAutoHeight ? undefined : height}
      style={isAutoHeight ? { height: 'auto' } : undefined}
    >
      <path
        d="M68.5.3C46.3.3,38.3,17.4,2.1,29.5h136.6C103,17.4,94.4.3,68.5.3Z"
        fill={fill}
      />
    </svg>
  );
};

export default ScrollShape;
