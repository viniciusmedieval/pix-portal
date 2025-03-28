
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface CheckoutErrorProps {
  title: string;
  message: string;
}

const CheckoutError: FC<CheckoutErrorProps> = ({ title, message }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <div className="rounded-full bg-red-100 p-3 mx-auto w-16 h-16 flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex flex-col space-y-3">
          <Button 
            onClick={() => navigate('/')}
            className="w-full"
          >
            Voltar para a página inicial
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
            className="w-full"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutError;
