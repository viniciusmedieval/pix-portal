
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches PIX configuration for a specific product
 */
export async function getPixConfig(produtoId: string) {
  if (!produtoId) {
    console.error("Cannot fetch PIX config: No product ID provided");
    return null;
  }
  
  console.log("Fetching PIX config for product ID:", produtoId);
  
  try {
    const { data, error } = await supabase
      .from('pagina_pix')
      .select('*')
      .eq('produto_id', produtoId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching PIX config:', error);
      throw error;
    }
    
    console.log("PIX config data returned:", data);
    return data;
  } catch (error) {
    console.error('Error in getPixConfig:', error);
    return null;
  }
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
  mostrar_qrcode_mobile?: boolean;
  redirect_url?: string;
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
  if (!config.produto_id) {
    console.error("Cannot update PIX config: No product ID provided");
    throw new Error("Product ID is required to update PIX configuration");
  }
  
  console.log("Updating PIX config for product ID:", config.produto_id);
  
  try {
    // Before making any changes, ensure redirect_url is properly formatted
    if (config.redirect_url && !config.redirect_url.match(/^https?:\/\//)) {
      // If redirect_url doesn't start with http:// or https://, prepend https://
      config.redirect_url = `https://${config.redirect_url}`;
      console.log("Modified redirect URL to include protocol:", config.redirect_url);
    }
    
    // Check if a config already exists for this product
    const { data: existingConfig } = await supabase
      .from('pagina_pix')
      .select('id')
      .eq('produto_id', config.produto_id)
      .maybeSingle();
      
    const pixData = {
      produto_id: config.produto_id,
      codigo_copia_cola: config.codigo_copia_cola || '',
      qr_code_url: config.qr_code_url || '',
      mensagem_pos_pix: config.mensagem_pos_pix || '',
      tempo_expiracao: config.tempo_expiracao || 15,
      nome_beneficiario: config.nome_beneficiario || 'Nome do Beneficiário',
      tipo_chave: config.tipo_chave || 'email',
      mostrar_qrcode_mobile: config.mostrar_qrcode_mobile !== undefined ? config.mostrar_qrcode_mobile : true,
      redirect_url: config.redirect_url || null,
      // Include new fields
      titulo: config.titulo || '',
      instrucao: config.instrucao || '',
      botao_texto: config.botao_texto || '',
      seguranca_texto: config.seguranca_texto || '',
      compra_titulo: config.compra_titulo || '',
      mostrar_produto: config.mostrar_produto !== undefined ? config.mostrar_produto : true,
      mostrar_termos: config.mostrar_termos !== undefined ? config.mostrar_termos : true,
      saiba_mais_texto: config.saiba_mais_texto || '',
      timer_texto: config.timer_texto || '',
      texto_copiado: config.texto_copiado || '',
      instrucoes_titulo: config.instrucoes_titulo || '',
      instrucoes: config.instrucoes || []
    };

    console.log("Existing config:", existingConfig);
    console.log("PIX data to be saved:", pixData);

    let result;
    if (existingConfig) {
      console.log("Updating existing PIX config with ID:", existingConfig.id);
      const { data, error } = await supabase
        .from('pagina_pix')
        .update(pixData)
        .eq('id', existingConfig.id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating PIX config:', error);
        throw error;
      }
      
      result = data;
    } else {
      console.log("Creating new PIX config");
      const { data, error } = await supabase
        .from('pagina_pix')
        .insert([pixData])
        .select()
        .single();
        
      if (error) {
        console.error('Error creating PIX config:', error);
        throw error;
      }
      
      result = data;
    }
    
    console.log("Saved PIX config successfully:", result);
    return result;
  } catch (error) {
    console.error('Error in updatePixConfig:', error);
    throw error;
  }
}
