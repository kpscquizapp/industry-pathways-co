import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  // const [displayLocation, setDisplayLocation] = useState(location);

  // useEffect(() => {
  //   if (location !== displayLocation) {
  //     setIsVisible(false);
  //     const timer = setTimeout(() => {
  //       setDisplayLocation(location);
  //       setIsVisible(true);
  //     }, 150);
  //     return () => clearTimeout(timer);
  //   } else {
  //     setIsVisible(true);
  //   }
  // }, [location, displayLocation]);

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out min-h-screen",
      )}
    >
      {children}
    </div>
  );
};

export default PageTransition;