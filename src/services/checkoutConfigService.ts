
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches global checkout configuration settings
 */
export async function getCheckoutConfig() {
  try {
    const { data, error } = await supabase
      .from('checkout_config')
      .select('*')
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching checkout config:', error);
      return null;
    }
    
    return data || {
      cor_primaria: '#22c55e',
      cor_secundaria: '#f9fafb',
      texto_botao: 'Comprar agora',
      contador_ativo: true,
      visitantes_min: 80,
      visitantes_max: 120,
    };
  } catch (error) {
    console.error('Error in getCheckoutConfig:', error);
    return null;
  }
}
