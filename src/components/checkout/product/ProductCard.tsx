
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatters';
import { Check, Monitor, MonitorSmartphone, Tv } from 'lucide-react';

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
  
  // Updated benefits with icons
  const benefits = [
    {
      text: 'Acesso imediato após confirmação do pagamento',
      icon: <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
    },
    {
      text: 'Conteúdo exclusivo disponível 24h por dia',
      icon: <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
    },
    {
      text: 'Compra Segura - Pagamento protegido e garantido',
      icon: <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
    },
    {
      text: 'Use 3 telas simultaneamente',
      icon: <MonitorSmartphone className="h-5 w-5 text-green-600 flex-shrink-0" />
    },
    {
      text: 'Mais de 60.000 conteúdos',
      icon: <Tv className="h-5 w-5 text-green-600 flex-shrink-0" />
    },
    {
      text: 'Guia de Programação [EPG]',
      icon: <Monitor className="h-5 w-5 text-green-600 flex-shrink-0" />
    }
  ];
  
  return (
    <Card className="mb-8 overflow-hidden shadow-sm">
      <CardContent className="p-0">
        <div className="md:flex">
          {/* Product Image */}
          {product.imagem_url && (
            <div className="w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
              <img
                src={product.imagem_url}
                alt={product.nome}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* All content next to image */}
          <div className="w-full md:w-3/5 flex flex-col">
            {/* Product name and price section */}
            <div className="p-4 border-b">
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
            
            {/* Benefits section with light green background */}
            <div className="bg-green-50 p-4 flex-grow">
              <h3 className="font-semibold text-green-800 mb-3">Benefícios inclusos:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2">
                    {benefit.icon}
                    <span className="text-sm">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
