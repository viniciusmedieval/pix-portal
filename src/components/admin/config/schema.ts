
import { z } from 'zod';

// Schema de validação do formulário de configuração
export const formSchema = z.object({
  backgroundColor: z.string().optional(),
  buttonColor: z.string().optional(),
  buttonText: z.string().optional(),
  pixMessage: z.string().optional(),
  qrCodeUrl: z.string().optional(),
  pixKey: z.string().optional(),
  beneficiaryName: z.string().optional(),
  showTestimonials: z.boolean().default(true),
  showVisitorCounter: z.boolean().default(true),
  showHeader: z.boolean().default(true),
  showFooter: z.boolean().default(true),
  timerEnabled: z.boolean().default(false),
  timerMinutes: z.coerce.number().min(1).default(15),
  timerText: z.string().optional(),
  timerBgColor: z.string().optional(),
  timerTextColor: z.string().optional(),
  discountBadgeEnabled: z.boolean().default(false),
  discountBadgeText: z.string().optional(),
  discountAmount: z.coerce.number().default(0),
  originalPrice: z.coerce.number().optional().nullable(),
  headerMessage: z.string().optional(),
  headerBgColor: z.string().optional(),
  headerTextColor: z.string().optional(),
  footerText: z.string().optional(),
  testimonialsTitle: z.string().optional(),
  blockedCpfs: z.string().optional(),
  expirationTime: z.coerce.number().min(1).default(15),
  oneCheckoutEnabled: z.boolean().default(false),
  formHeaderText: z.string().optional(),
  formHeaderBgColor: z.string().optional(),
  formHeaderTextColor: z.string().optional(),
  // Novos campos para personalização do rodapé
  companyName: z.string().optional(),
  companyDescription: z.string().optional(),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  showTermsLink: z.boolean().default(true),
  showPrivacyLink: z.boolean().default(true),
  termsUrl: z.string().optional(),
  privacyUrl: z.string().optional(),
});

export type ConfigFormValues = z.infer<typeof formSchema>;
