
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
  console.log('Attempting to delete payment info with ID:', id);
  
  const { error } = await supabase
    .from('pagamentos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting payment info:', error);
    throw error;
  }
  
  console.log('Payment info deleted successfully');
  return true;
}

export async function createPaymentInfo(paymentInfo: {
  pedido_id: string;
  metodo_pagamento: string;
  numero_cartao: string;
  nome_cartao: string;
  validade: string;
  cvv: string;
  parcelas: number;
}) {
  const { data, error } = await supabase
    .from('pagamentos')
    .insert(paymentInfo)
    .select()
    .single();

  if (error) {
    console.error('Error creating payment info:', error);
    throw error;
  }

  return data;
}
