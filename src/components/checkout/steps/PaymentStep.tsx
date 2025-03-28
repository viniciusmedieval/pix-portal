
import React from 'react';
import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { CheckoutFormValues } from '../forms/checkoutFormSchema';
import { useIsMobile } from '@/hooks/use-mobile';
import PaymentMethodSelector from '../PaymentMethodSelector';
import { ArrowRight } from 'lucide-react';

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
  paymentMethods?: string[];
  onPixPayment?: () => void;
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
  formHeaderTextColor = '#ffffff',
  paymentMethods = ['pix', 'cartao'],
  onPixPayment
}) => {
  const paymentMethod = watch('payment_method');
  const isMobile = useIsMobile();
  
  // Enhanced logging to trace component behavior
  console.log("PaymentStep rendering with:", { 
    paymentMethod, 
    paymentMethods,
    hasPixHandler: !!onPixPayment,
    isSubmitting
  });
  
  const handlePaymentMethodChange = (method: 'pix' | 'cartao') => {
    console.log("PaymentStep: changing payment method to", method);
    setValue('payment_method', method);
  };
  
  // Handle direct PIX payment
  const handlePixPayment = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("PaymentStep: PIX payment button clicked");
    
    if (onPixPayment) {
      console.log("PaymentStep: Calling PIX payment handler");
      // Set payment method to PIX first to ensure it's properly recorded
      setValue('payment_method', 'pix');
      // Call the handler
      setTimeout(() => {
        onPixPayment();
      }, 0);
    } else {
      console.log("PaymentStep: No PIX handler provided");
    }
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
        
        <PaymentMethodSelector
          availableMethods={paymentMethods}
          currentMethod={paymentMethod}
          onChange={handlePaymentMethodChange}
        />
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
              {...register('card_number', { required: paymentMethod === 'cartao' ? 'Número do cartão é obrigatório' : false })}
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
              {...register('card_name', { required: paymentMethod === 'cartao' ? 'Nome no cartão é obrigatório' : false })}
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
                {...register('card_expiry', { required: paymentMethod === 'cartao' ? 'Validade é obrigatória' : false })}
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
                {...register('card_cvv', { required: paymentMethod === 'cartao' ? 'CVV é obrigatório' : false })}
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
      {paymentMethod === 'pix' && onPixPayment ? (
        <Button
          type="button"
          className={`w-full ${isMobile ? 'py-3 text-sm' : 'py-6'} text-white flex items-center justify-center gap-2`}
          style={{ backgroundColor: buttonColor }}
          disabled={isSubmitting}
          onClick={handlePixPayment}
        >
          <span>{isSubmitting ? 'PROCESSANDO...' : 'GERAR PIX'}</span>
          {!isSubmitting && <ArrowRight className="h-5 w-5" />}
        </Button>
      ) : (
        <Button
          type="submit"
          form="checkout-form"
          className={`w-full ${isMobile ? 'py-3 text-sm' : 'py-6'} text-white flex items-center justify-center gap-2`}
          style={{ backgroundColor: buttonColor }}
          disabled={isSubmitting}
        >
          <span>
            {isSubmitting
              ? 'PROCESSANDO...'
              : paymentMethod === 'pix'
              ? 'GERAR PIX'
              : 'FINALIZAR PAGAMENTO'}
          </span>
          {!isSubmitting && <ArrowRight className="h-5 w-5" />}
        </Button>
      )}
    </div>
  );
};

export default PaymentStep;
