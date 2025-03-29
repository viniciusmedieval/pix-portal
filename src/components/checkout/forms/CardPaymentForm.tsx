
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckoutFormValues } from './checkoutFormSchema';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect } from 'react';

interface InstallmentOption {
  value: string;
  label: string;
}

interface CardPaymentFormProps {
  register: UseFormRegister<CheckoutFormValues>;
  setValue: UseFormSetValue<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
  installmentOptions: InstallmentOption[];
  watch?: UseFormWatch<CheckoutFormValues>;
}

export default function CardPaymentForm({ 
  register, 
  setValue, 
  errors,
  installmentOptions,
  watch 
}: CardPaymentFormProps) {
  const isMobile = useIsMobile();
  
  // If watch function is provided, use it to format the expiry date
  const cardExpiry = watch ? watch('card_expiry') : undefined;
  
  useEffect(() => {
    if (cardExpiry && watch) {
      // Remove any non-digits
      let cleaned = cardExpiry.replace(/\D/g, "");
      
      // Format as MM/YY
      if (cleaned.length > 0) {
        // Handle single digit month (prepend 0 if it's clearly a month between 1-9)
        if (cleaned.length === 1 && parseInt(cleaned, 10) > 0) {
          if (parseInt(cleaned, 10) > 1) {
            cleaned = "0" + cleaned;
          }
        } else if (cleaned.length >= 2) {
          // Check if first two digits are a valid month
          const month = parseInt(cleaned.substring(0, 2), 10);
          if (month > 12) {
            // If month > 12, assume user meant to type "01"
            cleaned = "0" + cleaned.charAt(0) + cleaned.substring(1);
          }
        }
        
        // Add the slash after the month
        if (cleaned.length > 2) {
          cleaned = cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
        } else if (cleaned.length === 2) {
          cleaned = cleaned + "/";
        }
      }
      
      // Only update if the format actually changed to prevent cursor jumping
      if (cleaned !== cardExpiry) {
        setValue('card_expiry', cleaned);
      }
    }
  }, [cardExpiry, setValue]);
  
  return (
    <div className={`space-y-${isMobile ? '4' : '5'}`}>
      <div className="space-y-2">
        <Label htmlFor="card_name" className={`${isMobile ? "text-sm" : "text-sm font-medium"}`}>Nome do titular</Label>
        <Input 
          id="card_name" 
          placeholder="Digite o nome do titular" 
          className={`rounded-md border-gray-300 focus:border-blue-400 focus:ring-blue-400 ${isMobile ? "h-10 text-sm" : ""}`}
          {...register('card_name')} 
        />
        {errors.card_name && (
          <p className="text-xs text-red-500">{errors.card_name.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="card_number" className={`${isMobile ? "text-sm" : "text-sm font-medium"}`}>Número do cartão</Label>
        <Input 
          id="card_number" 
          placeholder="Digite o número do seu cartão" 
          className={`rounded-md border-gray-300 focus:border-blue-400 focus:ring-blue-400 ${isMobile ? "h-10 text-sm" : ""}`}
          {...register('card_number')} 
        />
        {errors.card_number && (
          <p className="text-xs text-red-500">{errors.card_number.message as string}</p>
        )}
      </div>

      <div className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-3"} gap-3`}>
        <div className="space-y-2">
          <Label htmlFor="card_expiry" className={`${isMobile ? "text-sm" : "text-sm font-medium"}`}>Vencimento</Label>
          <Input 
            id="card_expiry" 
            placeholder="MM/AA" 
            className={`rounded-md border-gray-300 focus:border-blue-400 focus:ring-blue-400 ${isMobile ? "h-10 text-sm" : ""}`}
            {...register('card_expiry')} 
          />
          {errors.card_expiry && (
            <p className="text-xs text-red-500">{errors.card_expiry.message as string}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="card_cvv" className={`${isMobile ? "text-sm" : "text-sm font-medium"}`}>CVV</Label>
          <Input 
            id="card_cvv" 
            placeholder="000" 
            className={`rounded-md border-gray-300 focus:border-blue-400 focus:ring-blue-400 ${isMobile ? "h-10 text-sm" : ""}`}
            {...register('card_cvv')} 
          />
          {errors.card_cvv && (
            <p className="text-xs text-red-500">{errors.card_cvv.message as string}</p>
          )}
        </div>
        {!isMobile && (
          <div className="space-y-2">
            <Label htmlFor="installments" className="text-sm font-medium">Parcelamento</Label>
            <Select defaultValue="1x" onValueChange={(value) => setValue('installments', value)}>
              <SelectTrigger id="installments" className="rounded-md border-gray-300 h-10">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {installmentOptions.slice(0, 3).map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      {isMobile && (
        <div className="space-y-2">
          <Label htmlFor="installments" className="text-sm">Parcelamento</Label>
          <Select defaultValue="1x" onValueChange={(value) => setValue('installments', value)}>
            <SelectTrigger id="installments" className="rounded-md border-gray-300 h-10 text-sm">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {installmentOptions.slice(0, 3).map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
