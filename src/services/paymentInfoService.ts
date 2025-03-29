
import { supabase } from '@/integrations/supabase/client';

export async function getAllPaymentInfo() {
  const { data, error } = await supabase
    .from('pagamentos')
    .select(`
      *,
      pedidos:pedido_id(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching payment info:', error);
    throw error;
  }

  return data || [];
}

export async function deletePaymentInfo(id: string) {
  const { error } = await supabase
    .from('pagamentos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting payment info:', error);
    throw error;
  }

  return true;
}
