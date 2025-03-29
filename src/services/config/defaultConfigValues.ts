
// Default configuration values
export const DEFAULT_CONFIG = {
  cor_fundo: '#f9fafb',
  cor_botao: '#22c55e',
  texto_botao: 'Comprar agora',
  exibir_testemunhos: true,
  numero_aleatorio_visitas: true,
  bloquear_cpfs: [],
  chave_pix: '',
  qr_code: '',
  mensagem_pix: '',
  nome_beneficiario: 'Nome do Beneficiário',
  tipo_chave: 'email',
  tempo_expiracao: 15,
  timer_enabled: false,
  timer_minutes: 15,
  timer_text: 'Oferta expira em:',
  timer_bg_color: '#000000',
  timer_text_color: '#ffffff',
  discount_badge_enabled: false,
  discount_badge_text: 'Oferta especial',
  discount_amount: 0,
  original_price: 0,
  payment_security_text: 'Pagamento 100% seguro',
  payment_methods: ['pix', 'cartao'],
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
  mostrar_qrcode_mobile: true,
  // PIX specific fields
  pix_titulo: 'Pagamento via PIX',
  pix_subtitulo: 'Copie o código ou use o QR Code para realizar o pagamento',
  pix_timer_texto: 'Faltam {minutos}:{segundos} para o pagamento expirar...',
  pix_botao_texto: 'Confirmar pagamento',
  pix_seguranca_texto: 'Os bancos reforçaram a segurança do Pix e podem exibir avisos preventivos. Não se preocupe, sua transação está protegida.',
  pix_compra_titulo: 'Sua Compra',
  pix_mostrar_produto: true,
  pix_mostrar_termos: true,
  pix_saiba_mais_texto: 'Saiba mais sobre PIX',
  pix_texto_copiado: 'Código copiado!',
  pix_instrucoes_titulo: 'Para realizar o pagamento:',
  pix_instrucoes: [
    'Abra o aplicativo do seu banco',
    'Escolha a opção PIX e cole o código ou use a câmera do celular para pagar com QR Code',
    'Confirme as informações e finalize o pagamento'
  ],
  // Default FAQ settings
  show_faq: true,
  faqs: [
    {
      question: "Quando receberei meu produto após o pagamento?",
      answer: "Você receberá os dados de acesso por e-mail em até 15 minutos após a confirmação do PIX. Caso não encontre, verifique sua caixa de spam."
    },
    {
      question: "É seguro pagar com PIX?",
      answer: "Sim! O PIX é um método 100% seguro e aprovado pelo Banco Central. Não compartilhe seu comprovante com terceiros."
    },
    {
      question: "Posso cancelar após o pagamento?",
      answer: "Em caso de arrependimento, entre em contato em até 7 dias para reembolso, conforme nosso Termos de Compra."
    }
  ]
};
