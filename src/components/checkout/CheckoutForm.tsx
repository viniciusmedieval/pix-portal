
import { z } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CustomerInfoForm from './forms/CustomerInfoForm';
import PaymentMethodSelector from './PaymentMethodSelector';
import CardPaymentForm from './forms/CardPaymentForm';

// Define the form schema
const formSchema = z.object({
  name: z.string().min(3, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  cpf: z.string().min(11, "CPF/CNPJ inválido"),
  telefone: z.string().optional(),
  payment_method: z.enum(['pix', 'cartao']),
  card_name: z.string().optional(),
  card_number: z.string().optional(),
  card_expiry: z.string().optional(),
  card_cvv: z.string().optional(),
  installments: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof formSchema>;

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
  config?: any;
  showIdentificationSection?: boolean;
  showPaymentSection?: boolean;
}

export default function CheckoutForm({
  produto,
  onSubmit,
  onPixPayment,
  config,
  showIdentificationSection = true,
  showPaymentSection = true
}: CheckoutFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Available payment methods from config
  const availableMethods = config?.payment_methods || ['pix', 'cartao'];

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
    setValue('payment_method', method);
    
    if (method === 'pix' && onPixPayment) {
      onPixPayment();
    }
  };

  const processSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        onSubmit(data);
      }
      
      // If payment method is PIX and there's a PIX handler, call it
      if (data.payment_method === 'pix' && onPixPayment) {
        onPixPayment();
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
  const buttonColor = config?.cor_botao || '';
  const buttonText = config?.texto_botao || 'Finalizar compra';
  const buttonStyle = buttonColor ? { backgroundColor: buttonColor } : {};

  return (
    <div className="w-full space-y-6">
      <form id="checkout-form" onSubmit={handleSubmit(processSubmit)} className="space-y-6">
        <input type="hidden" {...register('payment_method')} />

        {/* Identification Section */}
        {showIdentificationSection && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Informações Pessoais</h3>
              <CustomerInfoForm register={register} errors={errors} />
            </CardContent>
          </Card>
        )}

        {/* Payment Method Section */}
        {showPaymentSection && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Forma de Pagamento</h3>
              
              <PaymentMethodSelector 
                availableMethods={availableMethods}
                currentMethod={currentPaymentMethod}
                onChange={handlePaymentMethodChange}
              />
              
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
              
              {/* Only show the button in the payment section */}
              {showPaymentSection && (
                <div className="mt-6">
                  <Button
                    type="submit"
                    className="w-full py-6 text-lg"
                    style={buttonStyle}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processando...' : buttonText}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
};
