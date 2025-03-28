
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface CheckoutErrorProps {
  message?: string;
}

const CheckoutError: React.FC<CheckoutErrorProps> = ({ 
  message = "O produto que você está procurando não existe ou não está disponível."
}) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Produto não encontrado</h2>
        <p className="text-gray-600 mt-2">{message}</p>
        <Button 
          onClick={() => navigate('/')}
          className="mt-4"
        >
          Voltar para a página inicial
        </Button>
      </div>
    </div>
  );
};

export default CheckoutError;
