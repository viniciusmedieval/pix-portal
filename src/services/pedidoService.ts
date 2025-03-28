
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/database.types';
import { verificarEstoque, atualizarEstoque } from '@/services/produtoService';

export type PedidoType = Database['public']['Tables']['pedidos']['Row'];

export async function getPedidos() {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .order('criado_em', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function verificarCpfDuplicado(cpf: string) {
  const { data, error } = await supabase
    .from('pedidos')
    .select('id')
    .eq('cpf', cpf)
    .limit(1);
  
  if (error) throw error;
  return data && data.length > 0;
}

export async function salvarPedido(pedido: {
  produto_id: string;
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  valor: number;
  forma_pagamento: string;
  quantidade?: number;
}) {
  // Verificar estoque antes de salvar o pedido
  if (pedido.quantidade) {
    const estoqueDisponivel = await verificarEstoque(pedido.produto_id);
    if (estoqueDisponivel < pedido.quantidade) {
      throw new Error('Estoque insuficiente para completar o pedido');
    }
  }

  const { data, error } = await supabase
    .from('pedidos')
    .insert({
      produto_id: pedido.produto_id,
      nome: pedido.nome,
      email: pedido.email,
      telefone: pedido.telefone,
      cpf: pedido.cpf,
      valor: pedido.valor,
      forma_pagamento: pedido.forma_pagamento,
      status: 'pendente'
    })
    .select()
    .single();

  if (error) throw error;
  
  // Atualizar o estoque se for especificada a quantidade
  if (pedido.quantidade) {
    const estoqueAtual = await verificarEstoque(pedido.produto_id);
    await atualizarEstoque(pedido.produto_id, estoqueAtual - pedido.quantidade);
  }
  
  return data;
}

export async function criarPedido(pedido: {
  produto_id: string;
  nome_cliente?: string;
  email_cliente?: string;
  telefone_cliente?: string;
  cpf_cliente?: string;
  valor: number;
  forma_pagamento: string;
  status?: string;
  quantidade?: number;
}) {
  // Verificar estoque antes de criar o pedido
  if (pedido.quantidade) {
    const estoqueDisponivel = await verificarEstoque(pedido.produto_id);
    if (estoqueDisponivel < pedido.quantidade) {
      throw new Error('Estoque insuficiente para completar o pedido');
    }
  }

  const { data, error } = await supabase
    .from('pedidos')
    .insert({
      produto_id: pedido.produto_id,
      nome: pedido.nome_cliente,
      email: pedido.email_cliente,
      telefone: pedido.telefone_cliente,
      cpf: pedido.cpf_cliente,
      valor: pedido.valor,
      forma_pagamento: pedido.forma_pagamento,
      status: pedido.status || 'pendente'
    })
    .select()
    .single();

  if (error) throw error;
  
  // Atualizar o estoque se for especificada a quantidade
  if (pedido.quantidade) {
    const estoqueAtual = await verificarEstoque(pedido.produto_id);
    await atualizarEstoque(pedido.produto_id, estoqueAtual - pedido.quantidade);
  }
  
  return data;
}

export async function atualizarStatusPedido(id: string, status: string) {
  const { data, error } = await supabase
    .from('pedidos')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPedidoById(id: string) {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function listarPedidos() {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*, produtos(nome)')
    .order('criado_em', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function atualizarStatusPagamento(pedidoId: string, status: 'Pago' | 'Falhou') {
  const { data, error } = await supabase
    .from('pedidos')
    .update({ 
      status_pagamento: status, 
      status: status === 'Pago' ? 'pago' : 'cancelado',
      atualizado_em: new Date().toISOString() 
    })
    .eq('id', pedidoId)
    .select();

  if (error) {
    console.error('Erro ao atualizar status do pagamento:', error);
    return null;
  }
  return data;
}

export async function excluirPedido(pedidoId: string) {
  const { error } = await supabase
    .from('pedidos')
    .delete()
    .eq('id', pedidoId);

  if (error) {
    console.error('Erro ao excluir pedido:', error);
    return false;
  }
  return true;
}

export async function cancelarPedido(pedidoId: string) {
  // Buscar pedido para pegar produto_id e quantidade
  const { data: pedido, error: pedidoError } = await supabase
    .from('pedidos')
    .select('produto_id')
    .eq('id', pedidoId)
    .single();

  if (pedidoError || !pedido) {
    console.error('Erro ao buscar pedido:', pedidoError);
    return false;
  }

  // Verificar estoque atual
  const estoqueAtual = await verificarEstoque(pedido.produto_id);

  // Marcar o pedido como cancelado
  const { error } = await supabase
    .from('pedidos')
    .update({ 
      status: 'cancelado',
      status_pagamento: 'Cancelado' 
    })
    .eq('id', pedidoId);

  if (error) {
    console.error('Erro ao cancelar pedido:', error);
    return false;
  }

  return true;
}

export async function gerarRelatorioVendas(
  statusPagamento: string = 'Todos', 
  dataInicio: string = '', 
  dataFim: string = ''
) {
  let query = supabase
    .from('pedidos')
    .select('*, produtos(nome)');

  // Aplicar filtros de status de pagamento
  if (statusPagamento !== 'Todos') {
    query = query.eq('status', statusPagamento.toLowerCase());
  }

  // Filtrar por data de início e fim
  if (dataInicio) {
    query = query.gte('criado_em', `${dataInicio}T00:00:00`);
  }

  if (dataFim) {
    query = query.lte('criado_em', `${dataFim}T23:59:59`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao gerar relatório de vendas:', error);
    return [];
  }

  return data || [];
}
