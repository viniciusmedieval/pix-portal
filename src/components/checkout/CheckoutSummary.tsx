
import React from 'react';
import { formatCurrency } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { ShieldCheck, CreditCard, ArrowRight } from 'lucide-react';

interface CheckoutSummaryProps {
  product: {
    id: string;
    nome: string;
    descricao?: string | null;
    preco: number;
    parcelas?: number;
    slug?: string | null;
  };
  onContinue: () => void;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({ 
  product, 
  onContinue
}) => {
  const buttonText = 'Continuar para pagamento';
  const finalPrice = product.preco;
  const securityText = 'Pagamento 100% seguro';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold">Resumo do pedido</h2>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700">Item:</span>
          <span className="font-medium">{product.nome}</span>
        </div>
        
        <div className="border-t border-gray-200 my-3 pt-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">Subtotal:</span>
            <span>{formatCurrency(finalPrice)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
        <span className="text-lg font-bold">Total:</span>
        <div className="text-right">
          <span className="text-2xl font-bold text-primary">{formatCurrency(finalPrice)}</span>
          {product.parcelas && product.parcelas > 1 && (
            <div className="text-sm text-gray-500">
              ou {product.parcelas}x de {formatCurrency(finalPrice / product.parcelas)}
            </div>
          )}
        </div>
      </div>

      <Button 
        className="w-full py-6 text-lg rounded-lg flex items-center justify-center gap-2" 
        onClick={onContinue}
      >
        <CreditCard className="h-5 w-5" />
        <span>{buttonText}</span>
        <ArrowRight className="h-5 w-5 ml-1" />
      </Button>

      <div className="flex items-center justify-center gap-2 text-gray-600">
        <ShieldCheck className="h-5 w-5 text-green-500" />
        <span>{securityText}</span>
      </div>

      <div className="flex justify-center space-x-4 items-center">
        <img src="/pix-logo.png" alt="PIX" className="h-6" />
        <div className="h-6 w-px bg-gray-300"></div>
        <div className="flex space-x-1">
          <div className="bg-gray-200 rounded-sm w-8 h-5"></div>
          <div className="bg-gray-200 rounded-sm w-8 h-5"></div>
          <div className="bg-gray-200 rounded-sm w-8 h-5"></div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
