
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
