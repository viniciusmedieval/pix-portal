
import { useState } from 'react';

interface PaymentMethodSelectorProps {
  availableMethods: string[];
  currentMethod: 'pix' | 'cartao';
  onChange: (method: 'pix' | 'cartao') => void;
}

export default function PaymentMethodSelector({
  availableMethods,
  currentMethod,
  onChange
}: PaymentMethodSelectorProps) {
  return (
    <div className="flex justify-between items-center mt-6 mb-4">
      <div className="space-x-4 flex">
        {availableMethods.includes('cartao') && (
          <button
            type="button"
            onClick={() => onChange('cartao')}
            className={`p-3 border rounded-md ${
              currentMethod === 'cartao' ? 'border-primary' : 'border-gray-300'
            }`}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
          </button>
        )}
        {availableMethods.includes('pix') && (
          <button
            type="button"
            onClick={() => onChange('pix')}
            className={`p-3 border rounded-md ${
              currentMethod === 'pix' ? 'border-primary' : 'border-gray-300'
            }`}
          >
            <img src="/pix-logo.png" alt="PIX" className="w-6 h-6" />
          </button>
        )}
      </div>
      <div className="text-sm font-medium">
        {currentMethod === 'cartao' ? 'Cartão de crédito' : 'PIX'}
      </div>
    </div>
  );
}
