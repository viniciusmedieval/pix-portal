import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/database.types';

// Export the complete ProdutoType with all fields
export type ProdutoType = Database['public']['Tables']['produtos']['Row'];

export async function getProdutos() {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .order('criado_em', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getProdutoById(id: string) {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getProdutoBySlug(slug: string) {
  // Decode the slug in case it was encoded in the URL
  const decodedSlug = decodeURIComponent(slug);
  
  try {
    // First try to find by slug
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('slug', decodedSlug)
      .maybeSingle();

    if (error) throw error;
    
    // If not found by slug, try by ID (in case the slug is actually an ID)
    if (!data) {
      const { data: dataById, error: errorById } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', slug)
        .maybeSingle();
        
      if (errorById) throw errorById;
      return dataById;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching produto by slug:', error);
    throw error;
  }
}

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

export async function verificarEstoque(produtoId: string) {
  const { data, error } = await supabase
    .from('produtos')
    .select('estoque')
    .eq('id', produtoId)
    .single();

  if (error) {
    console.error('Erro ao verificar estoque:', error);
    return 0;
  }
  
  return data?.estoque !== undefined ? data.estoque : 0;
}

export async function atualizarEstoque(produtoId: string, novaQuantidade: number) {
  const { error } = await supabase
    .from('produtos')
    .update({ estoque: novaQuantidade })
    .eq('id', produtoId);

  if (error) {
    console.error('Erro ao atualizar estoque:', error);
    return false;
  }
  
  return true;
}
