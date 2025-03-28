
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProdutoBySlug } from '@/services/produtoService';
import { usePixel } from '@/hooks/usePixel';
import { getCheckoutConfig } from '@/services/checkoutConfigService';
import { getConfig } from '@/services/configService';
import { getTestimonials } from '@/services/testimonialService';
import ProductDetails from '@/components/checkout/ProductDetails';
import ConfigDetails from '@/components/checkout/ConfigDetails';
import ErrorCard from '@/components/checkout/ErrorCard';
import TestimonialCard from '@/components/TestimonialCard';
import { formatCurrency } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { CheckCircle, Star, Users } from 'lucide-react';
import VisitorCounter from '@/components/VisitorCounter';

const CheckoutPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [numParcelas, setNumParcelas] = useState<number>(1);
  
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

  if (isProdutoLoading || isCheckoutConfigLoading || isConfigLoading) {
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

  const handleParcelaChange = (value: string) => {
    setNumParcelas(parseInt(value, 10));
  };

  const handlePaymentContinue = () => {
    if (produto?.slug) {
      navigate(`/checkout/${produto.slug}/pix`);
    } else {
      navigate(`/checkout/${produto.id}/pix`);
    }
  };

  // Colors from the configuration or defaults
  const primaryColor = config?.cor_botao || checkoutConfig?.cor_primaria || '#22c55e';
  const bgColor = config?.cor_fundo || checkoutConfig?.cor_secundaria || '#f9fafb';
  const buttonText = config?.texto_botao || 'Continuar para pagamento';

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">{produto.nome}</h1>
          <p className="text-gray-600 mt-2">{produto.descricao?.substring(0, 100)}{produto.descricao?.length > 100 ? '...' : ''}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Product Information */}
          <div className="space-y-6">
            {/* Product Image */}
            <div className="rounded-lg overflow-hidden shadow-md">
              <img 
                src={produto.imagem_url || "/lovable-uploads/5bdb8fb7-f326-419c-9013-3ab40582ff09.png"} 
                alt={produto.nome}
                className="w-full h-auto object-cover"
              />
            </div>

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
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">O que você vai receber</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Acesso imediato após a confirmação do pagamento</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Suporte técnico disponível 24h por dia</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Garantia de 7 dias ou seu dinheiro de volta</span>
                </li>
              </ul>
            </div>

            {/* Testimonials */}
            {config?.exibir_testemunhos && testimonials && testimonials.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Avaliações dos clientes</h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">4.8/5</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {testimonials.map(testimonial => (
                    <TestimonialCard 
                      key={testimonial.id}
                      userName={testimonial.userName}
                      comment={testimonial.comment}
                      rating={testimonial.rating}
                      avatar={testimonial.avatar}
                      date={testimonial.date}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Payment Information */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold">{produto.nome}</h2>
                  <div className="flex items-center mt-1">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Oferta especial</Badge>
                    <span className="text-sm text-gray-500 ml-2">Disponível por tempo limitado</span>
                  </div>
                </div>
                <div className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-primary">Ver detalhes</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <div className="p-4">
                        <h3 className="text-lg font-bold mb-2">{produto.nome}</h3>
                        <p className="mb-4">{produto.descricao}</p>
                        <div>
                          <h4 className="font-medium mb-1">Preço:</h4>
                          <p>{formatCurrency(produto.preco)}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-4 my-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>{formatCurrency(produto.preco)}</span>
                </div>
                <div className="flex justify-between items-center text-green-600">
                  <span>Desconto:</span>
                  <span>- {formatCurrency(0)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold">Total:</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary">{formatCurrency(produto.preco)}</span>
                  {produto.parcelas > 1 && (
                    <div className="text-sm text-gray-500">
                      ou {produto.parcelas}x de {formatCurrency(produto.preco / produto.parcelas)}
                    </div>
                  )}
                </div>
              </div>

              <Button 
                className="w-full py-6 text-lg" 
                style={{ backgroundColor: primaryColor }}
                onClick={handlePaymentContinue}
              >
                {buttonText}
              </Button>

              <div className="mt-4 text-center text-sm text-gray-500">
                <p>Pagamento 100% seguro</p>
                <div className="flex justify-center space-x-2 mt-2">
                  <img src="/pix-logo.png" alt="PIX" className="h-6" />
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Perguntas frequentes</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Como funciona o pagamento?</h4>
                  <p className="text-sm text-gray-600">Oferecemos pagamento via PIX para maior praticidade e segurança.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Quanto tempo leva para ter acesso?</h4>
                  <p className="text-sm text-gray-600">Após a confirmação do pagamento, o acesso é liberado imediatamente.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Posso pedir reembolso?</h4>
                  <p className="text-sm text-gray-600">Sim, oferecemos garantia de 7 dias. Se não estiver satisfeito, devolvemos seu dinheiro.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
