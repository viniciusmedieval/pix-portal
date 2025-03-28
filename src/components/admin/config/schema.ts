
import { z } from 'zod';

export const formSchema = z.object({
  // Basic info
  backgroundColor: z.string().optional(),
  buttonColor: z.string().optional(),
  buttonText: z.string().optional(),
  
  // PIX settings
  pixMessage: z.string().optional(),
  qrCodeUrl: z.string().optional(),
  pixKey: z.string().optional(),
  expirationTime: z.coerce.number().min(1).default(15).optional(),
  beneficiaryName: z.string().optional(),
  
  // Display toggles
  showTestimonials: z.boolean().default(true).optional(),
  showVisitorCounter: z.boolean().default(true).optional(),
  showHeader: z.boolean().default(true).optional(),
  showFooter: z.boolean().default(true).optional(),
  
  // Timer settings
  timerEnabled: z.boolean().default(false).optional(),
  timerMinutes: z.coerce.number().min(1).default(15).optional(),
  timerText: z.string().optional(),
  timerBgColor: z.string().optional(),
  timerTextColor: z.string().optional(),
  
  // Promo settings
  discountBadgeEnabled: z.boolean().default(false).optional(),
  discountBadgeText: z.string().optional(),
  discountAmount: z.coerce.number().min(0).default(0).optional(),
  originalPrice: z.coerce.number().min(0).nullable().optional(),
  
  // Content settings
  headerMessage: z.string().optional(),
  headerBgColor: z.string().optional(),
  headerTextColor: z.string().optional(),
  footerText: z.string().optional(),
  testimonialsTitle: z.string().optional(),
  
  // Security
  blockedCpfs: z.string().optional(),
});
