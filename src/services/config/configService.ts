
import { supabase } from '@/integrations/supabase/client';

// Fetch specific configuration for a product
export async function getConfig(produtoId: string) {
  try {
    const { data, error } = await supabase
      .from('config_checkout')
      .select('*')
      .eq('produto_id', produtoId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching config:', error);
      throw error;
    }
    
    // Return default values if no configuration is found
    if (!data) {
      return {
        produto_id: produtoId,
        exibir_testemunhos: true,
        numero_aleatorio_visitas: true,
        cor_fundo: '#f9fafb',
        chave_pix: '',
        timer_enabled: false,
        timer_minutes: 15,
        timer_text: 'Oferta expira em:',
        discount_badge_enabled: false,
        discount_badge_text: 'Oferta especial',
        discount_amount: 0,
        payment_security_text: 'Pagamento 100% seguro',
        texto_botao: 'Comprar agora',
        cor_botao: '#22c55e'
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error in getConfig:', error);
    // Return default configuration on error
    return {
      produto_id: produtoId,
      exibir_testemunhos: true,
      numero_aleatorio_visitas: true,
      cor_fundo: '#f9fafb',
      chave_pix: '',
      timer_enabled: false,
      timer_minutes: 15,
      timer_text: 'Oferta expira em:',
      discount_badge_enabled: false,
      discount_badge_text: 'Oferta especial',
      discount_amount: 0,
      payment_security_text: 'Pagamento 100% seguro',
      texto_botao: 'Comprar agora',
      cor_botao: '#22c55e'
    };
  }
}

// Save or update configuration for a product
export async function saveConfig(config: any) {
  try {
    // Check if configuration already exists for this product
    const { data: existingConfig } = await supabase
      .from('config_checkout')
      .select('id')
      .eq('produto_id', config.produto_id)
      .maybeSingle();
    
    let result;
    
    if (existingConfig) {
      // Update existing configuration
      const { data, error } = await supabase
        .from('config_checkout')
        .update(config)
        .eq('id', existingConfig.id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating config:', error);
        throw error;
      }
      
      result = data;
    } else {
      // Insert new configuration
      const { data, error } = await supabase
        .from('config_checkout')
        .insert(config)
        .select()
        .single();
        
      if (error) {
        console.error('Error creating config:', error);
        throw error;
      }
      
      result = data;
    }
    
    return result;
  } catch (error) {
    console.error('Error in saveConfig:', error);
    throw error;
  }
}
