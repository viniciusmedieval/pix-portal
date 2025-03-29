
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface CheckoutErrorProps {
  title: string;
  message: string;
  backUrl?: string;
}

const CheckoutError: React.FC<CheckoutErrorProps> = ({ 
  title, 
  message, 
  backUrl = "/"
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {title}
          </h1>
          <p className="text-gray-500">
            {message}
          </p>
        </div>
        
        <Button 
          onClick={() => navigate(backUrl)}
          className="w-full"
        >
          Voltar à Página Inicial
        </Button>
      </div>
    </div>
  );
};

export default CheckoutError;
