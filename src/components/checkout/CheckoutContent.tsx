
import React from 'react';
import { Testimonial } from '@/pages/CheckoutPage';
import BenefitsSection from '@/components/checkout/BenefitsSection';
import TestimonialsWidget from '@/components/checkout/TestimonialsWidget';
import ProductSection from '@/components/checkout/ProductSection';
import PaymentFormSection from '@/components/checkout/PaymentFormSection';
import VisitorCounterWidget from '@/components/checkout/VisitorCounterWidget';

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
      {/* Left column - Product info & payment */}
      <div className="lg:col-span-7 order-2 lg:order-1">
        {/* Step 1: Product Display */}
        <ProductSection 
          producto={producto}
          config={config}
          discountEnabled={discountEnabled}
          discountText={discountText}
          originalPrice={originalPrice}
          paymentFormVisible={true}
        />
        
        {/* Step 2,3,4: Customer Info, Payment Selection, Submit */}
        <PaymentFormSection 
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
        
        {/* Visitor counter */}
        <VisitorCounterWidget baseNumber={85} />
      </div>
      
      {/* Right column - Testimonials */}
      <div className="lg:col-span-5 order-1 lg:order-2">
        {/* Additional product benefits */}
        <BenefitsSection benefits={benefits} />
        
        {/* Step 2: Testimonials after customer data */}
        {testimonials.length > 0 && (
          <TestimonialsWidget testimonials={testimonials} />
        )}
      </div>
    </div>
  );
};

export default CheckoutContent;
