
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Index() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="max-w-lg text-center space-y-6">
        <h1 className="text-3xl font-bold">Bem-vindo ao PixPortal</h1>
        <p className="text-gray-600">
          Uma plataforma completa para gerenciar pagamentos via PIX e otimizar suas vendas online.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link to="/login">Fazer Login</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin">Acesso Admin</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
