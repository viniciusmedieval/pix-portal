
import { useCheckoutForm } from './hooks/useCheckoutForm';
import { useVisitorCounter } from './hooks/useVisitorCounter';
import CheckoutLayout from './CheckoutLayout';
import IdentificationStep from './steps/IdentificationStep';
import PaymentStep from './steps/PaymentStep';
import { mockTestimonials } from './data/mockTestimonials';

interface ModernCheckoutProps {
  producto: {
    id: string;
    nome: string;
    descricao?: string | null;
    preco: number;
    parcelas?: number;
    imagem_url?: string | null;
    slug?: string;
  };
  config?: any;
}

export default function ModernCheckout({ producto, config = {} }: ModernCheckoutProps) {
  // Extract config values with defaults
  const corBotao = config?.cor_botao || '#30b968';
  const textoBotao = config?.texto_botao || 'Finalizar compra';
  const showTestimonials = config?.exibir_testemunhos !== false;
  const testimonialTitle = config?.testimonials_title || 'O que dizem nossos clientes';
  const showVisitorCounter = config?.numero_aleatorio_visitas !== false;
  const paymentMethods = config?.payment_methods || ['pix', 'cartao'];
  
  // Define checkout steps
  const checkoutSteps = [
    { title: 'Seus dados', description: 'Informações pessoais' },
    { title: 'Pagamento', description: 'Finalizar compra' }
  ];
  
  // Use our custom hooks
  const {
    activeStep,
    isSubmitting,
    register,
    errors,
    setValue,
    watch,
    handleSubmit,
    handleContinue,
    handlePixPayment,
    onSubmit
  } = useCheckoutForm(producto);
  
  const visitors = useVisitorCounter(showVisitorCounter);
  
  // Get current step number
  const currentStep = activeStep === 'identification' ? 1 : 2;
  
  return (
    <CheckoutLayout
      producto={producto}
      config={config}
      currentStep={currentStep}
      activeStep={activeStep}
      showVisitorCounter={showVisitorCounter}
      visitors={visitors}
      showTestimonials={showTestimonials}
      testimonialTitle={testimonialTitle}
      testimonials={mockTestimonials}
      steps={checkoutSteps}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {activeStep === 'identification' ? (
          <IdentificationStep 
            register={register}
            errors={errors}
            handleContinue={handleContinue}
            buttonColor={corBotao}
          />
        ) : (
          <PaymentStep 
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            product={producto}
            isSubmitting={isSubmitting}
            paymentMethods={paymentMethods}
            handlePixPayment={handlePixPayment}
            buttonColor={corBotao}
            buttonText={textoBotao}
          />
        )}
      </form>
    </CheckoutLayout>
  );
}
