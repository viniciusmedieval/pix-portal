
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { PaymentInfoType } from '@/types/checkoutConfig';
import { savePaymentInfo } from '@/services/checkoutCustomizationService';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  cpf: z.string().min(11, { message: 'CPF inválido' }),
  telefone: z.string().optional(),
  payment_method: z.enum(['pix', 'cartao']),
  card_name: z.string().optional(),
  card_number: z.string().optional(),
  card_expiry: z.string().optional(),
  card_cvv: z.string().optional(),
  installments: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CheckoutFormProps {
  produto: {
    id: string;
    nome: string;
    preco: number;
    parcelas?: number;
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

export default function CheckoutForm({
  produto,
  onSubmit,
  onPixPayment,
  customization,
  config
}: CheckoutFormProps) {
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
        
        await savePaymentInfo(paymentInfo);
        
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
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input 
                id="name" 
                placeholder="Seu nome completo" 
                {...register('name')} 
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Seu e-mail" 
                {...register('email')} 
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF/CNPJ</Label>
              <Input 
                id="cpf" 
                placeholder="Digite seu CPF/CNPJ" 
                {...register('cpf')} 
              />
              {errors.cpf && (
                <p className="text-xs text-red-500">{errors.cpf.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Celular</Label>
              <Input 
                id="telefone" 
                placeholder="+55 (99) 99999-9999" 
                {...register('telefone')} 
              />
              {errors.telefone && (
                <p className="text-xs text-red-500">{errors.telefone.message}</p>
              )}
            </div>

            <input type="hidden" {...register('payment_method')} />

            {/* Payment method selector */}
            <div className="flex justify-between items-center mt-6 mb-4">
              <div className="space-x-4 flex">
                {availableMethods.includes('cartao') && (
                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange('cartao')}
                    className={`p-3 border rounded-md ${
                      currentPaymentMethod === 'cartao' ? 'border-primary' : 'border-gray-300'
                    }`}
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                  </button>
                )}
                {availableMethods.includes('pix') && (
                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange('pix')}
                    className={`p-3 border rounded-md ${
                      currentPaymentMethod === 'pix' ? 'border-primary' : 'border-gray-300'
                    }`}
                  >
                    <img src="/pix-logo.png" alt="PIX" className="w-6 h-6" />
                  </button>
                )}
              </div>
              <div className="text-sm font-medium">
                {currentPaymentMethod === 'cartao' ? 'Cartão de crédito' : 'PIX'}
              </div>
            </div>

            {/* Conditional card fields */}
            {currentPaymentMethod === 'cartao' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card_name">Nome do titular</Label>
                  <Input 
                    id="card_name" 
                    placeholder="Digite o nome do titular" 
                    {...register('card_name')} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="card_number">Número do cartão</Label>
                  <Input 
                    id="card_number" 
                    placeholder="Digite o número do seu cartão" 
                    {...register('card_number')} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="card_expiry">Vencimento</Label>
                    <Input 
                      id="card_expiry" 
                      placeholder="MM/AA" 
                      {...register('card_expiry')} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card_cvv">CVV</Label>
                    <Input 
                      id="card_cvv" 
                      placeholder="000" 
                      {...register('card_cvv')} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="installments">Parcelamento</Label>
                  <Select defaultValue="1x" onValueChange={(value) => setValue('installments', value)}>
                    <SelectTrigger id="installments">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {installmentOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
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
