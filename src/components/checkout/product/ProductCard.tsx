
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatters';
import { Check } from 'lucide-react';

interface ProductCardProps {
  product: {
    nome: string;
    preco: number;
    imagem_url?: string | null;
  };
  discountEnabled: boolean;
  discountText: string;
  originalPrice: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  discountEnabled,
  discountText,
  originalPrice
}) => {
  const discount = Math.round(((originalPrice - product.preco) / originalPrice) * 100);
  
  return (
    <Card className="mb-8 overflow-hidden shadow-sm">
      <CardContent className="p-0">
        <div className="md:flex">
          {/* Product Image */}
          {product.imagem_url && (
            <div className="w-full md:w-2/5 h-40 md:h-auto overflow-hidden">
              <img
                src={product.imagem_url}
                alt={product.nome}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Benefits section next to image */}
          <div className="bg-green-50 p-4 w-full md:w-3/5">
            <h3 className="font-semibold text-green-800 mb-2">Benefícios inclusos:</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Acesso imediato após confirmação do pagamento</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Conteúdo exclusivo disponível 24h por dia</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Garantia de satisfação ou seu dinheiro de volta</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">{product.nome}</h2>
          
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">
              {formatCurrency(product.preco)}
            </span>
            
            {discountEnabled && discount > 0 && (
              <>
                <span className="text-sm text-gray-500 line-through">
                  {formatCurrency(originalPrice)}
                </span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {discountText} - {discount}% OFF
                </span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
