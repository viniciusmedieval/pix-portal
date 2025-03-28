
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatters';

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
        {product.imagem_url && (
          <div className="w-full h-40 overflow-hidden">
            <img
              src={product.imagem_url}
              alt={product.nome}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
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
