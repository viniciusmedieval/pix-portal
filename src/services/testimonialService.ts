
import { supabase } from '@/integrations/supabase/client';

export interface TestimonialType {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  avatar_url?: string | null;
  created_at?: string;
}

/**
 * Fetch testimonials from the database
 * @param limit Number of testimonials to fetch
 * @returns Array of testimonials
 */
export async function getTestimonials(limit: number = 5): Promise<TestimonialType[]> {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getTestimonials:', error);
    return [];
  }
}

/**
 * Save a new testimonial
 * @param testimonial Testimonial data to save
 */
export async function saveTestimonial(testimonial: Omit<TestimonialType, 'id' | 'created_at'>) {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .insert([testimonial])
      .select()
      .single();
      
    if (error) {
      console.error('Error saving testimonial:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in saveTestimonial:', error);
    throw error;
  }
}

/**
 * Create a new testimonial (alias for saveTestimonial)
 */
export async function createTestimonial(testimonial: Omit<TestimonialType, 'id' | 'created_at'>) {
  return saveTestimonial(testimonial);
}

/**
 * Update an existing testimonial
 */
export async function updateTestimonial(id: string, testimonial: Partial<Omit<TestimonialType, 'id' | 'created_at'>>) {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .update(testimonial)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating testimonial:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateTestimonial:', error);
    throw error;
  }
}

/**
 * Delete a testimonial
 */
export async function deleteTestimonial(id: string) {
  try {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting testimonial:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteTestimonial:', error);
    throw error;
  }
}
