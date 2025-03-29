
import { useState, useEffect } from 'react';
import { getProdutos } from '@/services/produtoService';

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

  return { produtos, loading, error, refetch };
}
