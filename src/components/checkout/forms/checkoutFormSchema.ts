
import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  cpf: z.string().min(11, { message: "CPF inválido" }),
  telefone: z.string().optional(),
  payment_method: z.enum(["pix", "cartao"]),
  // Campos do cartão (opcionais se o método for PIX)
  card_name: z.string().min(3, { message: "Nome no cartão obrigatório" }).optional(),
  card_number: z.string().min(13, { message: "Número do cartão inválido" }).optional(),
  card_expiry: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, { message: "Formato deve ser MM/AA" }).optional(),
  card_cvv: z.string().regex(/^[0-9]{3,4}$/, { message: "CVV inválido" }).optional(),
  installments: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof formSchema>;
