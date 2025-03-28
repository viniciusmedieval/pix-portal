
import React from 'react';
import { formatCurrency } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, Clock } from 'lucide-react';
import ProductImage from './ProductImage';

interface ProductSectionProps {
  producto: {
    id: string;
    nome: string;
    descricao?: string | null;
    preco: number;
    parcelas?: number;
    slug?: string | null;
    imagem_url?: string | null;
  };
  config?: any;
  discountEnabled: boolean;
  discountText: string;
  originalPrice: number;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  producto,
  config,
  discountEnabled,
  discountText,
  originalPrice
}) => {
  // Use banner image from config if available
  const imageToUse = config?.imagem_banner || producto.imagem_url;
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Seção 1: Imagem do Produto */}
      <div className="w-full h-64 bg-gray-100">
        <ProductImage 
          imageUrl={imageToUse} 
          productName={producto.nome}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Seção 2: Informações do Produto */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">{producto.nome}</h1>
        {producto.descricao && (
          <p className="text-gray-600 mb-4">{producto.descricao}</p>
        )}
        
        {/* Seção 3: Benefícios do Produto */}
        <div className="mb-6 space-y-3 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium">Benefícios Inclusos:</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Acesso imediato após confirmação do pagamento</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Conteúdo exclusivo disponível 24h por dia</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Garantia de satisfação ou seu dinheiro de volta</span>
            </li>
          </ul>
        </div>
        
        {/* Seção 4: Preço e Descontos */}
        <div className="border rounded-xl p-4">
          <div className="flex items-center mb-2">
            <h2 className="font-medium text-lg flex-1">Resumo da oferta</h2>
            {discountEnabled && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {discountText}
              </Badge>
            )}
          </div>
          
          <div className="space-y-2 mt-3">
            {discountEnabled && originalPrice > producto.preco && (
              <div className="flex items-center">
                <span className="text-gray-500 line-through mr-2">De: {formatCurrency(originalPrice)}</span>
                <Badge variant="outline" className="bg-red-50 text-red-600 text-xs">
                  {Math.round((1 - producto.preco / originalPrice) * 100)}% OFF
                </Badge>
              </div>
            )}
            
            <div className="text-2xl font-bold text-red-600">
              Por: {formatCurrency(producto.preco)}
            </div>
            
            {producto.parcelas && producto.parcelas > 1 && (
              <div className="text-sm text-gray-500">
                ou até {producto.parcelas}x de {formatCurrency(producto.preco / producto.parcelas)} sem juros
              </div>
            )}
          </div>
        </div>
        
        {/* Seção 5: Informações de Segurança */}
        <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-2" />
          <span>{config?.payment_security_text || "Pagamento 100% seguro e processado em ambiente protegido"}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductSection;
