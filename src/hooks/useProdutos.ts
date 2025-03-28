
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getProdutos, deletarProduto, ProdutoType } from '@/services/produtoService';

export function useProdutos() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sortField, setSortField] = useState<keyof ProdutoType>('criado_em');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  const fetchProdutos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching products...');
      const data = await getProdutos();
      console.log('Products fetched:', data);
      setProdutos(data);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido ao carregar produtos'));
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os produtos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const refetch = useCallback(() => {
    fetchProdutos();
  }, [fetchProdutos]);

  useEffect(() => {
    fetchProdutos();
  }, [fetchProdutos]);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
      await deletarProduto(id);
      setProdutos(produtos.filter(produto => produto.id !== id));
      toast({
        title: 'Sucesso',
        description: 'Produto excluído com sucesso',
      });
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o produto',
        variant: 'destructive',
      });
    }
  };

  const sortProdutos = (field: keyof ProdutoType) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    
    setSortField(field);
    setSortDirection(newDirection);
    
    const sortedProdutos = [...produtos].sort((a, b) => {
      if (a[field] === null) return 1;
      if (b[field] === null) return -1;
      
      if (typeof a[field] === 'string' && typeof b[field] === 'string') {
        return newDirection === 'asc' 
          ? (a[field] as string).localeCompare(b[field] as string)
          : (b[field] as string).localeCompare(a[field] as string);
      }
      
      return newDirection === 'asc' 
        ? Number(a[field]) - Number(b[field])
        : Number(b[field]) - Number(a[field]);
    });
    
    setProdutos(sortedProdutos);
  };

  return {
    produtos,
    loading,
    error,
    handleDelete,
    sortProdutos,
    refetch
  };
}
