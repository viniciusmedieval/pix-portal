
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProdutoBySlug } from '@/services/produtoService';
import { usePixel } from '@/hooks/usePixel';
import { getCheckoutConfig } from '@/services/checkoutConfigService';
import { getConfig } from '@/services/configService';
import { getTestimonials } from '@/services/testimonialService';
import { getCheckoutCustomization } from '@/services/checkoutCustomizationService';
import VisitorCounter from '@/components/VisitorCounter';
import ProductImage from '@/components/checkout/ProductImage';
import BenefitsList from '@/components/checkout/BenefitsList';
import TestimonialSection from '@/components/checkout/TestimonialSection';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';
import FaqSection from '@/components/checkout/FaqSection';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import ErrorCard from '@/components/checkout/ErrorCard';

const CheckoutPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // Redirect if no slug is provided
  React.useEffect(() => {
    if (!slug) {
      console.error("Missing slug parameter in URL. Expected format: /checkout/:slug");
      navigate('/');
    } else {
      console.log(`Loading product with slug: ${slug}`);
    }
  }, [slug, navigate]);

  const { data: produto, isLoading: isProdutoLoading, isError: isProdutoError } = useQuery({
    queryKey: ['produto', slug],
    queryFn: () => {
      if (!slug) {
        throw new Error("No slug parameter provided");
      }
      return getProdutoBySlug(slug);
    },
    enabled: !!slug,
    retry: 1,
  });

  const { data: checkoutConfig, isLoading: isCheckoutConfigLoading } = useQuery({
    queryKey: ['checkoutConfig'],
    queryFn: () => getCheckoutConfig(),
  });

  const { data: config, isLoading: isConfigLoading } = useQuery({
    queryKey: ['config', produto?.id],
    queryFn: () => produto?.id ? getConfig(produto.id) : null,
    enabled: !!produto?.id,
  });
  
  const { data: customization, isLoading: isCustomizationLoading } = useQuery({
    queryKey: ['customization', produto?.id],
    queryFn: () => produto?.id ? getCheckoutCustomization(produto.id) : null,
    enabled: !!produto?.id,
  });

  const { data: testimonials, isLoading: isTestimonialsLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => getTestimonials(3),
    enabled: !!config?.exibir_testemunhos,
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

  const isLoading = isProdutoLoading || isCheckoutConfigLoading || isConfigLoading || isCustomizationLoading;

  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[300px]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (isProdutoError || !produto) {
    return (
      <div className="container py-8">
        <ErrorCard 
          title="Produto não encontrado"
          description={`Não foi possível encontrar o produto "${slug}".`}
          message="Verifique se o produto existe ou tente novamente mais tarde."
        />
      </div>
    );
  }

  const handlePaymentContinue = () => {
    if (produto?.slug) {
      navigate(`/checkout/${produto.slug}/pix`);
    } else {
      navigate(`/checkout/${produto.id}/pix`);
    }
  };

  // Colors from the configuration or defaults
  const bgColor = config?.cor_fundo || checkoutConfig?.cor_secundaria || '#f9fafb';

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto py-8 px-4">
        <CheckoutHeader 
          title={produto.nome} 
          description={produto.descricao}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Product Information */}
          <div className="space-y-6">
            <ProductImage 
              imageUrl={produto.imagem_url} 
              productName={produto.nome}
            />

            {/* Visitor Counter */}
            {config?.numero_aleatorio_visitas && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <VisitorCounter 
                  min={checkoutConfig?.visitantes_min || 1} 
                  max={checkoutConfig?.visitantes_max || 100} 
                />
              </div>
            )}

            {/* Benefits */}
            {customization && customization.show_benefits && (
              <BenefitsList
                benefits={customization.benefits}
                showGuarantees={customization.show_guarantees}
                guaranteeDays={customization.guarantee_days}
              />
            )}

            {/* Testimonials */}
            {config?.exibir_testemunhos && testimonials && testimonials.length > 0 && (
              <TestimonialSection testimonials={testimonials} />
            )}
          </div>

          {/* Right Column - Payment Information */}
          <div className="space-y-6">
            <CheckoutSummary
              product={produto}
              config={config}
              onContinue={handlePaymentContinue}
            />

            {/* FAQ Section */}
            {customization && customization.show_faq && (
              <FaqSection faqs={customization.faqs} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
