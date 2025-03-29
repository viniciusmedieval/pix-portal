
import { supabase } from '@/integrations/supabase/client';
import { FaqItem } from '@/types/checkoutConfig';
import { Json } from '@/types/database.types';

/**
 * Get FAQs for a specific product
 */
export async function getFaqs(productId: string): Promise<FaqItem[]> {
  try {
    const { data, error } = await supabase
      .from('checkout_customization')
      .select('faqs')
      .eq('produto_id', productId)
      .single();
    
    if (error) {
      console.error('Error fetching FAQs:', error);
      return [];
    }
    
    // Properly cast the JSON data to FaqItem array
    return (data?.faqs as unknown as FaqItem[]) || [];
  } catch (error) {
    console.error('Error in getFaqs:', error);
    return [];
  }
}

/**
 * Save FAQs for a specific product
 */
export async function saveFaqs(productId: string, faqs: FaqItem[]): Promise<boolean> {
  try {
    // Check if customization exists for this product
    const { data: existing } = await supabase
      .from('checkout_customization')
      .select('id')
      .eq('produto_id', productId)
      .single();
    
    if (existing) {
      // Update existing record
      const { error } = await supabase
        .from('checkout_customization')
        .update({ faqs: faqs as unknown as Json })
        .eq('produto_id', productId);
      
      if (error) {
        console.error('Error updating FAQs:', error);
        return false;
      }
    } else {
      // Create new record
      const { error } = await supabase
        .from('checkout_customization')
        .insert({ 
          produto_id: productId,
          faqs: faqs as unknown as Json 
        });
      
      if (error) {
        console.error('Error creating FAQs:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveFaqs:', error);
    return false;
  }
}
