
import { useEffect, useState } from "react";
import { User } from "lucide-react";

interface VisitorCounterProps {
  baseCount?: number;
}

const VisitorCounter = ({ baseCount = 135 }: VisitorCounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Generate a slightly random number based on the base count
    const randomVariation = Math.floor(Math.random() * 20) - 10; // -10 to +10
    const visitorCount = baseCount + randomVariation;
    setCount(visitorCount);

    // Simulate occasional increments
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of increment
        setCount(prev => prev + 1);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [baseCount]);

  return (
    <div className="flex items-center text-sm text-gray-600 animate-pulse-slow">
      <User size={16} className="mr-1" />
      <span>{count}</span>
      <span className="ml-1">pessoas online agora</span>
    </div>
  );
};

export default VisitorCounter;
