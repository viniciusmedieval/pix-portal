
import React from 'react';
import { UseFormRegister, FieldErrors, UseFormTrigger } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckoutFormValues } from '../forms/checkoutFormSchema';

interface IdentificationStepProps {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
  handleContinue: () => void;
  buttonColor: string;
}

const IdentificationStep: React.FC<IdentificationStepProps> = ({
  register,
  errors,
  handleContinue,
  buttonColor
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <img src="https://cdn-icons-png.flaticon.com/512/5087/5087607.png" alt="Formulário" className="w-5 h-5" />
        <p className="text-lg font-semibold">Dados pessoais</p>
      </div>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="name">Nome completo</Label>
          <Input 
            id="name" 
            {...register('name')} 
            placeholder="Digite seu nome completo" 
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input 
            id="email" 
            type="email" 
            {...register('email')} 
            placeholder="Digite seu e-mail" 
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="cpf">CPF/CNPJ</Label>
          <Input 
            id="cpf" 
            {...register('cpf')} 
            placeholder="Digite seu CPF ou CNPJ" 
            className={errors.cpf ? 'border-red-500' : ''}
          />
          {errors.cpf && (
            <p className="text-xs text-red-500 mt-1">{errors.cpf.message}</p>
          )}
        </div>
        
        <div className="flex gap-2">
          <div className="w-1/5">
            <Label htmlFor="ddd">DDD</Label>
            <Select defaultValue="55" disabled>
              <SelectTrigger>
                <SelectValue placeholder="+55" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="55">+55</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label htmlFor="telefone">Celular</Label>
            <Input 
              id="telefone" 
              {...register('telefone')} 
              placeholder="Digite seu número de celular" 
            />
          </div>
        </div>
      </div>
      
      <Button
        type="button"
        onClick={handleContinue}
        className="w-full py-6 text-lg font-semibold mt-6"
        style={{ backgroundColor: buttonColor }}
      >
        Continuar
      </Button>
    </div>
  );
};

export default IdentificationStep;
