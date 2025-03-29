
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches a product by its ID, handling both UUID and numeric IDs
 */
export async function getProdutoById(id: string) {
  if (!id) {
    console.error("Cannot fetch product: No ID provided");
    return null;
  }
  
  console.log("Fetching product with ID:", id);
  
  try {
    // First try to get the product directly
    let { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    // If there's an error about invalid UUID format, try matching by slug
    if (error && error.code === '22P02') {
      console.log("ID is not a valid UUID, trying to fetch by slug");
      
      const { data: slugData, error: slugError } = await supabase
        .from('produtos')
        .select('*')
        .eq('slug', id)
        .maybeSingle();
      
      if (slugError) {
        console.error("Error fetching by slug:", slugError);
        return null;
      }
      
      data = slugData;
    } else if (error) {
      console.error("Error fetching produto with ID", id, ":", error);
      return null;
    }
    
    if (!data) {
      console.log("No product found with ID:", id);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getProdutoById:', error);
    return null;
  }
}

/**
 * Fetches all available products
 */
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
    console.error('Error in getProdutos:', error);
    return [];
  }
}

/**
 * Creates a new product
 */
export async function criarProduto(produto: {
  nome: string;
  descricao: string;
  preco: number;
  categoria_id: string;
  imagens: string[];
  slug: string;
}) {
  try {
    const { data, error } = await supabase
      .from('produtos')
      .insert([produto])
      .select();
    
    if (error) {
      console.error('Error creating produto:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in criarProduto:', error);
    return null;
  }
}

/**
 * Updates an existing product
 */
export async function atualizarProduto(id: string, updates: {
  nome?: string;
  descricao?: string;
  preco?: number;
  categoria_id?: string;
  imagens?: string[];
  slug?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('produtos')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating produto:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in atualizarProduto:', error);
    return null;
  }
}

/**
 * Deletes a product by its ID
 */
export async function deletarProduto(id: string) {
  try {
    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting produto:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deletarProduto:', error);
    return false;
  }
}

/**
 * Fetches a product by its slug
 */
export async function getProdutoBySlug(slug: string) {
  if (!slug) {
    console.error("Cannot fetch produto: No slug provided");
    return null;
  }
  
  console.log("Attempting to fetch product with slug:", slug);
  
  try {
    // First try exact match
    let { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching produto with slug:", error);
      return null;
    }
    
    // If no results, try case-insensitive match
    if (!data) {
      console.log("Product not found by exact slug match, trying case-insensitive:", slug);
      
      const { data: caseInsensitiveData, error: caseInsensitiveError } = await supabase
        .from('produtos')
        .select('*')
        .ilike('slug', slug)
        .maybeSingle();
        
      if (caseInsensitiveError) {
        console.error("Error fetching produto with case-insensitive slug:", caseInsensitiveError);
        return null;
      }
      
      data = caseInsensitiveData;
    }
    
    // If still no results, try as ID
    if (!data) {
      console.log("Product not found by slug, trying as ID:", slug);
      
      try {
        const { data: idData, error: idError } = await supabase
          .from('produtos')
          .select('*')
          .eq('id', slug)
          .maybeSingle();
          
        if (idError) {
          console.error("Error fetching produto with ID", slug, ":", idError);
          return null;
        }
        
        data = idData;
      } catch (idError) {
        console.error("Exception fetching produto with ID:", idError);
      }
    }
    
    if (!data) {
      console.log("No product found for slug/id:", slug);
    } else {
      console.log("Found product:", data);
    }
    
    return data;
  } catch (error) {
    console.error("Error in getProdutoBySlug:", error);
    return null;
  }
}
