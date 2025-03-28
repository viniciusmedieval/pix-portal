
import { z } from 'zod';
import { CheckoutFormValues } from './forms/checkoutFormSchema';
import { Card, CardContent } from '@/components/ui/card';
import CustomerInfoForm from './forms/CustomerInfoForm';
import PaymentMethodSelector from './PaymentMethodSelector';
import CardPaymentForm from './forms/CardPaymentForm';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from './forms/checkoutFormSchema';
import CheckoutFormLayout from './ui/CheckoutFormLayout';
import PaymentButton from './ui/PaymentButton';

interface CheckoutFormProps {
  produto: {
    id: string;
    nome: string;
    preco: number;
    parcelas?: number;
    imagem_url?: string | null;
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

  const currentPaymentMethod = watch('payment_method');
  
  const handlePaymentMethodChange = (method: 'pix' | 'cartao') => {
    setPaymentMethod(method);
    setValue('payment_method', method);
  };

  const handlePixButtonClick = () => {
    handlePaymentMethodChange('pix');
    if (onPixPayment) {
      onPixPayment();
    }
  };

  const processSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        onSubmit(data);
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
    } finally {
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
  const buttonColor = config?.cor_botao ? `bg-[${config.cor_botao}] hover:bg-[${config.cor_botao}]/90` : '';
  
  // Form header styling
  const formHeaderText = config?.form_header_text || 'PREENCHA SEUS DADOS ABAIXO';
  const formHeaderBgColor = config?.form_header_bg_color || '#dc2626';
  const formHeaderTextColor = config?.form_header_text_color || '#ffffff';
  
  // Available payment methods
  const availableMethods = customization?.payment_methods || ['pix', 'cartao'];

  return (
    <CheckoutFormLayout
      headerText={formHeaderText}
      headerBgColor={formHeaderBgColor}
      headerTextColor={formHeaderTextColor}
    >
      <form id="checkout-form" onSubmit={handleSubmit(processSubmit)} className="space-y-6">
        {/* Etapa 2: Informações do Cliente */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Informações Pessoais</h3>
            <CustomerInfoForm register={register} errors={errors} />
          </CardContent>
        </Card>

        <input type="hidden" {...register('payment_method')} />

        {/* Etapa 3: Seleção do método de pagamento */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Forma de Pagamento</h3>
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
                />
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Etapa 4: Botão de confirmação */}
        <PaymentButton 
          isSubmitting={isSubmitting}
          buttonText={buttonText}
          buttonColor={buttonColor}
          isCartao={currentPaymentMethod === 'cartao'}
          onPixClick={availableMethods.includes('pix') ? handlePixButtonClick : undefined}
        />
      </form>
    </CheckoutFormLayout>
  );
}
