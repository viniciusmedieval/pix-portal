
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutLayout from './CheckoutLayout';
import CheckoutForm from './CheckoutForm';
import { toast } from "@/hooks/use-toast";
import { useCheckoutForm } from './hooks/useCheckoutForm';

interface ModernCheckoutProps {
  producto: any;
  config?: any;
}

export default function ModernCheckout({ producto, config }: ModernCheckoutProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Use the checkout form hook
  const { 
    handlePixPayment, 
    handleCardPayment, // Get the card payment handler
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
  
  return (
    <CheckoutLayout producto={producto} config={config}>
      <div className="w-full max-w-md mx-auto">
        <CheckoutForm 
          produto={producto} 
          config={config}
          onSubmit={onSubmit}
          onPixPayment={handlePixPayment}
          onCardPayment={handleCardPayment} // Pass the card payment handler
          customization={{
            payment_methods: config?.payment_methods,
            payment_info_title: config?.payment_info_title,
            cta_text: config?.texto_botao || 'Finalizar Compra'
          }}
        />
      </div>
    </CheckoutLayout>
  );
}
