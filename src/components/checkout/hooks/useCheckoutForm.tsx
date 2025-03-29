
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { formSchema, CheckoutFormValues } from '../forms/checkoutFormSchema';
import { toast } from "sonner";
import { useIsMobile } from '@/hooks/use-mobile';
import { salvarPedido } from '@/services/pedidoService';

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
      const isValid = await trigger(['name', 'email', 'cpf', 'telefone'] as any);
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
    if (isSubmitting) {
      console.log("Already submitting card payment, ignoring duplicate submit");
      return;
    }
    setIsSubmitting(true);
    console.log("Setting isSubmitting to true for card payment");
    try {
      const productIdentifier = producto.slug || producto.id;
      console.log("Product identifier:", productIdentifier);
      const pedidoData = {
        produto_id: producto.id,
        nome: data.name,
        email: data.email,
        telefone: data.telefone,
        cpf: data.cpf,
        valor: producto.preco,
        forma_pagamento: "cartao"
      };
      console.log("Creating pedido with data:", pedidoData);
      const pedido = await salvarPedido(pedidoData);
      console.log("Pedido created:", pedido);
      const pedidoId = pedido.id;
      console.log("Generated pedido_id:", pedidoId);
      toast.success("Processando pagamento com cartão", {
        description: "Redirecionando para a página de pagamento...",
      });
      console.log("Navigating to:", `/checkout/${productIdentifier}/cartao?pedidoId=${pedidoId}`);
      
      // Mudança principal aqui: garantir que o navigate seja executado sem problemas
      // Adicionando um pequeno timeout para garantir que o estado seja atualizado
      setTimeout(() => {
        navigate(`/checkout/${productIdentifier}/cartao?pedidoId=${pedidoId}`);
      }, 100);
    } catch (error) {
      console.error("Error processing card payment:", error);
      toast.error("Ocorreu um erro ao processar o pagamento. Tente novamente.");
      throw error;
    } finally {
      setIsSubmitting(false);
      console.log("Resetting isSubmitting in handleCardPayment");
    }
  };

  // Form submission handler
  const onSubmit = async (data: CheckoutFormValues) => {
    console.log("Form submitted with data:", data);
    console.log("Current payment method:", data.payment_method);
    if (isSubmitting) {
      console.log("Already submitting, ignoring duplicate submit");
      return;
    }
    setIsSubmitting(true);
    console.log("Setting isSubmitting to true");
    try {
      if (data.payment_method === "pix") {
        console.log("Processing PIX payment");
        handlePixPayment();
      } else if (data.payment_method === "cartao") {
        console.log("Processing card payment");
        await handleCardPayment(data);
      } else {
        throw new Error("Invalid payment method");
      }
    } catch (error) {
      console.error("Error processing checkout:", error);
      toast.error("Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
      console.log("Resetting isSubmitting to false");
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
