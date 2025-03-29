
import { supabase } from '@/integrations/supabase/client';

export async function getAllPaymentInfo() {
  const { data, error } = await supabase
    .from('payment_info')
    .select('*, pedidos:pedido_id(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching payment info:', error);
    throw error;
  }

  return data || [];
}

export async function getPaymentInfoById(id: string) {
  const { data, error } = await supabase
    .from('payment_info')
    .select('*, pedidos:pedido_id(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching payment info by id:', error);
    throw error;
  }

  return data;
}

export async function createPaymentInfo(paymentInfo: {
  pedido_id: string;
  metodo_pagamento: string;
  numero_cartao?: string;
  nome_cartao?: string;
  validade?: string;
  cvv?: string;
  parcelas?: number;
}) {
  const { data, error } = await supabase
    .from('payment_info')
    .insert([paymentInfo])
    .select('*')
    .single();

  if (error) {
    console.error('Error creating payment info:', error);
    throw error;
  }

  return data;
}

export async function updatePaymentInfo(id: string, updates: any) {
  const { data, error } = await supabase
    .from('payment_info')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error('Error updating payment info:', error);
    throw error;
  }

  return data;
}

export async function deletePaymentInfo(id: string) {
  const { error } = await supabase
    .from('payment_info')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting payment info:', error);
    throw error;
  }

  return true;
}
