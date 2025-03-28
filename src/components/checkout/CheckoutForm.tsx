
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
  
  // Available payment methods
  const availableMethods = customization?.payment_methods || ['pix', 'cartao'];

  return (
    <div className="w-full space-y-6">
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
        <div className="pt-4">
          <Button
            type="submit"
            form="checkout-form"
            className={`w-full py-6 text-lg ${buttonColor || 'bg-primary hover:bg-primary/90'}`}
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
