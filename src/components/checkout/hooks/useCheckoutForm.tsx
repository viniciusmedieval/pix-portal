
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { salvarPedido } from "@/services/pedidoService";
import { formSchema, CheckoutFormValues } from "../forms/checkoutFormSchema";

type PaymentMethod = "pix" | "cartao";
type CheckoutStep = "personal-info" | "payment-method" | "confirm";

interface CheckoutConfig {
  one_checkout_enabled?: boolean;
}

interface UseCheckoutFormReturn {
  activeStep: string;
  isSubmitting: boolean;
  register: ReturnType<typeof useForm<CheckoutFormValues>>["register"];
  errors: ReturnType<typeof useForm<CheckoutFormValues>>["formState"]["errors"];
  setValue: ReturnType<typeof useForm<CheckoutFormValues>>["setValue"];
  watch: ReturnType<typeof useForm<CheckoutFormValues>>["watch"];
  handleSubmit: ReturnType<typeof useForm<CheckoutFormValues>>["handleSubmit"];
  handleContinue: () => Promise<void>;
  handlePixPayment: () => void;
  handleCardPayment: (data: CheckoutFormValues) => Promise<void>;
  handlePaymentMethodChange: (method: PaymentMethod) => void;
  onSubmit: (data: CheckoutFormValues) => Promise<void>;
  currentStep: CheckoutStep;
  currentPaymentMethod: string;
  isOneCheckout: boolean;
}

export function useCheckoutForm(producto: any, config: CheckoutConfig): UseCheckoutFormReturn {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeStep] = useState<string>("identification");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("personal-info");
  const isOneCheckout = Boolean(config?.one_checkout_enabled);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payment_method: "cartao",
      installments: "1x",
    },
  });

  const { register, handleSubmit, formState: { errors }, setValue, trigger, watch } = form;

  const getProductIdentifier = (): string => producto.slug || producto.id;

  const scrollToTop = (): void => window.scrollTo({ top: 0, behavior: "smooth" });

  const showErrorToast = (message: string): void => {
    console.error(message);
    toast.error(message);
  };

  const handleContinue = async (): Promise<void> => {
    console.log("handleContinue - Current step:", currentStep);
    if (currentStep === "personal-info") {
      const isValid = await trigger(["name", "email", "cpf", "telefone"]);
      if (isValid) {
        setCurrentStep("payment-method");
        console.log("Moving to payment-method step");
        scrollToTop();
      } else {
        console.log("Validation failed:", errors);
      }
    } else if (currentStep === "payment-method") {
      setCurrentStep("confirm");
      console.log("Moving to confirm step");
      scrollToTop();
    }
  };

  const handlePaymentMethodChange = (method: PaymentMethod): void => {
    console.log("handlePaymentMethodChange - New method:", method);
    setValue("payment_method", method);
  };

  const handlePixPayment = (): void => {
    console.log("handlePixPayment - Starting");
    if (isSubmitting) {
      console.log("Already submitting, ignoring");
      return;
    }
    setIsSubmitting(true);
    try {
      setValue("payment_method", "pix");
      const productIdentifier = getProductIdentifier();
      toast.success("Processando pagamento PIX", {
        description: "Redirecionando para a página de pagamento PIX...",
      });
      console.log("Navigating to PIX page:", productIdentifier);
      navigate(`/checkout/${productIdentifier}/pix`);
    } catch (error) {
      showErrorToast("Erro ao processar pagamento PIX. Tente novamente.");
    } finally {
      setIsSubmitting(false);
      console.log("handlePixPayment - Done");
    }
  };

  const handleCardPayment = async (data: CheckoutFormValues): Promise<void> => {
    console.log("handleCardPayment - Starting with data:", data);
    if (isSubmitting) {
      console.log("Already submitting, ignoring");
      return;
    }
    setIsSubmitting(true);
    try {
      const productIdentifier = getProductIdentifier();
      const pedidoData = {
        produto_id: producto.id,
        nome: data.name,
        email: data.email,
        telefone: data.telefone,
        cpf: data.cpf,
        valor: producto.preco,
        forma_pagamento: "cartao",
      };
      console.log("Creating pedido:", pedidoData);
      const pedido = await salvarPedido(pedidoData);
      console.log("Pedido created:", pedido);
      const pedidoId = pedido.id;
      toast.success("Processando pagamento com cartão", {
        description: "Redirecionando para a página de pagamento...",
      });
      const url = `/checkout/${productIdentifier}/cartao?pedidoId=${pedidoId}`;
      console.log("Navigating to:", url);
      navigate(url);
    } catch (error) {
      showErrorToast("Erro ao processar pagamento com cartão. Tente novamente.");
    } finally {
      setIsSubmitting(false);
      console.log("handleCardPayment - Done");
    }
  };

  const onSubmit = async (data: CheckoutFormValues): Promise<void> => {
    console.log("onSubmit - Data:", data);
    console.log("onSubmit - Payment method:", data.payment_method);
    if (isSubmitting) {
      console.log("Already submitting, ignoring");
      return;
    }
    setIsSubmitting(true);
    try {
      switch (data.payment_method) {
        case "pix":
          console.log("Processing PIX");
          handlePixPayment();
          break;
        case "cartao":
          console.log("Processing card");
          await handleCardPayment(data);
          break;
        default:
          throw new Error("Invalid payment method");
      }
    } catch (error) {
      showErrorToast("Erro ao processar seu pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
      console.log("onSubmit - Done");
    }
  };

  const currentPaymentMethod = watch("payment_method");

  useEffect(() => {
    if (!isMobile && isOneCheckout) {
      console.log("Desktop OneCheckout mode enabled");
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
    isOneCheckout,
  };
}
