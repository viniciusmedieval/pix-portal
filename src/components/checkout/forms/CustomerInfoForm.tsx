
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';
import { CheckoutFormValues } from './checkoutFormSchema';

interface CustomerInfoFormProps {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
}

export default function CustomerInfoForm({ register, errors }: CustomerInfoFormProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={`space-y-${isMobile ? '3' : '4'}`}>
      <div className="space-y-2">
        <Label htmlFor="name" className={isMobile ? "text-sm" : ""}>Nome completo</Label>
        <Input 
          id="name" 
          placeholder="Seu nome completo" 
          {...register('name')} 
          className={isMobile ? "h-10 text-sm" : ""}
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className={isMobile ? "text-sm" : ""}>E-mail</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="Seu e-mail" 
          {...register('email')} 
          className={isMobile ? "h-10 text-sm" : ""}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cpf" className={isMobile ? "text-sm" : ""}>CPF/CNPJ</Label>
        <Input 
          id="cpf" 
          placeholder="Digite seu CPF/CNPJ" 
          {...register('cpf')} 
          className={isMobile ? "h-10 text-sm" : ""}
        />
        {errors.cpf && (
          <p className="text-xs text-red-500">{errors.cpf.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefone" className={isMobile ? "text-sm" : ""}>Celular</Label>
        <Input 
          id="telefone" 
          placeholder="+55 (99) 99999-9999" 
          {...register('telefone')} 
          className={isMobile ? "h-10 text-sm" : ""}
        />
        {errors.telefone && (
          <p className="text-xs text-red-500">{errors.telefone.message as string}</p>
        )}
      </div>
    </div>
  );
}
