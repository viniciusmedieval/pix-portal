
import React from 'react';
import { formatCurrency } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

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
    <div className="bg-white rounded-xl p-6 shadow mb-6">
      <h1 className="text-2xl font-bold mb-2">{producto.nome}</h1>
      {producto.descricao && (
        <p className="text-gray-600 mb-4">{producto.descricao}</p>
      )}
      
      <div className="border-t border-b py-6 my-6 space-y-4">
        <h2 className="font-medium text-lg">Resumo do pedido</h2>
        {discountEnabled && (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {discountText}
          </Badge>
        )}
        
        <div className="flex justify-between items-center">
          <span>Item:</span>
          <span>{producto.nome}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span>Subtotal:</span>
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
          <span className="text-lg font-bold text-red-600">{formatCurrency(producto.preco)}</span>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
        <div className="mr-2">
          <Clock className="h-4 w-4 inline" />
        </div>
        {config?.payment_security_text || "Pagamento 100% seguro"}
      </div>
      
      <div className="flex justify-center mt-4 space-x-2">
        <img src="/pix-logo.png" alt="PIX" className="h-6" />
        <div className="flex space-x-1">
          {['gray-300', 'gray-300', 'gray-300'].map((color, i) => (
            <div key={i} className={`w-8 h-5 bg-${color} rounded`}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSection;
