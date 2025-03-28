
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/database.types';

// Export the complete ProdutoType with all fields
export type ProdutoType = Database['public']['Tables']['produtos']['Row'];

// Re-export all functions from their respective service files
export { 
  getProdutos,
  getProdutoById,
  getProdutoBySlug
} from './produto/produtoQueryService';

export {
  criarProduto,
  atualizarProduto,
  deletarProduto
} from './produto/produtoMutationService';

export {
  verificarEstoque,
  atualizarEstoque
} from './produto/produtoInventoryService';
