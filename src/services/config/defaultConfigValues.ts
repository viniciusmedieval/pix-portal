
/**
 * Default values for checkout configuration
 */
export const DEFAULT_CONFIG = {
  // Common default values
  cor_fundo: '#f9fafb',
  cor_botao: '#22c55e',
  texto_botao: 'Comprar agora',
  numero_aleatorio_visitas: true,
  exibir_testemunhos: true,
  tempo_expiracao: 15,
  
  // Timer settings
  timer_enabled: false,
  timer_minutes: 15,
  timer_text: 'Oferta expira em:',
  timer_bg_color: '#000000',
  timer_text_color: '#ffffff',
  
  // Discount settings
  discount_badge_text: 'Oferta especial',
  discount_badge_enabled: true,
  discount_amount: 0,
  original_price: null,
  
  // Other visual elements
  payment_security_text: 'Pagamento 100% seguro',
  imagem_banner: null,
  banner_bg_color: '#000000',
  
  // Header fields
  header_message: 'Tempo restante! Garanta sua oferta',
  header_bg_color: '#000000',
  header_text_color: '#ffffff',
  show_header: true,
  
  // Footer fields
  show_footer: true,
  footer_text: 'Todos os direitos reservados © 2023',
  company_name: 'PixPortal',
  company_description: 'Soluções de pagamento para aumentar suas vendas online.',
  contact_email: 'contato@pixportal.com.br',
  contact_phone: '(11) 99999-9999',
  show_terms_link: true,
  show_privacy_link: true,
  terms_url: '/termos',
  privacy_url: '/privacidade',
  
  // Testimonials
  testimonials_title: 'O que dizem nossos clientes',
  
  // One checkout option
  one_checkout_enabled: false,
  
  // Form header
  form_header_text: 'PREENCHA SEUS DADOS ABAIXO',
  form_header_bg_color: '#dc2626', // red-600 em hexadecimal
  form_header_text_color: '#ffffff',
};
