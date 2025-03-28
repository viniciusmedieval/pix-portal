import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/database.types';

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
}) {
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
}) {
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
