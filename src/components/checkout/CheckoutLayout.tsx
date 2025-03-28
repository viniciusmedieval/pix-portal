
import React, { ReactNode } from 'react';

interface CheckoutLayoutProps {
  children: ReactNode;
}

const CheckoutLayout: React.FC<CheckoutLayoutProps> = ({
  children
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-grow container mx-auto py-0 px-4 max-w-4xl">
        <div className="mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CheckoutLayout;
