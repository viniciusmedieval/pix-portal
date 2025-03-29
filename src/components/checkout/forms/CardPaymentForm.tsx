
import { useState, useEffect } from 'react';
import { UseFormRegister, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { CheckoutFormValues, formatExpiryDate } from './checkoutFormSchema';
import { useIsMobile } from '@/hooks/use-mobile';

interface CardPaymentFormProps {
  register: UseFormRegister<CheckoutFormValues>;
  setValue: UseFormSetValue<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
  installmentOptions: { value: string; label: string }[];
  watch?: any;
}

const CardPaymentForm = ({
  register,
  setValue,
  errors,
  installmentOptions,
  watch
}: CardPaymentFormProps) => {
  const isMobile = useIsMobile();
  const [expiryInput, setExpiryInput] = useState('');
  
  // Limit installment options to first 12 or less
  const limitedInstallmentOptions = installmentOptions.slice(0, 12);
  
  // Format credit card number with spaces
  const formatCardNumber = (value: string) => {
    if (!value) return '';
    
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    
    // Add space after every 4 digits
    let formattedValue = '';
    for (let i = 0; i < digitsOnly.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += digitsOnly[i];
    }
    
    return formattedValue;
  };
  
  // Handle expiry date input
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Remove any non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    
    // Format as MM/YY
    const formattedValue = formatExpiryDate(digitsOnly);
    
    setExpiryInput(formattedValue);
    setValue('card_expiry', formattedValue);
  };
  
  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-2">
        <label htmlFor="card_number" className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
          Número do Cartão *
        </label>
        <input
          id="card_number"
          type="text"
          inputMode="numeric"
          {...register('card_number')}
          className={`w-full ${isMobile ? 'p-1.5 text-sm' : 'p-2'} border rounded focus:outline-none focus:ring-2 focus:ring-primary`}
          placeholder="0000 0000 0000 0000"
          onChange={(e) => {
            const formattedValue = formatCardNumber(e.target.value);
            e.target.value = formattedValue;
          }}
          maxLength={19}
        />
        {errors.card_number && (
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-red-500`}>{errors.card_number.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="card_name" className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
          Nome no Cartão *
        </label>
        <input
          id="card_name"
          {...register('card_name')}
          className={`w-full ${isMobile ? 'p-1.5 text-sm' : 'p-2'} border rounded focus:outline-none focus:ring-2 focus:ring-primary`}
          placeholder="Nome como está no cartão"
        />
        {errors.card_name && (
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-red-500`}>{errors.card_name.message}</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="card_expiry" className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
            Validade *
          </label>
          <input
            id="card_expiry"
            type="text"
            inputMode="numeric"
            value={expiryInput}
            onChange={handleExpiryChange}
            className={`w-full ${isMobile ? 'p-1.5 text-sm' : 'p-2'} border rounded focus:outline-none focus:ring-2 focus:ring-primary`}
            placeholder="MM/AA"
            maxLength={5}
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
            type="text"
            inputMode="numeric"
            {...register('card_cvv')}
            className={`w-full ${isMobile ? 'p-1.5 text-sm' : 'p-2'} border rounded focus:outline-none focus:ring-2 focus:ring-primary`}
            placeholder="123"
            maxLength={4}
            onChange={(e) => {
              // Only allow digits
              e.target.value = e.target.value.replace(/\D/g, '');
            }}
          />
          {errors.card_cvv && (
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-red-500`}>{errors.card_cvv.message}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="installments" className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
          Parcelas
        </label>
        <select
          id="installments"
          {...register('installments')}
          className={`w-full ${isMobile ? 'p-1.5 text-sm' : 'p-2'} border rounded focus:outline-none focus:ring-2 focus:ring-primary`}
        >
          {limitedInstallmentOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CardPaymentForm;
