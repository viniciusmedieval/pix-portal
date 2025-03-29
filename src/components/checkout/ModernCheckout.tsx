
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, CheckoutFormValues } from './forms/checkoutFormSchema';
import { toast } from "@/hooks/use-toast";
import { steps } from './data/checkoutSteps';
import IdentificationStep from './steps/IdentificationStep';
import PaymentStep from './steps/PaymentStep';
import { useCheckoutChecklist } from '@/hooks/useCheckoutChecklist';
import { mockTestimonials } from './data/mockTestimonials';
import CheckoutChecklist from './CheckoutChecklist';
import { useIsMobile } from '@/hooks/use-mobile';
import CheckoutLayout from './CheckoutLayout';

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
  const showTestimonials = config?.exibir_testemunhos !== false;
  const testimonialTitle = config?.testimonials_title || 'O que dizem nossos clientes';
  const showVisitorCounter = config?.numero_aleatorio_visitas !== false;
  const paymentMethods = config?.payment_methods || ['pix', 'cartao'];
  
  console.log("ModernCheckout config:", config);
  console.log("Footer should be visible:", config?.show_footer !== false);
  console.log("Available payment methods:", paymentMethods);
  
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
      payment_method: paymentMethods.includes('cartao') ? 'cartao' : 'pix',
      installments: '1x',
    },
    mode: 'onChange'
  });
  
  const currentPaymentMethod = watch('payment_method');
  
  useEffect(() => {
    console.log("Current payment method:", currentPaymentMethod);
  }, [currentPaymentMethod]);
  
  // Handle payment method change
  const handlePaymentMethodChange = (method: 'pix' | 'cartao') => {
    console.log("Payment method changed to:", method);
    setValue('payment_method', method);
    updateChecklistItem('payment-method', true);
  };
  
  // Handle continue to next step
  const handleContinue = async () => {
    if (currentStep === 0) {
      const personalInfoValid = await trigger(['name', 'email', 'cpf', 'telefone'] as const);
      if (personalInfoValid) {
        setCurrentStep(1);
        updateChecklistItem('personal-info', true);
      }
    }
  };
  
  // Handle PIX payment
  const handlePixPayment = () => {
    console.log("PIX payment button clicked");
    setValue('payment_method', 'pix');
    updateChecklistItem('payment-method', true);
    handleSubmit(onSubmit)();
  };
  
  // Form submission handler
  const onSubmit = async (data: CheckoutFormValues) => {
    console.log('Form submission started with payment method:', data.payment_method);
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
  
  // Generate installment options based on product settings
  const maxInstallments = producto.parcelas || 1;
  const installmentOptions = Array.from({ length: maxInstallments }, (_, i) => i + 1).map(
    (num) => ({
      value: `${num}x`,
      label: `${num}x de R$ ${(producto.preco / num).toFixed(2).replace('.', ',')}${num > 1 ? ' sem juros' : ''}`,
    })
  );
  
  // Determine the active step name
  const activeStep = currentStep === 0 ? 'identification' : 'payment';
  
  return (
    <CheckoutLayout
      producto={producto}
      config={config}
      currentStep={currentStep}
      activeStep={activeStep}
      showVisitorCounter={showVisitorCounter}
      visitors={visitors}
      showTestimonials={showTestimonials}
      testimonialTitle={testimonialTitle}
      testimonials={mockTestimonials}
      steps={steps}
    >
      <form id="checkout-form" onSubmit={handleSubmit(onSubmit)}>
        {currentStep === 0 ? (
          <IdentificationStep 
            register={register}
            errors={errors}
            handleContinue={handleContinue}
            buttonColor={corBotao}
          />
        ) : (
          <PaymentStep 
            register={register}
            watch={watch}
            setValue={setValue}
            errors={errors}
            isSubmitting={isSubmitting}
            installmentOptions={installmentOptions}
            buttonColor={corBotao}
            paymentMethods={paymentMethods}
            onPixPayment={handlePixPayment}
          />
        )}
      </form>
    </CheckoutLayout>
  );
};

export default ModernCheckout;
