
import React, { useState } from 'react';
import BenefitsList from '@/components/checkout/BenefitsList';
import TestimonialsSection from '@/components/checkout/TestimonialsSection';
import ProductSummary from '@/components/checkout/ProductSummary';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import UserCounter from '@/components/checkout/UserCounter';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import { Testimonial } from '@/pages/CheckoutPage';
import { CreditCard, Shield, Clock } from 'lucide-react';

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
  testimonials = []
}) => {
  const [paymentFormVisible, setPaymentFormVisible] = useState(false);

  const handleContinueToPayment = () => {
    setPaymentFormVisible(true);
    // Scroll to payment form
    setTimeout(() => {
      document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const benefits = [
    { text: "Acesso imediato após a confirmação do pagamento", icon: "clock" },
    { text: "Suporte técnico disponível 24h por dia", icon: "support" },
    { text: "Garantia de 7 dias ou seu dinheiro de volta", icon: "shield" }
  ];

  const discountEnabled = config?.discount_badge_enabled || false;
  const discountText = config?.discount_badge_text || 'Oferta especial';
  const originalPrice = config?.original_price || producto.preco;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left column - Benefits & testimonials */}
      <div className="lg:col-span-5">
        <div className="bg-white rounded-xl p-6 shadow mb-6">
          <h2 className="font-medium text-lg mb-4">Benefícios</h2>
          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>{benefit.text}</span>
              </li>
            ))}
            
            {/* Guarantee box */}
            <li className="mt-6 border border-blue-100 rounded-lg p-4 bg-blue-50">
              <div className="flex items-start">
                <div className="text-blue-500 mr-2">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Garantia de 7 dias</p>
                  <p className="text-sm text-gray-600">Se não estiver satisfeito, devolvemos seu dinheiro</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        
        {/* Testimonials */}
        {testimonials.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="font-medium text-lg mb-4">O que dizem nossos clientes</h2>
            <div className="space-y-6">
              {testimonials.map(testimonial => (
                <div key={testimonial.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                      {testimonial.avatar_url ? (
                        <img src={testimonial.avatar_url} alt={testimonial.user_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary text-white">
                          {testimonial.user_name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.user_name}</p>
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{testimonial.comment}</p>
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-500 mt-4 text-right">
              {testimonials.length} comentários
            </div>
          </div>
        )}
      </div>
      
      {/* Right column - Product info & payment */}
      <div className="lg:col-span-7">
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
          
          {!paymentFormVisible ? (
            <Button 
              onClick={handleContinueToPayment}
              className="w-full py-6 text-lg"
              style={{ backgroundColor: config?.cor_botao || '#22c55e' }}
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Comprar agora
            </Button>
          ) : (
            <div id="payment-section">
              <CheckoutForm 
                produto={{
                  id: producto.id,
                  nome: producto.nome,
                  preco: producto.preco,
                  parcelas: producto.parcelas,
                  imagem_url: producto.imagem_url
                }}
                customization={customization}
                config={config}
              />
            </div>
          )}
          
          <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
            <div className="mr-2">
              <Clock className="h-4 w-4 inline" />
            </div>
            Pagamento 100% seguro
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
        
        {/* Visitor counter */}
        <div className="bg-white bg-opacity-80 rounded-xl p-4 shadow-sm">
          <UserCounter baseNumber={85} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutContent;
