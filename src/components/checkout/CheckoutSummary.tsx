
import React from 'react';
import { formatCurrency } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck } from 'lucide-react';

interface CheckoutSummaryProps {
  product: {
    id: string;
    nome: string;
    descricao?: string | null;
    preco: number;
    parcelas?: number;
    slug?: string | null;
  };
  config?: {
    cor_botao?: string;
    texto_botao?: string;
    discount_badge_enabled?: boolean;
    discount_badge_text?: string;
    discount_amount?: number;
    original_price?: number | null;
    payment_security_text?: string;
  };
  onContinue?: () => void;
  showButtons?: boolean;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({ 
  product, 
  config
}) => {
  // Default values if config is not provided
  const discountEnabled = config?.discount_badge_enabled || false;
  const discountText = config?.discount_badge_text || 'Oferta especial';
  const discountAmount = config?.discount_amount || 0;
  const originalPrice = config?.original_price || product.preco;
  const securityText = config?.payment_security_text || 'Pagamento 100% seguro';
  
  const finalPrice = originalPrice - discountAmount;

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      {discountEnabled && (
        <div className="inline-block">
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-normal text-xs px-2 py-1">
            {discountText}
          </Badge>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-800">Subtotal:</span>
          <span className="font-medium">{formatCurrency(originalPrice)}</span>
        </div>
        
        {discountAmount > 0 && (
          <div className="flex justify-between items-center text-sm text-green-600">
            <span>Desconto:</span>
            <span>- {formatCurrency(discountAmount)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
        <ShieldCheck className="h-4 w-4 text-green-500" />
        <span>{securityText}</span>
      </div>

      <div className="flex justify-center space-x-4 items-center pt-2">
        <img src="/pix-logo.png" alt="PIX" className="h-5" />
        <div className="h-5 w-px bg-gray-300"></div>
        <div className="flex space-x-1">
          <div className="bg-gray-200 rounded-sm w-7 h-5"></div>
          <div className="bg-gray-200 rounded-sm w-7 h-5"></div>
          <div className="bg-gray-200 rounded-sm w-7 h-5"></div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
