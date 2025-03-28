
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, CheckoutFormValues } from './forms/checkoutFormSchema';
import { toast } from "@/hooks/use-toast";

// Import components
import CheckoutLayout from './CheckoutLayout';
import CheckoutForm from './CheckoutForm';
import CheckoutSummary from './CheckoutSummary';
import { mockTestimonials } from './data/mockTestimonials';
import CheckoutChecklist from './CheckoutChecklist';
import { useCheckoutChecklist } from '@/hooks/useCheckoutChecklist';
import { Card, CardContent } from '@/components/ui/card';

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
  const [activeStep, setActiveStep] = useState<'identification' | 'payment'>('identification');
  const [visitors, setVisitors] = useState(0);
  const { checklistItems, updateChecklistItem } = useCheckoutChecklist();
  
  // Extract config values with defaults
  const showVisitorCounter = config?.numero_aleatorio_visitas !== false;
  const showTestimonials = config?.exibir_testemunhos !== false;
  const testimonialTitle = config?.testimonials_title || 'O que dizem nossos clientes';
  
  // Set up random visitor count if enabled
  useEffect(() => {
    if (showVisitorCounter) {
      setVisitors(Math.floor(Math.random() * (150 - 80) + 80));
    }
  }, [showVisitorCounter]);
  
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
  
  // Watch for field changes to update checklist
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (['name', 'email', 'cpf', 'telefone'].includes(name as string) && type === 'change') {
        trigger(['name', 'email', 'cpf', 'telefone']).then(valid => {
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
  
  // Handle continue to payment step
  const handleContinue = async () => {
    if (activeStep === 'identification') {
      const isValid = await trigger(['name', 'email', 'cpf', 'telefone']);
      
      if (isValid) {
        setActiveStep('payment');
        updateChecklistItem('personal-info', true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };
  
  // Handle direct pix payment
  const handlePixPayment = () => {
    setValue('payment_method', 'pix');
    updateChecklistItem('payment-method', true);
    
    handleSubmit(onSubmit)();
  };
  
  // Form submission handler
  const onSubmit = async (data: CheckoutFormValues) => {
    updateChecklistItem('payment-method', true);
    updateChecklistItem('confirm-payment', true);
    
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
    }
  };
  
  // Define steps for progress indicator
  const steps = [
    { title: 'Dados pessoais', description: 'Identificação' },
    { title: 'Pagamento', description: 'Escolha o método' },
  ];
  
  return (
    <CheckoutLayout
      producto={producto}
      config={config}
      currentStep={activeStep === 'identification' ? 1 : 2}
      activeStep={activeStep}
      showVisitorCounter={showVisitorCounter}
      visitors={visitors}
      showTestimonials={showTestimonials}
      testimonialTitle={testimonialTitle}
      testimonials={mockTestimonials}
      steps={steps}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {activeStep === 'identification' ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Informações Pessoais</h2>
              <CustomerInfoForm 
                register={register}
                errors={errors}
              />
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleContinue}
                  className="w-full py-3 bg-primary text-white rounded-md"
                >
                  Continuar para pagamento
                </button>
              </div>
            </div>
          ) : (
            <CheckoutForm
              produto={producto}
              config={config}
              onSubmit={onSubmit}
              onPixPayment={handlePixPayment}
              customization={{
                payment_methods: Array.isArray(config?.payment_methods) 
                  ? config.payment_methods 
                  : ['pix', 'cartao'],
                payment_info_title: config?.payment_info_title,
                cta_text: config?.texto_botao,
              }}
            />
          )}
        </div>
        
        <div className="order-first md:order-last">
          <Card>
            <CardContent className="p-4">
              <CheckoutChecklist items={checklistItems} />
            </CardContent>
          </Card>
        </div>
      </div>
    </CheckoutLayout>
  );
};

export default ModernCheckout;
