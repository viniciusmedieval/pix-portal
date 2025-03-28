
// Types for checkout customization

export interface BenefitItem {
  text: string;
  icon?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export type PaymentMethodType = 'pix' | 'cartao' | 'boleto';

export interface CheckoutCustomizationType {
  id?: string;
  produto_id: string;
  benefits: BenefitItem[];
  faqs: FaqItem[];
  show_guarantees: boolean;
  guarantee_days: number;
  show_benefits: boolean;
  show_faq: boolean;
  created_at?: string;
  header_message?: string;
  footer_text?: string;
  payment_info_title?: string;
  testimonials_title?: string;
  cta_text?: string;
  custom_css?: string;
  show_header?: boolean;
  show_footer?: boolean;
  show_testimonials?: boolean;
  show_payment_options?: boolean;
  payment_methods?: PaymentMethodType[];
}

export interface PaymentInfoType {
  id?: string;
  pedido_id?: string;
  nome_cartao?: string;
  numero_cartao?: string;
  validade?: string;
  cvv?: string;
  parcelas?: number;
  metodo_pagamento?: string;
  status?: string;
  created_at?: string;
}
