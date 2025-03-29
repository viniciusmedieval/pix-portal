
import { supabase } from '@/integrations/supabase/client';
import { FaqItem } from '@/types/checkoutConfig';

/**
 * Obter perguntas frequentes para um produto específico
 */
export async function getFaqs(produtoId: string): Promise<FaqItem[]> {
  if (!produtoId) {
    console.error("Não é possível obter FAQs: ID do produto não fornecido");
    return [];
  }
  
  try {
    const { data: configData, error: configError } = await supabase
      .from('checkout_config')
      .select('faqs')
      .eq('produto_id', produtoId)
      .maybeSingle();
    
    if (configError) {
      console.error('Erro ao buscar FAQs:', configError);
      return [];
    }
    
    if (configData?.faqs && Array.isArray(configData.faqs)) {
      return configData.faqs;
    }
    
    return [];
  } catch (error) {
    console.error('Erro em getFaqs:', error);
    return [];
  }
}

/**
 * Salvar perguntas frequentes para um produto
 */
export async function saveFaqs(produtoId: string, faqs: FaqItem[]): Promise<boolean> {
  if (!produtoId) {
    console.error("Não é possível salvar FAQs: ID do produto não fornecido");
    return false;
  }
  
  try {
    const { data: existingConfig, error: fetchError } = await supabase
      .from('checkout_config')
      .select('id')
      .eq('produto_id', produtoId)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Erro ao verificar configuração existente:', fetchError);
      throw fetchError;
    }
    
    if (existingConfig) {
      // Atualizar FAQs na configuração existente
      const { error: updateError } = await supabase
        .from('checkout_config')
        .update({ faqs })
        .eq('id', existingConfig.id);
      
      if (updateError) {
        console.error('Erro ao atualizar FAQs:', updateError);
        throw updateError;
      }
    } else {
      // Criar nova configuração com FAQs
      const { error: insertError } = await supabase
        .from('checkout_config')
        .insert([{ produto_id: produtoId, faqs }]);
      
      if (insertError) {
        console.error('Erro ao criar configuração com FAQs:', insertError);
        throw insertError;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Erro em saveFaqs:', error);
    return false;
  }
}
