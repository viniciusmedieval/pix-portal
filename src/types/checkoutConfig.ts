
import { Json } from './database.types';

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

export interface CheckoutConfigType {
  id?: string;
  produto_id: string;
  cor_fundo?: string;
  cor_botao?: string; 
  texto_botao?: string;
  exibir_testemunhos?: boolean;
  numero_aleatorio_visitas?: boolean;
  bloquear_cpfs?: string[];
  chave_pix?: string;
  qr_code?: string;
  mensagem_pix?: string;
  tempo_expiracao?: number;
  nome_beneficiario?: string;
  tipo_chave?: string;
  timer_enabled?: boolean;
  timer_minutes?: number;
  timer_text?: string;
  timer_bg_color?: string;
  timer_text_color?: string;
  discount_badge_text?: string;
  discount_badge_enabled?: boolean;
  discount_amount?: number;
  original_price?: number | null;
  payment_security_text?: string;
  imagem_banner?: string | null;
  banner_bg_color?: string;
  header_message?: string;
  header_bg_color?: string;
  header_text_color?: string;
  show_header?: boolean;
  show_footer?: boolean;
  footer_text?: string;
  testimonials_title?: string;
  payment_methods?: string[];
  one_checkout_enabled?: boolean;
  form_header_text?: string;
  form_header_bg_color?: string;
  form_header_text_color?: string;
  company_name?: string;
  company_description?: string;
  contact_email?: string;
  contact_phone?: string;
  show_terms_link?: boolean;
  show_privacy_link?: boolean;
  terms_url?: string;
  privacy_url?: string;
  mostrar_qrcode_mobile?: boolean;
  pix_redirect_url?: string;
  
  // PIX page specific properties
  pix_titulo?: string;
  pix_subtitulo?: string;
  pix_timer_texto?: string;
  pix_botao_texto?: string;
  pix_seguranca_texto?: string;
  pix_compra_titulo?: string;
  pix_mostrar_produto?: boolean;
  pix_mostrar_termos?: boolean;
  pix_saiba_mais_texto?: string;
  pix_texto_copiado?: string;
  pix_instrucoes_titulo?: string;
  pix_instrucoes?: string[];
  faqs?: FaqItem[];
  
  // WhatsApp integration properties
  whatsapp_number?: string;
  whatsapp_message?: string;
  show_whatsapp_button?: boolean;
}
