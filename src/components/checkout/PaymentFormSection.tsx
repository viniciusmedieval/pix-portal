
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import CustomerInfoForm from './forms/CustomerInfoForm';
import CardPaymentForm from './forms/CardPaymentForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, CheckoutFormValues } from './forms/checkoutFormSchema';

interface PaymentFormSectionProps {
  produto: {
    id: string;
    nome: string;
    preco: number;
    parcelas?: number;
    imagem_url?: string | null;
  };
  customization?: any;
  config?: any;
}

const PaymentFormSection: React.FC<PaymentFormSectionProps> = ({
  produto,
  customization,
  config
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao'>('cartao');

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

  const handleFormSubmit = async (formData: CheckoutFormValues) => {
    setIsLoading(true);
    
    try {
      console.log('Processing payment with form data:', formData);
      
      // Mock successful payment
      toast({
        title: "Pagamento processado",
        description: "Seu pagamento foi processado com sucesso!",
      });
      
      // Redirect to success page
      navigate(`/sucesso?produto=${produto.id}`);
      
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        variant: 'destructive',
        title: "Erro no processamento",
        description: "Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle PIX payment option
  const handlePixPayment = () => {
    navigate(`/checkout/${produto.id}/pix`);
  };

  // Generate installment options based on product settings
  const maxInstallments = produto.parcelas || 1;
  const installmentOptions = Array.from({ length: maxInstallments }, (_, i) => i + 1).map(
    (num) => ({
      value: `${num}x`,
      label: `${num}x de R$ ${(produto.preco / num).toFixed(2).replace('.', ',')}${num > 1 ? ' sem juros' : ''}`,
    })
  );

  return (
    <div className="space-y-6">
      {/* Customer Information Section */}
      <div>
        <h2 className="text-base font-medium mb-4 flex items-center">
          <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-500 text-white rounded-full text-xs mr-2">1</span>
          Identificação
        </h2>
        <CustomerInfoForm register={register} errors={errors} />
      </div>
      
      {/* Testimonials placeholder - actual testimonials rendered in CheckoutContent */}
      
      {/* Payment Section */}
      <div>
        <h2 className="text-base font-medium mb-4 flex items-center">
          <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-500 text-white rounded-full text-xs mr-2">2</span>
          Pagamento
        </h2>
        
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            className={`flex items-center justify-center border rounded-sm p-2 w-1/2 ${paymentMethod === 'cartao' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
            onClick={() => setPaymentMethod('cartao')}
          >
            <img src="/placeholder.svg" alt="Cartão" className="h-5 w-5 mr-2" />
            <span>Cartão de crédito</span>
          </button>
          
          <button
            type="button"
            className={`flex items-center justify-center border rounded-sm p-2 w-1/2 ${paymentMethod === 'pix' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
            onClick={() => {
              setPaymentMethod('pix');
              handlePixPayment();
            }}
          >
            <img src="/pix-logo.png" alt="PIX" className="h-5 w-5 mr-2" />
            <span>PIX</span>
          </button>
        </div>
        
        {paymentMethod === 'cartao' && (
          <CardPaymentForm 
            register={register}
            setValue={setValue}
            errors={errors}
            installmentOptions={installmentOptions}
          />
        )}
      </div>
      
      {/* Hidden form to handle submission */}
      <form id="checkout-form" onSubmit={handleSubmit(handleFormSubmit)} className="hidden">
        <input type="hidden" {...register('payment_method')} value={paymentMethod} />
      </form>
    </div>
  );
};

export default PaymentFormSection;
