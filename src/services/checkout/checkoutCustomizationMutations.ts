
import { supabase } from '@/integrations/supabase/client';
import { CheckoutCustomizationType } from '@/types/checkoutConfig';
import { parsePaymentMethods, handleCheckoutError } from './checkoutCustomizationTypes';

/**
 * Saves or updates checkout customization for a product
 */
export async function saveCheckoutCustomization(customization: CheckoutCustomizationType): Promise<CheckoutCustomizationType> {
  try {
    let existingId: string | undefined = customization.id;
    
    if (!existingId && customization.produto_id) {
      // Check if customization already exists for this product
      const { data: existingData } = await supabase
        .from('checkout_customization')
        .select('id')
        .eq('produto_id', customization.produto_id)
        .maybeSingle();
        
      existingId = existingData?.id;
    }
    
    // Transform payment_methods into JSONB format for Supabase
    const paymentMethodsJsonb = customization.payment_methods || ["pix", "cartao"];
    
    const updateData = {
      benefits: customization.benefits,
      faqs: customization.faqs,
      show_guarantees: customization.show_guarantees,
      guarantee_days: customization.guarantee_days,
      show_benefits: customization.show_benefits,
      show_faq: customization.show_faq,
      // Additional fields
      header_message: customization.header_message,
      footer_text: customization.footer_text,
      payment_info_title: customization.payment_info_title,
      testimonials_title: customization.testimonials_title,
      cta_text: customization.cta_text,
      custom_css: customization.custom_css,
      show_header: customization.show_header,
      show_footer: customization.show_footer,
      show_testimonials: customization.show_testimonials,
      show_payment_options: customization.show_payment_options,
      payment_methods: paymentMethodsJsonb
    };
    
    let result;
    
    if (existingId) {
      // Update existing customization
      const { data, error } = await supabase
        .from('checkout_customization')
        .update(updateData)
        .eq('id', existingId)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating checkout customization:', error);
        throw error;
      }
      
      result = data;
    } else {
      // Insert new customization
      const { data, error } = await supabase
        .from('checkout_customization')
        .insert({
          produto_id: customization.produto_id,
          ...updateData
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error creating checkout customization:', error);
        throw error;
      }
      
      result = data;
    }
    
    const paymentMethods = parsePaymentMethods(result.payment_methods);
    
    return {
      id: result.id,
      produto_id: result.produto_id,
      benefits: result.benefits || [],
      faqs: result.faqs || [],
      show_guarantees: result.show_guarantees || true,
      guarantee_days: result.guarantee_days || 7,
      show_benefits: result.show_benefits || true,
      show_faq: result.show_faq || true,
      created_at: result.created_at,
      // Additional fields
      header_message: result.header_message,
      footer_text: result.footer_text,
      payment_info_title: result.payment_info_title,
      testimonials_title: result.testimonials_title,
      cta_text: result.cta_text,
      custom_css: result.custom_css,
      show_header: result.show_header,
      show_footer: result.show_footer,
      show_testimonials: result.show_testimonials,
      show_payment_options: result.show_payment_options,
      payment_methods: paymentMethods
    };
  } catch (error) {
    return handleCheckoutError(error, 'saveCheckoutCustomization', {
      produto_id: customization.produto_id,
      benefits: [],
      faqs: [],
      show_guarantees: true,
      guarantee_days: 7,
      show_benefits: true,
      show_faq: true
    });
  }
}

/**
 * Saves payment information for an order
 */
export async function savePaymentInfo(paymentInfo: any) {
  try {
    const { data, error } = await supabase
      .from('payment_info')
      .insert(paymentInfo)
      .select()
      .single();
      
    if (error) {
      return handleCheckoutError(error, 'savePaymentInfo', null);
    }
    
    return data;
  } catch (error) {
    return handleCheckoutError(error, 'savePaymentInfo', null);
  }
}
