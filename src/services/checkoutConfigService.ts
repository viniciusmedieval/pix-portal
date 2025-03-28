
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/database.types';
import { CheckoutConfigType } from '@/types/checkoutConfig';

export async function getCheckoutConfig(): Promise<CheckoutConfigType> {
  const { data, error } = await supabase
    .from('checkout_config')
    .select('*')
    .maybeSingle();

  if (error) throw error;
  
  // Return default values if no data is found
  return data || {
    id: '',
    titulo: 'Checkout',
    descricao: 'Finalizar compra',
    cor_primaria: '#22c55e',
    cor_secundaria: '#f9fafb',
    fonte: 'Inter',
    max_parcelas: 12,
    criado_em: new Date().toISOString(),
    contador_ativo: true,
    visitantes_min: 1,
    visitantes_max: 100
  };
}
