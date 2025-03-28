
import React, { useState } from 'react';
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
  customization?: any;
  config?: any;
  showIdentificationSection?: boolean;
  showPaymentSection?: boolean;
}

const PaymentFormSection: React.FC<PaymentFormSectionProps> = ({ 
  produto,
  customization,
  config,
  showIdentificationSection = true,
  showPaymentSection = true
}) => {
  const { slug } = useParams<{ slug: string }>();
  const [showPixPayment, setShowPixPayment] = useState(false);

  const handlePixPayment = () => {
    setShowPixPayment(true);
    // In a real application, redirect to pix payment page
    window.location.href = `/checkout/${slug}/pix`;
  };

  return (
    <CheckoutForm 
      produto={produto}
      customization={customization}
      config={config}
      onPixPayment={handlePixPayment}
      showIdentificationSection={showIdentificationSection}
      showPaymentSection={showPaymentSection}
    />
  );
};

export default PaymentFormSection;
