
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutLayout from './CheckoutLayout';
import CheckoutForm from './CheckoutForm';
import { toast } from "@/hooks/use-toast";
import { useCheckoutForm } from './hooks/useCheckoutForm';
import { useOneCheckoutState } from './hooks/useOneCheckoutState';

interface ModernCheckoutProps {
  producto: any;
  config?: any;
}

export default function ModernCheckout({ producto, config }: ModernCheckoutProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Get checkout state (visitors count, etc.)
  const { 
    visitors,
    currentStep: stepIndex,
    setCurrentStep
  } = useOneCheckoutState(config);
  
  // Use the checkout form hook
  const { 
    activeStep,
    handlePixPayment, 
    handleCardPayment,
    onSubmit 
  } = useCheckoutForm(producto);
  
  // If configured, redirect after N seconds
  useEffect(() => {
    if (config?.redirect_after_seconds) {
      const timer = setTimeout(() => {
        const redirectUrl = config.redirect_url || '/';
        navigate(redirectUrl);
      }, config.redirect_after_seconds * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [config, navigate]);
  
  // Define checkout steps
  const steps = [
    { title: "Informações", description: "Dados pessoais" },
    { title: "Pagamento", description: "Forma de pagamento" },
    { title: "Confirmação", description: "Revisão do pedido" }
  ];
  
  // Convert stepIndex to a numeric value (1-based) for the UI
  const currentStep = typeof stepIndex === 'number' ? 
    stepIndex + 1 : 
    activeStep === 'identification' ? 1 : 2;
  
  // Config for display options
  const showVisitorCounter = config?.show_visitor_counter !== false;
  const showTestimonials = config?.show_testimonials !== false;
  const testimonialTitle = config?.testimonial_title || "O que nossos clientes dizem";
  const testimonials = Array.isArray(config?.testimonials) ? config.testimonials : [];
  
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
      testimonials={testimonials}
      steps={steps}
    >
      <div className="w-full max-w-md mx-auto">
        <CheckoutForm 
          produto={producto} 
          config={config}
          onSubmit={onSubmit}
          onPixPayment={handlePixPayment}
          onCardPayment={handleCardPayment}
          customization={{
            payment_methods: config?.payment_methods || ['pix', 'cartao'],
            payment_info_title: config?.payment_info_title,
            cta_text: config?.texto_botao || 'Finalizar Compra'
          }}
        />
      </div>
    </CheckoutLayout>
  );
}
