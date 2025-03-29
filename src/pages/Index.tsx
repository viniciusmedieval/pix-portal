
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Hero from '@/components/home/Hero';
import Products from '@/components/home/Products';

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">PixPortal</h1>
          <div className="flex gap-4">
            <Button asChild variant="ghost">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/admin">Admin</Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <Hero />
        <Products />
      </main>
      
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2024 PixPortal. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
