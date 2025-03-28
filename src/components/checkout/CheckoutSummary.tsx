
import React from 'react';
import { formatCurrency } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ShieldCheck, CreditCard, ArrowRight } from 'lucide-react';

interface CheckoutSummaryProps {
  product: {
    id: string;
    nome: string;
    descricao?: string | null;
    preco: number;
    parcelas?: number;
    slug?: string | null;
    original_price?: number;
    discount_amount?: number;
  };
  config?: {
    cor_botao?: string;
    texto_botao?: string;
    cta_text?: string;
    discount_badge_enabled?: boolean;
    discount_badge_text?: string;
    discount_amount?: number;
    original_price?: number | null;
    payment_security_text?: string;
  };
  onContinue: () => void;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({ 
  product, 
  config, 
  onContinue 
}) => {
  // Use cta_text or texto_botao as a single source of truth
  const buttonText = config?.texto_botao || config?.cta_text || 'Continuar para pagamento';
  const primaryColor = config?.cor_botao || '#22c55e';
  const discountEnabled = config?.discount_badge_enabled || false;
  const discountText = config?.discount_badge_text || 'Oferta especial';
  const discountAmount = product?.discount_amount || config?.discount_amount || 0;
  const originalPrice = product?.original_price || config?.original_price || product.preco;
  const securityText = config?.payment_security_text || 'Pagamento 100% seguro';
  
  const finalPrice = originalPrice - discountAmount;

  return (
    <div className="space-y-6">
      {discountAmount > 0 && (
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center mt-1">
              {discountEnabled && (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 mr-2">{discountText}</Badge>
              )}
            </div>
          </div>
        </div>
      )}

      {discountAmount > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">Subtotal:</span>
            <span>{formatCurrency(originalPrice)}</span>
          </div>
          <div className="flex justify-between items-center text-green-600">
            <span>Desconto:</span>
            <span>- {formatCurrency(discountAmount)}</span>
          </div>
        </div>
      )}

      <Button 
        className="w-full py-6 text-lg rounded-lg flex items-center justify-center gap-2" 
        style={{ backgroundColor: primaryColor }}
        onClick={onContinue}
        form="checkout-form"
        type="submit"
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
