
import { supabase } from '@/integrations/supabase/client';

export async function getConfig(produtoId: string) {
  // First check the pagina_pix table
  const { data: pixConfig, error: pixError } = await supabase
    .from('pagina_pix')
    .select('*')
    .eq('produto_id', produtoId)
    .maybeSingle();
  
  // Check the config_checkout table
  const { data: checkoutConfig, error: checkoutError } = await supabase
    .from('config_checkout')
    .select('*')
    .eq('produto_id', produtoId)
    .maybeSingle();
  
  // Combine data with appropriate defaults
  const result = {
    // Common default values
    cor_fundo: '#f9fafb',
    cor_botao: '#22c55e',
    texto_botao: 'Comprar agora',
    numero_aleatorio_visitas: true,
    exibir_testemunhos: true,
    tempo_expiracao: 15,
    
    // Merge checkout config if it exists
    ...(checkoutConfig || {}),
    
    // If pixConfig exists, map its fields to standard names
    ...(pixConfig && {
      chave_pix: pixConfig.codigo_copia_cola,
      qr_code: pixConfig.qr_code_url,
      mensagem_pix: pixConfig.mensagem_pos_pix,
      tempo_expiracao: pixConfig.tempo_expiracao || 15,
    }),
    
    // Ensure produto_id is set
    produto_id: produtoId,
    // Add the missing fields that are being used in AdminConfig.tsx
    pixel_facebook: checkoutConfig?.pixel_facebook || '',
    pixel_google: checkoutConfig?.pixel_google || ''
  };
  
  return result;
}

export async function criarOuAtualizarConfig(config: {
  produto_id: string;
  cor_fundo?: string;
  cor_botao?: string;
  texto_botao?: string;
  chave_pix?: string;
  qr_code?: string;
  mensagem_pix?: string;
  tempo_expiracao?: number;
  exibir_testemunhos?: boolean;
  numero_aleatorio_visitas?: boolean;
  bloquear_cpfs?: string[];
  pixel_facebook?: string;
  pixel_google?: string;
}) {
  // Update or create config_checkout record
  const { data: existingConfig } = await supabase
    .from('config_checkout')
    .select('id')
    .eq('produto_id', config.produto_id)
    .maybeSingle();

  const checkoutData = {
    produto_id: config.produto_id,
    cor_fundo: config.cor_fundo,
    cor_botao: config.cor_botao,
    texto_botao: config.texto_botao,
    exibir_testemunhos: config.exibir_testemunhos,
    numero_aleatorio_visitas: config.numero_aleatorio_visitas,
    bloquear_cpfs: config.bloquear_cpfs,
    pixel_facebook: config.pixel_facebook,
    pixel_google: config.pixel_google
  };

  if (existingConfig) {
    await supabase
      .from('config_checkout')
      .update(checkoutData)
      .eq('id', existingConfig.id);
  } else {
    await supabase
      .from('config_checkout')
      .insert([checkoutData]);
  }

  // Update or create pagina_pix record if PIX data is provided
  if (config.chave_pix || config.qr_code || config.mensagem_pix || config.tempo_expiracao) {
    const { data: existingPixConfig } = await supabase
      .from('pagina_pix')
      .select('id')
      .eq('produto_id', config.produto_id)
      .maybeSingle();
      
    const pixData = {
      produto_id: config.produto_id,
      codigo_copia_cola: config.chave_pix,
      qr_code_url: config.qr_code,
      mensagem_pos_pix: config.mensagem_pix,
      tempo_expiracao: config.tempo_expiracao || 15
    };

    if (existingPixConfig) {
      await supabase
        .from('pagina_pix')
        .update(pixData)
        .eq('id', existingPixConfig.id);
    } else {
      await supabase
        .from('pagina_pix')
        .insert([pixData]);
    }
  }

  // Return the full updated config
  return getConfig(config.produto_id);
}
