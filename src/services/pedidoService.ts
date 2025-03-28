
import { supabase } from '@/integrations/supabase/client';

export async function listarPedidos() {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*, produtos(nome)')
    .order('criado_em', { ascending: false });
  
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

export async function criarPedido(pedido: {
  produto_id: string;
  nome: string;
  email: string;
  telefone?: string;
  cpf: string;
  valor: number;
  forma_pagamento: string;
  status?: string;
}) {
  const { data, error } = await supabase
    .from('pedidos')
    .insert([{
      ...pedido,
      status: pedido.status || 'pendente'
    }])
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
