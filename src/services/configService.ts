
import { getMergedConfig } from './config/mergeConfigService';
import { updateCheckoutConfig } from './config/checkoutConfigService';
import { updatePixConfig } from './config/pixConfigService';

/**
 * Gets the complete configuration for a product
 */
export async function getConfig(produtoId: string) {
  console.log("Getting config for product ID:", produtoId);
  
  try {
    const config = await getMergedConfig(produtoId);
    console.log("Retrieved merged config:", config);
    return config;
  } catch (error) {
    console.error("Error getting config:", error);
    throw error;
  }
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
  bloquear_cpfs?: string | string[];
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
  // New PIX page configuration fields
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
  mostrar_qrcode_mobile?: boolean;
  pix_redirect_url?: string;
  // WhatsApp integration
  pix_whatsapp_number?: string;
  pix_whatsapp_message?: string;
  pix_show_whatsapp_button?: boolean;
}) {
  console.log('Creating or updating config with PIX fields:', {
    pix_titulo: config.pix_titulo,
    pix_subtitulo: config.pix_subtitulo,
    pix_timer_texto: config.pix_timer_texto,
    tipo_chave: config.tipo_chave,
    nome_beneficiario: config.nome_beneficiario,
    mostrar_qrcode_mobile: config.mostrar_qrcode_mobile,
    pix_redirect_url: config.pix_redirect_url,
    pix_whatsapp_number: config.pix_whatsapp_number,
    pix_whatsapp_message: config.pix_whatsapp_message
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
      bloquear_cpfs: typeof config.bloquear_cpfs === 'string' 
        ? config.bloquear_cpfs.split(',').map(cpf => cpf.trim()) 
        : config.bloquear_cpfs || [],
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
      privacy_url: config.privacy_url,
      pix_redirect_url: config.pix_redirect_url
    };

    await updateCheckoutConfig(checkoutData);
    console.log("Checkout config updated successfully");

    // Update PIX configuration
    const pixData = {
      produto_id: config.produto_id,
      codigo_copia_cola: config.chave_pix,
      qr_code_url: config.qr_code,
      mensagem_pos_pix: config.mensagem_pix,
      tempo_expiracao: config.tempo_expiracao || 15,
      nome_beneficiario: config.nome_beneficiario || 'Nome do Beneficiário',
      tipo_chave: config.tipo_chave || 'email',
      mostrar_qrcode_mobile: config.mostrar_qrcode_mobile !== undefined ? config.mostrar_qrcode_mobile : true,
      redirect_url: config.pix_redirect_url,
      // Add new PIX page customization fields
      titulo: config.pix_titulo,
      instrucao: config.pix_subtitulo,
      botao_texto: config.pix_botao_texto,
      seguranca_texto: config.pix_seguranca_texto,
      compra_titulo: config.pix_compra_titulo,
      mostrar_produto: config.pix_mostrar_produto,
      mostrar_termos: config.pix_mostrar_termos,
      saiba_mais_texto: config.pix_saiba_mais_texto,
      timer_texto: config.pix_timer_texto,
      texto_copiado: config.pix_texto_copiado,
      instrucoes_titulo: config.pix_instrucoes_titulo,
      instrucoes: config.pix_instrucoes,
      whatsapp_number: config.pix_whatsapp_number,
      whatsapp_message: config.pix_whatsapp_message,
      show_whatsapp_button: config.pix_show_whatsapp_button
    };

    console.log("Updating PIX config with data:", pixData);
    await updatePixConfig(pixData);
    console.log("PIX config updated successfully");

    // Return the full updated config
    return getConfig(config.produto_id);
  } catch (error) {
    console.error('Error in criarOuAtualizarConfig:', error);
    throw error;
  }
}
