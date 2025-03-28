
import { BenefitItem, FaqItem, PaymentMethodType } from '@/types/checkoutConfig';

// Common error handling function
export const handleCheckoutError = (error: any, context: string, defaultReturn?: any): any => {
  console.error(`Error in ${context}:`, error);
  return defaultReturn;
};

// Default values for checkout customization when none exists
export const getDefaultCheckoutCustomization = (produtoId: string) => ({
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
  payment_methods: ['pix', 'cartao'] as PaymentMethodType[],
  payment_info_title: "Informações de Pagamento",
  testimonials_title: "O que dizem nossos clientes",
  cta_text: "Comprar agora"
});

// Helper function to parse payment methods from Supabase response
export const parsePaymentMethods = (paymentMethodsData: any): PaymentMethodType[] => {
  if (!paymentMethodsData) {
    return ["pix", "cartao"] as PaymentMethodType[];
  }
  
  let methods: string[];
  
  if (typeof paymentMethodsData === 'string') {
    try {
      methods = JSON.parse(paymentMethodsData);
    } catch (e) {
      methods = ["pix", "cartao"];
    }
  } else if (Array.isArray(paymentMethodsData)) {
    methods = paymentMethodsData;
  } else {
    methods = ["pix", "cartao"];
  }
  
  // Filter to ensure only valid payment method types are included
  return methods.filter(method => 
    method === 'pix' || method === 'cartao' || method === 'boleto'
  ) as PaymentMethodType[];
};
