
import { useState } from 'react';
import { useCheckoutForm } from './hooks/useCheckoutForm';
import CheckoutLayout from './CheckoutLayout';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';
import CustomerInfoForm from './forms/CustomerInfoForm';
import CardPaymentForm from './forms/CardPaymentForm';
import PaymentMethodSelector from './PaymentMethodSelector';
import PaymentButton from './ui/PaymentButton';
import { CheckoutFormValues } from './forms/checkoutFormSchema';
import { useOneCheckoutState } from './hooks/useOneCheckoutState';

interface OneCheckoutProps {
  producto: any;
  config?: any;
}

export default function OneCheckout({ producto, config }: OneCheckoutProps) {
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = useState<'identification' | 'payment' | 'complete'>('identification');
  
  // Get checkout state (visitors count, etc.)
  const { 
    visitors,
    currentStep: stepIndex
  } = useOneCheckoutState(config);
  
  // Use the checkout form hook
  const { 
    register, 
    errors, 
    setValue, 
    watch, 
    handleSubmit, 
    handlePixPayment,
    handleCardPayment,
    isSubmitting,
    onSubmit,
    activeStep
  } = useCheckoutForm(producto);
  
  const paymentMethod = watch('payment_method');
  
  const handlePaymentMethodChange = (method: 'pix' | 'cartao') => {
    setValue('payment_method', method);
  };
  
  // Generate installment options
  const maxInstallments = producto.parcelas || 1;
  const installmentOptions = Array.from({ length: maxInstallments }, (_, i) => i + 1).map(
    (num) => ({
      value: `${num}x`,
      label: `${num}x de R$ ${(producto.preco / num).toFixed(2).replace('.', ',')}${num > 1 ? ' sem juros' : ''}`,
    })
  );
  
  const handleContinue = async () => {
    // Normally you would trigger form validation here
    setCurrentStep('payment');
    window.scrollTo(0, 0);
  };
  
  // Extract configuration values
  const buttonText = config?.texto_botao || 'Finalizar compra';
  const buttonColor = config?.cor_botao || '#10b981';
  const headerBgColor = config?.header_bg_color || '#f9fafb';
  const headerTextColor = config?.header_text_color || '#111827';
  const paymentMethods = Array.isArray(config?.payment_methods) ? config.payment_methods : ['pix', 'cartao'];
  
  // Define checkout steps
  const steps = [
    { title: "Informações", description: "Dados pessoais" },
    { title: "Pagamento", description: "Forma de pagamento" },
    { title: "Confirmação", description: "Revisão do pedido" }
  ];
  
  // Config for display options
  const showVisitorCounter = config?.show_visitor_counter !== false;
  const showTestimonials = config?.show_testimonials !== false;
  const testimonialTitle = config?.testimonial_title || "O que nossos clientes dizem";
  const testimonials = Array.isArray(config?.testimonials) ? config.testimonials : [];
  
  // Convert the string 'identification'/'payment' to a numeric step
  const numericStep = currentStep === 'identification' ? 1 : 
                      currentStep === 'payment' ? 2 : 3;
  
  return (
    <CheckoutLayout 
      producto={producto} 
      config={config}
      currentStep={numericStep}
      activeStep={currentStep}
      showVisitorCounter={showVisitorCounter}
      visitors={visitors}
      showTestimonials={showTestimonials}
      testimonialTitle={testimonialTitle}
      testimonials={testimonials}
      steps={steps}
    >
      <div className="w-full max-w-md mx-auto">
        <div className="rounded-lg overflow-hidden shadow-md mb-6">
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)}>
            {/* Customer Information Section */}
            <Card className={currentStep !== 'identification' ? 'hidden md:block' : ''}>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Dados Pessoais</h2>
                <CustomerInfoForm register={register} errors={errors} />
                
                <div className="md:hidden mt-6">
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="w-full py-3 bg-primary text-white rounded-md"
                  >
                    Continuar para pagamento
                  </button>
                </div>
              </CardContent>
            </Card>
            
            {/* Payment Section */}
            <Card className={currentStep !== 'payment' ? 'hidden md:block mt-4' : 'mt-4'}>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Forma de Pagamento</h2>
                
                <input type="hidden" {...register('payment_method')} />
                
                <PaymentMethodSelector 
                  availableMethods={paymentMethods}
                  currentMethod={paymentMethod}
                  onChange={handlePaymentMethodChange}
                />
                
                {paymentMethod === 'cartao' && (
                  <div className="mt-4">
                    <CardPaymentForm 
                      register={register}
                      setValue={setValue}
                      errors={errors}
                      installmentOptions={installmentOptions}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Submit Button */}
            <div className="mt-6">
              <PaymentButton 
                isSubmitting={isSubmitting}
                buttonText={paymentMethod === 'pix' ? 'Gerar PIX' : buttonText}
                buttonColor={buttonColor}
                isCartao={paymentMethod === 'cartao'}
                onPixClick={paymentMethods.includes('pix') ? handlePixPayment : undefined}
                onCardClick={paymentMethod === 'cartao' ? handleCardPayment : undefined}
              />
            </div>
          </form>
        </div>
      </div>
    </CheckoutLayout>
  );
}
