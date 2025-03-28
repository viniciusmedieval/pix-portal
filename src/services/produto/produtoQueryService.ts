
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
        throw new Error(`Product not found by slug "${decodedSlug}" or ID "${slug}"`);
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
