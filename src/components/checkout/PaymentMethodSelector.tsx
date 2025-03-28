
import { CreditCard } from 'lucide-react';

interface PaymentMethodSelectorProps {
  availableMethods: string[];
  currentMethod: string;
  onChange: (method: 'pix' | 'cartao') => void;
}

export default function PaymentMethodSelector({
  availableMethods,
  currentMethod,
  onChange
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium mb-1.5">Selecione a forma de pagamento:</div>
      
      <div className="grid grid-cols-2 gap-3">
        {availableMethods.includes('cartao') && (
          <button
            type="button"
            onClick={() => onChange('cartao')}
            className={`flex items-center justify-center gap-2 py-2 px-4 border rounded-md transition-colors ${
              currentMethod === 'cartao' 
                ? 'bg-primary/10 border-primary text-primary' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Cartão</span>
          </button>
        )}
        
        {availableMethods.includes('pix') && (
          <button
            type="button"
            onClick={() => onChange('pix')}
            className={`flex items-center justify-center gap-2 py-2 px-4 border rounded-md transition-colors ${
              currentMethod === 'pix' 
                ? 'bg-primary/10 border-primary text-primary' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <img src="/pix-logo.png" alt="PIX" className="w-4 h-4" />
            <span>PIX</span>
          </button>
        )}
      </div>
    </div>
  );
}
