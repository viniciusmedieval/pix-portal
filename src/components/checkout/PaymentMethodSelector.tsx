
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
  
  const handleMethodClick = (method: 'pix' | 'cartao') => (e: React.MouseEvent | React.KeyboardEvent) => {
    // Prevent any default behavior
    if ('preventDefault' in e) {
      e.preventDefault();
    }
    
    console.log("Payment method selected:", method);
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
            className={`p-3 border rounded-md flex items-center justify-center cursor-pointer transition-colors ${
              currentMethod === 'cartao' ? 'border-primary bg-primary/10' : 'border-gray-200 hover:bg-gray-50'
            }`}
            onClick={handleMethodClick('cartao')}
            role="button"
            aria-pressed={currentMethod === 'cartao'}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleMethodClick('cartao')(e);
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
            className={`p-3 border rounded-md flex items-center justify-center cursor-pointer transition-colors ${
              currentMethod === 'pix' ? 'border-primary bg-primary/10' : 'border-gray-200 hover:bg-gray-50'
            }`}
            onClick={handleMethodClick('pix')}
            role="button"
            aria-pressed={currentMethod === 'pix'}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleMethodClick('pix')(e);
              }
            }}
          >
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <img src="/pix-logo.png" alt="PIX" className="h-4 w-4 mr-1" />
                <span className="font-medium">PIX</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
