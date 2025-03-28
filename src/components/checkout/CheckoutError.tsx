import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CheckoutErrorProps {
  title?: string;
  message?: string;
  showModal?: boolean;
}

const CheckoutError: React.FC<CheckoutErrorProps> = ({ 
  title = "Produto não encontrado",
  message = "O produto que você está procurando não existe ou não está disponível.",
  showModal = false
}) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  if (showModal) {
    return (
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              {title}
            </DialogTitle>
            <DialogDescription>
              {message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              onClick={handleGoHome}
              className="w-full"
            >
              Voltar para a página inicial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

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
            onClick={handleGoHome}
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
