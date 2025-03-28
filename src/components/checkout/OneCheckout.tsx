import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from './forms/checkoutFormSchema';
import { toast } from "@/hooks/use-toast";

// Import components
import CheckoutHeader from './header/CheckoutHeader';
import ProductCard from './product/ProductCard';
import TestimonialsSection from './testimonials/TestimonialsSection';
import VisitorCounter from './visitors/VisitorCounter';
import { useCheckoutChecklist } from '@/hooks/useCheckoutChecklist';
import { mockTestimonials } from './data/mockTestimonials';
import { useOneCheckoutState } from './hooks/useOneCheckoutState';
import OneCheckoutForm from './one-checkout/OneCheckoutForm';
import OneCheckoutSidebar from './one-checkout/OneCheckoutSidebar';
import { Card, CardContent } from '@/components/ui/card';
import CheckoutFooter from './footer/CheckoutFooter';
import { useIsMobile } from '@/hooks/use-mobile';

interface OneCheckoutProps {
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
}

const OneCheckout: React.FC<OneCheckoutProps> = ({ producto, config = {} }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { 
    visitors, 
    currentStep, 
    setCurrentStep, 
    isSubmitting, 
    setIsSubmitting 
  } = useOneCheckoutState(config);
  
  const { checklistItems, updateChecklistItem } = useCheckoutChecklist();
  
  // Extract config values with defaults
  const corFundo = config?.cor_fundo || '#f5f5f7';
  const corBotao = config?.cor_botao || '#30b968';
  const textoBotao = config?.texto_botao || 'Finalizar compra';
  const showHeader = config?.show_header !== false;
  const headerMessage = config?.header_message || 'Tempo restante! Garanta sua oferta';
  const headerBgColor = config?.header_bg_color || '#000000';
  const headerTextColor = config?.header_text_color || '#ffffff';
  const showTestimonials = config?.exibir_testemunhos !== false;
  const testimonialTitle = config?.testimonials_title || 'O que dizem nossos clientes';
  const showVisitorCounter = config?.numero_aleatorio_visitas !== false;
  const discountEnabled = config?.discount_badge_enabled || false;
  const discountText = config?.discount_badge_text || 'Oferta especial';
  const originalPrice = config?.original_price || (producto.preco * 1.2);
  const paymentMethods = config?.payment_methods || ['pix', 'cartao'];
  
  // Configurações para o cabeçalho do formulário
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
  
  console.log("OneCheckout config:", config);
  console.log("OneCheckout mobile:", isMobile);
  
  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payment_method: 'cartao',
      installments: '1x',
    },
    mode: 'onChange'
  });
  
  const currentPaymentMethod = watch('payment_method');
  
  // Handle payment method change
  const handlePaymentMethodChange = (method: 'pix' | 'cartao') => {
    console.log("Changing payment method to:", method);
    setValue('payment_method', method);
    updateChecklistItem('payment-method', true);
    
    if (currentStep === 'personal-info') {
      trigger(['name', 'email', 'cpf', 'telefone'] as any).then(valid => {
        if (valid) {
          setCurrentStep('payment-method');
          updateChecklistItem('personal-info', true);
        }
      });
    }
  };
  
  // Check personal info fields
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (['name', 'email', 'cpf', 'telefone'].includes(name as string) && type === 'change') {
        trigger(['name', 'email', 'cpf', 'telefone'] as any).then(valid => {
          if (valid) {
            updateChecklistItem('personal-info', true);
          }
        });
      }
      
      if (name === 'payment_method' && value.payment_method) {
        updateChecklistItem('payment-method', true);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [watch, trigger, updateChecklistItem]);
  
  // Handle PIX payment
  const handlePixPayment = () => {
    console.log("PIX payment button clicked");
    setValue('payment_method', 'pix');
    updateChecklistItem('payment-method', true);
    handleSubmit(onSubmit)();
  };

  // Form submission handler
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    updateChecklistItem('confirm-payment', true);
    
    try {
      console.log('Form data on submit:', data);
      console.log('Payment method selected:', data.payment_method);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (data.payment_method === 'pix') {
        const path = `/checkout/${producto.slug || producto.id}/pix`;
        console.log("Redirecting to PIX page:", path);
        navigate(path);
      } else {
        const path = `/checkout/${producto.slug || producto.id}/cartao`;
        console.log("Redirecting to Credit Card page:", path);
        navigate(path);
      }
      
      toast({
        title: "Processando pagamento",
        description: `Redirecionando para pagamento via ${data.payment_method === 'pix' ? 'PIX' : 'cartão'}...`,
      });
    } catch (error) {
      console.error('Erro ao processar checkout:', error);
      toast({
        variant: 'destructive',
        title: "Erro no processamento",
        description: "Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle continue to next step
  const handleContinue = async () => {
    if (currentStep === 'personal-info') {
      const personalInfoValid = await trigger(['name', 'email', 'cpf', 'telefone'] as any);
      if (personalInfoValid) {
        setCurrentStep('payment-method');
        updateChecklistItem('personal-info', true);
      }
    } else if (currentStep === 'payment-method') {
      setCurrentStep('confirm');
    }
  };
  
  // Generate installment options based on product settings
  const maxInstallments = producto.parcelas || 1;
  const installmentOptions = Array.from({ length: maxInstallments }, (_, i) => i + 1).map(
    (num) => ({
      value: `${num}x`,
      label: `${num}x de R$ ${(producto.preco / num).toFixed(2)}${num > 1 ? ' sem juros' : ''}`,
    })
  );
  
  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: corFundo }}>
      {/* Header section */}
      {showHeader && (
        <CheckoutHeader 
          message={headerMessage}
          bgColor={headerBgColor}
          textColor={headerTextColor}
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

        <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-3'} gap-6 mt-6`}>
          <div className={isMobile ? 'w-full' : 'md:col-span-2'}>
            <Card className="shadow-sm overflow-hidden">
              <div className="p-3 text-center" style={{ backgroundColor: formHeaderBgColor, color: formHeaderTextColor }}>
                <h3 className="font-bold">{formHeaderText}</h3>
              </div>
              
              <CardContent className={isMobile ? "p-3" : "p-5"}>
                <OneCheckoutForm
                  register={register}
                  errors={errors}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  currentStep={currentStep}
                  currentPaymentMethod={watch('payment_method')}
                  handlePaymentMethodChange={handlePaymentMethodChange}
                  handleContinue={handleContinue}
                  setValue={setValue}
                  isSubmitting={isSubmitting}
                  installmentOptions={installmentOptions}
                  handlePixPayment={handlePixPayment}
                  paymentMethods={paymentMethods}
                  corBotao={corBotao}
                  textoBotao={textoBotao}
                />
              </CardContent>
            </Card>
          </div>
          
          {!isMobile && (
            <div className="order-first md:order-last">
              <OneCheckoutSidebar checklistItems={checklistItems} />
            </div>
          )}
        </div>
        
        {/* Testimonials section */}
        {showTestimonials && (
          <TestimonialsSection 
            testimonials={mockTestimonials} 
            title={testimonialTitle} 
          />
        )}
        
        {/* Visitor counter */}
        {showVisitorCounter && (
          <VisitorCounter visitors={visitors} />
        )}
      </div>
      
      {/* Footer section with explicit showFooter prop */}
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

export default OneCheckout;
