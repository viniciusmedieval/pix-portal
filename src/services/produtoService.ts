
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/database.types';

// Export the complete ProdutoType with all fields
export type ProdutoType = Database['public']['Tables']['produtos']['Row'];

export async function getProdutos() {
  try {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) {
      console.error('Error fetching produtos:', error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error('Exception in getProdutos:', error);
    throw error;
  }
}

export async function getProdutoById(id: string) {
  try {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching produto with ID ${id}:`, error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error(`Exception in getProdutoById for ID ${id}:`, error);
    throw error;
  }
}

export async function getProdutoBySlug(slug: string) {
  // Decode the slug in case it was encoded in the URL
  const decodedSlug = decodeURIComponent(slug);
  
  try {
    console.log(`Attempting to fetch product with slug: ${decodedSlug}`);
    
    // First try to find by slug
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('slug', decodedSlug)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching produto with slug ${decodedSlug}:`, error);
      throw error;
    }
    
    // If not found by slug, try by ID (in case the slug is actually an ID)
    if (!data) {
      console.log(`Product not found by slug, trying as ID: ${slug}`);
      const { data: dataById, error: errorById } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', slug)
        .maybeSingle();
        
      if (errorById) {
        console.error(`Error fetching produto with ID ${slug}:`, errorById);
        throw errorById;
      }
      
      if (!dataById) {
        console.error(`Product not found by either slug "${decodedSlug}" or ID "${slug}"`);
      } else {
        console.log(`Product found by ID: ${slug}`);
      }
      
      return dataById;
    }
    
    console.log(`Product found by slug: ${decodedSlug}`);
    return data;
  } catch (error) {
    console.error(`Exception in getProdutoBySlug for slug/id ${slug}:`, error);
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
  try {
    const { data, error } = await supabase
      .from('produtos')
      .select('estoque')
      .eq('id', produtoId)
      .single();

    if (error) {
      console.error(`Erro ao verificar estoque para produto ${produtoId}:`, error);
      return 0;
    }
    
    return data?.estoque !== undefined ? data.estoque : 0;
  } catch (error) {
    console.error(`Exception in verificarEstoque for produto ${produtoId}:`, error);
    return 0;
  }
}

export async function atualizarEstoque(produtoId: string, novaQuantidade: number) {
  try {
    const { error } = await supabase
      .from('produtos')
      .update({ estoque: novaQuantidade })
      .eq('id', produtoId);

    if (error) {
      console.error(`Erro ao atualizar estoque para produto ${produtoId}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Exception in atualizarEstoque for produto ${produtoId}:`, error);
    return false;
  }
}
