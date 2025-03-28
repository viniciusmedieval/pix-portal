
import React from 'react';
import CheckoutForm from './CheckoutForm';
import { useParams } from 'react-router-dom';
import CheckoutSummary from './CheckoutSummary';

interface PaymentFormSectionProps {
  produto: {
    id: string;
    nome: string;
    preco: number;
    parcelas?: number;
    imagem_url?: string | null;
  };
  config?: any;
  showIdentificationSection?: boolean;
  showPaymentSection?: boolean;
  firstStep?: boolean;
  onContinueToPayment?: () => void;
}

const PaymentFormSection: React.FC<PaymentFormSectionProps> = ({ 
  produto,
  config,
  showIdentificationSection = true,
  showPaymentSection = true,
  firstStep = false,
  onContinueToPayment
}) => {
  const { slug } = useParams<{ slug: string }>();
  
  const handlePixPayment = () => {
    // In a real application, redirect to pix payment page
    if (slug) {
      window.location.href = `/checkout/${slug}/pix`;
    }
  };

  return (
    <div className="space-y-6">
      <CheckoutForm 
        produto={produto}
        config={config}
        onPixPayment={handlePixPayment}
        showIdentificationSection={showIdentificationSection}
        showPaymentSection={showPaymentSection}
      />

      {/* Show the checkout summary only on the first step */}
      {firstStep && onContinueToPayment && (
        <div className="mt-6">
          <CheckoutSummary 
            product={produto}
            config={config}
            onContinue={onContinueToPayment}
            showButtons={true}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentFormSection;
