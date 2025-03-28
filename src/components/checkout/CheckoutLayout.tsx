
import React from 'react';
import CheckoutHeader from './header/CheckoutHeader';
import ProductCard from './product/ProductCard';
import ProgressIndicator from './progress/ProgressIndicator';
import { Card, CardContent } from '@/components/ui/card';
import TestimonialsSection from './testimonials/TestimonialsSection';
import VisitorCounter from './visitors/VisitorCounter';

interface CheckoutLayoutProps {
  children: React.ReactNode;
  producto: {
    id: string;
    nome: string;
    descricao?: string | null;
    preco: number;
    imagem_url?: string | null;
  };
  config: any;
  currentStep: number;
  activeStep: string;
  showVisitorCounter: boolean;
  visitors: number;
  showTestimonials: boolean;
  testimonialTitle: string;
  testimonials: any[];
  steps: { title: string; description: string }[];
}

const CheckoutLayout: React.FC<CheckoutLayoutProps> = ({
  children,
  producto,
  config,
  currentStep,
  activeStep,
  showVisitorCounter,
  visitors,
  showTestimonials,
  testimonialTitle,
  testimonials,
  steps
}) => {
  const corFundo = config?.cor_fundo || '#f5f5f7';
  const showHeader = config?.show_header !== false;
  const headerMessage = config?.header_message || 'Tempo restante! Garanta sua oferta';
  const headerBgColor = config?.header_bg_color || '#000000';
  const headerTextColor = config?.header_text_color || '#ffffff';
  const discountEnabled = config?.discount_badge_enabled || false;
  const discountText = config?.discount_badge_text || 'Oferta especial';
  const originalPrice = config?.original_price || (producto.preco * 1.2);
  
  // Novas configurações para o cabeçalho do formulário
  const formHeaderText = config?.form_header_text || 'PREENCHA SEUS DADOS ABAIXO';
  const formHeaderBgColor = config?.form_header_bg_color || '#dc2626';
  const formHeaderTextColor = config?.form_header_text_color || '#ffffff';
  
  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: corFundo }}>
      {/* Header section */}
      {showHeader && (
        <CheckoutHeader 
          message={headerMessage}
          bgColor={headerBgColor}
          textColor={headerTextColor}
          currentStep={currentStep}
          totalSteps={steps.length}
        />
      )}
      
      <div className="container max-w-4xl mx-auto py-4 px-4 sm:px-6 sm:py-6">
        {/* Enhanced Product card */}
        <ProductCard 
          product={producto}
          discountEnabled={discountEnabled}
          discountText={discountText}
          originalPrice={originalPrice}
        />

        {/* Progress indicator */}
        <ProgressIndicator 
          currentStep={currentStep} 
          totalSteps={steps.length} 
          steps={steps}
        />

        <Card className="shadow-sm overflow-hidden">
          <div className="p-3 text-center" style={{ backgroundColor: formHeaderBgColor, color: formHeaderTextColor }}>
            <h3 className="font-bold">{formHeaderText}</h3>
          </div>
          
          <CardContent className="p-5">
            {children}
          </CardContent>
        </Card>
        
        {/* Testimonials section */}
        {showTestimonials && activeStep === 'identification' && (
          <TestimonialsSection 
            testimonials={testimonials} 
            title={testimonialTitle} 
          />
        )}
        
        {/* Visitor counter */}
        {showVisitorCounter && (
          <VisitorCounter visitors={visitors} />
        )}
      </div>
    </div>
  );
};

export default CheckoutLayout;
