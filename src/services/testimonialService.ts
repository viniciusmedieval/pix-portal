
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

export async function createTestimonial(testimonial: Omit<TestimonialType, 'id' | 'date'>) {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .insert({
        user_name: testimonial.userName,
        comment: testimonial.comment,
        rating: testimonial.rating,
        avatar_url: testimonial.avatar
      })
      .select();

    if (error) {
      console.error('Error creating testimonial:', error);
      throw error;
    }
    
    return data[0];
  } catch (error) {
    console.error('Exception in createTestimonial:', error);
    throw error;
  }
}

export async function updateTestimonial(id: string, testimonial: Partial<Omit<TestimonialType, 'id' | 'date'>>) {
  try {
    const updateData: any = {};
    
    if (testimonial.userName) updateData.user_name = testimonial.userName;
    if (testimonial.comment) updateData.comment = testimonial.comment;
    if (testimonial.rating) updateData.rating = testimonial.rating;
    if (testimonial.avatar) updateData.avatar_url = testimonial.avatar;
    
    const { data, error } = await supabase
      .from('testimonials')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating testimonial:', error);
      throw error;
    }
    
    return data[0];
  } catch (error) {
    console.error('Exception in updateTestimonial:', error);
    throw error;
  }
}

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
    console.error('Exception in deleteTestimonial:', error);
    throw error;
  }
}
