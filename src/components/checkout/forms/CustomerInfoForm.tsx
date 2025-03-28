
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
      <div className="space-y-1">
        <Label htmlFor="name" className="text-sm">Nome completo</Label>
        <Input 
          id="name" 
          placeholder="Seu nome completo" 
          className="rounded-sm border-gray-300"
          {...register('name')} 
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message as string}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="email" className="text-sm">E-mail</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="Seu e-mail" 
          className="rounded-sm border-gray-300"
          {...register('email')} 
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message as string}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="cpf" className="text-sm">CPF/CNPJ</Label>
          <Input 
            id="cpf" 
            placeholder="Digite seu CPF/CNPJ" 
            className="rounded-sm border-gray-300"
            {...register('cpf')} 
          />
          {errors.cpf && (
            <p className="text-xs text-red-500">{errors.cpf.message as string}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="telefone" className="text-sm">Celular</Label>
          <div className="flex">
            <div className="flex items-center bg-gray-100 text-gray-500 px-2 rounded-l-sm border border-r-0 border-gray-300">
              <span className="text-xs">+55</span>
            </div>
            <Input 
              id="telefone" 
              placeholder="(99) 99999-9999" 
              className="rounded-l-none rounded-r-sm border-gray-300"
              {...register('telefone')} 
            />
          </div>
          {errors.telefone && (
            <p className="text-xs text-red-500">{errors.telefone.message as string}</p>
          )}
        </div>
      </div>
    </div>
  );
}
