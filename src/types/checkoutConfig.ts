
import { Database } from '@/types/database.types';

// Define the correct type to use in CheckoutPage.tsx
export type CheckoutConfigType = {
  id: string;
  titulo?: string;
  descricao?: string;
  cor_primaria?: string;
  cor_secundaria?: string;
  fonte?: string;
  max_parcelas?: number;
  criado_em?: string;
  contador_ativo?: boolean;
  visitantes_min?: number;
  visitantes_max?: number;
  produto_id?: string;
  banner_url?: string | null;
  texto_topo?: string | null;
  texto_botao?: string | null;
  logo_url?: string | null;
};
