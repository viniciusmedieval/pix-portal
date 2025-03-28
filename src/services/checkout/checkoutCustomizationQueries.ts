
import { supabase } from '@/integrations/supabase/client';
import { CheckoutCustomizationType, PaymentMethodType, BenefitItem, FaqItem } from '@/types/checkoutConfig';
import { getDefaultCheckoutCustomization, parsePaymentMethods, handleCheckoutError } from './checkoutCustomizationTypes';
import { Json } from '@/types/database.types';

/**
 * Fetches checkout customization for a specific product
 */
export async function getCheckoutCustomization(produtoId: string): Promise<CheckoutCustomizationType> {
  try {
    const { data, error } = await supabase
      .from('checkout_customization')
      .select('*')
      .eq('produto_id', produtoId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching checkout customization:', error);
      throw error;
    }
    
    // Return default values if no data is found
    if (!data) {
      return getDefaultCheckoutCustomization(produtoId);
    }
    
    const paymentMethods = parsePaymentMethods(data.payment_methods);
    
    // Convert database fields to expected types
    const benefits = Array.isArray(data.benefits) ? (data.benefits as unknown as BenefitItem[]) : [];
    const faqs = Array.isArray(data.faqs) ? (data.faqs as unknown as FaqItem[]) : [];
    
    return {
      id: data.id,
      produto_id: data.produto_id || produtoId,
      benefits: benefits,
      faqs: faqs,
      show_guarantees: data.show_guarantees || true,
      guarantee_days: data.guarantee_days || 7,
      show_benefits: data.show_benefits || true,
      show_faq: data.show_faq || true,
      created_at: data.created_at,
      // Additional fields
      header_message: data.header_message,
      footer_text: data.footer_text,
      payment_info_title: data.payment_info_title || "Informações de Pagamento",
      testimonials_title: data.testimonials_title || "O que dizem nossos clientes",
      cta_text: data.cta_text || "Comprar agora",
      custom_css: data.custom_css,
      show_header: data.show_header !== undefined ? data.show_header : true,
      show_footer: data.show_footer !== undefined ? data.show_footer : true,
      show_testimonials: data.show_testimonials !== undefined ? data.show_testimonials : true,
      show_payment_options: data.show_payment_options !== undefined ? data.show_payment_options : true,
      payment_methods: paymentMethods as PaymentMethodType[]
    };
  } catch (error) {
    console.error('Error in getCheckoutCustomization:', error);
    // Return default values if an error occurs
    return getDefaultCheckoutCustomization(produtoId);
  }
}

/**
 * Retrieves payment information for a specific order
 */
export async function getPaymentInfo(pedidoId: string) {
  try {
    const { data, error } = await supabase
      .from('payment_info')
      .select('*')
      .eq('pedido_id', pedidoId)
      .maybeSingle();
      
    if (error) {
      return handleCheckoutError(error, 'getPaymentInfo', null);
    }
    
    return data;
  } catch (error) {
    return handleCheckoutError(error, 'getPaymentInfo', null);
  }
}
