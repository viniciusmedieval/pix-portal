
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InstallmentOption {
  value: string;
  label: string;
}

interface CardPaymentFormProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors<any>;
  installmentOptions: InstallmentOption[];
}

export default function CardPaymentForm({ 
  register, 
  setValue, 
  errors,
  installmentOptions 
}: CardPaymentFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="card_name">Nome do titular</Label>
        <Input 
          id="card_name" 
          placeholder="Digite o nome do titular" 
          {...register('card_name')} 
        />
        {errors.card_name && (
          <p className="text-xs text-red-500">{errors.card_name.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="card_number">Número do cartão</Label>
        <Input 
          id="card_number" 
          placeholder="Digite o número do seu cartão" 
          {...register('card_number')} 
        />
        {errors.card_number && (
          <p className="text-xs text-red-500">{errors.card_number.message as string}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="card_expiry">Vencimento</Label>
          <Input 
            id="card_expiry" 
            placeholder="MM/AA" 
            {...register('card_expiry')} 
          />
          {errors.card_expiry && (
            <p className="text-xs text-red-500">{errors.card_expiry.message as string}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="card_cvv">CVV</Label>
          <Input 
            id="card_cvv" 
            placeholder="000" 
            {...register('card_cvv')} 
          />
          {errors.card_cvv && (
            <p className="text-xs text-red-500">{errors.card_cvv.message as string}</p>
          )}
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
  );
}
