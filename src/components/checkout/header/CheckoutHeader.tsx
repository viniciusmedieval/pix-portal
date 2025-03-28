
import React from 'react';
import { Clock } from 'lucide-react';

interface CheckoutHeaderProps {
  message: string;
  bgColor?: string;
  textColor?: string;
}

const CheckoutHeader: React.FC<CheckoutHeaderProps> = ({ 
  message, 
  bgColor = '#000000', 
  textColor = '#ffffff' 
}) => {
  return (
    <div 
      className="w-full py-3 px-4 text-center sticky top-0 z-10" 
      style={{ 
        backgroundColor: bgColor,
        color: textColor
      }}
    >
      <div className="container mx-auto flex items-center justify-center gap-2">
        <Clock className="w-4 h-4 animate-pulse" />
        <p className="text-sm font-medium">
          {message}
        </p>
      </div>
    </div>
  );
};

export default CheckoutHeader;
