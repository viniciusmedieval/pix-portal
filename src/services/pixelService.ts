
import { supabase } from '@/integrations/supabase/client';

export async function getPixel(produto_id: string) {
  if (!produto_id) return null;
  
  const { data, error } = await supabase
    .from('pixels')
    .select('*')
    .eq('produto_id', produto_id)
    .maybeSingle();
    
  if (error) {
    console.error('Error fetching pixel data:', error);
    return null;
  }
  
  return data;
}

export async function criarOuAtualizarPixel(pixel: {
  produto_id: string;
  facebook_pixel_id?: string;
  google_ads_id?: string;
  gtm_id?: string;
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
