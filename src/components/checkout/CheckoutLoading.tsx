
import React from 'react';
import { Loader2 } from "lucide-react";

const CheckoutLoading: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Carregando checkout...
        </h1>
        <p className="text-gray-500">
          Estamos preparando tudo para você. Aguarde um momento.
        </p>
      </div>
    </div>
  );
};

export default CheckoutLoading;
