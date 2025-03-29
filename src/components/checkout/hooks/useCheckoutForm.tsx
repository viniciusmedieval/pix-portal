
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
    console.log("PIX payment handler triggered in useCheckoutForm");
    
    // Prevent multiple submissions
    if (isSubmitting) {
      console.log("Already submitting, ignoring duplicate click");
      return;
    }
    
    // Set submitting state to prevent multiple clicks
    setIsSubmitting(true);
    
    try {
      // Set payment method to PIX
      setValue('payment_method', 'pix');
      
      // Get product identifier for the URL
      const productIdentifier = producto.slug || producto.id;
      
      // Show a toast notification
      toast({
        title: "Processando pagamento PIX",
        description: "Redirecionando para a página de pagamento PIX...",
      });
      
      // Navigate to PIX page
      console.log("Navigating to PIX page for:", productIdentifier);
      
      // Slight delay to ensure state is updated
      setTimeout(() => {
        navigate(`/checkout/${productIdentifier}/pix`);
      }, 100);
    } catch (error) {
      console.error("Error processing PIX payment:", error);
      
      // Reset submitting state if there was an error
      setIsSubmitting(false);
      
      // Show error toast
      toast({
        variant: 'destructive',
        title: "Erro no processamento",
        description: "Ocorreu um erro ao processar o pagamento PIX. Por favor, tente novamente.",
      });
    }
  };

  // Handle credit card payment - Direct to payment failed
  const handleCardPayment = () => {
    console.log("Card payment handler triggered, redirecting to payment failed page");
    
    // Prevent multiple submissions
    if (isSubmitting) {
      console.log("Already submitting, ignoring duplicate click");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Set payment method to cartao
      setValue('payment_method', 'cartao');
      
      // Get product identifier for the URL
      const productIdentifier = producto.slug || producto.id;
      
      // Create a mock pedido_id for testing
      const mockPedidoId = "ped_" + Math.random().toString(36).substr(2, 9);
      console.log("Generated mock pedido_id:", mockPedidoId);
      
      // Show toast about payment being declined
      toast({
        variant: 'destructive',
        title: "Pagamento não aprovado",
        description: "Não foi possível processar seu pagamento. Redirecionando...",
      });
      
      // Navigate directly to the payment failed page
      navigate(`/checkout/${productIdentifier}/payment-failed/${mockPedidoId}`);
    } catch (error) {
      console.error("Error processing card payment:", error);
      
      // Reset submitting state if there was an error
      setIsSubmitting(false);
      
      // Show error toast
      toast({
        variant: 'destructive',
        title: "Erro no processamento",
        description: "Ocorreu um erro ao processar o pagamento com cartão. Por favor, tente novamente.",
      });
    }
  };

  // Form submission handler
  const onSubmit = async (data: CheckoutFormValues) => {
    console.log("Form submitted with data:", data);
    
    // Prevent multiple submissions
    if (isSubmitting) {
      console.log("Already submitting, ignoring duplicate submit");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Processing checkout for product:", producto);
      console.log("Payment method being used:", data.payment_method);
      
      // Ensure we have a slug or fallback to ID
      const productIdentifier = producto.slug || producto.id;
      
      if (data.payment_method === 'pix') {
        console.log("Redirecting to PIX page for:", productIdentifier);
        
        // Show success toast
        toast({
          title: "Processando pagamento PIX",
          description: "Redirecionando para a página de pagamento PIX...",
        });
        
        // Navigate to PIX page
        navigate(`/checkout/${productIdentifier}/pix`);
      } else if (data.payment_method === 'cartao') {
        // Direct to payment failed
        handleCardPayment();
      }
    } catch (error) {
      console.error('Erro ao processar checkout:', error);
      
      // Show error toast
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
    handleCardPayment,
    onSubmit
  };
}
