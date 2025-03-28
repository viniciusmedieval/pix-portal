
import { supabase } from '@/integrations/supabase/client';

export async function getConfig(produtoId: string) {
  // First check the pagina_pix table
  const { data: pixConfig, error: pixError } = await supabase
    .from('pagina_pix')
    .select('*')
    .eq('produto_id', produtoId)
    .single();
  
  if (pixConfig) {
    // If we have pix config data, use it
    return {
      ...pixConfig,
      tempo_expiracao: pixConfig.tempo_expiracao || 15
    };
  }
  
  // Fallback to config_checkout
  const { data, error } = await supabase
    .from('config_checkout')
    .select('*')
    .eq('produto_id', produtoId)
    .single();
  
  if (error && !data) {
    // If no config exists, create default
    const defaultConfig = {
      produto_id: produtoId,
      cor_fundo: '#f9fafb',
      cor_botao: '#22c55e',
      texto_botao: 'Comprar agora',
      numero_aleatorio_visitas: true,
      exibir_testemunhos: true,
      tempo_expiracao: 15
    };
    
    const { data: newConfig } = await supabase
      .from('config_checkout')
      .insert([defaultConfig])
      .select()
      .single();
      
    return newConfig;
  }
  
  return {
    ...data,
    tempo_expiracao: 15 // Default value if not set
  };
}

export async function criarOuAtualizarConfig(config: {
  produto_id: string;
  chave_pix?: string;
  qr_code?: string;
  mensagem_pix?: string;
  tempo_expiracao?: number;
  cor_fundo?: string;
  cor_botao?: string;
}) {
  // Check if config already exists for this product
  const { data } = await supabase
    .from('pagina_pix')
    .select('*')
    .eq('produto_id', config.produto_id)
    .single();
    
  if (data) {
    // Update existing config
    const { data: updatedConfig, error } = await supabase
      .from('pagina_pix')
      .update({
        codigo_copia_cola: config.chave_pix,
        qr_code_url: config.qr_code,
        mensagem_pos_pix: config.mensagem_pix,
        tempo_expiracao: config.tempo_expiracao || 15
      })
      .eq('produto_id', config.produto_id)
      .select();
      
    if (error) throw error;
    return updatedConfig;
  } else {
    // Create new config
    const { data: newConfig, error } = await supabase
      .from('pagina_pix')
      .insert([{
        produto_id: config.produto_id,
        codigo_copia_cola: config.chave_pix,
        qr_code_url: config.qr_code,
        mensagem_pos_pix: config.mensagem_pix,
        tempo_expiracao: config.tempo_expiracao || 15
      }])
      .select();
      
    if (error) throw error;
    return newConfig;
  }
}
