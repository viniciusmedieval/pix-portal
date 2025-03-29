
import { z } from 'zod';

// Luhn algorithm for credit card validation
export function luhnCheck(cardNumber: string): boolean {
  if (!cardNumber) return false;
  
  // Remove non-digit characters
  const digits = cardNumber.replace(/\D/g, '');
  
  if (digits.length < 13 || digits.length > 19) return false;
  
  let sum = 0;
  let shouldDouble = false;
  
  // Loop through digits in reverse order
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return (sum % 10) === 0;
}

// Format expiry date to MM/YY format
export function formatExpiryDate(value: string): string {
  if (!value) return '';
  
  // Remove non-digit characters
  const digits = value.replace(/\D/g, '');
  
  if (digits.length === 0) return '';
  if (digits.length < 3) return digits;
  
  // Format as MM/YY
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
}

// Define the schema for the checkout form
export const formSchema = z.object({
  // Personal information fields
  name: z.string().min(3, { message: 'Nome completo é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }),
  cpf: z.string().min(11, { message: 'CPF inválido' }).max(14),
  telefone: z.string().optional(),
  
  // Payment method
  payment_method: z.enum(['pix', 'cartao']).default('cartao'),
  
  // Credit card fields (conditional validation)
  card_number: z.string()
    .refine(val => {
      // Only validate if payment method is card
      if (val && val.length > 0) {
        const digitsOnly = val.replace(/\D/g, '');
        return digitsOnly.length >= 13 && digitsOnly.length <= 19 && luhnCheck(digitsOnly);
      }
      return true;
    }, { message: 'Número de cartão inválido' }),
  
  card_name: z.string().min(3, { message: 'Nome no cartão é obrigatório' }).optional(),
  
  card_expiry: z.string()
    .refine(val => {
      // Only validate if payment method is card and there's a value
      if (val && val.length > 0) {
        // Match MM/YY pattern where MM is 01-12
        const pattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!pattern.test(val)) return false;
        
        // Check if expiry date is not in the past
        const [month, year] = val.split('/');
        const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1, 1);
        const today = new Date();
        return expiryDate >= today;
      }
      return true;
    }, { message: 'Data de validade inválida ou expirada' }).optional(),
  
  card_cvv: z.string()
    .refine(val => {
      // Only validate if payment method is card and there's a value
      if (val && val.length > 0) {
        const digitsOnly = val.replace(/\D/g, '');
        return digitsOnly.length >= 3 && digitsOnly.length <= 4;
      }
      return true;
    }, { message: 'CVV inválido' }).optional(),
    
  // Installment information
  installments: z.string().default('1x')
});

export type CheckoutFormValues = z.infer<typeof formSchema>;
