
import { supabase } from '@/integrations/supabase/client';
import { ProdutoType } from '../produtoService';

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
    if (!id) {
      console.error('Invalid ID parameter: ID is undefined or empty');
      throw new Error('Invalid ID parameter: ID is undefined or empty');
    }
    
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
  try {
    // First validate that the slug parameter is actually defined and not empty
    if (!slug) {
      console.error('Invalid slug parameter: slug is undefined or empty');
      throw new Error('Invalid slug parameter: slug is undefined or empty');
    }
    
    // Decode the slug in case it was encoded in the URL
    const decodedSlug = decodeURIComponent(slug);
    
    console.log(`Attempting to fetch product with slug: ${decodedSlug}`);
    
    // First, try to find by exact slug match (case sensitive)
    let { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('slug', decodedSlug)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching produto with slug ${decodedSlug}:`, error);
      throw error;
    }
    
    // If not found with exact match, try case-insensitive search
    if (!data) {
      console.log(`Product not found by exact slug match, trying case-insensitive: ${decodedSlug}`);
      
      const { data: caseInsensitiveData, error: caseInsensitiveError } = await supabase
        .from('produtos')
        .select('*')
        .ilike('slug', decodedSlug)
        .maybeSingle();
        
      if (caseInsensitiveError) {
        console.error(`Error in case-insensitive search for ${decodedSlug}:`, caseInsensitiveError);
      } else if (caseInsensitiveData) {
        console.log(`Product found by case-insensitive slug: ${caseInsensitiveData.slug}`);
        return caseInsensitiveData;
      }
    }
    
    // If still not found, try by ID (in case the slug is actually an ID)
    if (!data) {
      console.log(`Product not found by slug, trying as ID: ${slug}`);
      
      try {
        const { data: dataById, error: errorById } = await supabase
          .from('produtos')
          .select('*')
          .eq('id', slug)
          .maybeSingle();
          
        if (errorById) {
          console.error(`Error fetching produto with ID ${slug}:`, errorById);
        } else if (dataById) {
          console.log(`Product found by ID: ${slug}`);
          return dataById;
        } else {
          console.error(`Product not found by either slug "${decodedSlug}" or ID "${slug}"`);
        }
      } catch (innerError) {
        console.error(`Error in ID lookup for ${slug}:`, innerError);
      }
    }
    
    return data;
  } catch (error) {
    console.error(`Exception in getProdutoBySlug for slug/id ${slug}:`, error);
    return null; // Return null instead of throwing for better UI handling
  }
}
