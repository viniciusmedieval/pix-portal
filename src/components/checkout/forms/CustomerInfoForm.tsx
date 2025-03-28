
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckoutFormValues } from './checkoutFormSchema';
import { Flag } from 'lucide-react';

interface CustomerInfoFormProps {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
  config?: {
    show_name?: boolean;
    show_email?: boolean;
    show_cpf?: boolean;
    show_phone?: boolean;
  };
}

export default function CustomerInfoForm({ 
  register, 
  errors,
  config = {
    show_name: true,
    show_email: true,
    show_cpf: true,
    show_phone: true
  }
}: CustomerInfoFormProps) {
  return (
    <div className="space-y-5">
      {config.show_name && (
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">Nome completo</Label>
          <Input 
            id="name" 
            placeholder="Seu nome completo" 
            className="rounded-md border-gray-300 focus:border-blue-400 focus:ring-blue-400"
            {...register('name')} 
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message as string}</p>
          )}
        </div>
      )}

      {config.show_email && (
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">E-mail</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="Seu e-mail" 
            className="rounded-md border-gray-300 focus:border-blue-400 focus:ring-blue-400"
            {...register('email')} 
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message as string}</p>
          )}
        </div>
      )}

      {config.show_cpf && config.show_phone && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cpf" className="text-sm font-medium">CPF/CNPJ</Label>
            <Input 
              id="cpf" 
              placeholder="Digite seu CPF/CNPJ" 
              className="rounded-md border-gray-300 focus:border-blue-400 focus:ring-blue-400"
              {...register('cpf')} 
            />
            {errors.cpf && (
              <p className="text-xs text-red-500">{errors.cpf.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone" className="text-sm font-medium">Celular</Label>
            <div className="flex">
              <div className="flex items-center bg-gray-100 px-2 border border-r-0 border-gray-300 rounded-l-md">
                <Flag size={16} className="text-gray-500 mr-1" />
                <span className="text-sm text-gray-600">+55</span>
              </div>
              <Input 
                id="telefone" 
                placeholder="(99) 99999-9999" 
                className="rounded-l-none rounded-r-md border-gray-300 focus:border-blue-400 focus:ring-blue-400"
                {...register('telefone')} 
              />
            </div>
            {errors.telefone && (
              <p className="text-xs text-red-500">{errors.telefone.message as string}</p>
            )}
          </div>
        </div>
      )}

      {config.show_cpf && !config.show_phone && (
        <div className="space-y-2">
          <Label htmlFor="cpf" className="text-sm font-medium">CPF/CNPJ</Label>
          <Input 
            id="cpf" 
            placeholder="Digite seu CPF/CNPJ" 
            className="rounded-md border-gray-300 focus:border-blue-400 focus:ring-blue-400"
            {...register('cpf')} 
          />
          {errors.cpf && (
            <p className="text-xs text-red-500">{errors.cpf.message as string}</p>
          )}
        </div>
      )}

      {!config.show_cpf && config.show_phone && (
        <div className="space-y-2">
          <Label htmlFor="telefone" className="text-sm font-medium">Celular</Label>
          <div className="flex">
            <div className="flex items-center bg-gray-100 px-2 border border-r-0 border-gray-300 rounded-l-md">
              <Flag size={16} className="text-gray-500 mr-1" />
              <span className="text-sm text-gray-600">+55</span>
            </div>
            <Input 
              id="telefone" 
              placeholder="(99) 99999-9999" 
              className="rounded-l-none rounded-r-md border-gray-300 focus:border-blue-400 focus:ring-blue-400"
              {...register('telefone')} 
            />
          </div>
          {errors.telefone && (
            <p className="text-xs text-red-500">{errors.telefone.message as string}</p>
          )}
        </div>
      )}
    </div>
  );
}
