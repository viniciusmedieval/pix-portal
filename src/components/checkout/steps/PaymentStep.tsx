
import React from 'react';
import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { CheckoutFormValues } from '../forms/checkoutFormSchema';
import { useIsMobile } from '@/hooks/use-mobile';

interface PaymentStepProps {
  register: UseFormRegister<CheckoutFormValues>;
  watch: UseFormWatch<CheckoutFormValues>;
  setValue: UseFormSetValue<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
  isSubmitting: boolean;
  installmentOptions: { value: string; label: string }[];
  buttonColor?: string;
  formHeaderText?: string;
  formHeaderBgColor?: string;
  formHeaderTextColor?: string;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  register,
  watch,
  setValue,
  errors,
  isSubmitting,
  installmentOptions,
  buttonColor = '#22c55e',
  formHeaderText = 'ESCOLHA A FORMA DE PAGAMENTO',
  formHeaderBgColor = '#dc2626',
  formHeaderTextColor = '#ffffff'
}) => {
  const paymentMethod = watch('payment_method');
  const isMobile = useIsMobile();
  
  const handlePaymentMethodChange = (method: 'pix' | 'cartao') => {
    setValue('payment_method', method);
  };
  
  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div 
        className={`py-3 px-4 -mx-5 ${isMobile ? '-mt-3' : '-mt-6'} mb-6 text-center font-bold ${isMobile ? 'text-xs' : 'text-sm'}`}
        style={{ 
          backgroundColor: formHeaderBgColor,
          color: formHeaderTextColor
        }}
      >
        {formHeaderText}
      </div>
      
      {/* Payment Method Selection */}
      <div className="space-y-4">
        <p className={`font-medium ${isMobile ? 'text-sm' : ''}`}>Forma de Pagamento</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`border rounded-lg ${isMobile ? 'p-2 text-sm' : 'p-4'} text-center cursor-pointer transition-colors ${
              paymentMethod === 'cartao' ? 'border-primary bg-primary/10' : 'border-gray-200'
            }`}
            onClick={() => handlePaymentMethodChange('cartao')}
          >
            <span className="block font-medium">Cartão</span>
          </div>
          
          <div
            className={`border rounded-lg ${isMobile ? 'p-2 text-sm' : 'p-4'} text-center cursor-pointer transition-colors ${
              paymentMethod === 'pix' ? 'border-primary bg-primary/10' : 'border-gray-200'
            }`}
            onClick={() => handlePaymentMethodChange('pix')}
          >
            <span className="block font-medium">PIX</span>
          </div>
        </div>
      </div>
      
      {/* Card Payment Fields (Conditional) */}
      {paymentMethod === 'cartao' && (
        <div className="space-y-4">
          {/* Card Number */}
          <div className="space-y-2">
            <label htmlFor="card_number" className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
              Número do Cartão *
            </label>
            <input
              id="card_number"
              {...register('card_number', { required: 'Número do cartão é obrigatório' })}
              className={`w-full ${isMobile ? 'p-1.5 text-sm' : 'p-2'} border rounded focus:outline-none focus:ring-2 focus:ring-primary`}
              placeholder="0000 0000 0000 0000"
            />
            {errors.card_number && (
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-red-500`}>{errors.card_number.message}</p>
            )}
          </div>
          
          {/* Card Holder Name */}
          <div className="space-y-2">
            <label htmlFor="card_name" className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
              Nome no Cartão *
            </label>
            <input
              id="card_name"
              {...register('card_name', { required: 'Nome no cartão é obrigatório' })}
              className={`w-full ${isMobile ? 'p-1.5 text-sm' : 'p-2'} border rounded focus:outline-none focus:ring-2 focus:ring-primary`}
              placeholder="Nome como está no cartão"
            />
            {errors.card_name && (
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-red-500`}>{errors.card_name.message}</p>
            )}
          </div>
          
          {/* Expiry & CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="card_expiry" className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
                Validade *
              </label>
              <input
                id="card_expiry"
                {...register('card_expiry', { required: 'Validade é obrigatória' })}
                className={`w-full ${isMobile ? 'p-1.5 text-sm' : 'p-2'} border rounded focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="MM/AA"
              />
              {errors.card_expiry && (
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-red-500`}>{errors.card_expiry.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="card_cvv" className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
                CVV *
              </label>
              <input
                id="card_cvv"
                {...register('card_cvv', { required: 'CVV é obrigatório' })}
                className={`w-full ${isMobile ? 'p-1.5 text-sm' : 'p-2'} border rounded focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="123"
              />
              {errors.card_cvv && (
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-red-500`}>{errors.card_cvv.message}</p>
              )}
            </div>
          </div>
          
          {/* Installments */}
          {installmentOptions.length > 1 && (
            <div className="space-y-2">
              <label htmlFor="installments" className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
                Parcelas
              </label>
              <select
                id="installments"
                {...register('installments')}
                className={`w-full ${isMobile ? 'p-1.5 text-sm' : 'p-2'} border rounded focus:outline-none focus:ring-2 focus:ring-primary`}
              >
                {installmentOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
      
      {/* Submit Button */}
      <Button
        type="submit"
        className={`w-full ${isMobile ? 'py-3 text-sm' : 'py-6'} text-white`}
        style={{ backgroundColor: buttonColor }}
        disabled={isSubmitting}
      >
        {isSubmitting
          ? 'PROCESSANDO...'
          : paymentMethod === 'pix'
          ? 'GERAR PIX'
          : 'FINALIZAR PAGAMENTO'}
      </Button>
    </div>
  );
};

export default PaymentStep;
