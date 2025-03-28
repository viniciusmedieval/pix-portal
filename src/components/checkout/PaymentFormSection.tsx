
import React from 'react';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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
    <div id="payment-section" className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>{customization?.payment_info_title || "Informações de Pagamento"}</CardTitle>
        </CardHeader>
        <CardContent>
          <CheckoutForm 
            produto={produto}
            customization={customization}
            config={config}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFormSection;
