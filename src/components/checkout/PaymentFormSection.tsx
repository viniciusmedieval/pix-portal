
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutForm from './CheckoutForm';
import { useToast } from '@/hooks/use-toast';

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
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission (credit card payment)
  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    
    try {
      console.log('Processing payment with form data:', formData);
      
      // Here you would typically send the data to your payment processor
      
      // Mock successful payment
      toast({
        title: "Pagamento processado",
        description: "Seu pagamento foi processado com sucesso!",
      });
      
      // Redirect to success page
      navigate(`/sucesso?produto=${produto.id}`);
      
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        variant: 'destructive',
        title: "Erro no processamento",
        description: "Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle PIX payment option
  const handlePixPayment = () => {
    navigate(`/checkout/${produto.id}/pix`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">
        {customization?.payment_info_title || "Complete sua compra"}
      </h2>
      
      <CheckoutForm
        produto={produto}
        onSubmit={handleSubmit}
        onPixPayment={handlePixPayment}
        customization={customization}
        config={config}
      />
    </div>
  );
};

export default PaymentFormSection;
