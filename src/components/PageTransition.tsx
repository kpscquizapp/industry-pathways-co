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
        "transition-all h-screen  duration-300 ease-out overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        // isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}
    >
      {children}
    </div>
  );
};

export default PageTransition;