
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import ProductDetails from '@/components/checkout/ProductDetails';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';
import TestimonialsSection from '@/components/checkout/TestimonialsSection';
import BenefitsSection from '@/components/checkout/BenefitsSection';
import FaqSection from '@/components/checkout/FaqSection';
import { useIsMobile } from '@/hooks/use-mobile';
import { Testimonial } from '@/pages/CheckoutPage';

interface CheckoutContentProps {
  producto: {
    id: string;
    nome: string;
    descricao?: string | null;
    preco: number;
    parcelas?: number;
    imagem_url?: string | null;
    slug?: string;
  };
  config?: any;
  customization?: any;
  testimonials: Testimonial[];
  bannerImage?: string;
}

const CheckoutContent: React.FC<CheckoutContentProps> = ({ 
  producto, 
  config, 
  customization,
  testimonials, 
  bannerImage 
}) => {
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const isMobile = useIsMobile();

  const handleShowCheckout = () => {
    setShowCheckoutForm(true);
    // Scroll to form
    setTimeout(() => {
      document.getElementById('checkout-form')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  return (
    <div className="grid gap-6 mt-6 md:grid-cols-2">
      {/* Left column: Product details, benefits, testimonials */}
      <div className="space-y-6">
        <ProductDetails 
          product={producto} 
          config={config} 
          bannerImage={bannerImage}
        />
        
        {/* Only show benefits if not on mobile or if form not showing on mobile */}
        {(!isMobile || !showCheckoutForm) && (
          <>
            {customization?.show_benefits && customization?.benefits?.length > 0 && (
              <BenefitsSection benefits={customization.benefits} />
            )}
            
            {customization?.show_testimonials !== false && testimonials?.length > 0 && (
              <TestimonialsSection 
                testimonials={testimonials} 
                title={customization?.testimonials_title} 
              />
            )}
            
            {customization?.show_guarantees && customization?.guarantee_days > 0 && (
              <Card className="border-green-200 bg-green-50">
                <div className="p-4 text-center">
                  <h3 className="font-semibold mb-2">Garantia de {customization.guarantee_days} dias</h3>
                  <p className="text-sm text-gray-700">
                    Não ficou satisfeito? Devolvemos 100% do seu dinheiro em até {customization.guarantee_days} dias.
                  </p>
                </div>
              </Card>
            )}
            
            {customization?.show_faq && customization?.faqs?.length > 0 && (
              <FaqSection faqs={customization.faqs} />
            )}
          </>
        )}
      </div>
      
      {/* Right column: Checkout form or checkout summary */}
      <div>
        {showCheckoutForm ? (
          <Card className="p-4">
            <CheckoutForm 
              produto={producto}
              onSubmit={(data) => console.log('Form submitted:', data)}
              customization={customization}
              config={config}
            />
          </Card>
        ) : (
          <div className="sticky top-4">
            <CheckoutSummary 
              product={producto} 
              config={config} 
              customization={customization}
              onContinue={handleShowCheckout} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutContent;
