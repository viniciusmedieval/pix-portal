
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
        show_faq: true,
        show_header: true,
        show_footer: true,
        show_testimonials: true,
        show_payment_options: true,
        payment_methods: ["pix", "cartao"],
        payment_info_title: "Informações de Pagamento",
        testimonials_title: "O que dizem nossos clientes",
        cta_text: "Comprar agora"
      };
    }
    
    const paymentMethods = data.payment_methods ? 
      (typeof data.payment_methods === 'string' ? 
        JSON.parse(data.payment_methods as string) : 
        data.payment_methods as string[]) : 
      ["pix", "cartao"];
    
    return {
      id: data.id,
      produto_id: data.produto_id || produtoId,
      benefits: (data.benefits as BenefitItem[]) || [],
      faqs: (data.faqs as FaqItem[]) || [],
      show_guarantees: data.show_guarantees || true,
      guarantee_days: data.guarantee_days || 7,
      show_benefits: data.show_benefits || true,
      show_faq: data.show_faq || true,
      created_at: data.created_at,
      // Novos campos
      header_message: data.header_message,
      footer_text: data.footer_text,
      payment_info_title: data.payment_info_title || "Informações de Pagamento",
      testimonials_title: data.testimonials_title || "O que dizem nossos clientes",
      cta_text: data.cta_text || "Comprar agora",
      custom_css: data.custom_css,
      show_header: data.show_header !== undefined ? data.show_header : true,
      show_footer: data.show_footer !== undefined ? data.show_footer : true,
      show_testimonials: data.show_testimonials !== undefined ? data.show_testimonials : true,
      show_payment_options: data.show_payment_options !== undefined ? data.show_payment_options : true,
      payment_methods: paymentMethods
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
      show_faq: true,
      show_header: true,
      show_footer: true,
      show_testimonials: true,
      show_payment_options: true,
      payment_methods: ["pix", "cartao"],
      payment_info_title: "Informações de Pagamento",
      testimonials_title: "O que dizem nossos clientes",
      cta_text: "Comprar agora"
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
    
    // Transforme payment_methods em JSONB apropriado para o Supabase
    const paymentMethodsJsonb = customization.payment_methods || ["pix", "cartao"];
    
    const updateData = {
      benefits: customization.benefits,
      faqs: customization.faqs,
      show_guarantees: customization.show_guarantees,
      guarantee_days: customization.guarantee_days,
      show_benefits: customization.show_benefits,
      show_faq: customization.show_faq,
      // Novos campos
      header_message: customization.header_message,
      footer_text: customization.footer_text,
      payment_info_title: customization.payment_info_title,
      testimonials_title: customization.testimonials_title,
      cta_text: customization.cta_text,
      custom_css: customization.custom_css,
      show_header: customization.show_header,
      show_footer: customization.show_footer,
      show_testimonials: customization.show_testimonials,
      show_payment_options: customization.show_payment_options,
      payment_methods: paymentMethodsJsonb
    };
    
    if (existingId) {
      // Update existing customization
      const { data, error } = await supabase
        .from('checkout_customization')
        .update(updateData)
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
          ...updateData
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error creating checkout customization:', error);
        throw error;
      }
      
      result = data;
    }
    
    const paymentMethods = result.payment_methods ? 
      (typeof result.payment_methods === 'string' ? 
        JSON.parse(result.payment_methods as string) : 
        result.payment_methods as string[]) : 
      ["pix", "cartao"];
    
    return {
      id: result.id,
      produto_id: result.produto_id,
      benefits: (result.benefits as BenefitItem[]) || [],
      faqs: (result.faqs as FaqItem[]) || [],
      show_guarantees: result.show_guarantees || true,
      guarantee_days: result.guarantee_days || 7,
      show_benefits: result.show_benefits || true,
      show_faq: result.show_faq || true,
      created_at: result.created_at,
      // Novos campos
      header_message: result.header_message,
      footer_text: result.footer_text,
      payment_info_title: result.payment_info_title,
      testimonials_title: result.testimonials_title,
      cta_text: result.cta_text,
      custom_css: result.custom_css,
      show_header: result.show_header,
      show_footer: result.show_footer,
      show_testimonials: result.show_testimonials,
      show_payment_options: result.show_payment_options,
      payment_methods: paymentMethods
    };
  } catch (error) {
    console.error('Error in saveCheckoutCustomization:', error);
    throw error;
  }
}

// Criando um novo serviço para informações de pagamento
export async function savePaymentInfo(paymentInfo: any) {
  try {
    const { data, error } = await supabase
      .from('payment_info')
      .insert(paymentInfo)
      .select()
      .single();
      
    if (error) {
      console.error('Error saving payment info:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in savePaymentInfo:', error);
    throw error;
  }
}

export async function getPaymentInfo(pedidoId: string) {
  try {
    const { data, error } = await supabase
      .from('payment_info')
      .select('*')
      .eq('pedido_id', pedidoId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching payment info:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getPaymentInfo:', error);
    throw error;
  }
}
