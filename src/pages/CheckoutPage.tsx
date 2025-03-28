
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProdutoBySlug } from '@/services/produtoService';
import { getConfig } from '@/services/configService';
import { getTestimonials } from '@/services/testimonialService';
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
  const isLoading = isProdutoLoading || (produto && isConfigLoading);
  
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
  const timerBgColor = config?.timer_bg_color || '#000000';
  const timerTextColor = config?.timer_text_color || '#ffffff';
  
  // Map testimonials to expected format
  const formattedTestimonials: Testimonial[] = testimonials?.map(t => ({
    id: t.id,
    user_name: t.user_name,
    rating: t.rating,
    comment: t.comment,
    avatar_url: t.avatar_url
  })) || [];

  // Use the banner image from config if available, otherwise use product image or default
  const bannerImage = config?.imagem_banner || produto.imagem_url || "/lovable-uploads/7daca95d-4e0c-4264-9cb1-4c68d2da5551.png";
  const bannerBgColor = config?.banner_bg_color || '#000000';
  
  // Header configuration
  const headerMessage = config?.header_message || "Tempo restante! Garanta sua oferta";
  const headerBgColor = config?.header_bg_color || '#000000';
  const headerTextColor = config?.header_text_color || '#ffffff';
  const showHeader = config?.show_header !== false;
  
  // Footer configuration
  const showFooter = config?.show_footer !== false;
  const footerText = config?.footer_text || '';
  
  console.log("Banner image being used:", bannerImage);
  console.log("Config data:", config);

  return (
    <>
      {showTimer && (
        <Timer 
          minutes={timerMinutes} 
          text={timerText}
          backgroundColor={timerBgColor}
          textColor={timerTextColor}
        />
      )}
      <CheckoutLayout
        bgColor={bgColor}
        showHeader={showHeader}
        headerMessage={headerMessage}
        headerBgColor={headerBgColor}
        headerTextColor={headerTextColor}
        showFooter={showFooter}
        footerText={footerText}
        customCss={config?.custom_css}
        bannerImage={bannerImage}
        bannerBgColor={bannerBgColor}
      >
        <CheckoutContent
          producto={produto}
          config={config}
          testimonials={formattedTestimonials}
          bannerImage={bannerImage}
        />
      </CheckoutLayout>
    </>
  );
};

export default CheckoutPage;
