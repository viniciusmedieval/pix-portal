
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
  tipo_chave?: string;
  // New fields for customized PIX page
  titulo?: string;
  instrucao?: string;
  botao_texto?: string;
  seguranca_texto?: string;
  compra_titulo?: string;
  mostrar_produto?: boolean;
  mostrar_termos?: boolean;
  saiba_mais_texto?: string;
  timer_texto?: string;
  texto_copiado?: string;
  instrucoes_titulo?: string;
  instrucoes?: string[];
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
    nome_beneficiario: config.nome_beneficiario,
    tipo_chave: config.tipo_chave,
    // Include new fields
    titulo: config.titulo,
    instrucao: config.instrucao,
    botao_texto: config.botao_texto,
    seguranca_texto: config.seguranca_texto,
    compra_titulo: config.compra_titulo,
    mostrar_produto: config.mostrar_produto,
    mostrar_termos: config.mostrar_termos,
    saiba_mais_texto: config.saiba_mais_texto,
    timer_texto: config.timer_texto,
    texto_copiado: config.texto_copiado,
    instrucoes_titulo: config.instrucoes_titulo,
    instrucoes: config.instrucoes
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
