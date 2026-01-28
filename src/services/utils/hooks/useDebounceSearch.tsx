import { useEffect, useState } from "react";


export const useDebounceSearch = (searchTerm: string) => {
    const [debouncedValue, setDebouncedValue] = useState(searchTerm);
  
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(searchTerm);
      }, 500);
  
      return () => {
        clearTimeout(handler);
      };
    }, [searchTerm]);
  
    if (debouncedValue) {
      return debouncedValue;
    }   
    return '';
};