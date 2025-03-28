
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProdutoBySlug } from '@/services/produtoService';
import { getConfig } from '@/services/configService';
import CheckoutLoading from '@/components/checkout/CheckoutLoading';
import CheckoutError from '@/components/checkout/CheckoutError';
import CheckoutLayout from '@/components/checkout/CheckoutLayout';
import CheckoutContent from '@/components/checkout/CheckoutContent';

const CheckoutPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Fetch product data
  const { data: produto, isLoading: isLoadingProduto, error: errorProduto } = useQuery({
    queryKey: ['produto', slug],
    queryFn: () => getProdutoBySlug(slug || ''),
    enabled: !!slug,
  });

  // Fetch config data
  const { data: config, isLoading: isLoadingConfig } = useQuery({
    queryKey: ['config', produto?.id],
    queryFn: () => getConfig(produto?.id || ''),
    enabled: !!produto?.id,
  });

  // Handle loading state
  if (isLoadingProduto || isLoadingConfig) {
    return <CheckoutLoading />;
  }

  // Handle error state
  if (errorProduto || !produto) {
    return (
      <CheckoutError
        title="Produto não encontrado"
        message="O produto que você está procurando não existe ou não está disponível."
      />
    );
  }

  return (
    <CheckoutLayout>
      <CheckoutContent
        producto={produto}
      />
    </CheckoutLayout>
  );
};

export default CheckoutPage;
