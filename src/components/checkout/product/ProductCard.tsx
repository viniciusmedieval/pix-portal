
import React from 'react';
import { formatCurrency } from '@/lib/formatters';
import ProductImage from '../ProductImage';

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
  return (
    <div className="flex flex-col sm:flex-row gap-6 mb-6">
      {product.imagem_url && (
        <div className="w-full sm:w-1/3 rounded-lg overflow-hidden shadow-md">
          <ProductImage 
            imageUrl={product.imagem_url}
            productName={product.nome}
            className="w-full h-48 sm:h-full object-cover"
          />
        </div>
      )}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2">{product.nome}</h1>
        {product.descricao && (
          <p className="text-gray-600 mb-4">{product.descricao}</p>
        )}
        
        {discountEnabled && (
          <div className="flex flex-col items-start mb-4">
            <h2 className="text-2xl font-bold text-red-600 mb-1">
              {discountEnabled ? `DE ${formatCurrency(originalPrice || 0)}` : ''}
            </h2>
            <h3 className="text-3xl font-bold text-red-700">
              POR APENAS {formatCurrency(product.preco)}
            </h3>
            <div className="bg-yellow-400 px-3 py-1 text-sm font-bold text-black rounded mt-2">
              PREÇO DE HOJE - OFERTA LIMITADA
            </div>
          </div>
        )}

        {!discountEnabled && (
          <div className="text-2xl font-bold text-gray-900 mb-4">
            {formatCurrency(product.preco)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
