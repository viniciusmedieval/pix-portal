
import React from 'react';
import { UseFormRegister, FieldErrors, UseFormHandleSubmit, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import CustomerInfoForm from '../forms/CustomerInfoForm';
import PaymentMethodSelector from '../PaymentMethodSelector';
import CardPaymentForm from '../forms/CardPaymentForm';

interface OneCheckoutFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  handleSubmit: UseFormHandleSubmit<any>;
  onSubmit: (data: any) => Promise<void>;
  currentStep: 'personal-info' | 'payment-method' | 'confirm';
  currentPaymentMethod: string;
  handlePaymentMethodChange: (method: 'pix' | 'cartao') => void;
  handleContinue: () => void;
  setValue: UseFormSetValue<any>;
  isSubmitting: boolean;
  installmentOptions: Array<{ value: string; label: string }>;
  handlePixPayment: () => void;
  paymentMethods: string[];
  corBotao: string;
  textoBotao: string;
}

const OneCheckoutForm: React.FC<OneCheckoutFormProps> = ({
  register,
  errors,
  handleSubmit,
  onSubmit,
  currentStep,
  currentPaymentMethod,
  handlePaymentMethodChange,
  handleContinue,
  setValue,
  isSubmitting,
  installmentOptions,
  handlePixPayment,
  paymentMethods,
  corBotao,
  textoBotao
}) => {
  console.log("OneCheckoutForm rendering with payment method:", currentPaymentMethod);
  console.log("HasPixHandler:", !!handlePixPayment);
  
  // Direct PIX payment handler
  const onPixButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("PIX button clicked in OneCheckoutForm");
    
    if (handlePixPayment) {
      console.log("Calling PIX payment handler");
      handlePixPayment();
    } else {
      console.log("No PIX handler provided");
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Customer Information */}
      <div className={`space-y-5 ${currentStep !== 'personal-info' ? 'hidden md:block' : ''}`}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm">1</div>
          <h2 className="font-semibold text-lg">Informações Pessoais</h2>
        </div>
        
        <CustomerInfoForm 
          register={register}
          errors={errors}
        />

        <div className="pt-4 md:hidden">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full py-3 rounded-md bg-primary text-white"
          >
            Continuar
          </button>
        </div>
      </div>
      
      {/* Payment Section */}
      <div className={`space-y-5 pt-4 border-t border-gray-200 ${(currentStep !== 'payment-method' && currentStep !== 'confirm') ? 'hidden md:block' : ''}`}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm">2</div>
          <h2 className="font-semibold text-lg">Forma de Pagamento</h2>
        </div>
        
        <input type="hidden" {...register('payment_method')} />
        
        <PaymentMethodSelector 
          availableMethods={paymentMethods}
          currentMethod={currentPaymentMethod}
          onChange={handlePaymentMethodChange}
        />
        
        {/* Conditional card fields */}
        {currentPaymentMethod === 'cartao' && (
          <CardPaymentForm 
            register={register}
            setValue={setValue}
            errors={errors}
            installmentOptions={installmentOptions}
          />
        )}

        <div className="pt-4 md:hidden">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full py-3 rounded-md bg-primary text-white"
          >
            Revisar e finalizar
          </button>
        </div>
      </div>
      
      {/* Submit Button - only shown on desktop or on confirm step */}
      <div className={`pt-6 ${currentStep !== 'confirm' ? 'hidden md:block' : ''}`}>
        {currentPaymentMethod === 'pix' ? (
          <button
            type="button"
            onClick={onPixButtonClick}
            className="w-full py-4 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ backgroundColor: corBotao }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processando...' : 'Gerar PIX'}
          </button>
        ) : (
          <button
            type="submit"
            className="w-full py-4 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ backgroundColor: corBotao }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processando...' : textoBotao}
          </button>
        )}
        
        {/* PIX alternative */}
        {paymentMethods.includes('pix') && currentPaymentMethod === 'cartao' && (
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-500 block mb-2">ou</span>
            <button
              type="button"
              onClick={onPixButtonClick}
              className="w-full py-3 border border-gray-300 rounded-md bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Pagar com PIX
            </button>
          </div>
        )}
        
        <div className="text-center mt-3 text-sm text-gray-500">
          <p>Pagamento 100% seguro. Transação realizada com criptografia.</p>
        </div>
      </div>
    </form>
  );
};

export default OneCheckoutForm;
