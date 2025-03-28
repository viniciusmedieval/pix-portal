
import React from 'react';
import { CreditCard } from 'lucide-react';

interface PaymentMethodSelectorProps {
  availableMethods: string[];
  currentMethod: string;
  onChange: (method: 'pix' | 'cartao') => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  availableMethods,
  currentMethod,
  onChange
}) => {
  console.log("PaymentMethodSelector rendered with", { availableMethods, currentMethod });
  
  const handleMethodClick = (method: 'pix' | 'cartao') => (e: React.MouseEvent) => {
    // Prevent any default behavior and stop propagation
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Payment method clicked:", method);
    onChange(method);
  };
  
  if (!availableMethods || availableMethods.length === 0) {
    console.warn("No payment methods available!");
    return <div className="text-red-500">No payment methods available</div>;
  }
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {availableMethods.includes('cartao') && (
          <div
            role="button"
            aria-pressed={currentMethod === 'cartao'}
            tabIndex={0}
            className={`p-3 border rounded-md flex items-center justify-center cursor-pointer transition-colors ${
              currentMethod === 'cartao' ? 'border-primary bg-primary/10' : 'border-gray-200 hover:bg-gray-50'
            }`}
            onClick={handleMethodClick('cartao')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleMethodClick('cartao')(e as unknown as React.MouseEvent);
              }
            }}
          >
            <div className="flex flex-col items-center">
              <CreditCard className="h-5 w-5 mb-1" />
              <span className="font-medium">Cartão</span>
            </div>
          </div>
        )}
        
        {availableMethods.includes('pix') && (
          <div
            role="button"
            aria-pressed={currentMethod === 'pix'}
            tabIndex={0}
            className={`p-3 border rounded-md flex items-center justify-center cursor-pointer transition-colors ${
              currentMethod === 'pix' ? 'border-primary bg-primary/10' : 'border-gray-200 hover:bg-gray-50'
            }`}
            onClick={handleMethodClick('pix')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleMethodClick('pix')(e as unknown as React.MouseEvent);
              }
            }}
          >
            <div className="flex flex-col items-center">
              <img src="/pix-logo.png" alt="PIX" className="h-5 w-5 mb-1" />
              <span className="font-medium">PIX</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
