
import { Database } from '@/types/database.types';

// Define the correct type to use in CheckoutPage.tsx
export type CheckoutConfigType = {
  id: string;
  titulo?: string;
  descricao?: string;
  cor_primaria?: string;
  cor_secundaria?: string;
  fonte?: string;
  max_parcelas?: number;
  criado_em?: string;
  contador_ativo?: boolean;
  visitantes_min?: number;
  visitantes_max?: number;
  produto_id?: string;
  banner_url?: string | null;
  texto_topo?: string | null;
  texto_botao?: string | null;
  logo_url?: string | null;
  // Novos campos
  timer_enabled?: boolean;
  timer_minutes?: number;
  timer_text?: string;
  discount_badge_text?: string;
  discount_badge_enabled?: boolean;
  discount_amount?: number;
  original_price?: number;
  payment_security_text?: string;
};

export type CheckoutCustomizationType = {
  id?: string;
  produto_id: string;
  benefits: BenefitItem[];
  faqs: FaqItem[];
  show_guarantees: boolean;
  guarantee_days: number;
  show_benefits: boolean;
  show_faq: boolean;
  created_at?: string;
  // Novos campos
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
  payment_methods?: string[];
};

export type BenefitItem = {
  id?: string;
  text: string;
};

export type FaqItem = {
  id?: string;
  question: string;
  answer: string;
};

export type PaymentInfoType = {
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
};
