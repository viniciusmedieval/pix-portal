
import { supabase } from '@/integrations/supabase/client';
import { CheckoutCustomizationType, BenefitItem, FaqItem } from '@/types/checkoutConfig';

export async function getCheckoutCustomization(produtoId: string): Promise<CheckoutCustomizationType> {
  try {
    const { data, error } = await supabase
      .from('checkout_customization')
      .select('*')
      .eq('produto_id', produtoId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching checkout customization:', error);
      throw error;
    }
    
    // Return default values if no data is found
    if (!data) {
      return {
        produto_id: produtoId,
        benefits: [
          { text: "Acesso imediato após a confirmação do pagamento" },
          { text: "Suporte técnico disponível 24h por dia" },
          { text: "Garantia de 7 dias ou seu dinheiro de volta" }
        ],
        faqs: [
          { 
            question: "Como funciona o pagamento?", 
            answer: "Oferecemos pagamento via PIX para maior praticidade e segurança." 
          },
          { 
            question: "Quanto tempo leva para ter acesso?", 
            answer: "Após a confirmação do pagamento, o acesso é liberado imediatamente." 
          },
          { 
            question: "Posso pedir reembolso?", 
            answer: "Sim, oferecemos garantia de 7 dias. Se não estiver satisfeito, devolvemos seu dinheiro." 
          }
        ],
        show_guarantees: true,
        guarantee_days: 7,
        show_benefits: true,
        show_faq: true
      };
    }
    
    return {
      id: data.id,
      produto_id: data.produto_id || produtoId,
      benefits: (data.benefits as BenefitItem[]) || [],
      faqs: (data.faqs as FaqItem[]) || [],
      show_guarantees: data.show_guarantees || true,
      guarantee_days: data.guarantee_days || 7,
      show_benefits: data.show_benefits || true,
      show_faq: data.show_faq || true,
      created_at: data.created_at
    };
  } catch (error) {
    console.error('Error in getCheckoutCustomization:', error);
    // Return default values if an error occurs
    return {
      produto_id: produtoId,
      benefits: [
        { text: "Acesso imediato após a confirmação do pagamento" },
        { text: "Suporte técnico disponível 24h por dia" },
        { text: "Garantia de 7 dias ou seu dinheiro de volta" }
      ],
      faqs: [
        { 
          question: "Como funciona o pagamento?", 
          answer: "Oferecemos pagamento via PIX para maior praticidade e segurança." 
        },
        { 
          question: "Quanto tempo leva para ter acesso?", 
          answer: "Após a confirmação do pagamento, o acesso é liberado imediatamente." 
        },
        { 
          question: "Posso pedir reembolso?", 
          answer: "Sim, oferecemos garantia de 7 dias. Se não estiver satisfeito, devolvemos seu dinheiro." 
        }
      ],
      show_guarantees: true,
      guarantee_days: 7,
      show_benefits: true,
      show_faq: true
    };
  }
}

export async function saveCheckoutCustomization(customization: CheckoutCustomizationType): Promise<CheckoutCustomizationType> {
  try {
    let existingId: string | undefined = customization.id;
    
    if (!existingId && customization.produto_id) {
      // Check if customization already exists for this product
      const { data: existingData } = await supabase
        .from('checkout_customization')
        .select('id')
        .eq('produto_id', customization.produto_id)
        .maybeSingle();
        
      existingId = existingData?.id;
    }
    
    let result;
    
    if (existingId) {
      // Update existing customization
      const { data, error } = await supabase
        .from('checkout_customization')
        .update({
          benefits: customization.benefits,
          faqs: customization.faqs,
          show_guarantees: customization.show_guarantees,
          guarantee_days: customization.guarantee_days,
          show_benefits: customization.show_benefits,
          show_faq: customization.show_faq
        })
        .eq('id', existingId)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating checkout customization:', error);
        throw error;
      }
      
      result = data;
    } else {
      // Insert new customization
      const { data, error } = await supabase
        .from('checkout_customization')
        .insert({
          produto_id: customization.produto_id,
          benefits: customization.benefits,
          faqs: customization.faqs,
          show_guarantees: customization.show_guarantees,
          guarantee_days: customization.guarantee_days,
          show_benefits: customization.show_benefits,
          show_faq: customization.show_faq
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error creating checkout customization:', error);
        throw error;
      }
      
      result = data;
    }
    
    return {
      id: result.id,
      produto_id: result.produto_id,
      benefits: (result.benefits as BenefitItem[]) || [],
      faqs: (result.faqs as FaqItem[]) || [],
      show_guarantees: result.show_guarantees || true,
      guarantee_days: result.guarantee_days || 7,
      show_benefits: result.show_benefits || true,
      show_faq: result.show_faq || true,
      created_at: result.created_at
    };
  } catch (error) {
    console.error('Error in saveCheckoutCustomization:', error);
    throw error;
  }
}
