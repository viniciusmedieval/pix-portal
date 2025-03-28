
import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  cpf: z.string().min(11, { message: 'CPF inválido' }),
  telefone: z.string().optional(),
  payment_method: z.enum(['pix', 'cartao']),
  card_name: z.string().optional(),
  card_number: z.string().optional(),
  card_expiry: z.string().optional(),
  card_cvv: z.string().optional(),
  installments: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof formSchema>;
