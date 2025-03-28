
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { criarProduto, atualizarProduto, getProdutoById } from '@/services/produtoService';

export default function AdminProduto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    preco: '',
    parcelas: '1',
    imagem_url: '',
  });

  useEffect(() => {
    const fetchProduto = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const produto = await getProdutoById(id);
        
        if (produto) {
          setForm({
            nome: produto.nome,
            descricao: produto.descricao || '',
            preco: produto.preco.toString(),
            parcelas: produto.parcelas?.toString() || '1',
            imagem_url: produto.imagem_url || '',
          });
        }
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do produto",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduto();
  }, [id, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const produtoData = {
        nome: form.nome,
        descricao: form.descricao,
        preco: parseFloat(form.preco),
        parcelas: parseInt(form.parcelas),
        imagem_url: form.imagem_url || null,
      };

      if (id) {
        await atualizarProduto(id, produtoData);
      } else {
        await criarProduto(produtoData);
      }

      toast({
        title: "Sucesso",
        description: `Produto ${id ? 'atualizado' : 'criado'} com sucesso!`,
      });
      
      navigate('/admin/produtos');
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast({
        title: "Erro",
        description: `Não foi possível ${id ? 'atualizar' : 'criar'} o produto`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl py-6">
      <div className="mb-6">
        <Link to="/admin/produtos" className="flex items-center text-sm text-blue-600 hover:text-blue-800 mb-2">
          <ArrowLeft className="h-4 w-4 mr-1" /> Voltar para produtos
        </Link>
        <h1 className="text-2xl font-bold">{id ? 'Editar Produto' : 'Novo Produto'}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="produto-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do produto *</Label>
              <Input
                id="nome"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Ex: Curso de Marketing Digital"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                placeholder="Descreva seu produto em detalhes"
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preco">Preço (R$) *</Label>
                <Input
                  id="preco"
                  name="preco"
                  type="number"
                  step="0.01"
                  value={form.preco}
                  onChange={handleChange}
                  placeholder="Ex: 97.00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="parcelas">Parcelas</Label>
                <Input
                  id="parcelas"
                  name="parcelas"
                  type="number"
                  min="1"
                  value={form.parcelas}
                  onChange={handleChange}
                  placeholder="Ex: 12"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imagem_url">URL da imagem</Label>
              <Input
                id="imagem_url"
                name="imagem_url"
                value={form.imagem_url}
                onChange={handleChange}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/produtos')}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            form="produto-form"
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : 'Salvar Produto'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
