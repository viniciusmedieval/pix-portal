
import { useEffect, useState } from "react";
import { User } from "lucide-react";

interface VisitorCounterProps {
  min?: number;
  max?: number;
  ativo?: boolean;
  baseCount?: number;
}

const VisitorCounter = ({ 
  min = 1, 
  max = 100, 
  ativo = true, 
  baseCount = 135 
}: VisitorCounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!ativo) return;

    // Generate a random number between min and max
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    setCount(randomNumber);

    // Simulate occasional increments
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of increment
        setCount(prev => prev + 1);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [min, max, ativo, baseCount]);

  if (!ativo) return null;

  return (
    <div className="flex items-center text-sm text-gray-600 animate-pulse-slow">
      <User size={16} className="mr-1" />
      <span>{count}</span>
      <span className="ml-1">pessoas online agora</span>
    </div>
  );
};

export default VisitorCounter;
