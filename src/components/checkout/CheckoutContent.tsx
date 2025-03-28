
import React from 'react';
import { Testimonial } from '@/pages/CheckoutPage';
import TestimonialsSection from '@/components/checkout/TestimonialsSection';
import PaymentFormSection from '@/components/checkout/PaymentFormSection';
import { formatCurrency } from '@/lib/formatters';

interface CheckoutContentProps {
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
  customization?: any;
  testimonials?: Testimonial[];
  bannerImage?: string;
}

const CheckoutContent: React.FC<CheckoutContentProps> = ({
  producto,
  config,
  customization,
  testimonials = [],
  bannerImage
}) => {
  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-200 mt-0 overflow-hidden">
      {/* Form Section */}
      <div className="p-4">
        <PaymentFormSection 
          produto={{
            id: producto.id,
            nome: producto.nome,
            preco: producto.preco,
            parcelas: producto.parcelas,
            imagem_url: bannerImage || producto.imagem_url
          }}
          customization={customization}
          config={config}
        />
      </div>
      
      {/* Testimonials Section as a separate section */}
      {testimonials.length > 0 && (
        <div className="border-t border-gray-200 p-4">
          <TestimonialsSection 
            testimonials={testimonials} 
            title="Depoimentos" 
          />
        </div>
      )}
      
      {/* Order Summary Section */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 flex-shrink-0">
              <img 
                src={bannerImage || producto.imagem_url || "/placeholder.svg"} 
                alt={producto.nome}
                className="w-full h-full object-cover rounded-sm"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            </div>
            <div>
              <h3 className="font-medium text-sm">{producto.nome}</h3>
              <p className="text-xs text-gray-500">
                {producto.parcelas && producto.parcelas > 1 
                  ? `${producto.parcelas}x de ${formatCurrency(producto.preco / producto.parcelas)}`
                  : formatCurrency(producto.preco)
                }
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm">1 item · {formatCurrency(producto.preco)}</p>
          </div>
        </div>
        
        <button
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-sm mt-4 font-medium"
        >
          Assinar agora
        </button>
        
        <div className="text-center text-xs text-gray-500 mt-3">
          <p>Clique SOMENTE se estiver de acordo com a compra neste momento.</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutContent;
