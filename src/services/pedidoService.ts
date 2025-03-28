
import { supabase } from '@/integrations/supabase/client';

type NovoPedido = {
  produto_id: string;
  nome_cliente: string;
  email_cliente: string;
  cpf_cliente?: string;
  valor: number;
  forma_pagamento: 'pix' | 'cartao';
  status?: 'pendente' | 'pago' | 'recusado';
};

export async function criarPedido(pedido: NovoPedido) {
  const { data, error } = await supabase
    .from('pedidos')
    .insert([
      {
        ...pedido,
        status: pedido.status || 'pendente',
      },
    ])
    .select();

  if (error) throw error;
  return data[0];
}

export async function listarPedidos() {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*, produtos(nome)')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getPedidoById(id: string) {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*, produtos(nome)')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function atualizarStatusPedido(id: string, status: string) {
  const { data, error } = await supabase
    .from('pedidos')
    .update({ status })
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
}
