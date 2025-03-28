
import { supabase } from '@/integrations/supabase/client';

export async function verificarCpfDuplicado(cpf: string, produtoId: string) {
  const { data, error } = await supabase
    .from('pedidos')
    .select('id')
    .eq('cpf', cpf)
    .eq('produto_id', produtoId)
    .limit(1);

  if (error) throw error;

  return data.length > 0;
}

export async function salvarPedido(dados: {
  produto_id: string;
  nome: string;
  email: string;
  telefone?: string;
  cpf: string;
  valor: number;
  forma_pagamento: 'pix' | 'cartao';
}) {
  const { data, error } = await supabase.from('pedidos').insert([dados]).select();

  if (error) throw error;
  return data?.[0];
}

export async function buscarPedidoPorId(id: string) {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*, produtos(*)') 
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}
