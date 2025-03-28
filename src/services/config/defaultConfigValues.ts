
/**
 * Default configuration values for checkout
 */
export const DEFAULT_CONFIG = {
  cor_fundo: '#f5f5f7',
  cor_botao: '#30b968',
  texto_botao: 'Finalizar compra',
  exibir_testemunhos: true,
  numero_aleatorio_visitas: true,
  bloquear_cpfs: [],
  timer_enabled: false,
  timer_minutes: 15,
  timer_text: 'Oferta expira em:',
  timer_bg_color: '#000000',
  timer_text_color: '#ffffff',
  discount_badge_text: 'Oferta especial',
  discount_badge_enabled: true,
  discount_amount: 0,
  payment_security_text: 'Pagamento 100% seguro',
  banner_bg_color: '#000000',
  header_message: 'Tempo restante! Garanta sua oferta',
  header_bg_color: '#000000',
  header_text_color: '#ffffff',
  show_header: true,
  show_footer: true,
  footer_text: 'Todos os direitos reservados © 2023',
  testimonials_title: 'O que dizem nossos clientes',
  one_checkout_enabled: false,
  form_header_text: 'PREENCHA SEUS DADOS ABAIXO',
  form_header_bg_color: '#dc2626',
  form_header_text_color: '#ffffff',
  company_name: 'PixPortal',
  company_description: 'Soluções de pagamento para aumentar suas vendas online.',
  contact_email: 'contato@pixportal.com.br',
  contact_phone: '(11) 99999-9999',
  show_terms_link: true,
  show_privacy_link: true,
  terms_url: '/termos',
  privacy_url: '/privacidade',
  payment_methods: ['pix', 'cartao'],
  
  // PIX specific fields
  chave_pix: '',
  qr_code: '',
  mensagem_pix: '',
  tempo_expiracao: 15,
  nome_beneficiario: '',
  original_price: null,
  
  // PIX page customization fields
  pix_titulo: 'Aqui está o PIX copia e cola',
  pix_subtitulo: 'Copie o código ou use a câmera para ler o QR Code e realize o pagamento no app do seu banco.',
  pix_timer_texto: 'Faltam {minutos}:{segundos} minutos para o pagamento expirar...',
  pix_botao_texto: 'Confirmar pagamento',
  pix_seguranca_texto: 'Os bancos reforçaram a segurança do Pix e podem exibir avisos preventivos. Não se preocupe, sua transação está protegida.',
  pix_compra_titulo: 'Sua Compra',
  pix_mostrar_produto: true,
  pix_mostrar_termos: true,
  pix_saiba_mais_texto: 'Saiba mais',
  pix_texto_copiado: 'Código copiado!',
  pix_instrucoes_titulo: 'Para realizar o pagamento:',
  pix_instrucoes: [
    'Abra o aplicativo do seu banco',
    'Escolha a opção PIX e cole o código ou use a câmera do celular para pagar com QR Code',
    'Confirme as informações e finalize o pagamento'
  ]
};
