
import { useEffect, useState } from 'react';

interface UserCounterProps {
  baseNumber?: number;
}

export default function UserCounter({ baseNumber = 100 }: UserCounterProps) {
  const [count, setCount] = useState<number>(0);
  
  useEffect(() => {
    // Generate a random number between baseNumber-30 and baseNumber+30
    const randomCount = Math.floor(Math.random() * 60) + (baseNumber - 30);
    setCount(randomCount);
    
    // Occasionally increase the counter to simulate other users
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of incrementing
        setCount(prev => prev + 1);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [baseNumber]);
  
  return (
    <div className="flex items-center justify-center text-sm text-gray-600 mt-3">
      <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
      </svg>
      <span>Outras {count} visitantes estão finalizando a compra neste momento.</span>
    </div>
  );
}
