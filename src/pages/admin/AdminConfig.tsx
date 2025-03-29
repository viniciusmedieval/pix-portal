
import React from 'react';
import { useParams } from 'react-router-dom';
import { ConfigForm } from '@/components/admin/config/ConfigForm';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminConfig() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Configurações de Checkout</h1>
        <p className="text-gray-500">Personalize a experiência de checkout para o seu produto</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <ConfigForm />
        </CardContent>
      </Card>
    </div>
  );
}
