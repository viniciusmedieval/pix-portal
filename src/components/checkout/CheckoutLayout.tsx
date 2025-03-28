
import React from 'react';
import CheckoutHeader from './header/CheckoutHeader';
import ProductCard from './product/ProductCard';
import ProgressIndicator from './progress/ProgressIndicator';
import { Card, CardContent } from '@/components/ui/card';
import TestimonialsSection from './testimonials/TestimonialsSection';
import VisitorCounter from './visitors/VisitorCounter';
import CheckoutFooter from './footer/CheckoutFooter';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const corFundo = config?.cor_fundo || '#f5f5f7';
  const showHeader = config?.show_header !== false;
  const headerMessage = config?.header_message || 'Tempo restante! Garanta sua oferta';
  const headerBgColor = config?.header_bg_color || '#000000';
  const headerTextColor = config?.header_text_color || '#ffffff';
  const discountEnabled = config?.discount_badge_enabled || false;
  const discountText = config?.discount_badge_text || 'Oferta especial';
  const originalPrice = config?.original_price || (producto.preco * 1.2);
  
  // Form header settings
  const formHeaderText = config?.form_header_text || 'PREENCHA SEUS DADOS ABAIXO';
  const formHeaderBgColor = config?.form_header_bg_color || '#dc2626';
  const formHeaderTextColor = config?.form_header_text_color || '#ffffff';
  
  // Configurações para o rodapé
  const showFooter = config?.show_footer !== false;
  const footerText = config?.footer_text || 'Todos os direitos reservados';
  const companyName = config?.company_name || 'PixPortal';
  const companyDescription = config?.company_description || 'Soluções de pagamento para aumentar suas vendas online.';
  const contactEmail = config?.contact_email || 'contato@pixportal.com.br';
  const contactPhone = config?.contact_phone || '(11) 99999-9999';
  const showTermsLink = config?.show_terms_link !== false;
  const showPrivacyLink = config?.show_privacy_link !== false;
  const termsUrl = config?.terms_url || '/termos';
  const privacyUrl = config?.privacy_url || '/privacidade';
  
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
      
      <div className={`container max-w-4xl mx-auto ${isMobile ? 'py-3 px-3' : 'py-4 px-4 sm:px-6 sm:py-6'}`}>
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
          <CardContent className={isMobile ? "p-3" : "p-5"}>
            {/* Pass form header settings to children if they need them */}
            {React.Children.map(children, child => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<any>, {
                  formHeaderText,
                  formHeaderBgColor,
                  formHeaderTextColor
                });
              }
              return child;
            })}
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
      
      {/* Footer section */}
      <CheckoutFooter 
        showFooter={showFooter}
        footerText={footerText}
        companyName={companyName}
        companyDescription={companyDescription}
        contactEmail={contactEmail}
        contactPhone={contactPhone}
        showTermsLink={showTermsLink}
        showPrivacyLink={showPrivacyLink}
        termsUrl={termsUrl}
        privacyUrl={privacyUrl}
      />
    </div>
  );
};

export default CheckoutLayout;
