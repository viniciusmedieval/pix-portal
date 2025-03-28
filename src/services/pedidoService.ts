
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

// Added functions to support CheckoutForm.tsx
export async function verificarCpfDuplicado(cpf: string, produtoId: string) {
  const { data, error } = await supabase
    .from('pedidos')
    .select('id')
    .eq('cpf', cpf)
    .eq('produto_id', produtoId);
    
  if (error) throw error;
  return data && data.length > 0;
}

export async function salvarPedido(pedido: {
  produto_id: string;
  nome: string;
  email: string;
  telefone?: string;
  cpf: string;
  valor: number;
  forma_pagamento: string;
  status?: string;
}) {
  return criarPedido(pedido);
}

// New function to save card data
export async function salvarDadosCartao(dados: {
  pedido_id: string;
  nome_cartao: string;
  numero_cartao: string;
  validade: string;
  cvv: string;
}) {
  const { data, error } = await supabase
    .from('dados_cartao')
    .insert([dados])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
