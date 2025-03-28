
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProdutoBySlug } from '@/services/produtoService';
import { getCheckoutConfig } from '@/services/configService';
import { getConfig } from '@/services/configService';
import { getTestimonials } from '@/services/testimonialService';
import { getCheckoutCustomization } from '@/services/checkoutCustomizationService';
import { usePixel } from '@/hooks/usePixel';
import Timer from '@/components/checkout/Timer';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import ProductSummary from '@/components/checkout/ProductSummary';
import BenefitsList from '@/components/checkout/BenefitsList';
import TestimonialsSection from '@/components/checkout/TestimonialsSection';
import UserCounter from '@/components/checkout/UserCounter';
import { Button } from '@/components/ui/button';

export default function CheckoutPage() {
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

  // Fetch checkout configurations
  const { data: checkoutConfig, isLoading: isCheckoutConfigLoading } = useQuery({
    queryKey: ['checkoutConfig'],
    queryFn: () => getCheckoutConfig(),
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
  const isLoading = isProdutoLoading || isCheckoutConfigLoading || isConfigLoading || isCustomizationLoading || isTestimonialsLoading;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  // Error state
  if (isProdutoError || !produto) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Produto não encontrado</h2>
          <p className="text-gray-600 mt-2">O produto que você está procurando não existe ou não está disponível.</p>
          <Button 
            onClick={() => navigate('/')}
            className="mt-4"
          >
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    );
  }

  // Get background color from config
  const bgColor = config?.cor_fundo || checkoutConfig?.cor_secundaria || '#f9fafb';
  
  // Determine if timer should be displayed
  const showTimer = config?.timer_enabled || false;
  const timerMinutes = config?.timer_minutes || 15;
  const timerText = config?.timer_text || 'Tempo limitado! Preço promocional encerrará em breve';
  
  return (
    <div style={{ backgroundColor: bgColor }}>
      {/* Timer */}
      {showTimer && (
        <Timer minutes={timerMinutes} text={timerText} />
      )}
      
      {/* Header */}
      {customization?.show_header && (
        <header className="bg-black text-white py-4 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-xl font-bold">{produto.nome}</h1>
            {customization?.header_message && (
              <p className="text-sm mt-1">{customization.header_message}</p>
            )}
          </div>
        </header>
      )}

      {/* Main content */}
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Product banner if exists */}
          {config?.banner_url && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img 
                src={config.banner_url} 
                alt={produto.nome} 
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left column - Product info & benefits */}
            <div className="space-y-6">
              {/* Benefits */}
              {customization?.show_benefits && customization?.benefits && customization.benefits.length > 0 && (
                <BenefitsList 
                  benefits={customization.benefits} 
                  showGuarantees={customization.show_guarantees}
                  guaranteeDays={customization.guarantee_days}
                />
              )}
              
              {/* Testimonials */}
              {customization?.show_testimonials && testimonials && testimonials.length > 0 && (
                <TestimonialsSection 
                  testimonials={testimonials} 
                  title={customization.testimonials_title}
                />
              )}
            </div>
            
            {/* Right column - Checkout form */}
            <div className="space-y-6">
              {/* Product summary */}
              <ProductSummary 
                produto={produto}
                config={config}
              />
              
              {/* Checkout form */}
              <CheckoutForm 
                produto={produto}
                customization={customization}
                config={config}
              />
              
              {/* Visitor counter */}
              {config?.numero_aleatorio_visitas && (
                <UserCounter baseNumber={checkoutConfig?.visitantes_max || 100} />
              )}
              
              {/* Security badge */}
              <div className="flex justify-center items-center mt-2">
                <svg className="w-4 h-4 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599.8a1 1 0 01.506.84l.032 6.83c0 .12-.026.237-.075.346a1 1 0 01-.319.395l-6 4.5a1 1 0 01-1.196 0l-6-4.5a1 1 0 01-.394-.74V6.545a1 1 0 01.617-.927L10 3.323V3a1 1 0 011-1zm0 2.618L4.792 7.635l4.708 1.876 5.5-2.2V8.5l-5.5 2.2v7.21l5.5-4.12V8.192l-4.708 1.883L4.5 8.192v4.698l5.5 4.12v-7.21l-5.5-2.2V6.545l5.5-1.927z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-gray-500">
                  {config?.payment_security_text || 'Compra 100% segura'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      {customization?.show_footer && (
        <footer className="bg-gray-100 py-4 text-center text-sm text-gray-500 mt-8">
          <div className="container mx-auto px-4">
            {customization?.footer_text ? (
              <p>{customization.footer_text}</p>
            ) : (
              <p>© {new Date().getFullYear()} - Todos os direitos reservados</p>
            )}
          </div>
        </footer>
      )}
      
      {/* Custom CSS */}
      {customization?.custom_css && (
        <style>{customization.custom_css}</style>
      )}
    </div>
  );
}
