
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProdutoBySlug } from '@/services/produtoService';
import { usePixel } from '@/hooks/usePixel';
import { getCheckoutConfig } from '@/services/checkoutConfigService';
import ProductDetails from '@/components/checkout/ProductDetails';
import ConfigDetails from '@/components/checkout/ConfigDetails';
import ErrorCard from '@/components/checkout/ErrorCard';

const CheckoutPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [numParcelas, setNumParcelas] = React.useState<number>(1);

  // Log for debugging purposes
  React.useEffect(() => {
    if (!slug) {
      console.error("Missing slug parameter in URL. Expected format: /checkout/:slug");
    } else {
      console.log(`Loading product with slug: ${slug}`);
    }
  }, [slug]);

  const { data: produto, isLoading: isProdutoLoading, isError: isProdutoError } = useQuery({
    queryKey: ['produto', slug],
    queryFn: () => {
      if (!slug) {
        throw new Error("No slug parameter provided");
      }
      return getProdutoBySlug(slug);
    },
    // Skip query if slug is undefined
    enabled: !!slug,
  });

  const { data: config, isLoading: isConfigLoading, isError: isConfigError } = useQuery({
    queryKey: ['checkoutConfig'],
    queryFn: () => getCheckoutConfig(),
  });

  // Only call usePixel if produto exists
  usePixel(produto?.id, 'InitiateCheckout');

  // Handle the case when there's no slug
  if (!slug) {
    return (
      <div className="container py-8">
        <ErrorCard 
          title="URL inválido"
          description="Parâmetro de produto ausente na URL."
          message="A URL do checkout deve incluir um identificador de produto válido. Formato esperado: /checkout/:slug"
        />
      </div>
    );
  }

  if (isProdutoLoading || isConfigLoading) {
    return <div className="container py-8">Carregando...</div>;
  }

  if (isProdutoError || isConfigError) {
    return (
      <div className="container py-8">
        <ErrorCard 
          title="Erro ao carregar produto"
          description="Não foi possível carregar as informações do produto."
          message="Verifique se o produto existe ou tente novamente mais tarde."
        />
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="container py-8">
        <ErrorCard 
          title="Produto não encontrado"
          description="O produto solicitado não foi encontrado."
          message={`O produto com o identificador "${slug}" não existe ou foi removido.`}
        />
      </div>
    );
  }

  const handleParcelaChange = (value: string) => {
    setNumParcelas(parseInt(value, 10));
  };

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Details */}
        <div>
          <ProductDetails 
            produto={produto} 
            numParcelas={numParcelas} 
            maxParcelas={config?.max_parcelas} 
            onParcelaChange={handleParcelaChange} 
          />
        </div>

        {/* Checkout Configuration Details */}
        <div>
          <ConfigDetails config={config} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
