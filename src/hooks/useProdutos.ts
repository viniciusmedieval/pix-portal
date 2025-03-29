
import { useState, useEffect } from 'react';
import { getProdutos, deletarProduto } from '@/services/produtoService';

// Define product type locally instead of importing it
export type Produto = {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  imagem_url?: string;
  slug?: string;
  estoque?: number;
  ativo?: boolean;
  criado_em?: string;
  parcelas?: number;
};

export function useProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProdutos() {
      try {
        setLoading(true);
        const data = await getProdutos();
        setProdutos(data);
      } catch (err) {
        console.error('Error fetching produtos:', err);
        setError('Falha ao carregar produtos. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    }

    fetchProdutos();
  }, []);

  const refetch = async () => {
    setLoading(true);
    try {
      const data = await getProdutos();
      setProdutos(data);
      setError(null);
    } catch (err) {
      console.error('Error refetching produtos:', err);
      setError('Falha ao recarregar produtos. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, nome?: string) => {
    try {
      await deletarProduto(id);
      await refetch();
      return true;
    } catch (error) {
      console.error(`Error deleting produto ${id}:`, error);
      return false;
    }
  };

  const sortProdutos = (field: keyof Produto, direction: 'asc' | 'desc' = 'asc') => {
    const sorted = [...produtos].sort((a, b) => {
      const valueA = a[field] || '';
      const valueB = b[field] || '';
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return direction === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
      
      return direction === 'asc' 
        ? (valueA as any) - (valueB as any) 
        : (valueB as any) - (valueA as any);
    });
    
    setProdutos(sorted);
  };

  return { produtos, loading, error, refetch, handleDelete, sortProdutos };
}
