
import { z } from "zod";

export const formSchema = z.object({
  // Produto settings
  productName: z.string().optional(),
  price: z.coerce.number().optional(),
  
  // General appearance settings
  backgroundColor: z.string().optional(),
  buttonColor: z.string().optional(),
  buttonText: z.string().optional(),
  
  // Header settings
  headerMessage: z.string().optional(),
  headerBgColor: z.string().optional(),
  headerTextColor: z.string().optional(),
  showHeader: z.boolean().optional(),
  
  // Form settings
  formHeaderText: z.string().optional(),
  formHeaderBgColor: z.string().optional(),
  formHeaderTextColor: z.string().optional(),
  
  // Footer settings
  footerText: z.string().optional(),
  showFooter: z.boolean().optional(),
  companyName: z.string().optional(),
  companyDescription: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  showTermsLink: z.boolean().optional(),
  showPrivacyLink: z.boolean().optional(),
  termsUrl: z.string().optional(),
  privacyUrl: z.string().optional(),
  
  // Checkout settings
  showTestimonials: z.boolean().optional(),
  showVisitorCounter: z.boolean().optional(),
  oneCheckoutEnabled: z.boolean().optional(),
  testimonialTitle: z.string().optional(),
  blockedCpfs: z.string().optional(),
  
  // Timer settings
  timerEnabled: z.boolean().optional(),
  timerMinutes: z.coerce.number().min(1).optional(),
  timerText: z.string().optional(),
  timerBgColor: z.string().optional(),
  timerTextColor: z.string().optional(),
  
  // Discount settings
  discountBadgeEnabled: z.boolean().optional(),
  discountBadgeText: z.string().optional(),
  discountAmount: z.coerce.number().min(0).optional(),
  originalPrice: z.coerce.number().nullable().optional(),
  
  // PIX settings
  pixKey: z.string().optional(),
  beneficiaryName: z.string().optional(),
  qrCodeUrl: z.string().optional(),
  pixMessage: z.string().optional(),
  expirationTime: z.coerce.number().min(1).default(15).optional(),
  pixRedirectUrl: z.string().optional(), 
  
  // PIX page customization settings
  pixTitulo: z.string().optional(),
  pixSubtitulo: z.string().optional(),
  pixTimerTexto: z.string().optional(),
  pixBotaoTexto: z.string().optional(),
  pixInstrucoesTitulo: z.string().optional(),
  pixInstrucoes: z.array(z.string()).default([
    "Abra o aplicativo do seu banco",
    "Escolha a opção PIX e cole o código ou use a câmera do celular para pagar com QR Code",
    "Confirme as informações e finalize o pagamento"
  ]).optional(),
  pixSegurancaTexto: z.string().optional(),
  pixCompraTitulo: z.string().optional(),
  pixSaibaMaisTexto: z.string().optional(),
  pixMostrarProduto: z.boolean().default(true).optional(),
  pixMostrarTermos: z.boolean().default(true).optional(),
  pixTextoCopied: z.string().optional(),
});
