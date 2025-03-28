
import { supabase } from '@/integrations/supabase/client';

export interface TestimonialType {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  avatar_url?: string | null;
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
