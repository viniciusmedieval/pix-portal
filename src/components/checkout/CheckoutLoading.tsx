
import React from 'react';

const CheckoutLoading: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
};

export default CheckoutLoading;
