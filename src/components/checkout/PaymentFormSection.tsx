
import React from 'react';
import CheckoutForm from '@/components/checkout/CheckoutForm';

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
}

const PaymentFormSection: React.FC<PaymentFormSectionProps> = ({ 
  produto, 
  customization, 
  config 
}) => {
  return (
    <div id="payment-section">
      <CheckoutForm 
        produto={produto}
        customization={customization}
        config={config}
      />
    </div>
  );
};

export default PaymentFormSection;
