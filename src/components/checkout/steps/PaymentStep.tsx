
import React, { useState } from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CheckoutFormValues } from '../forms/checkoutFormSchema';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
  
  // Handle payment method change
  const handlePaymentMethodChange = (value: 'cartao' | 'pix') => {
    setValue('payment_method', value);
  };
  
  return (
    <div className="space-y-4">
      <div className="p-3 text-center -mx-5 -mt-5 mb-4" style={{ backgroundColor: formHeaderBgColor, color: formHeaderTextColor }}>
        <h3 className="font-bold">{formHeaderText}</h3>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Forma de Pagamento</h3>
        
        <RadioGroup 
          defaultValue="cartao"
          value={paymentMethod}
          onValueChange={(value) => handlePaymentMethodChange(value as 'cartao' | 'pix')}
          className="flex flex-col space-y-3"
        >
          <div className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-gray-50">
            <RadioGroupItem value="cartao" id="cartao" className="mr-2" />
            <Label htmlFor="cartao" className="flex-1 cursor-pointer">
              <div className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                <span>Cartão de crédito</span>
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-gray-50">
            <RadioGroupItem value="pix" id="pix" className="mr-2" />
            <Label htmlFor="pix" className="flex-1 cursor-pointer">
              <div className="flex items-center">
                <img src="/pix-logo.png" alt="PIX" className="mr-2 h-5 w-5" />
                <span>PIX</span>
              </div>
            </Label>
          </div>
        </RadioGroup>
        
        {paymentMethod === 'cartao' && (
          <Card className="mt-4 border border-gray-200">
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="card_name">Nome no cartão</Label>
                  <Input 
                    id="card_name" 
                    {...register('card_name')} 
                    placeholder="Nome como está no cartão" 
                    className={errors.card_name ? 'border-red-500' : ''}
                  />
                  {errors.card_name && (
                    <p className="text-xs text-red-500 mt-1">{errors.card_name.message}</p>
                  )}
                </div>
                
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
                      placeholder="123" 
                      className={errors.card_cvv ? 'border-red-500' : ''}
                    />
                    {errors.card_cvv && (
                      <p className="text-xs text-red-500 mt-1">{errors.card_cvv.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="installments">Parcelamento</Label>
                  <select
                    id="installments"
                    {...register('installments')}
                    className="w-full p-2 border rounded-md mt-1"
                  >
                    {installmentOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {paymentMethod === 'pix' && (
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center">
              <img src="/pix-logo.png" alt="PIX" className="w-8 h-8 mr-2" />
              <div>
                <p className="font-medium">Pague instantaneamente via PIX</p>
                <p className="text-sm text-gray-500">
                  Após confirmar, você receberá o QR Code e o código PIX para pagamento
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex flex-col space-y-3 pt-6">
        <Button
          type="submit"
          className="w-full py-6 text-lg font-semibold text-white"
          style={{ backgroundColor: buttonColor }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processando...' : 'Finalizar Compra'}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          className="flex items-center justify-center w-full"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para identificação
        </Button>
      </div>
    </div>
  );
};

export default PaymentStep;
