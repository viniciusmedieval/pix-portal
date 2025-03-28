
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProdutoCard from "@/components/ProdutoCard";
import { useQuery } from "@tanstack/react-query";
import { getProdutos } from "@/services/produtoService";

const Products = () => {
  const { data: produtos, isLoading } = useQuery({
    queryKey: ['produtos'],
    queryFn: getProdutos
  });

  return (
    <section id="products" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-4">
          Nossos Produtos
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Confira nossos produtos em destaque e veja como podem transformar seus processos de venda online.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-48 w-64 rounded-lg bg-gray-200 mb-4"></div>
                <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : produtos && produtos.length > 0 ? (
            produtos.map((produto) => (
              <ProdutoCard
                key={produto.id}
                id={produto.id}
                nome={produto.nome}
                descricao={produto.descricao || ""}
                preco={produto.preco}
                imagem_url={produto.imagem_url}
                slug={produto.slug}
                estoque={produto.estoque}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">Nenhum produto encontrado. Adicione produtos no painel administrativo.</p>
              <Link to="/admin/produtos" className="inline-block mt-4">
                <Button variant="outline">
                  Ir para administração de produtos
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Products;
