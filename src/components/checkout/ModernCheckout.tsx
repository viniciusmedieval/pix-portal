import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from './forms/checkoutFormSchema';
import { toast } from "@/hooks/use-toast";
import CustomerInfoForm from './forms/CustomerInfoForm';
import PaymentMethodSelector from './PaymentMethodSelector';
import CardPaymentForm from './forms/CardPaymentForm';
import { useCheckoutChecklist } from '@/hooks/useCheckoutChecklist';
import { steps } from './data/checkoutSteps';

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
  
  const showVisitorCounter = config?.numero_aleatorio_visitas !== false;
  const showTestimonials = config?.exibir_testemunhos !== false;
  const testimonialTitle = config?.testimonials_title || 'O que dizem nossos clientes';
  
  useEffect(() => {
    if (showVisitorCounter) {
      setVisitors(Math.floor(Math.random() * (150 - 80) + 80));
    }
  }, [showVisitorCounter]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
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
  
  const handlePixPayment = () => {
    setValue('payment_method', 'pix');
    updateChecklistItem('payment-method', true);
    
    handleSubmit(onSubmit)();
  };
  
  const onSubmit = async (data: any) => {
    updateChecklistItem('payment-method', true);
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
    }
  };
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: config?.cor_fundo || '#f5f5f7' }}>
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
    </div>
  );
};

export default ModernCheckout;
