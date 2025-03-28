
import React from 'react';

interface CheckoutHeaderProps {
  title: string;
  description?: string;
}

const CheckoutHeader: React.FC<CheckoutHeaderProps> = ({ title, description }) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-2xl font-bold">{title}</h1>
      {description && (
        <p className="text-gray-600 mt-2">
          {description.length > 100 ? `${description.substring(0, 100)}...` : description}
        </p>
      )}
    </div>
  );
};

export default CheckoutHeader;
