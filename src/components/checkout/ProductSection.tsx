
import React from 'react';
import { formatCurrency } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, ShieldCheck } from 'lucide-react';
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
  paymentFormVisible: boolean;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  producto,
  config,
  discountEnabled,
  discountText,
  originalPrice
}) => {
  return (
    <div className="bg-white rounded-xl shadow mb-6 overflow-hidden">
      {/* Product Image Header - Step 1: Product Display */}
      <div className="w-full h-64 bg-gray-100">
        <ProductImage 
          imageUrl={producto.imagem_url || config?.imagem_banner} 
          productName={producto.nome}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Product Info - Step 1: Product Details */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">{producto.nome}</h1>
        {producto.descricao && (
          <p className="text-gray-600 mb-4">{producto.descricao}</p>
        )}
        
        {/* Product Benefits - Step 1: Product Benefits */}
        <div className="mb-6 space-y-2 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium">Vantagens do Produto:</h3>
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
              <ShieldCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Garantia de satisfação ou seu dinheiro de volta</span>
            </li>
          </ul>
        </div>
        
        {/* Order Summary - Step 4: Order Summary */}
        <div className="border rounded-xl p-4 space-y-4">
          <h2 className="font-medium text-lg">Resumo do pedido</h2>
          
          {discountEnabled && (
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {discountText}
            </Badge>
          )}
          
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Item:</span>
              <span>{producto.nome}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{formatCurrency(producto.preco)}</span>
            </div>
            
            {discountEnabled && originalPrice > producto.preco && (
              <div className="flex justify-between items-center text-green-600">
                <span>Desconto:</span>
                <span>- {formatCurrency(originalPrice - producto.preco)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center pt-4 border-t">
              <span className="text-lg font-bold">Total:</span>
              <div className="text-right">
                <div className="text-lg font-bold text-red-600">{formatCurrency(producto.preco)}</div>
                {producto.parcelas && producto.parcelas > 1 && (
                  <div className="text-sm text-gray-500">
                    ou até {producto.parcelas}x de {formatCurrency(producto.preco / producto.parcelas)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment Security Info */}
        <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
          <div className="mr-2">
            <Clock className="h-4 w-4 inline" />
          </div>
          {config?.payment_security_text || "Pagamento 100% seguro"}
        </div>
        
        {/* Payment Methods */}
        <div className="flex justify-center mt-4 space-x-4 items-center">
          <img src="/pix-logo.png" alt="PIX" className="h-6" />
          <div className="h-6 w-px bg-gray-300"></div>
          <div className="flex space-x-1">
            {['gray-300', 'gray-300', 'gray-300'].map((color, i) => (
              <div key={i} className={`w-8 h-5 bg-${color} rounded`}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSection;
