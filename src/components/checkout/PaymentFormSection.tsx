
import React from 'react';
import CheckoutForm from './CheckoutForm';
import { useParams } from 'react-router-dom';

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
}

const PaymentFormSection: React.FC<PaymentFormSectionProps> = ({ 
  produto,
  config,
  showIdentificationSection = true,
  showPaymentSection = true
}) => {
  const { slug } = useParams<{ slug: string }>();
  
  const handlePixPayment = () => {
    // In a real application, redirect to pix payment page
    if (slug) {
      window.location.href = `/checkout/${slug}/pix`;
    }
  };

  return (
    <CheckoutForm 
      produto={produto}
      config={config}
      onPixPayment={handlePixPayment}
      showIdentificationSection={showIdentificationSection}
      showPaymentSection={showPaymentSection}
    />
  );
};

export default PaymentFormSection;
