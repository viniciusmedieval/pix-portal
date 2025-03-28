
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches PIX configuration for a specific product
 */
export async function getPixConfig(produtoId: string) {
  const { data, error } = await supabase
    .from('pagina_pix')
    .select('*')
    .eq('produto_id', produtoId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching PIX config:', error);
  }
  
  return data;
}

/**
 * Creates or updates PIX configuration for a product
 */
export async function updatePixConfig(config: {
  produto_id: string;
  codigo_copia_cola?: string;
  qr_code_url?: string;
  mensagem_pos_pix?: string;
  tempo_expiracao?: number;
  nome_beneficiario?: string;
}) {
  const { data: existingConfig } = await supabase
    .from('pagina_pix')
    .select('id')
    .eq('produto_id', config.produto_id)
    .maybeSingle();
    
  const pixData = {
    produto_id: config.produto_id,
    codigo_copia_cola: config.codigo_copia_cola,
    qr_code_url: config.qr_code_url,
    mensagem_pos_pix: config.mensagem_pos_pix,
    tempo_expiracao: config.tempo_expiracao || 15,
    nome_beneficiario: config.nome_beneficiario
  };

  if (existingConfig) {
    const { data, error } = await supabase
      .from('pagina_pix')
      .update(pixData)
      .eq('id', existingConfig.id);
      
    if (error) {
      console.error('Error updating PIX config:', error);
      throw error;
    }
    
    return data;
  } else {
    const { data, error } = await supabase
      .from('pagina_pix')
      .insert([pixData]);
      
    if (error) {
      console.error('Error creating PIX config:', error);
      throw error;
    }
    
    return data;
  }
}
