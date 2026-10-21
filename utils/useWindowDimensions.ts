'use client';

import { useEffect, useState } from 'react';

interface WindowDimensions {
  width: number | null;
  height: number | null;
}

export const useWindowDimensions = (): WindowDimensions => {
  const [windowSize, setWindowSize] = useState<WindowDimensions>({
    width: null,
    height: null,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};
