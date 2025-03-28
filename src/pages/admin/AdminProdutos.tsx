
import { useProdutos } from '@/hooks/useProdutos';
import ProdutosHeader from '@/components/admin/produto/ProdutosHeader';
import EmptyProductsList from '@/components/admin/produto/EmptyProductsList';
import ProdutosTable from '@/components/admin/produto/ProdutosTable';

export default function AdminProdutos() {
  const { produtos, loading, handleDelete, sortProdutos } = useProdutos();

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
            <EmptyProductsList />
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
