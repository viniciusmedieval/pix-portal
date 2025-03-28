
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckoutFormValues } from './checkoutFormSchema';

interface CustomerInfoFormProps {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
}

export default function CustomerInfoForm({ register, errors }: CustomerInfoFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input 
          id="name" 
          placeholder="Seu nome completo" 
          {...register('name')} 
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message as string}</p>
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
          <p className="text-xs text-red-500">{errors.email.message as string}</p>
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
          <p className="text-xs text-red-500">{errors.cpf.message as string}</p>
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
          <p className="text-xs text-red-500">{errors.telefone.message as string}</p>
        )}
      </div>
    </div>
  );
}
