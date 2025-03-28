
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckoutFormValues } from './checkoutFormSchema';

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
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="card_name" className="text-sm">Nome do titular</Label>
        <Input 
          id="card_name" 
          placeholder="Digite o nome do titular" 
          className="rounded-sm border-gray-300"
          {...register('card_name')} 
        />
        {errors.card_name && (
          <p className="text-xs text-red-500">{errors.card_name.message as string}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="card_number" className="text-sm">Número do cartão</Label>
        <Input 
          id="card_number" 
          placeholder="Digite o número do seu cartão" 
          className="rounded-sm border-gray-300"
          {...register('card_number')} 
        />
        {errors.card_number && (
          <p className="text-xs text-red-500">{errors.card_number.message as string}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-1 space-y-1">
          <Label htmlFor="card_expiry" className="text-sm">Vencimento</Label>
          <Input 
            id="card_expiry" 
            placeholder="MM/AA" 
            className="rounded-sm border-gray-300"
            {...register('card_expiry')} 
          />
          {errors.card_expiry && (
            <p className="text-xs text-red-500">{errors.card_expiry.message as string}</p>
          )}
        </div>
        <div className="col-span-1 space-y-1">
          <Label htmlFor="card_cvv" className="text-sm">CVV</Label>
          <Input 
            id="card_cvv" 
            placeholder="000" 
            className="rounded-sm border-gray-300"
            {...register('card_cvv')} 
          />
          {errors.card_cvv && (
            <p className="text-xs text-red-500">{errors.card_cvv.message as string}</p>
          )}
        </div>
        <div className="col-span-1 space-y-1">
          <Label htmlFor="installments" className="text-sm">Parcelamento</Label>
          <Select defaultValue="1x" onValueChange={(value) => setValue('installments', value)}>
            <SelectTrigger id="installments" className="rounded-sm border-gray-300 h-10">
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
    </div>
  );
}
