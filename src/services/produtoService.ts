
import { supabase } from '@/integrations/supabase/client';

export async function getProdutoBySlug(slug: string) {
  const { data, error } = await supabase.from('produtos').select('*').eq('slug', slug).single();
  if (error) throw error;
  return data;
}

export async function getProdutoById(id: string) {
  const { data, error } = await supabase.from('produtos').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function listarProdutos() {
  const { data, error } = await supabase.from('produtos').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function criarProduto(produto: {
  nome: string;
  preco: number;
  descricao?: string;
  imagem?: string;
  slug: string;
  parcelas_permitidas?: number;
}) {
  const { data, error } = await supabase.from('produtos').insert([produto]).select();
  if (error) throw error;
  return data[0];
}

export async function atualizarProduto(id: string, produto: {
  nome?: string;
  preco?: number;
  descricao?: string;
  imagem?: string;
  slug?: string;
  parcelas_permitidas?: number;
}) {
  const { data, error } = await supabase.from('produtos').update(produto).eq('id', id).select();
  if (error) throw error;
  return data[0];
}

export async function excluirProduto(id: string) {
  const { error } = await supabase.from('produtos').delete().eq('id', id);
  if (error) throw error;
  return true;
}
