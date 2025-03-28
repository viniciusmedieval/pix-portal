
import { supabase } from '@/integrations/supabase/client';

export async function getProdutos() {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .order('criado_em', { ascending: false });
  
  if (error) throw error;
  return data;
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
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) throw error;
  return data;
}

export async function criarOuAtualizarProduto(produto: {
  id?: string;
  nome: string;
  descricao?: string;
  preco: number;
  parcelas?: number;
  slug?: string;
  ativo?: boolean;
}) {
  if (produto.id) {
    // Update
    const { data, error } = await supabase
      .from('produtos')
      .update(produto)
      .eq('id', produto.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } else {
    // Create
    const { data, error } = await supabase
      .from('produtos')
      .insert([produto])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}
