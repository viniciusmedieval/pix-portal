
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { formSchema, CheckoutFormValues } from '../forms/checkoutFormSchema';
import { toast } from "@/hooks/use-toast";

export function useCheckoutForm(producto: any) {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState('identification'); // 'identification' or 'payment'
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payment_method: 'cartao',
      installments: '1x',
    },
  });
  
  // Handle continue to payment step
  const handleContinue = async () => {
    if (activeStep === 'identification') {
      const isValid = await trigger(['name', 'email', 'cpf', 'telefone']);
      if (isValid) {
        setActiveStep('payment');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };
  
  // Handle PIX payment
  const handlePixPayment = () => {
    setValue('payment_method', 'pix');
    handleSubmit(onSubmit)();
  };

  // Form submission handler
  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    
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

  return {
    activeStep,
    isSubmitting,
    register,
    errors,
    setValue,
    watch,
    handleSubmit,
    handleContinue,
    handlePixPayment,
    onSubmit
  };
}
