import { useState, useEffect } from 'react';

interface DelayedRenderResult {
  showContent: boolean;
  loading: React.ReactNode;
}

export const useDelayedRender = (delay: number = 300): DelayedRenderResult => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const loading = (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
    </div>
  );

  return { showContent, loading };
};