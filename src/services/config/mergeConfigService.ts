
import { getCheckoutConfig } from './checkoutConfigService';
import { getPixConfig } from './pixConfigService';
import { DEFAULT_CONFIG } from './defaultConfigValues';

/**
 * Merges configurations from different tables with default values
 */
export async function getMergedConfig(produtoId: string) {
  // Fetch checkout config
  const checkoutConfig = await getCheckoutConfig(produtoId);
  
  // Fetch PIX config
  const pixConfig = await getPixConfig(produtoId);
  
  // Combine data with appropriate defaults
  const result = {
    // Start with default values
    ...DEFAULT_CONFIG,
    
    // Merge checkout config if it exists
    ...(checkoutConfig || {}),
    
    // If pixConfig exists, map its fields to standard names
    ...(pixConfig && {
      chave_pix: pixConfig.codigo_copia_cola,
      qr_code: pixConfig.qr_code_url,
      mensagem_pix: pixConfig.mensagem_pos_pix,
      tempo_expiracao: pixConfig.tempo_expiracao || 15,
      nome_beneficiario: pixConfig.nome_beneficiario
    }),
    
    // Ensure produto_id is set
    produto_id: produtoId,
  };
  
  return result;
}
