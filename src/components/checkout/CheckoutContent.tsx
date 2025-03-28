
import React, { useState } from 'react';
import BenefitsList from '@/components/checkout/BenefitsList';
import TestimonialsSection from '@/components/checkout/TestimonialsSection';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import UserCounter from '@/components/checkout/UserCounter';
import { Testimonial } from '@/pages/CheckoutPage';

interface CheckoutContentProps {
  producto: {
    id: string;
    nome: string;
    descricao?: string | null;
    preco: number;
    parcelas?: number;
    slug?: string | null;
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
  const [paymentFormVisible, setPaymentFormVisible] = useState(false);

  const handleContinueToPayment = () => {
    setPaymentFormVisible(true);
    // Scroll to payment form
    setTimeout(() => {
      document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      {/* Product banner if exists */}
      {bannerImage && (
        <div className="mb-6 rounded-lg overflow-hidden">
          <img 
            src={bannerImage} 
            alt={producto.nome} 
            className="w-full h-auto object-cover"
          />
        </div>
      )}
          
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left column - Product info & benefits */}
        <div className="space-y-6">
          {/* Benefits */}
          {customization?.show_benefits && customization?.benefits && customization.benefits.length > 0 && (
            <BenefitsList 
              benefits={customization.benefits} 
              showGuarantees={customization.show_guarantees}
              guaranteeDays={customization.guarantee_days}
            />
          )}
          
          {/* Testimonials */}
          {customization?.show_testimonials && testimonials.length > 0 && (
            <TestimonialsSection 
              testimonials={testimonials} 
              title={customization.testimonials_title}
            />
          )}
        </div>
        
        {/* Right column - Checkout */}
        <div className="space-y-6">
          {!paymentFormVisible ? (
            <CheckoutSummary 
              product={{
                id: producto.id,
                nome: producto.nome,
                descricao: producto.descricao,
                preco: producto.preco,
                parcelas: producto.parcelas,
                slug: producto.slug
              }}
              config={config}
              onContinue={handleContinueToPayment}
            />
          ) : (
            <div id="payment-section">
              <CheckoutForm 
                produto={{
                  id: producto.id,
                  nome: producto.nome,
                  preco: producto.preco,
                  parcelas: producto.parcelas,
                }}
                customization={customization}
                config={config}
              />
            </div>
          )}
          
          {/* Visitor counter */}
          {config?.numero_aleatorio_visitas && (
            <UserCounter baseNumber={100} />
          )}
        </div>
      </div>
    </>
  );
};

export default CheckoutContent;
