
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface CheckoutErrorProps {
  title?: string;
  message?: string;
}

export default function CheckoutError({ 
  title = "Erro no Checkout", 
  message = "Ocorreu um erro ao carregar a página de checkout. Por favor, tente novamente." 
}: CheckoutErrorProps) {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
        
        <h2 className="mt-4 text-xl font-bold text-gray-900">{title}</h2>
        <p className="mt-2 text-gray-500">{message}</p>
        
        <div className="mt-6">
          <Button 
            onClick={() => navigate('/')}
            className="w-full"
          >
            Voltar para a página inicial
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
            className="w-full mt-3"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    </div>
  );
}
