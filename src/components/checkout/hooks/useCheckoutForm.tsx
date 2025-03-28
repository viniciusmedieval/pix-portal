
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
  
  // Handle PIX payment - This is the critical function that needs fixing
  const handlePixPayment = () => {
    console.log("PIX payment handler triggered in useCheckoutForm");
    
    // Prevent multiple submissions
    if (isSubmitting) {
      console.log("Already submitting, ignoring duplicate click");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Set payment method to PIX
      setValue('payment_method', 'pix');
      console.log("Payment method set to PIX, now submitting form...");
      
      // Submit the form with PIX payment method
      handleSubmit(onSubmit)();
    } catch (error) {
      console.error("Error in handlePixPayment:", error);
      setIsSubmitting(false);
      
      toast({
        variant: 'destructive',
        title: "Erro no processamento",
        description: "Ocorreu um erro ao processar o pagamento PIX. Por favor, tente novamente.",
      });
    }
  };

  // Form submission handler
  const onSubmit = async (data: CheckoutFormValues) => {
    console.log("Form submitted with data:", data);
    
    if (isSubmitting && data.payment_method !== 'pix') {
      console.log("Already submitting non-PIX payment, ignoring duplicate submit");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Processing checkout for product:", producto);
      console.log("Payment method being used:", data.payment_method);
      
      // Add a delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Ensure we have a slug or fallback to ID
      const productIdentifier = producto.slug || producto.id;
      
      if (data.payment_method === 'pix') {
        const pixUrl = `/checkout/${productIdentifier}/pix`;
        console.log("Redirecting to PIX page:", pixUrl);
        navigate(pixUrl);
        
        toast({
          title: "Processando pagamento PIX",
          description: "Redirecionando para a página de pagamento PIX...",
        });
      } else {
        const cartaoUrl = `/checkout/${productIdentifier}/cartao`;
        console.log("Redirecting to card page:", cartaoUrl);
        navigate(cartaoUrl);
        
        toast({
          title: "Processando pagamento",
          description: "Redirecionando para pagamento via cartão...",
        });
      }
    } catch (error) {
      console.error('Erro ao processar checkout:', error);
      toast({
        variant: 'destructive',
        title: "Erro no processamento",
        description: "Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.",
      });
    } finally {
      // Reset submission state after a delay to prevent double clicks
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
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
