
import { supabase } from '@/integrations/supabase/client';

export async function verificarEstoque(produtoId: string) {
  try {
    const { data, error } = await supabase
      .from('produtos')
      .select('estoque')
      .eq('id', produtoId)
      .single();

    if (error) {
      console.error(`Erro ao verificar estoque para produto ${produtoId}:`, error);
      return 0;
    }
    
    return data?.estoque !== undefined ? data.estoque : 0;
  } catch (error) {
    console.error(`Exception in verificarEstoque for produto ${produtoId}:`, error);
    return 0;
  }
}

export async function atualizarEstoque(produtoId: string, novaQuantidade: number) {
  try {
    const { error } = await supabase
      .from('produtos')
      .update({ estoque: novaQuantidade })
      .eq('id', produtoId);

    if (error) {
      console.error(`Erro ao atualizar estoque para produto ${produtoId}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Exception in atualizarEstoque for produto ${produtoId}:`, error);
    return false;
  }
}
