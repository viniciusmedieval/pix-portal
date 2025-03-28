
import { getMergedConfig } from './config/mergeConfigService';
import { updateCheckoutConfig } from './config/checkoutConfigService';
import { updatePixConfig } from './config/pixConfigService';

/**
 * Gets the complete configuration for a product
 */
export async function getConfig(produtoId: string) {
  return getMergedConfig(produtoId);
}

/**
 * Creates or updates configuration for a product
 */
export async function criarOuAtualizarConfig(config: {
  produto_id: string;
  cor_fundo?: string;
  cor_botao?: string;
  texto_botao?: string;
  chave_pix?: string;
  qr_code?: string;
  mensagem_pix?: string;
  tempo_expiracao?: number;
  exibir_testemunhos?: boolean;
  numero_aleatorio_visitas?: boolean;
  bloquear_cpfs?: string[];
  nome_beneficiario?: string;
  timer_enabled?: boolean;
  timer_minutes?: number;
  timer_text?: string;
  timer_bg_color?: string;
  timer_text_color?: string;
  discount_badge_text?: string;
  discount_badge_enabled?: boolean;
  discount_amount?: number;
  original_price?: number;
  payment_security_text?: string;
  imagem_banner?: string;
  banner_bg_color?: string;
  header_message?: string;
  header_bg_color?: string;
  header_text_color?: string;
  show_header?: boolean;
  show_footer?: boolean;
  footer_text?: string;
  testimonials_title?: string;
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
}) {
  console.log('Creating or updating config with form header settings:', {
    form_header_text: config.form_header_text,
    form_header_bg_color: config.form_header_bg_color,
    form_header_text_color: config.form_header_text_color
  });

  try {
    // Update checkout configuration
    const checkoutData = {
      produto_id: config.produto_id,
      cor_fundo: config.cor_fundo,
      cor_botao: config.cor_botao,
      texto_botao: config.texto_botao,
      exibir_testemunhos: config.exibir_testemunhos,
      numero_aleatorio_visitas: config.numero_aleatorio_visitas,
      bloquear_cpfs: config.bloquear_cpfs,
      timer_enabled: config.timer_enabled,
      timer_minutes: config.timer_minutes,
      timer_text: config.timer_text,
      timer_bg_color: config.timer_bg_color,
      timer_text_color: config.timer_text_color,
      discount_badge_text: config.discount_badge_text,
      discount_badge_enabled: config.discount_badge_enabled,
      discount_amount: config.discount_amount,
      original_price: config.original_price,
      payment_security_text: config.payment_security_text,
      imagem_banner: config.imagem_banner,
      banner_bg_color: config.banner_bg_color,
      header_message: config.header_message,
      header_bg_color: config.header_bg_color,
      header_text_color: config.header_text_color,
      show_header: config.show_header,
      show_footer: config.show_footer,
      footer_text: config.footer_text,
      testimonials_title: config.testimonials_title,
      one_checkout_enabled: config.one_checkout_enabled,
      form_header_text: config.form_header_text,
      form_header_bg_color: config.form_header_bg_color,
      form_header_text_color: config.form_header_text_color,
      company_name: config.company_name,
      company_description: config.company_description,
      contact_email: config.contact_email,
      contact_phone: config.contact_phone,
      show_terms_link: config.show_terms_link,
      show_privacy_link: config.show_privacy_link,
      terms_url: config.terms_url,
      privacy_url: config.privacy_url
    };

    await updateCheckoutConfig(checkoutData);

    // Update PIX configuration if PIX data is provided
    if (config.chave_pix || config.qr_code || config.mensagem_pix || config.tempo_expiracao || config.nome_beneficiario) {
      const pixData = {
        produto_id: config.produto_id,
        codigo_copia_cola: config.chave_pix,
        qr_code_url: config.qr_code,
        mensagem_pos_pix: config.mensagem_pix,
        tempo_expiracao: config.tempo_expiracao || 15,
        nome_beneficiario: config.nome_beneficiario
      };

      await updatePixConfig(pixData);
    }

    // Return the full updated config
    return getConfig(config.produto_id);
  } catch (error) {
    console.error('Error in criarOuAtualizarConfig:', error);
    throw error;
  }
}
