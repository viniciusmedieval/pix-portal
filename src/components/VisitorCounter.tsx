
import { useEffect, useState } from "react";
import { User } from "lucide-react";

interface VisitorCounterProps {
  min?: number;
  max?: number;
  ativo?: boolean;
  baseCount?: number;
  useConfig?: boolean;
  config?: {
    numero_aleatorio_visitas?: boolean;
    visitantes_min?: number;
    visitantes_max?: number;
  };
}

const VisitorCounter = ({ 
  min = 1, 
  max = 100, 
  ativo = true, 
  baseCount = 135,
  useConfig = false,
  config
}: VisitorCounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Se não estiver ativo ou se useConfig for true e config.numero_aleatorio_visitas for false, não mostra contador
    if (!ativo || (useConfig && config?.numero_aleatorio_visitas === false)) return;

    // Use config values if provided and useConfig is true
    const minValue = useConfig && config?.visitantes_min ? config.visitantes_min : min;
    const maxValue = useConfig && config?.visitantes_max ? config.visitantes_max : max;

    // Generate a random number between minValue and maxValue
    const randomNumber = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    setCount(randomNumber);

    // Simulate occasional increments
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of increment
        setCount(prev => prev + 1);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [min, max, ativo, baseCount, useConfig, config]);

  // If not active or if using config and numero_aleatorio_visitas is false, return null
  if (!ativo || (useConfig && config?.numero_aleatorio_visitas === false)) return null;

  return (
    <div className="flex items-center text-sm text-gray-600 animate-pulse-slow">
      <User size={16} className="mr-1" />
      <span>{count}</span>
      <span className="ml-1">pessoas online agora</span>
    </div>
  );
};

export default VisitorCounter;
