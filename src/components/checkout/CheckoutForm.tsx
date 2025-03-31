import { z } from 'zod';
import { CheckoutFormValues } from './forms/checkoutFormSchema';
import { Card, CardContent } from '@/components/ui/card';
import CustomerInfoForm from './forms/CustomerInfoForm';
import PaymentMethodSelector from './PaymentMethodSelector';
import CardPaymentForm from './forms/CardPaymentForm';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from './forms/checkoutFormSchema';
import CheckoutFormLayout from './ui/CheckoutFormLayout';
import PaymentButton from './ui/PaymentButton';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from "sonner";
import { getAsaasSettings } from '@/services/asaasService';
import AsaasCheckout from './AsaasCheckout';

interface CheckoutFormProps {
  produto: {
    id: string;
    nome: string;
    preco: number;
    parcelas?: number;
    imagem_url?: string | null;
    slug?: string;
  };
  onSubmit?: (data: CheckoutFormValues) => void;
  onPixPayment?: () => void;
  customization?: {
    payment_methods?: string[];
    payment_info_title?: string;
    cta_text?: string;
  };
  config?: {
    cor_botao?: string;
    texto_botao?: string;
    form_header_text?: string;
    form_header_bg_color?: string;
    form_header_text_color?: string;
  };
}

export default function CheckoutForm({
  produto,
  onSubmit,
  onPixPayment,
  customization,
  config
}: CheckoutFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao'>('cartao');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useAsaas, setUseAsaas] = useState(false);
  const [asaasLoading, setAsaasLoading] = useState(true);
  const isMobile = useIsMobile();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payment_method: 'cartao',
      installments: '1x',
    },
  });

  // Check if we should use Asaas for payments
  useEffect(() => {
    async function checkAsaasIntegration() {
      try {
        setAsaasLoading(true);
        const settings = await getAsaasSettings();
        setUseAsaas(settings?.integration_enabled || false);
      } catch (error) {
        console.error('Error checking Asaas integration:', error);
        setUseAsaas(false);
      } finally {
        setAsaasLoading(false);
      }
    }
    
    checkAsaasIntegration();
  }, []);

  // Handle Asaas payment success
  const handlePaymentSuccess = (paymentId: string, method: string) => {
    console.log(`Payment successful with ${method}. ID: ${paymentId}`);
    
    // Redirect to success page
    window.location.href = `/sucesso?produto=${produto.id}&payment=${paymentId}`;
  };

  // If using Asaas and not loading anymore, show the Asaas checkout instead
  if (useAsaas && !asaasLoading) {
    return (
      <CheckoutFormLayout
        headerText={config?.form_header_text || 'PREENCHA SEUS DADOS ABAIXO'}
        headerBgColor={config?.form_header_bg_color || '#dc2626'}
        headerTextColor={config?.form_header_text_color || '#ffffff'}
      >
        <AsaasCheckout 
          produto={produto}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </CheckoutFormLayout>
    );
  }

  // If still checking Asaas integration or not using it, continue with regular checkout
  const currentPaymentMethod = watch('payment_method');
  
  useEffect(() => {
    console.log("Payment method changed in CheckoutForm:", currentPaymentMethod);
  }, [currentPaymentMethod]);
  
  const handlePaymentMethodChange = (method: 'pix' | 'cartao') => {
    console.log("Payment method changed to:", method);
    setPaymentMethod(method);
    setValue('payment_method', method);
  };

  const handlePixButtonClick = () => {
    console.log("PIX button clicked in CheckoutForm");
    
    // First update the internal state
    handlePaymentMethodChange('pix');
    
    if (onPixPayment) {
      // Prevent multiple submissions
      if (isSubmitting) {
        console.log("Submission already in progress, ignoring PIX click");
        return;
      }
      
      setIsSubmitting(true);
      console.log("Has PIX payment handler, calling directly");
      
      try {
        onPixPayment();
      } catch (error) {
        console.error("Error handling PIX payment:", error);
        toast.error("Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.");
        setIsSubmitting(false);
      }
    } else {
      console.log("No PIX payment handler, submitting form");
      // Manual form submission as a fallback
      handleSubmit(processSubmit)();
    }
  };

  const processSubmit = async (data: CheckoutFormValues) => {
    console.log("Form submitted with payment method:", data.payment_method);
    console.log("Form data:", data);
    
    if (isSubmitting) {
      console.log("Submission already in progress, ignoring");
      return;
    }
    
    setIsSubmitting(true);
    console.log("Setting isSubmitting to true in processSubmit");
    
    try {
      // If PIX is selected and we have a PIX handler, call it directly
      if (data.payment_method === 'pix' && onPixPayment) {
        console.log("Calling PIX payment handler from form submission");
        onPixPayment();
        return;
      }
      
      // Otherwise proceed with standard submission
      if (onSubmit) {
        console.log("Calling standard onSubmit handler with data:", data);
        onSubmit(data);
      } else {
        console.log("No submit handler provided");
        toast.info("Nenhum manipulador de envio fornecido para processar este formulário.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      toast.error("Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.");
      setIsSubmitting(false);
    }
  };

  // Generate installment options based on product settings
  const maxInstallments = produto.parcelas || 1;
  const installmentOptions = Array.from({ length: maxInstallments }, (_, i) => i + 1).map(
    (num) => ({
      value: `${num}x`,
      label: `${num}x de R$ ${(produto.preco / num).toFixed(2).replace('.', ',')}${num > 1 ? ' sem juros' : ''}`,
    })
  );

  // Custom styling based on configuration
  const buttonText = config?.texto_botao || customization?.cta_text || 'Finalizar compra';
  const buttonColor = config?.cor_botao || '';
  
  // Form header styling
  const formHeaderText = config?.form_header_text || 'PREENCHA SEUS DADOS ABAIXO';
  const formHeaderBgColor = config?.form_header_bg_color || '#dc2626';
  const formHeaderTextColor = config?.form_header_text_color || '#ffffff';
  
  // Available payment methods
  const availableMethods = customization?.payment_methods || ['pix', 'cartao'];
  
  console.log("CheckoutForm render state:", { 
    currentPaymentMethod, 
    availableMethods,
    hasPixHandler: !!onPixPayment,
    isSubmitting,
    buttonText
  });

  return (
    <CheckoutFormLayout
      headerText={formHeaderText}
      headerBgColor={formHeaderBgColor}
      headerTextColor={formHeaderTextColor}
    >
      {asaasLoading ? (
        <div className="p-6 text-center">
          <p>Carregando opções de pagamento...</p>
        </div>
      ) : (
        <form 
          id="checkout-form" 
          onSubmit={handleSubmit(processSubmit, errors => {
            console.log("Form validation errors:", errors);
            if (Object.keys(errors).length > 0) {
              toast.error("Por favor, preencha todos os campos obrigatórios corretamente.");
            }
          })}
          className="space-y-6"
        >
          {/* Etapa 2: Informações do Cliente */}
          <Card>
            <CardContent className={isMobile ? "pt-4 px-3" : "pt-6"}>
              <h3 className={`${isMobile ? "text-base" : "text-lg"} font-semibold mb-4`}>Informações Pessoais</h3>
              <CustomerInfoForm register={register} errors={errors} />
            </CardContent>
          </Card>

          <input type="hidden" {...register('payment_method')} />

          {/* Etapa 3: Seleção do método de pagamento */}
          <Card>
            <CardContent className={isMobile ? "pt-4 px-3" : "pt-6"}>
              <h3 className={`${isMobile ? "text-base" : "text-lg"} font-semibold mb-4`}>Forma de Pagamento</h3>
              <PaymentMethodSelector 
                availableMethods={availableMethods}
                currentMethod={currentPaymentMethod}
                onChange={handlePaymentMethodChange}
              />
              
              {/* Campos condicionais do cartão */}
              {currentPaymentMethod === 'cartao' && (
                <div className="mt-4">
                  <CardPaymentForm 
                    register={register}
                    setValue={setValue}
                    errors={errors}
                    installmentOptions={installmentOptions}
                    watch={watch}
                  />
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Etapa 4: Botão de confirmação */}
          <PaymentButton 
            isSubmitting={isSubmitting}
            buttonText={currentPaymentMethod === 'pix' ? 'Gerar PIX' : buttonText}
            buttonColor={buttonColor}
            isCartao={currentPaymentMethod === 'cartao'}
            onPixClick={availableMethods.includes('pix') ? handlePixButtonClick : undefined}
          />
        </form>
      )}
    </CheckoutFormLayout>
  );
}
