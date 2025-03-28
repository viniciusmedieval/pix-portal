
import React from 'react';

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
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {availableMethods.includes('cartao') && (
          <div
            className={`p-3 border rounded-md flex items-center justify-center cursor-pointer transition-colors ${
              currentMethod === 'cartao' ? 'border-primary bg-primary/10' : 'border-gray-200'
            }`}
            onClick={() => {
              console.log("Selecting cartao payment method");
              onChange('cartao');
            }}
          >
            <div className="flex flex-col items-center">
              <span className="font-medium">Cartão</span>
            </div>
          </div>
        )}
        
        {availableMethods.includes('pix') && (
          <div
            className={`p-3 border rounded-md flex items-center justify-center cursor-pointer transition-colors ${
              currentMethod === 'pix' ? 'border-primary bg-primary/10' : 'border-gray-200'
            }`}
            onClick={() => {
              console.log("Selecting pix payment method");
              onChange('pix');
            }}
          >
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <img src="/pix-logo.png" alt="PIX" className="h-4 w-auto mr-1" />
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
