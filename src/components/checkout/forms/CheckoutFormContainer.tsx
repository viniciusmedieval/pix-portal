
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { PaymentInfoType } from '@/types/checkoutConfig';
import CustomerInfoForm from './CustomerInfoForm';
import CardPaymentForm from './CardPaymentForm';
import PaymentMethodSelector from '../PaymentMethodSelector';
import { formSchema } from './checkoutFormSchema';

type FormValues = z.infer<typeof formSchema>;

interface CheckoutFormContainerProps {
  produto: {
    id: string;
    nome: string;
    preco: number;
    parcelas?: number;
    imagem_url?: string | null;
  };
  onSubmit?: (data: FormValues) => void;
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

export default function CheckoutFormContainer({
  produto,
  onSubmit,
  onPixPayment,
  customization,
  config
}: CheckoutFormContainerProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao'>('cartao');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
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

  const processSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Call external submit handler if provided
      if (onSubmit) {
        onSubmit(data);
        return;
      }
      
      // Handle payment information
      if (data.payment_method === 'cartao') {
        const paymentInfo: Partial<PaymentInfoType> = {
          nome_cartao: data.card_name,
          numero_cartao: data.card_number,
          validade: data.card_expiry,
          cvv: data.card_cvv,
          parcelas: parseInt(data.installments?.split('x')[0] || '1'),
          metodo_pagamento: 'cartao',
        };
        
        // Navigate to success page or handle card payment
        navigate(`/sucesso?produto=${produto.id}`);
      } else {
        // Navigate to PIX page
        navigate(`/checkout/${produto.id}/pix`);
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao processar pagamento',
        description: 'Ocorreu um erro ao processar seu pagamento. Tente novamente.',
      });
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
  const paymentTitle = customization?.payment_info_title || 'Pagamento';
  
  // Available payment methods
  const availableMethods = customization?.payment_methods || ['pix', 'cartao'];

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>{paymentTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="checkout-form" onSubmit={handleSubmit(processSubmit)} className="space-y-4">
            <CustomerInfoForm register={register} errors={errors} />

            <input type="hidden" {...register('payment_method')} />

            {/* Payment method selector */}
            <PaymentMethodSelector 
              availableMethods={availableMethods}
              currentMethod={currentPaymentMethod}
              onChange={handlePaymentMethodChange}
            />

            {/* Conditional card fields */}
            {currentPaymentMethod === 'cartao' && (
              <CardPaymentForm 
                register={register}
                setValue={setValue}
                errors={errors}
                installmentOptions={installmentOptions}
              />
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button
            type="submit"
            form="checkout-form"
            className={`w-full ${buttonColor || 'bg-primary hover:bg-primary/90'}`}
            disabled={isSubmitting}
          >
            {buttonText}
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
        </CardFooter>
      </Card>
    </div>
  );
}
