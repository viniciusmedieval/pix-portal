
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProdutoBySlug } from '@/services/produtoService';
import { getConfig } from '@/services/configService';
import CheckoutLoading from '@/components/checkout/CheckoutLoading';
import CheckoutError from '@/components/checkout/CheckoutError';
import ModernCheckout from '@/components/checkout/ModernCheckout';
import OneCheckout from '@/components/checkout/OneCheckout';

export default function CheckoutPage() {
  const { slug } = useParams<{ slug: string }>();
  
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
  
  // Use the oneCheckoutEnabled flag from config to determine which checkout type to show
  const isOneCheckout = config?.one_checkout_enabled || false;

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      {/* Return the one-checkout view if enabled by admin settings, otherwise use the multi-step checkout */}
      {isOneCheckout ? 
        <OneCheckout producto={producto} config={config} /> : 
        <ModernCheckout producto={producto} config={config} />}
    </div>
  );
}
