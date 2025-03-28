
import { supabase } from '@/integrations/supabase/client';
import { CheckoutCustomizationType, BenefitItem, FaqItem } from '@/types/checkoutConfig';

export async function getCheckoutCustomization(produtoId: string): Promise<CheckoutCustomizationType> {
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
  return data || {
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

export async function saveCheckoutCustomization(customization: CheckoutCustomizationType): Promise<CheckoutCustomizationType> {
  // Check if customization already exists
  const { data: existingCustomization } = await supabase
    .from('checkout_customization')
    .select('id')
    .eq('produto_id', customization.produto_id)
    .maybeSingle();

  let result;
  
  if (existingCustomization) {
    // Update existing customization
    const { data, error } = await supabase
      .from('checkout_customization')
      .update(customization)
      .eq('id', existingCustomization.id)
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
      .insert(customization)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating checkout customization:', error);
      throw error;
    }
    
    result = data;
  }
  
  return result;
}
