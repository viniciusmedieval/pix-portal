
import { supabase } from '@/integrations/supabase/client';

export async function getConfig(produto_id: string) {
  const { data, error } = await supabase
    .from('config_checkout')
    .select('*')
    .eq('produto_id', produto_id)
    .maybeSingle();
    
  if (error) throw error;
  return data;
}

export async function criarOuAtualizarConfig(config: {
  produto_id: string;
  cor_fundo?: string;
  cor_botao?: string;
  texto_botao?: string;
  mensagem_pix?: string;
  qr_code?: string;
  chave_pix?: string;
  tempo_expiracao?: number;
  exibir_testemunhos?: boolean;
  numero_aleatorio_visitas?: boolean;
  bloquear_cpfs?: string[];
}) {
  // Verificar se já existe uma configuração para este produto
  const { data: existingConfig } = await supabase
    .from('config_checkout')
    .select('id')
    .eq('produto_id', config.produto_id)
    .maybeSingle();

  if (existingConfig) {
    // Atualizar configuração existente
    const { data, error } = await supabase
      .from('config_checkout')
      .update(config)
      .eq('id', existingConfig.id)
      .select();
    
    if (error) throw error;
    return data?.[0];
  } else {
    // Criar nova configuração
    const { data, error } = await supabase
      .from('config_checkout')
      .insert([config])
      .select();
    
    if (error) throw error;
    return data?.[0];
  }
}
