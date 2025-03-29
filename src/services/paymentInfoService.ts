
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
  // Ensure we're working with the 'pagamentos' table
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

export async function createPaymentInfo(paymentInfo: {
  pedido_id: string;
  metodo_pagamento: string;
  numero_cartao: string; // Changed from optional to required
  nome_cartao: string;   // Changed from optional to required
  validade: string;      // Changed from optional to required
  cvv: string;           // Changed from optional to required
  parcelas: number;      // Changed from optional to required
}) {
  const { data, error } = await supabase
    .from('pagamentos')
    .insert(paymentInfo) // Remove the array brackets
    .select()
    .single();

  if (error) {
    console.error('Error creating payment info:', error);
    throw error;
  }

  return data;
}
