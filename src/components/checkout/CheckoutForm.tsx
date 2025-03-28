
import { z } from 'zod';
import { CheckoutFormValues } from './forms/checkoutFormSchema';
import { Card, CardContent } from '@/components/ui/card';
import CustomerInfoForm from './forms/CustomerInfoForm';
import PaymentMethodSelector from './PaymentMethodSelector';
import CardPaymentForm from './forms/CardPaymentForm';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from './forms/checkoutFormSchema';
import { useParams } from 'react-router-dom';

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
  customization?: any;
  config?: any;
  showIdentificationSection?: boolean;
  showPaymentSection?: boolean;
}

export default function CheckoutForm({
  produto,
  onSubmit,
  onPixPayment,
  customization,
  config,
  showIdentificationSection = true,
  showPaymentSection = true
}: CheckoutFormProps) {
  const { slug } = useParams<{ slug: string }>();
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

  // Custom styling based on configuration - unified approach
  const buttonText = config?.texto_botao || customization?.cta_text || 'Finalizar compra';
  const buttonColor = config?.cor_botao || '';
  const buttonColorClass = buttonColor ? `bg-[${buttonColor}] hover:bg-[${buttonColor}]/90` : '';
  
  // Available payment methods
  const availableMethods = customization?.payment_methods || ['pix', 'cartao'];

  return (
    <div className="w-full space-y-6">
      <form id="checkout-form" onSubmit={handleSubmit(processSubmit)} className="space-y-6">
        {/* Etapa 2: Informações do Cliente */}
        {showIdentificationSection && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Informações Pessoais</h3>
              <CustomerInfoForm register={register} errors={errors} />
            </CardContent>
          </Card>
        )}

        <input type="hidden" {...register('payment_method')} />

        {/* Etapa 3: Seleção do método de pagamento */}
        {showPaymentSection && (
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
        )}
        
        {/* Etapa 4: Botão de confirmação */}
        <div className="pt-4">
          <Button
            type="submit"
            form="checkout-form"
            className={`w-full py-6 text-lg ${buttonColorClass || 'bg-primary hover:bg-primary/90'}`}
            style={buttonColor ? { backgroundColor: buttonColor } : {}}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processando...' : buttonText}
          </Button>
          
          {availableMethods.includes('pix') && currentPaymentMethod === 'cartao' && (
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-500">ou</span>
              <Button
                variant="outline"
                onClick={handlePixButtonClick}
                className="w-full mt-2"
                disabled={isSubmitting}
              >
                <img src="/pix-logo.png" alt="PIX" className="w-4 h-4 mr-2" />
                Pagar com PIX
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
