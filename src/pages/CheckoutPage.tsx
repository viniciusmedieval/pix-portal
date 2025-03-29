
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
  
  console.log("CheckoutPage: Rendering with slug:", slug);
  
  // Fetch product data
  const { data: producto, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ['produto', slug],
    queryFn: () => getProdutoBySlug(slug || ''),
    enabled: !!slug,
  });

  console.log("CheckoutPage: Product data:", producto);
  console.log("CheckoutPage: Product loading:", productLoading);
  console.log("CheckoutPage: Product error:", productError);

  // Fetch config data
  const { data: config, isLoading: configLoading } = useQuery({
    queryKey: ['checkout-config', producto?.id],
    queryFn: () => getConfig(producto?.id || ''),
    enabled: !!producto?.id,
  });

  console.log("CheckoutPage: Config data:", config);
  console.log("CheckoutPage: Config loading:", configLoading);
  console.log("OneCheckout enabled in raw config:", config?.one_checkout_enabled);

  const isLoading = productLoading || configLoading;
  
  // Handle loading state
  if (isLoading) {
    return <CheckoutLoading />;
  }

  // Handle error state
  if (productError || !producto) {
    console.error("CheckoutPage: Error or no product found:", productError);
    
    return (
      <CheckoutError
        title="Produto não encontrado"
        message="O produto que você está procurando não existe ou não está disponível."
      />
    );
  }

  console.log("Checkout config:", config);
  console.log("OneCheckout enabled:", config?.one_checkout_enabled);
  console.log("OneCheckout enabled (type):", typeof config?.one_checkout_enabled);
  
  // Default payment methods to ['pix', 'cartao'] if not provided in config
  const paymentMethods = config?.payment_methods || ['pix', 'cartao'];
  console.log("Payment methods available:", paymentMethods);
  
  // Get background color from config
  const bgColor = config?.cor_fundo || '#f5f5f7';
  
  // Use the oneCheckoutEnabled flag from config to determine which checkout type to show
  // Force conversion to boolean with double negation to handle any non-boolean values
  const isOneCheckout = Boolean(config?.one_checkout_enabled);
  
  console.log("Using OneCheckout mode:", isOneCheckout);
  console.log("Using OneCheckout mode (type after conversion):", typeof isOneCheckout);

  // Pass the entire config object along with default payment methods
  const configWithDefaults = {
    ...config,
    payment_methods: paymentMethods,
    one_checkout_enabled: isOneCheckout // Ensure this is explicitly passed as boolean
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      {isOneCheckout ? 
        <OneCheckout producto={producto} config={configWithDefaults} /> : 
        <ModernCheckout producto={producto} config={configWithDefaults} />}
    </div>
  );
}
