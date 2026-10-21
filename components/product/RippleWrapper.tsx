
"use client"

import { useState } from "react";

interface RippleWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const RippleWrapper = ({ children, className = "" }: RippleWrapperProps) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>(
    []
  );
  const [rippleId, setRippleId] = useState(0);

  const createRipple = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = rippleId + 1;

    setRippleId(id);
    setRipples((prev) => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  return (
    <div onClick={createRipple} className={`relative overflow-hidden ${className}`}>
      {/* Ripple effect layer */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute w-[200px] h-[200px] bg-black/50 rounded-full animate-ripple"
            style={{
              left: ripple.x - 100,
              top: ripple.y - 100,
            }}
          />
        ))}
      </div>

      {children}
    </div>
  );
};

export default RippleWrapper;
