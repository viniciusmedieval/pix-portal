
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
  
  useEffect(() => {
    if (!slug) {
      console.error("Missing slug parameter in URL");
      navigate('/');
    }
  }, [slug, navigate]);

  // Fetch product data
  const { data: produto, isLoading: isProdutoLoading, isError: isProdutoError } = useQuery({
    queryKey: ['produto', slug],
    queryFn: () => slug ? getProdutoBySlug(slug) : null,
    enabled: !!slug,
    retry: 1,
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
    enabled: !!customization?.show_testimonials,
  });

  // Fire pixel event for checkout page view
  usePixel(produto?.id, 'InitiateCheckout');

  // Loading state
  const isLoading = isProdutoLoading || isConfigLoading || isCustomizationLoading || isTestimonialsLoading;
  
  if (isLoading) {
    return <CheckoutLoading />;
  }
  
  // Error state
  if (isProdutoError || !produto) {
    return <CheckoutError />;
  }

  // Get background color from config
  const bgColor = config?.cor_fundo || '#f9fafb';
  
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

  return (
    <>
      {/* Timer */}
      {showTimer && (
        <Timer minutes={timerMinutes} text={timerText} />
      )}
      
      <CheckoutLayout
        bgColor={bgColor}
        showHeader={customization?.show_header || false}
        headerTitle={produto.nome}
        headerMessage={customization?.header_message}
        showFooter={customization?.show_footer || false}
        footerText={customization?.footer_text}
        customCss={customization?.custom_css}
      >
        <CheckoutContent
          producto={produto}
          config={config}
          customization={customization}
          testimonials={formattedTestimonials}
          bannerImage={config?.qr_code}
        />
      </CheckoutLayout>
    </>
  );
};

export default CheckoutPage;
