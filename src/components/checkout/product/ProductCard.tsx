
import React from 'react';
import { formatCurrency } from '@/lib/formatters';
import ProductImage from '../ProductImage';
import { BadgePercent, CheckCircle, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: {
    id: string;
    nome: string;
    descricao?: string | null;
    preco: number;
    imagem_url?: string | null;
  };
  discountEnabled?: boolean;
  discountText?: string;
  originalPrice?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  discountEnabled = false,
  discountText = 'Oferta especial',
  originalPrice 
}) => {
  // Calculate discount percentage if available
  const discountPercentage = originalPrice && product.preco 
    ? Math.round(((originalPrice - product.preco) / originalPrice) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
      <div className="flex flex-col sm:flex-row">
        {/* Product image section */}
        {product.imagem_url && (
          <div className="w-full sm:w-2/5 relative">
            <ProductImage 
              imageUrl={product.imagem_url}
              productName={product.nome}
              className="w-full h-64 sm:h-full object-cover"
            />
            {discountEnabled && discountPercentage > 0 && (
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                <BadgePercent className="w-4 h-4 mr-1" />
                -{discountPercentage}%
              </div>
            )}
          </div>
        )}
        
        {/* Product details section */}
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-2">{product.nome}</h1>
          
          {product.descricao && (
            <p className="text-gray-600 mb-4">{product.descricao}</p>
          )}
          
          {/* Price display with enhanced styling */}
          <div className="space-y-3 mb-4">
            {discountEnabled && originalPrice && (
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-gray-500 line-through text-lg">
                    {formatCurrency(originalPrice)}
                  </span>
                  <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100 border-none">
                    {discountText}
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-red-600 mt-1">
                  {formatCurrency(product.preco)}
                </div>
              </div>
            )}

            {!discountEnabled && (
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(product.preco)}
              </div>
            )}
          </div>
          
          {/* Benefits/reassurance section */}
          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <h3 className="font-medium mb-3">Vantagens exclusivas:</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Acesso imediato após confirmação do pagamento</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Suporte prioritário 24/7</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Garantia de satisfação ou seu dinheiro de volta em até 7 dias</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
