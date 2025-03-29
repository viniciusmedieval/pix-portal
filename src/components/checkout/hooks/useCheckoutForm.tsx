
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
      
      // Navigate to PIX page - use proper path format
      console.log("Navigating to PIX page for:", productIdentifier);
      navigate(`/checkout/${productIdentifier}/pix`);
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
      
      // Create a mock pedido_id for testing - in a real app, this would come from an API
      const mockPedidoId = "ped_" + Math.random().toString(36).substr(2, 9);
      console.log("Generated mock pedido_id:", mockPedidoId);
      
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
      } else {
        console.log("Redirecting to card page for:", productIdentifier);
        
        // Show success toast
        toast({
          title: "Processando pagamento",
          description: "Redirecionando para pagamento via cartão...",
        });
        
        // Fix: Use correctly cased "cartao" not "cartão" in the URL and pass the pedido_id
        navigate(`/checkout/${productIdentifier}/cartao?pedido_id=${mockPedidoId}`);
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
    onSubmit
  };
}
