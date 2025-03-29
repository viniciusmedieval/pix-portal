
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { formSchema, CheckoutFormValues } from '../forms/checkoutFormSchema';
import { toast } from "sonner";
import { useIsMobile } from '@/hooks/use-mobile';

export function useCheckoutForm(producto: any, config: any) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeStep, setActiveStep] = useState('identification'); // 'identification' or 'payment'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<'personal-info' | 'payment-method' | 'confirm'>(
    'personal-info'
  );
  
  // Force convert to boolean
  const isOneCheckout = Boolean(config?.one_checkout_enabled);
  
  console.log("useCheckoutForm init - config:", config);
  console.log("useCheckoutForm init - isOneCheckout enabled:", isOneCheckout);
  console.log("useCheckoutForm init - isOneCheckout enabled type:", typeof isOneCheckout);
  console.log("useCheckoutForm init - isMobile:", isMobile);
  
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
    console.log("Continue clicked, current step:", currentStep);
    
    if (currentStep === 'personal-info') {
      const isValid = await trigger(['name', 'email', 'cpf', 'telefone']);
      if (isValid) {
        setCurrentStep('payment-method');
        console.log("Moving to payment-method step");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (currentStep === 'payment-method') {
      setCurrentStep('confirm');
      console.log("Moving to confirm step");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Handle payment method change
  const handlePaymentMethodChange = (method: 'pix' | 'cartao') => {
    console.log("Payment method changed to:", method);
    setValue('payment_method', method);
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
      toast.success("Processando pagamento PIX", {
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
      toast.error("Ocorreu um erro ao processar o pagamento PIX. Por favor, tente novamente.");
    }
  };

  // Handle credit card payment
  const handleCardPayment = async (data: CheckoutFormValues) => {
    console.log("Card payment handler triggered with data:", data);
    
    // Prevent multiple submissions
    if (isSubmitting) {
      console.log("Already submitting card payment, ignoring duplicate submit");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get product identifier for the URL
      const productIdentifier = producto.slug || producto.id;
      
      // Create a mock pedido_id for testing - in a real app, this would come from an API
      const mockPedidoId = "ped_" + Math.random().toString(36).substr(2, 9);
      console.log("Generated mock pedido_id:", mockPedidoId);
      
      // Show toast about processing the payment
      toast.success("Processando pagamento com cartão", {
        description: "Redirecionando para a página de pagamento...",
      });
      
      // Navigate to the CartaoPage with the pedidoId parameter
      console.log("Final navigation URL:", `/checkout/${productIdentifier}/cartao?pedidoId=${mockPedidoId}`);
      navigate(`/checkout/${productIdentifier}/cartao?pedidoId=${mockPedidoId}`);
    } catch (error) {
      console.error("Error processing card payment:", error);
      
      // Show error toast
      toast.error("Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.");
      
      // Reset submitting state
      setIsSubmitting(false);
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
    console.log("Setting isSubmitting to true");
    
    try {
      console.log("Processing checkout for product:", producto);
      console.log("Payment method being used:", data.payment_method);
      
      if (data.payment_method === 'pix') {
        handlePixPayment();
      } else if (data.payment_method === 'cartao') {
        handleCardPayment(data);
      }
    } catch (error) {
      console.error('Erro ao processar checkout:', error);
      
      // Show error toast
      toast.error("Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.");
      
      // Reset submission state
      setIsSubmitting(false);
    }
  };

  // Get current payment method
  const currentPaymentMethod = watch('payment_method');

  useEffect(() => {
    // When in OneCheckout mode on desktop, we can show all steps at once
    // For mobile, we still need to handle steps
    if (!isMobile && isOneCheckout) {
      console.log("Desktop OneCheckout - showing all steps at once");
    }
  }, [isMobile, isOneCheckout]);

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
    handlePaymentMethodChange,
    onSubmit,
    currentStep,
    currentPaymentMethod,
    isOneCheckout
  };
}
