
import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckoutFormValues } from '../forms/checkoutFormSchema';

interface PaymentStepProps {
  register: UseFormRegister<CheckoutFormValues>;
  setValue: UseFormSetValue<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
  watch: UseFormWatch<CheckoutFormValues>;
  isSubmitting: boolean;
  installmentOptions: { value: string; label: string }[];
  buttonColor: string;
  formHeaderBgColor?: string;
  formHeaderTextColor?: string;
  formHeaderText?: string;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  register,
  setValue,
  errors,
  watch,
  isSubmitting,
  installmentOptions,
  buttonColor,
  formHeaderBgColor = '#dc2626',
  formHeaderTextColor = '#ffffff',
  formHeaderText = 'ESCOLHA A FORMA DE PAGAMENTO'
}) => {
  const paymentMethod = watch('payment_method');

  const handlePaymentMethodChange = (value: string) => {
    setValue('payment_method', value as 'pix' | 'cartao');
  };

  console.log('Rendering PaymentStep with header settings:', {
    formHeaderText,
    formHeaderBgColor,
    formHeaderTextColor
  });

  return (
    <div className="space-y-4">
      <div 
        className="p-3 text-center -mx-5 -mt-5 mb-4" 
        style={{ 
          backgroundColor: formHeaderBgColor, 
          color: formHeaderTextColor 
        }}
      >
        <h3 className="font-bold">{formHeaderText}</h3>
      </div>
      
      <div className="space-y-4">
        <RadioGroup
          defaultValue={paymentMethod}
          value={paymentMethod}
          onValueChange={handlePaymentMethodChange}
          className="grid grid-cols-2 gap-4"
        >
          <div className={`border rounded-md p-4 text-center hover:border-primary cursor-pointer ${paymentMethod === 'pix' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
            <RadioGroupItem value="pix" id="pix" className="sr-only" />
            <Label htmlFor="pix" className="cursor-pointer flex flex-col items-center justify-center gap-2">
              <img src="/pix-logo.png" alt="PIX" className="w-10 h-10" />
              <span>PIX</span>
            </Label>
          </div>
          
          <div className={`border rounded-md p-4 text-center hover:border-primary cursor-pointer ${paymentMethod === 'cartao' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
            <RadioGroupItem value="cartao" id="cartao" className="sr-only" />
            <Label htmlFor="cartao" className="cursor-pointer flex flex-col items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
              <span>Cartão de crédito</span>
            </Label>
          </div>
        </RadioGroup>
        
        {paymentMethod === 'cartao' && (
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="card_number">Número do cartão</Label>
              <Input 
                id="card_number" 
                {...register('card_number')} 
                placeholder="0000 0000 0000 0000" 
                className={errors.card_number ? 'border-red-500' : ''}
              />
              {errors.card_number && (
                <p className="text-xs text-red-500 mt-1">{errors.card_number.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="card_name">Nome no cartão</Label>
              <Input 
                id="card_name" 
                {...register('card_name')} 
                placeholder="Nome impresso no cartão" 
                className={errors.card_name ? 'border-red-500' : ''}
              />
              {errors.card_name && (
                <p className="text-xs text-red-500 mt-1">{errors.card_name.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="card_expiry">Validade</Label>
                <Input 
                  id="card_expiry" 
                  {...register('card_expiry')} 
                  placeholder="MM/AA" 
                  className={errors.card_expiry ? 'border-red-500' : ''}
                />
                {errors.card_expiry && (
                  <p className="text-xs text-red-500 mt-1">{errors.card_expiry.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="card_cvv">CVV</Label>
                <Input 
                  id="card_cvv" 
                  {...register('card_cvv')} 
                  placeholder="000" 
                  className={errors.card_cvv ? 'border-red-500' : ''}
                />
                {errors.card_cvv && (
                  <p className="text-xs text-red-500 mt-1">{errors.card_cvv.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="installments">Parcelas</Label>
              <Select 
                defaultValue="1x" 
                onValueChange={(value) => setValue('installments', value)}
              >
                <SelectTrigger id="installments">
                  <SelectValue placeholder="Selecione o número de parcelas" />
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
      </div>
      
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-6 text-lg font-semibold mt-6 text-white"
        style={{ backgroundColor: buttonColor }}
      >
        {isSubmitting 
          ? 'Processando...' 
          : paymentMethod === 'pix' 
            ? 'Gerar QR Code PIX' 
            : 'Finalizar pagamento'}
      </Button>
    </div>
  );
};

export default PaymentStep;
