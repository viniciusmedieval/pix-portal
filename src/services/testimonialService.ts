
import { supabase } from '@/integrations/supabase/client';
import { TestimonialType } from '@/components/TestimonialCard';

export async function getTestimonials(limit = 5) {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching testimonials:', error);
      throw error;
    }
    
    return data.map(item => ({
      id: item.id,
      userName: item.user_name,
      comment: item.comment,
      rating: item.rating,
      avatar: item.avatar_url,
      date: new Date(item.created_at).toLocaleDateString('pt-BR')
    })) as TestimonialType[];
  } catch (error) {
    console.error('Exception in getTestimonials:', error);
    throw error;
  }
}
