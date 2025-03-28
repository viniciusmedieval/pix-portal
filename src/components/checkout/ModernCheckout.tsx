
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, CheckoutFormValues } from './forms/checkoutFormSchema';
import CheckoutLayout from './CheckoutLayout';
import IdentificationStep from './steps/IdentificationStep';
import PaymentStep from './steps/PaymentStep';
import { mockTestimonials } from './data/mockTestimonials';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";

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
  const [currentStep, setCurrentStep] = useState(1);
  const [activeStep, setActiveStep] = useState('identification');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visitors, setVisitors] = useState(0);
  const navigate = useNavigate();
  
  // Extract config values with defaults
  const corBotao = config?.cor_botao || '#22c55e';
  const showTestimonials = config?.exibir_testemunhos !== false;
  const showVisitorCounter = config?.numero_aleatorio_visitas !== false;
  const testimonialTitle = config?.testimonials_title || 'O que dizem nossos clientes';
  
  // Form header settings
  const formHeaderText = config?.form_header_text || 'PREENCHA SEUS DADOS ABAIXO';
  const formHeaderBgColor = config?.form_header_bg_color || '#dc2626';
  const formHeaderTextColor = config?.form_header_text_color || '#ffffff';
  
  // Set up form
  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    formState: { errors },
    watch
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payment_method: 'cartao',
      installments: '1x',
    },
  });
  
  // Generate random visitor count
  useEffect(() => {
    if (showVisitorCounter) {
      setVisitors(Math.floor(Math.random() * (150 - 80) + 80));
    }
  }, [showVisitorCounter]);
  
  // Handle progression to next step
  const handleContinueToPayment = async () => {
    const isValid = await trigger(['name', 'email', 'cpf']);
    
    if (isValid) {
      setCurrentStep(2);
      setActiveStep('payment');
      window.scrollTo(0, 0);
    }
  };
  
  // Handle form submission
  const handleFormSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log('Form data:', data);
      
      // Simulate API call
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
  
  // Define the steps
  const steps = [
    { title: 'Identificação', description: 'Dados pessoais' },
    { title: 'Pagamento', description: 'Forma de pagamento' }
  ];
  
  // Generate installment options based on product settings
  const maxInstallments = producto.parcelas || 1;
  const installmentOptions = Array.from({ length: maxInstallments }, (_, i) => i + 1).map(
    (num) => ({
      value: `${num}x`,
      label: `${num}x de R$ ${(producto.preco / num).toFixed(2)}${num > 1 ? ' sem juros' : ''}`,
    })
  );
  
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
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {activeStep === 'identification' && (
          <IdentificationStep 
            register={register} 
            errors={errors} 
            handleContinue={handleContinueToPayment}
            buttonColor={corBotao}
            formHeaderBgColor={formHeaderBgColor}
            formHeaderTextColor={formHeaderTextColor}
            formHeaderText={formHeaderText}
          />
        )}
        
        {activeStep === 'payment' && (
          <PaymentStep 
            register={register}
            setValue={setValue}
            errors={errors}
            watch={watch}
            isSubmitting={isSubmitting}
            installmentOptions={installmentOptions}
            buttonColor={corBotao}
            formHeaderBgColor={formHeaderBgColor}
            formHeaderTextColor={formHeaderTextColor}
            formHeaderText="ESCOLHA A FORMA DE PAGAMENTO"
          />
        )}
      </form>
    </CheckoutLayout>
  );
};

export default ModernCheckout;
