
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, CheckoutFormValues } from './forms/checkoutFormSchema';
import { toast } from "@/hooks/use-toast";
import CheckoutHeader from './header/CheckoutHeader';
import ProductCard from './product/ProductCard';
import TestimonialsSection from './testimonials/TestimonialsSection';
import VisitorCounter from './visitors/VisitorCounter';
import { steps } from './data/checkoutSteps';
import IdentificationStep from './steps/IdentificationStep';
import PaymentStep from './steps/PaymentStep';
import { useCheckoutChecklist } from '@/hooks/useCheckoutChecklist';
import { ChecklistItem } from './CheckoutChecklist';
import { mockTestimonials } from './data/mockTestimonials';
import { Card, CardContent } from '@/components/ui/card';
import CheckoutChecklist from './CheckoutChecklist';
import { useIsMobile } from '@/hooks/use-mobile';

interface ModernCheckoutProps {
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

const ModernCheckout: React.FC<ModernCheckoutProps> = ({ producto, config = {} }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visitors] = useState(Math.floor(Math.random() * (150 - 80) + 80));
  const { checklistItems, updateChecklistItem } = useCheckoutChecklist();
  const isMobile = useIsMobile();
  
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
  
  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<CheckoutFormValues>({
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
    setValue('payment_method', method);
    updateChecklistItem('payment-method', true);
  };
  
  // Handle continue to next step
  const handleContinue = async () => {
    if (currentStep === 0) {
      const personalInfoValid = await trigger(['name', 'email', 'cpf', 'telefone'] as any);
      if (personalInfoValid) {
        setCurrentStep(1);
        updateChecklistItem('personal-info', true);
      }
    }
  };
  
  // Handle PIX payment
  const handlePixPayment = () => {
    setValue('payment_method', 'pix');
    updateChecklistItem('payment-method', true);
    handleSubmit(onSubmit)();
  };
  
  // Form submission handler
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    updateChecklistItem('confirm-payment', true);
    
    try {
      console.log('Form data:', data);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (data.payment_method === 'pix') {
        navigate(`/checkout/${producto.slug || producto.id}/pix`);
      } else {
        navigate(`/checkout/${producto.slug || producto.id}/cartao`);
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
  
  // Generate installment options based on product settings
  const maxInstallments = producto.parcelas || 1;
  const installmentOptions = Array.from({ length: maxInstallments }, (_, i) => i + 1).map(
    (num) => ({
      value: `${num}x`,
      label: `${num}x de R$ ${(producto.preco / num).toFixed(2).replace('.', ',')}${num > 1 ? ' sem juros' : ''}`,
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
        {/* Product card */}
        <ProductCard 
          product={producto}
          discountEnabled={discountEnabled}
          discountText={discountText}
          originalPrice={originalPrice}
        />

        <div className={`grid grid-cols-1 ${isMobile ? 'gap-4 mt-4' : 'md:grid-cols-3 gap-6 mt-6'}`}>
          {isMobile && (
            <Card>
              <CardContent className="p-3">
                <CheckoutChecklist items={checklistItems} />
              </CardContent>
            </Card>
          )}
          
          <div className={isMobile ? '' : 'md:col-span-2'}>
            {/* Form Content */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card className="shadow-sm overflow-hidden">
                {currentStep === 0 ? (
                  <CardContent className={isMobile ? "p-3" : "p-5"}>
                    <IdentificationStep 
                      register={register}
                      errors={errors}
                      handleContinue={handleContinue}
                      buttonColor={corBotao}
                      formHeaderText={formHeaderText}
                      formHeaderBgColor={formHeaderBgColor}
                      formHeaderTextColor={formHeaderTextColor}
                    />
                  </CardContent>
                ) : (
                  <CardContent className={isMobile ? "p-3" : "p-5"}>
                    <PaymentStep 
                      register={register}
                      watch={watch}
                      setValue={setValue}
                      errors={errors}
                      isSubmitting={isSubmitting}
                      installmentOptions={installmentOptions}
                      buttonColor={corBotao}
                      formHeaderText="ESCOLHA A FORMA DE PAGAMENTO"
                      formHeaderBgColor={formHeaderBgColor}
                      formHeaderTextColor={formHeaderTextColor}
                    />
                  </CardContent>
                )}
              </Card>
            </form>
          </div>
          
          {!isMobile && (
            <div className="order-first md:order-last">
              <Card>
                <CardContent className="p-4">
                  <CheckoutChecklist items={checklistItems} />
                </CardContent>
              </Card>
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
    </div>
  );
};

export default ModernCheckout;
