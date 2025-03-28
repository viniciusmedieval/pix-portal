
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches checkout configuration for a specific product
 */
export async function getCheckoutConfig(produtoId: string) {
  const { data, error } = await supabase
    .from('config_checkout')
    .select('*')
    .eq('produto_id', produtoId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching checkout config:', error);
  }
  
  return data;
}

/**
 * Creates or updates checkout configuration for a product
 */
export async function updateCheckoutConfig(config: {
  produto_id: string;
  cor_fundo?: string;
  cor_botao?: string;
  texto_botao?: string;
  exibir_testemunhos?: boolean;
  numero_aleatorio_visitas?: boolean;
  bloquear_cpfs?: string[];
  timer_enabled?: boolean;
  timer_minutes?: number;
  timer_text?: string;
  timer_bg_color?: string;
  timer_text_color?: string;
  discount_badge_text?: string;
  discount_badge_enabled?: boolean;
  discount_amount?: number;
  original_price?: number;
  payment_security_text?: string;
  imagem_banner?: string;
  banner_bg_color?: string;
  header_message?: string;
  header_bg_color?: string;
  header_text_color?: string;
  show_header?: boolean;
  show_footer?: boolean;
  footer_text?: string;
  testimonials_title?: string;
  one_checkout_enabled?: boolean;
  form_header_text?: string;
  form_header_bg_color?: string;
  form_header_text_color?: string;
  company_name?: string;
  company_description?: string;
  contact_email?: string;
  contact_phone?: string;
  show_terms_link?: boolean;
  show_privacy_link?: boolean;
  terms_url?: string;
  privacy_url?: string;
}) {
  try {
    console.log('Updating checkout config with data:', config);
    
    const { data: existingConfig } = await supabase
      .from('config_checkout')
      .select('id')
      .eq('produto_id', config.produto_id)
      .maybeSingle();

    if (existingConfig) {
      const { data, error } = await supabase
        .from('config_checkout')
        .update(config)
        .eq('id', existingConfig.id)
        .select();
        
      if (error) {
        console.error('Error updating checkout config:', error);
        throw error;
      }
      
      return data;
    } else {
      const { data, error } = await supabase
        .from('config_checkout')
        .insert([config])
        .select();
        
      if (error) {
        console.error('Error creating checkout config:', error);
        throw error;
      }
      
      return data;
    }
  } catch (error) {
    console.error('Error in updateCheckoutConfig:', error);
    throw error;
  }
}
