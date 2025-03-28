
import React from 'react';
import { formatCurrency } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

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
  onContinue: () => void;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({ 
  product, 
  config, 
  onContinue 
}) => {
  const buttonText = config?.texto_botao || 'Continuar para pagamento';
  const primaryColor = config?.cor_botao || '#22c55e';
  const discountEnabled = config?.discount_badge_enabled || false;
  const discountText = config?.discount_badge_text || 'Oferta especial';
  const discountAmount = config?.discount_amount || 0;
  const originalPrice = config?.original_price || product.preco;
  const securityText = config?.payment_security_text || 'Pagamento 100% seguro';
  
  const finalPrice = originalPrice - discountAmount;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold">{product.nome}</h2>
          <div className="flex items-center mt-1">
            {discountEnabled && (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{discountText}</Badge>
            )}
            <span className="text-sm text-gray-500 ml-2">Disponível por tempo limitado</span>
          </div>
        </div>
        <div className="text-right">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-primary">Ver detalhes</Button>
            </DialogTrigger>
            <DialogContent>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{product.nome}</h3>
                <p className="mb-4">{product.descricao}</p>
                <div>
                  <h4 className="font-medium mb-1">Preço:</h4>
                  <p>{formatCurrency(finalPrice)}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border-t border-b border-gray-200 py-4 my-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Subtotal:</span>
          <span>{formatCurrency(originalPrice)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between items-center text-green-600">
            <span>Desconto:</span>
            <span>- {formatCurrency(discountAmount)}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-6">
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
        className="w-full py-6 text-lg" 
        style={{ backgroundColor: primaryColor }}
        onClick={onContinue}
      >
        {buttonText}
      </Button>

      <div className="mt-4 text-center text-sm text-gray-500">
        <p>{securityText}</p>
        <div className="flex justify-center space-x-2 mt-2">
          <img src="/pix-logo.png" alt="PIX" className="h-6" />
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
