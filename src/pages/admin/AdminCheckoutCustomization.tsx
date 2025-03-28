
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProdutos } from '@/services/produtoService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function AdminCheckoutCustomization() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [productId, setProductId] = useState<string>(id || '');

  const { data: products = [] } = useQuery({
    queryKey: ['produtos'],
    queryFn: () => getProdutos(),
  });
  
  const handleProductChange = (value: string) => {
    setProductId(value);
    navigate(`/admin/checkout-customization/${value}`);
  };
  
  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Personalização do Checkout</h1>
          <p className="text-gray-500">Esta funcionalidade foi removida</p>
        </div>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personalização Removida</CardTitle>
            <CardDescription>
              A funcionalidade de personalização do checkout foi desativada.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">
              Esta funcionalidade não está mais disponível no sistema.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
