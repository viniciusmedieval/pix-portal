import { useProdutos } from '@/hooks/useProdutos';
import ProdutosHeader from '@/components/admin/produto/ProdutosHeader';
import EmptyProductsList from '@/components/admin/produto/EmptyProductsList';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { ProdutosTable } from "@/components/admin/produto/ProdutosTable";
import { getProdutos } from "@/services/produtoService";

export default function AdminProdutos() {
  const { produtos, loading, handleDelete, sortProdutos, error, refetch } = useProdutos();
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Erro ao carregar produtos',
        description: 'Não foi possível obter a lista de produtos. Tente novamente.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  return (
    <div className="container py-6">
      <ProdutosHeader />

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {produtos.length === 0 ? (
            <EmptyProductsList onRetry={refetch} />
          ) : (
            <ProdutosTable 
              produtos={produtos} 
              onDelete={handleDelete} 
              onSort={sortProdutos} 
            />
          )}
        </>
      )}
    </div>
  );
}
