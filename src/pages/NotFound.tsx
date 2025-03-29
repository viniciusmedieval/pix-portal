
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <h2 className="text-2xl font-semibold mt-4 mb-6 text-gray-700">Página não encontrada</h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        A página que você está procurando não existe ou foi removida.
      </p>
      <Button asChild>
        <Link to="/">Voltar para a página inicial</Link>
      </Button>
    </div>
  );
}
