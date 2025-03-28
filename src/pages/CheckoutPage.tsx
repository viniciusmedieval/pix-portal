
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { getProdutoBySlug } from '@/services/produtoService';
import { getConfig } from '@/services/configService';
import CheckoutLoading from '@/components/checkout/CheckoutLoading';
import CheckoutError from '@/components/checkout/CheckoutError';
import ModernCheckout from '@/components/checkout/ModernCheckout';
import OneCheckout from '@/components/checkout/OneCheckout';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function CheckoutPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // Check if one-checkout mode is enabled via URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const urlOneCheckout = urlParams.get('one') === 'true';
  
  // State for toggle switch
  const [isOneCheckout, setIsOneCheckout] = useState(urlOneCheckout);

  // Fetch product data
  const { data: producto, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ['produto', slug],
    queryFn: () => getProdutoBySlug(slug || ''),
    enabled: !!slug,
  });

  // Fetch config data
  const { data: config, isLoading: configLoading } = useQuery({
    queryKey: ['checkout-config', producto?.id],
    queryFn: () => getConfig(producto?.id || ''),
    enabled: !!producto?.id,
  });

  const isLoading = productLoading || configLoading;
  
  // Update URL when toggle changes
  const handleToggleChange = (checked: boolean) => {
    setIsOneCheckout(checked);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('one', checked.toString());
    navigate(`${newUrl.pathname}${newUrl.search}`, { replace: true });
  };

  // Handle loading state
  if (isLoading) {
    return <CheckoutLoading />;
  }

  // Handle error state
  if (productError || !producto) {
    return (
      <CheckoutError
        title="Produto não encontrado"
        message="O produto que você está procurando não existe ou não está disponível."
      />
    );
  }

  console.log("Checkout config:", config);
  console.log("Produto:", producto);
  
  // Get background color from config
  const bgColor = config?.cor_fundo || '#f5f5f7';

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      {/* Checkout Mode Toggle */}
      <div className="container max-w-4xl mx-auto pt-4 px-4">
        <div className="flex items-center justify-end space-x-2 mb-4">
          <Label htmlFor="checkout-mode" className="text-sm text-gray-600">
            Checkout em etapas
          </Label>
          <Switch 
            id="checkout-mode" 
            checked={isOneCheckout}
            onCheckedChange={handleToggleChange}
          />
          <Label htmlFor="checkout-mode" className="text-sm text-gray-600">
            Checkout único
          </Label>
        </div>
      </div>
      
      {/* Return the one-checkout view if enabled, otherwise use the multi-step checkout */}
      {isOneCheckout ? 
        <OneCheckout producto={producto} config={config} /> : 
        <ModernCheckout producto={producto} config={config} />}
    </div>
  );
}
