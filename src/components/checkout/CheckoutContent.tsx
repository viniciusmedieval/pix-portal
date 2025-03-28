
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
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left column - Product info, banner & testimonials */}
      <div className="lg:w-1/2 space-y-6">
        {/* Product banner if exists */}
        {bannerImage && (
          <div className="rounded-xl overflow-hidden shadow-md">
            <img 
              src={bannerImage} 
              alt={producto.nome} 
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        
        {/* Product title and description - Mobile only */}
        <div className="lg:hidden">
          <h1 className="text-2xl font-bold mb-2">{producto.nome}</h1>
          {producto.descricao && (
            <p className="text-gray-600">{producto.descricao}</p>
          )}
        </div>
        
        {/* Benefits */}
        {customization?.show_benefits && customization?.benefits && customization.benefits.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-md">
            <BenefitsList 
              benefits={customization.benefits} 
              showGuarantees={customization.show_guarantees}
              guaranteeDays={customization.guarantee_days}
            />
          </div>
        )}
        
        {/* Testimonials */}
        {customization?.show_testimonials && testimonials.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-md">
            <TestimonialsSection 
              testimonials={testimonials} 
              title={customization.testimonials_title}
            />
          </div>
        )}
      </div>
      
      {/* Right column - Checkout summary & form */}
      <div className="lg:w-1/2 space-y-6">
        {/* Product title and description - Desktop only */}
        <div className="hidden lg:block">
          <h1 className="text-2xl font-bold mb-2">{producto.nome}</h1>
          {producto.descricao && (
            <p className="text-gray-600">{producto.descricao}</p>
          )}
        </div>
        
        {!paymentFormVisible ? (
          <div className="bg-white rounded-xl p-6 shadow-md">
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
          </div>
        ) : (
          <div id="payment-section" className="bg-white rounded-xl p-6 shadow-md">
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
          <div className="bg-white bg-opacity-80 rounded-xl p-4 shadow-sm">
            <UserCounter baseNumber={100} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutContent;
