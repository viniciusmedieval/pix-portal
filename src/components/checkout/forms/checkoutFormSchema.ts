
import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  cpf: z.string().min(11, { message: "CPF inválido" }),
  telefone: z.string().min(10, { message: "Telefone inválido" }),
  payment_method: z.enum(["pix", "cartao"]),
  // Campos do cartão (opcionais se o método for PIX)
  card_name: z.string().min(3, { message: "Nome no cartão obrigatório" }).optional(),
  card_number: z.string()
    .min(13, { message: "Número do cartão inválido" })
    .optional()
    .refine(
      (val) => {
        if (!val) return true; // Skip validation if empty (for PIX)
        
        // Remove non-digits
        const digitsOnly = val.replace(/\D/g, "");
        
        // Basic Luhn algorithm for credit card validation
        let sum = 0;
        let shouldDouble = false;
        
        for (let i = digitsOnly.length - 1; i >= 0; i--) {
          let digit = parseInt(digitsOnly.charAt(i));
          
          if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
          }
          
          sum += digit;
          shouldDouble = !shouldDouble;
        }
        
        return sum % 10 === 0;
      },
      { message: "Número de cartão inválido" }
    ),
  card_expiry: z.string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true; // Skip validation if empty (for PIX)
        
        // Match MM/YY format where MM can be a single digit (1-9) or double digit (01-12)
        const pattern = /^(0?[1-9]|1[0-2])\/(2\d)$/;
        
        if (!pattern.test(val)) return false;
        
        // Extract month and year
        const [month, year] = val.split('/');
        const currentYear = new Date().getFullYear() % 100; // Get last 2 digits
        const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed
        
        // Convert to numbers
        const yearNum = parseInt(year, 10);
        const monthNum = parseInt(month, 10);
        
        // Validate that the date is in the future or current month
        return (yearNum > currentYear) || 
               (yearNum === currentYear && monthNum >= currentMonth);
      },
      { message: "Data de expiração inválida ou expirada" }
    ),
  card_cvv: z.string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true; // Skip validation if empty (for PIX)
        
        const digitsOnly = val.replace(/\D/g, "");
        return digitsOnly.length >= 3 && digitsOnly.length <= 4;
      },
      { message: "CVV inválido" }
    ),
  installments: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof formSchema>;
