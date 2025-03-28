
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckoutFormValues } from './checkoutFormSchema';
import { useIsMobile } from '@/hooks/use-mobile';

interface InstallmentOption {
  value: string;
  label: string;
}

interface CardPaymentFormProps {
  register: UseFormRegister<CheckoutFormValues>;
  setValue: UseFormSetValue<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
  installmentOptions: InstallmentOption[];
}

export default function CardPaymentForm({ 
  register, 
  setValue, 
  errors,
  installmentOptions 
}: CardPaymentFormProps) {
  const isMobile = useIsMobile();
  
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
                {installmentOptions.map((option) => (
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
              {installmentOptions.map((option) => (
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
