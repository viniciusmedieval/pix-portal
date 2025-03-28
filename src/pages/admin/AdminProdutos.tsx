
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Pencil, 
  Trash2, 
  PlusCircle, 
  Tag, 
  Package, 
  ArrowUpDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/formatters";
import { getProdutos, deletarProduto, ProdutoType } from '@/services/produtoService';

export default function AdminProdutos() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof ProdutoType>('criado_em');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const data = await getProdutos();
      setProdutos(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os produtos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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
        ? (a[field] as number) - (b[field] as number)
        : (b[field] as number) - (a[field] as number);
    });
    
    setProdutos(sortedProdutos);
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Link to="/admin/produto/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {produtos.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">Nenhum produto cadastrado</h3>
              <p className="mt-2 text-gray-500">Comece adicionando seu primeiro produto.</p>
              <div className="mt-6">
                <Link to="/admin/produto/new">
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Adicionar Produto
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => sortProdutos('nome')}
                    >
                      Produto
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => sortProdutos('preco')}
                    >
                      Preço
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => sortProdutos('estoque')}
                    >
                      Estoque
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => sortProdutos('ativo')}
                    >
                      Status
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtos.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gray-100 rounded-md overflow-hidden">
                          {produto.imagem_url ? (
                            <img
                              src={produto.imagem_url}
                              alt={produto.nome}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Tag className="h-6 w-6 m-2 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{produto.nome}</div>
                          {produto.slug && (
                            <div className="text-xs text-gray-500">/{produto.slug}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(produto.preco)}</TableCell>
                    <TableCell>
                      {produto.estoque !== null && produto.estoque !== undefined ? (
                        <span className={produto.estoque === 0 ? 'text-red-500' : ''}>
                          {produto.estoque}
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        produto.ativo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {produto.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/admin/produto/${produto.id}`}>
                          <Button variant="outline" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(produto.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}
    </div>
  );
}
