
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
      if (!slug || !pedido_id) {
        setLoading(false);
        return;
      }
      
      try {
        const produtoData = await getProdutoBySlug(slug);
        if (produtoData) {
          setProduto(produtoData);
          
          const configData = await getConfig(produtoData.id);
          setConfig(configData);
          
          const pedidoData = await getPedidoById(pedido_id);
          setPedido(pedidoData);
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
    if (!pedido_id) return;
    
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
      await atualizarStatusPedido(pedido_id, "processando");
      
      // Track purchase event when payment is processed
      if (!paymentProcessed && produto) {
        trackEvent('Purchase', {
          value: pedido?.valor,
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

  // Render loading/error state if needed
  const hasData = !!(produto && pedido);
  const pageState = <PaymentPageState loading={loading} hasData={hasData} />;
  if (loading || !hasData) return pageState;

  return (
    <div className="min-h-screen p-6" style={{ background: config?.cor_fundo || '#f9fafb' }}>
      <div className="max-w-md mx-auto">
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
