
import { supabase } from '@/integrations/supabase/client';

interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Obter perguntas frequentes para um produto específico
 */
export async function getFaqs(produtoId: string): Promise<FaqItem[]> {
  if (!produtoId) {
    console.error("Não é possível obter FAQs: ID do produto não fornecido");
    return [];
  }
  
  try {
    // First try to get FAQs from checkout_customization table (new structure)
    const { data: customizationData, error: customizationError } = await supabase
      .from('checkout_customization')
      .select('faqs')
      .eq('produto_id', produtoId)
      .maybeSingle();
    
    if (!customizationError && customizationData?.faqs && Array.isArray(customizationData.faqs)) {
      return customizationData.faqs;
    }
    
    // Fallback to config_checkout table if exists and has a faqs field
    const { data: configData, error: configError } = await supabase
      .from('config_checkout')
      .select('*')
      .eq('produto_id', produtoId)
      .maybeSingle();
    
    // If we have any FAQs in the table, try to return them
    if (!configError && configData && configData.faqs && Array.isArray(configData.faqs)) {
      return configData.faqs;
    }
    
    console.log("No FAQs found in database tables");
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
    // First try to save to checkout_customization
    const { data: existingCustomization, error: fetchCustomizationError } = await supabase
      .from('checkout_customization')
      .select('id')
      .eq('produto_id', produtoId)
      .maybeSingle();
    
    if (!fetchCustomizationError) {
      if (existingCustomization) {
        // Update existing customization
        const { error: updateError } = await supabase
          .from('checkout_customization')
          .update({ faqs })
          .eq('id', existingCustomization.id);
        
        if (updateError) {
          console.error('Erro ao atualizar FAQs:', updateError);
          throw updateError;
        }
      } else {
        // Create new customization entry
        const { error: insertError } = await supabase
          .from('checkout_customization')
          .insert([{ produto_id: produtoId, faqs }]);
        
        if (insertError) {
          console.error('Erro ao criar configuração com FAQs:', insertError);
          throw insertError;
        }
      }
      return true;
    } else {
      console.error('Erro ao verificar configuração existente:', fetchCustomizationError);
      throw fetchCustomizationError;
    }
  } catch (error) {
    console.error('Erro em saveFaqs:', error);
    return false;
  }
}
