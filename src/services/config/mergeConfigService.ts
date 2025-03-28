
import { getCheckoutConfig } from './checkoutConfigService';
import { getPixConfig } from './pixConfigService';
import { DEFAULT_CONFIG } from './defaultConfigValues';

/**
 * Merges configurations from different tables with default values
 */
export async function getMergedConfig(produtoId: string) {
  if (!produtoId) {
    console.error('No product ID provided to getMergedConfig');
    return { ...DEFAULT_CONFIG };
  }
  
  try {
    // Fetch checkout config
    const checkoutConfig = await getCheckoutConfig(produtoId);
    
    // Fetch PIX config
    const pixConfig = await getPixConfig(produtoId);
    
    // For debugging
    console.log('Raw checkout config from database:', checkoutConfig);
    console.log('OneCheckout enabled in raw config:', checkoutConfig?.one_checkout_enabled);
    console.log('PIX config from database:', pixConfig);
    
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
    
    console.log('Merged config result with one_checkout_enabled:', result.one_checkout_enabled);
    console.log('Merged config PIX settings:', {
      chave_pix: result.chave_pix,
      qr_code: result.qr_code,
      tempo_expiracao: result.tempo_expiracao
    });
    
    return result;
  } catch (error) {
    console.error('Error in getMergedConfig:', error);
    // Return default config if there's an error
    return { ...DEFAULT_CONFIG, produto_id: produtoId };
  }
}
