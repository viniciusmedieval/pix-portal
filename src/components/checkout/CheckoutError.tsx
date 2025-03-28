
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface CheckoutErrorProps {
  title?: string;
  message?: string;
}

const CheckoutError: React.FC<CheckoutErrorProps> = ({ 
  title = "Produto não encontrado",
  message = "O produto que você está procurando não existe ou não está disponível."
}) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-red-600">
            <AlertCircle className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{message}</p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => navigate('/')}
            className="w-full"
          >
            Voltar para a página inicial
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CheckoutError;
