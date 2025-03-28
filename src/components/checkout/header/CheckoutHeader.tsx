
import React from 'react';

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
      className="w-full py-2 px-4 text-center" 
      style={{ 
        backgroundColor: bgColor,
        color: textColor
      }}
    >
      <p className="text-sm font-medium">
        {message}
      </p>
    </div>
  );
};

export default CheckoutHeader;
