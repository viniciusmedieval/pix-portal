
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { CheckoutFormValues } from '../forms/checkoutFormSchema';

interface IdentificationStepProps {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
  handleContinue: () => void;
  buttonColor?: string;
  formHeaderText?: string;
  formHeaderBgColor?: string;
  formHeaderTextColor?: string;
}

const IdentificationStep: React.FC<IdentificationStepProps> = ({
  register,
  errors,
  handleContinue,
  buttonColor = '#22c55e',
  formHeaderText = 'PREENCHA SEUS DADOS ABAIXO',
  formHeaderBgColor = '#dc2626',
  formHeaderTextColor = '#ffffff'
}) => {
  // Log header settings for debugging
  console.log('Rendering IdentificationStep with header settings:', {
    formHeaderText,
    formHeaderBgColor,
    formHeaderTextColor
  });

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div 
        className="py-3 px-4 -mx-5 -mt-6 mb-6 text-center font-bold"
        style={{ 
          backgroundColor: formHeaderBgColor,
          color: formHeaderTextColor
        }}
      >
        {formHeaderText}
      </div>

      {/* Name Field */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Nome Completo *
        </label>
        <input
          id="name"
          {...register('name', { required: 'Nome é obrigatório' })}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Digite seu nome completo"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email *
        </label>
        <input
          id="email"
          type="email"
          {...register('email', { required: 'Email é obrigatório' })}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Digite seu email"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* CPF Field */}
      <div className="space-y-2">
        <label htmlFor="cpf" className="text-sm font-medium">
          CPF *
        </label>
        <input
          id="cpf"
          {...register('cpf', { required: 'CPF é obrigatório' })}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Digite seu CPF (apenas números)"
        />
        {errors.cpf && (
          <p className="text-sm text-red-500">{errors.cpf.message}</p>
        )}
      </div>

      {/* WhatsApp Field */}
      <div className="space-y-2">
        <label htmlFor="whatsapp" className="text-sm font-medium">
          WhatsApp *
        </label>
        <input
          id="whatsapp"
          {...register('whatsapp', { required: 'WhatsApp é obrigatório' })}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Digite seu WhatsApp"
        />
        {errors.whatsapp && (
          <p className="text-sm text-red-500">{errors.whatsapp.message}</p>
        )}
      </div>

      {/* Continue Button */}
      <Button
        type="button"
        onClick={handleContinue}
        className="w-full py-6 text-white"
        style={{ backgroundColor: buttonColor }}
      >
        CONTINUAR
      </Button>
    </div>
  );
}

export default IdentificationStep;
