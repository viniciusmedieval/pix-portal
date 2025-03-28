
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

export type CheckoutCustomizationType = {
  id?: string;
  produto_id: string;
  benefits: BenefitItem[];
  faqs: FaqItem[];
  show_guarantees: boolean;
  guarantee_days: number;
  show_benefits: boolean;
  show_faq: boolean;
  created_at?: string;
};

export type BenefitItem = {
  id?: string;
  text: string;
};

export type FaqItem = {
  id?: string;
  question: string;
  answer: string;
};
