
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProdutoBySlug } from '@/services/produtoService';
import CheckoutLoading from '@/components/checkout/CheckoutLoading';
import CheckoutError from '@/components/checkout/CheckoutError';
import CheckoutLayout from '@/components/checkout/CheckoutLayout';
import CheckoutContent from '@/components/checkout/CheckoutContent';

const CheckoutPage = () => {
  const { slug } = useParams<{ slug: string }>();

  // Fetch product data
  const { data: produto, isLoading, error } = useQuery({
    queryKey: ['produto', slug],
    queryFn: () => getProdutoBySlug(slug || ''),
    enabled: !!slug,
  });

  // Handle loading state
  if (isLoading) {
    return <CheckoutLoading />;
  }

  // Handle error state
  if (error || !produto) {
    return (
      <CheckoutError
        title="Produto não encontrado"
        message="O produto que você está procurando não existe ou não está disponível."
      />
    );
  }

  return (
    <CheckoutLayout>
      <CheckoutContent producto={produto} />
    </CheckoutLayout>
  );
};

export default CheckoutPage;
