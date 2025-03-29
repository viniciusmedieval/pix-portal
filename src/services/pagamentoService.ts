
import { supabase } from '@/integrations/supabase/client';

interface DadosPagamento {
  pedido_id: string;
  metodo_pagamento: string;
  numero_cartao: string;
  nome_cartao: string;
  validade: string;
  cvv: string;
  parcelas: number;
}

export async function criarPagamento(dadosPagamento: DadosPagamento) {
  const { data, error } = await supabase
    .from('pagamentos')
    .insert([dadosPagamento])
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar pagamento:', error);
    throw error;
  }

  return data;
}

export async function obterPagamentoPorPedido(pedidoId: string) {
  const { data, error } = await supabase
    .from('pagamentos')
    .select('*')
    .eq('pedido_id', pedidoId)
    .maybeSingle();

  if (error) {
    console.error('Erro ao obter pagamento:', error);
    throw error;
  }

  return data;
}
