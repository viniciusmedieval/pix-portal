
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProdutoBySlug } from '@/services/produtoService';
import { getConfig } from '@/services/configService';
import { getTestimonials } from '@/services/testimonialService';
import { getCheckoutCustomization } from '@/services/checkoutCustomizationService';
import { usePixel } from '@/hooks/usePixel';
import Timer from '@/components/checkout/Timer';
import CheckoutLoading from '@/components/checkout/CheckoutLoading';
import CheckoutError from '@/components/checkout/CheckoutError';
import CheckoutLayout from '@/components/checkout/CheckoutLayout';
import CheckoutContent from '@/components/checkout/CheckoutContent';

export interface Testimonial {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  avatar_url?: string;
}

const CheckoutPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { trackEvent } = usePixel(); 
  
  useEffect(() => {
    if (!slug) {
      console.error("Missing slug parameter in URL");
      navigate('/');
    }
  }, [slug, navigate]);

  // Fetch product data
  const { data: produto, isLoading: isProdutoLoading, isError: isProdutoError, error: produtoError } = useQuery({
    queryKey: ['produto', slug],
    queryFn: async () => {
      if (!slug) return null;
      console.log(`Fetching product with slug: ${slug}`);
      const data = await getProdutoBySlug(slug);
      if (!data) {
        console.error(`Product not found for slug: ${slug}`);
        return null;
      }
      console.log(`Product found:`, data);
      return data;
    },
    enabled: !!slug,
    retry: 3,
    retryDelay: (attempt) => Math.min(attempt > 1 ? 2000 : 1000, 30 * 1000),
  });

  // Fetch product-specific config
  const { data: config, isLoading: isConfigLoading } = useQuery({
    queryKey: ['config', produto?.id],
    queryFn: () => produto?.id ? getConfig(produto.id) : null,
    enabled: !!produto?.id,
  });
  
  // Fetch customization settings
  const { data: customization, isLoading: isCustomizationLoading } = useQuery({
    queryKey: ['customization', produto?.id],
    queryFn: () => produto?.id ? getCheckoutCustomization(produto.id) : null,
    enabled: !!produto?.id,
  });

  // Fetch testimonials
  const { data: testimonials, isLoading: isTestimonialsLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => getTestimonials(3),
    enabled: !!produto?.id,
  });

  // Fire pixel event for checkout page view if product exists
  useEffect(() => {
    if (produto?.id) {
      trackEvent('InitiateCheckout');
    }
  }, [produto?.id, trackEvent]);

  // Loading state
  const isLoading = isProdutoLoading || (produto && (isConfigLoading || isCustomizationLoading));
  
  if (isLoading && !isProdutoError) {
    return <CheckoutLoading />;
  }
  
  // Error state or product not found
  if (isProdutoError || !produto) {
    const errorMessage = `Não foi possível encontrar o produto com identificador "${slug}". Verifique se o link está correto.`;
    console.error(errorMessage, produtoError);
    return <CheckoutError 
      title="Produto não encontrado" 
      message={errorMessage} 
      showModal={true}
    />;
  }

  // Get background color from config
  const bgColor = config?.cor_fundo || '#f5f5f5';
  
  // Determine if timer should be displayed
  const showTimer = config?.timer_enabled || false;
  const timerMinutes = config?.timer_minutes || 15;
  const timerText = config?.timer_text || 'Tempo limitado! Preço promocional encerrará em breve';
  
  // Map testimonials to expected format
  const formattedTestimonials: Testimonial[] = testimonials?.map(t => ({
    id: t.id,
    user_name: t.user_name,
    rating: t.rating,
    comment: t.comment,
    avatar_url: t.avatar_url
  })) || [];

  // Fix the banner image reference - using either the uploaded image or the hardcoded one
  const bannerImage = produto.imagem_url || "/lovable-uploads/7daca95d-4e0c-4264-9cb1-4c68d2da5551.png";

  return (
    <>
      <CheckoutLayout
        bgColor={bgColor}
        showHeader={true}
        headerMessage={customization?.header_message || "Tempo restante! Garanta sua oferta"}
        showFooter={customization?.show_footer || false}
        footerText={customization?.footer_text}
        customCss={customization?.custom_css}
        bannerImage={bannerImage}
      >
        <CheckoutContent
          producto={produto}
          config={config}
          customization={customization}
          testimonials={formattedTestimonials}
          bannerImage={bannerImage}
        />
      </CheckoutLayout>
    </>
  );
};

export default CheckoutPage;
