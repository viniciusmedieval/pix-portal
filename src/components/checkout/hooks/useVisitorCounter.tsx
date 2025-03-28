
import { useState, useEffect } from 'react';

export function useVisitorCounter(showVisitorCounter: boolean) {
  const [visitors, setVisitors] = useState(0);
  
  // Set up random visitor count
  useEffect(() => {
    if (showVisitorCounter) {
      setVisitors(Math.floor(Math.random() * (150 - 80) + 80));
    }
  }, [showVisitorCounter]);
  
  return visitors;
}
