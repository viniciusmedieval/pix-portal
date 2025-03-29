
import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPedidoById, atualizarStatusPedido } from "@/services/pedidoService";
import { getProdutoBySlug } from "@/services/produtoService";
import { getConfig } from "@/services/configService";
import { toast } from "@/hooks/use-toast";
import usePixel from "@/hooks/usePixel";

// Import the components
import CreditCardForm, { CreditCardFormValues } from "@/components/payment/CreditCardForm";
import ProductSummary from "@/components/payment/ProductSummary";
import PaymentPageState from "@/components/payment/PaymentPageState";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CartaoPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const pedido_id = searchParams.get('pedido_id');
  const navigate = useNavigate();

  const [pedido, setPedido] = useState<any>(null);
  const [produto, setProduto] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  
  // Initialize pixel tracking
  const { trackEvent } = usePixel();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data for CartaoPage with slug:", slug);
        
        if (!slug) {
          console.error("No slug provided");
          setLoading(false);
          return;
        }
        
        // First fetch the product data by slug
        const produtoData = await getProdutoBySlug(slug);
        console.log("Product data retrieved:", produtoData);
        
        if (!produtoData) {
          console.error("Product not found");
          setLoading(false);
          return;
        }
        
        setProduto(produtoData);
        
        // Then fetch the config using the product ID
        const configData = await getConfig(produtoData.id);
        console.log("Config data retrieved:", configData);
        setConfig(configData);
        
        // Finally, if a pedido_id was provided, fetch the order data
        // For testing/demo purposes, if no pedido_id is provided, we'll create a mock order
        if (pedido_id) {
          console.log("Fetching order data for ID:", pedido_id);
          try {
            const pedidoData = await getPedidoById(pedido_id);
            setPedido(pedidoData);
          } catch (error) {
            console.error("Error fetching order, creating mock order:", error);
            // Create a mock order if we can't fetch the real one
            setPedido({
              id: pedido_id || 'mock_id',
              nome: 'Cliente',
              email: 'cliente@exemplo.com',
              valor: produtoData.preco,
              status: 'pendente'
            });
          }
        } else {
          console.log("No pedido_id provided, creating mock order");
          // Create a mock order for demonstration
          setPedido({
            id: 'mock_' + Math.random().toString(36).substring(2, 9),
            nome: 'Cliente',
            email: 'cliente@exemplo.com',
            valor: produtoData.preco,
            status: 'pendente'
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do pedido",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [slug, pedido_id]);

  const onSubmit = async (data: CreditCardFormValues) => {
    if (!pedido?.id) {
      toast({
        title: "Erro",
        description: "Informações do pedido não encontradas",
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);
    try {
      // Basic "encryption" - in a real app, use proper encryption
      console.log('Dados do cartão:', {
        nome_cartao: data.nome_cartao,
        numero_cartao: data.numero_cartao.replace(/\d(?=\d{4})/g, "*"), // Mask all but last 4 digits for logging
        validade: data.validade,
        cvv: "***", // Don't log CVV
      });
      
      // Update pedido status
      if (pedido.id && pedido.id !== 'mock_id' && !pedido.id.startsWith('mock_')) {
        await atualizarStatusPedido(pedido.id, "processando");
      } else {
        console.log("Mock order - would update status to 'processando'");
      }
      
      // Track purchase event when payment is processed
      if (!paymentProcessed && produto) {
        trackEvent('Purchase', {
          value: pedido?.valor || produto?.preco,
          currency: 'BRL',
          content_name: produto?.nome,
          payment_type: 'credit_card',
          produtoId: produto?.id
        });
        setPaymentProcessed(true);
      }
      
      toast({
        title: "Pagamento Recebido",
        description: "Seu pagamento foi recebido e está sendo processado.",
      });
      
      // Navigate to home after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error("Error submitting payment:", error);
      toast({
        title: "Erro no Pagamento",
        description: "Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoBack = () => {
    if (slug) {
      navigate(`/checkout/${slug}`);
    } else {
      navigate('/');
    }
  };

  // Render loading/error state if needed
  const hasData = !!(produto);
  
  if (loading) {
    return <PaymentPageState loading={true} hasData={true} />;
  }
  
  if (!hasData) {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <PaymentPageState loading={false} hasData={false} />
        <Button 
          variant="outline" 
          className="mt-6"
          onClick={handleGoBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para checkout
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ background: config?.cor_fundo || '#f9fafb' }}>
      <div className="max-w-md mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={handleGoBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Pagamento com Cartão</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Product Info Component */}
            <ProductSummary 
              produto={produto} 
              pedido={pedido} 
              config={{
                discount_badge_enabled: config?.discount_badge_enabled,
                discount_badge_text: config?.discount_badge_text,
                discount_amount: config?.discount_amount,
                original_price: config?.original_price
              }} 
            />
            
            {/* Credit Card Form Component */}
            <CreditCardForm 
              onSubmit={onSubmit} 
              submitting={submitting} 
              buttonColor={config?.cor_botao}
              buttonText={config?.texto_botao_pagamento || "Confirmar Pagamento"}
            />
          </CardContent>
        </Card>
        
        <div className="mt-4 text-sm text-center text-gray-500">
          <p>Seus dados estão protegidos com criptografia de ponta a ponta.</p>
        </div>
      </div>
    </div>
  );
}
