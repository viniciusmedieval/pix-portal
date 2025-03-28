import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProdutoBySlug } from '@/services/produtoService';
import { getConfig } from '@/services/configService';
import { getTestimonials } from '@/services/testimonialService';
import { getCheckoutCustomization } from '@/services/checkoutCustomizationService';
import { usePixel } from '@/hooks/usePixel';
import Timer from '@/components/checkout/Timer';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import ProductSummary from '@/components/checkout/ProductSummary';
import BenefitsList from '@/components/checkout/BenefitsList';
import TestimonialsSection, { Testimonial } from '@/components/checkout/TestimonialsSection';
import UserCounter from '@/components/checkout/UserCounter';
import { Button } from '@/components/ui/button';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';

export default function CheckoutPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [paymentFormVisible, setPaymentFormVisible] = useState(false);
  
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
  const bgColor = config?.cor_fundo || '#f9fafb';
  
  // Determine if timer should be displayed
  const showTimer = config?.timer_enabled || false;
  const timerMinutes = config?.timer_minutes || 15;
  const timerText = config?.timer_text || 'Tempo limitado! Preço promocional encerrará em breve';
  
  const handleContinueToPayment = () => {
    setPaymentFormVisible(true);
    // Scroll to payment form
    setTimeout(() => {
      document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Map testimonials to expected format
  const formattedTestimonials: Testimonial[] = testimonials?.map(t => ({
    id: t.id,
    user_name: t.user_name,
    rating: t.rating,
    comment: t.comment,
    avatar_url: t.avatar_url
  })) || [];

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
        <div className="max-w-5xl mx-auto">
          {/* Product banner if exists */}
          {config?.qr_code && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img 
                src={config.qr_code} 
                alt={produto.nome} 
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-8">
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
              {customization?.show_testimonials && formattedTestimonials.length > 0 && (
                <TestimonialsSection 
                  testimonials={formattedTestimonials} 
                  title={customization.testimonials_title}
                />
              )}
            </div>
            
            {/* Right column - Checkout */}
            <div className="space-y-6">
              {!paymentFormVisible ? (
                <CheckoutSummary 
                  product={{
                    id: produto.id,
                    nome: produto.nome,
                    descricao: produto.descricao,
                    preco: produto.preco,
                    parcelas: produto.parcelas,
                    slug: produto.slug
                  }}
                  config={config}
                  onContinue={handleContinueToPayment}
                />
              ) : (
                <div id="payment-section">
                  <CheckoutForm 
                    produto={{
                      id: produto.id,
                      nome: produto.nome,
                      preco: produto.preco,
                      parcelas: produto.parcelas,
                    }}
                    customization={customization}
                    config={config}
                  />
                </div>
              )}
              
              {/* Visitor counter */}
              {config?.numero_aleatorio_visitas && (
                <UserCounter baseNumber={100} />
              )}
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
