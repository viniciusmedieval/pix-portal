
import { supabase } from '@/integrations/supabase/client';

export async function getPixel(produto_id: string) {
  const { data, error } = await supabase.from('pixels').select('*').eq('produto_id', produto_id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function criarOuAtualizarPixel(pixel: {
  produto_id: string;
  facebook_pixel?: string;
  google_tag?: string;
  custom_script?: string;
}) {
  // Verificar se já existe pixels para este produto
  const { data: existingPixel } = await supabase
    .from('pixels')
    .select('id')
    .eq('produto_id', pixel.produto_id)
    .maybeSingle();

  if (existingPixel) {
    // Atualizar pixels existentes
    const { data, error } = await supabase
      .from('pixels')
      .update(pixel)
      .eq('id', existingPixel.id)
      .select();
    
    if (error) throw error;
    return data[0];
  } else {
    // Criar novos pixels
    const { data, error } = await supabase
      .from('pixels')
      .insert([pixel])
      .select();
    
    if (error) throw error;
    return data[0];
  }
}
