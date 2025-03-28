
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProdutoBySlug } from '@/services/produtoService';
import { getConfig } from '@/services/configService';
import CheckoutLoading from '@/components/checkout/CheckoutLoading';
import CheckoutError from '@/components/checkout/CheckoutError';
import NewCheckoutContent from '@/components/checkout/NewCheckoutContent';

const CheckoutPage = () => {
  const { slug } = useParams<{ slug: string }>();

  // Fetch product data
  const { data: produto, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ['produto', slug],
    queryFn: () => getProdutoBySlug(slug || ''),
    enabled: !!slug,
  });

  // Fetch config data
  const { data: config, isLoading: configLoading } = useQuery({
    queryKey: ['checkout-config', produto?.id],
    queryFn: () => getConfig(produto?.id || ''),
    enabled: !!produto?.id,
  });

  const isLoading = productLoading || configLoading;

  // Handle loading state
  if (isLoading) {
    return <CheckoutLoading />;
  }

  // Handle error state
  if (productError || !produto) {
    return (
      <CheckoutError
        title="Produto não encontrado"
        message="O produto que você está procurando não existe ou não está disponível."
      />
    );
  }

  return <NewCheckoutContent producto={produto} config={config} />;
};

export default CheckoutPage;
