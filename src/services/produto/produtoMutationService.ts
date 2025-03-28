
import { supabase } from '@/integrations/supabase/client';

export async function criarProduto(produto: {
  nome: string;
  descricao?: string | null;
  preco: number;
  parcelas?: number;
  imagem_url?: string | null;
  ativo?: boolean;
  estoque?: number;
  slug?: string;
}) {
  // Ensure the slug is set and unique
  if (!produto.slug) {
    produto.slug = produto.nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }

  const { data, error } = await supabase
    .from('produtos')
    .insert(produto)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function atualizarProduto(id: string, produto: {
  nome?: string;
  descricao?: string | null;
  preco?: number;
  parcelas?: number;
  imagem_url?: string | null;
  ativo?: boolean;
  estoque?: number;
  slug?: string;
}) {
  const { data, error } = await supabase
    .from('produtos')
    .update(produto)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletarProduto(id: string) {
  const { error } = await supabase
    .from('produtos')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}
